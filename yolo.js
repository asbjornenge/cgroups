var fs = require('fs')
var chpr = require('child_process')
var cgroups = require('./index')

var noErr = function(fn) {
    return function(err) {
        if(err) { console.error(err); process.exit(1) }
        fn()
    }
}

// We have a process
var stress = chpr.spawn('bash')

// Let's make a cgroup
cgroups.create('yolo', {cpuset : {cpus:'0'}}, noErr(function() {
    // Put the process in the cgroup
    cgroups.movePid(stress.pid, 'cpuset/yolo', noErr(function() {
        stress.stdin.write("dd if=/dev/zero of=/dev/null | dd if=/dev/zero of=/dev/null | dd if=/dev/zero of=/dev/null | dd if=/dev/zero of=/dev/null \n")
        console.log('Open htop, see 1 cpu spike! Current cmd should spike 4 cpus...')
        console.log('*Controlled by cgroups - BOOMshakalaka*')
    })) 
}))

// Cleanup on exit
process.on('SIGINT', function() {
    stress.kill('SIGINT')
    cgroups.remove('yolo', {cpuset:{}}, function() {
        process.emit('SINGINT')
    })
})
