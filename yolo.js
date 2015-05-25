var fs = require('fs')
var chpr = require('child_process')
var cgroups = require('./index')

var handleErr = function(err) {
    if(err) { console.error(err); process.exit(1) }
}

// Let's make a cgroup
cgroups.create('yolo', { resources : ['cpuset'] }, function(err) {
    handleErr(err)
    // Limit the cgroup to 1 cpu only
    cgroups.set('yolo', { cpuset : { cpus : '0' }}, function(err) {
        handleErr(err)
        // Make a bash and move to cgroup
        var stress = chpr.spawn('bash')
        stress.stdout.on('data', function(err) {
            console.log('shell data',err)
        })
        stress.stderr.on('data', function(err) {
            console.log('shell err',err)
        })
        console.log(stress.pid)
        cgroups.movePid(stress.pid, 'cpuset/yolo', function(err) {
            handleErr(err)
            // Stress multiple cpus
            stress.stdin.write('dd if=/dev/zero of=/dev/null | dd if=/dev/zero of=/dev/null | dd if=/dev/zero of=/dev/null\n')
            stress.stdin.write('ps --ppid $$')
        })


        // Watch htop for a bit to verify that only 1 cpu is stressed
        setTimeout(function() {
            // Cleanup
            console.log('Cleaning up...')
            stress.stdin.write('pkill -P $$\n')
//            setTimeout(function() {
//                stress.on('exit', function() {
//                    cgroups.remove('yolo', { resources : ['cpuset'] }, function(err) {
//                        handleErr(err)
//                        console.log('All done :-)')
//                        process.exit(0)
//                    })
//                })
//                stress.kill('SIGTERM')
//            },1000)
        }, 10000)
    })
})
