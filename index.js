require('shelljs/global')
var fs    = require('fs')
var async = require('async') 
var chpr  = require('child_process')

module.exports = {
    root : '/sys/fs/cgroup',

    create : function(group, options, callback) {
        async.each(options.resources, function(resource, cb) {
            chpr.exec('mkdir '+module.exports.root+'/'+resource+'/'+group, cb)
        }, callback)
    },
    remove : function(group, options, callback) {
        async.each(options.resources, function(resource, cb) {
            chpr.exec('rmdir '+module.exports.root+'/'+resource+'/'+group, cb)
        }, callback)
    },
    set : function(group, resourceTree, callback) {
        Object.keys(resourceTree).forEach(function(resource) {
            async.each(Object.keys(resourceTree[resource]), function(resourcePath, cb) {
                var value = resourceTree[resource][resourcePath]
                // TODO: Don't use echo !! use node fs.write
                // Cause echo ignores write errors
                fs.writeFile(module.exports.root+'/'+resource+'/'+group+'/'+resource+'.'+resourcePath, value, cb)
                //console.log('echo '+value+' '+module.exports.root+'/'+resource+'/'+group+'/'+resource+'.'+resourcePath)
            }, callback)
        })
    },
    getGroups: function(pid, callback) {
        if (!fs.existsSync('/proc/'+pid+'/cgroup')) callback(null, [])
        chpr.exec('cat /proc/'+pid+'/cgroup', function(err, stdout, stderr) {
            callback(err, parseCgroups(stdout))
        })
    },
    addProcess : function(pid) {

    }
}

var parseCgroups = function(data) {
    return data.split('\n').map(function(line) {
        return line.split(':').reduce(function(obj, current, index) {
            console.log(index, current)
            if (index == 0) obj['cgid']     = current
            if (index == 1) obj['resource'] = current
            if (index == 2) obj['group']    = current
            return obj 
        }, {})
    })
}
