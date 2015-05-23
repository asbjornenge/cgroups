require('shelljs/global')
var fs    = require('fs')
var async = require('async') 
var chpr  = require('child_process')

module.exports = {
    root : '/sys/fs/cgroup',

    create : function(options, group, callback) {
        async.each(options.resources, function(resource, cb) {
            chpr.exec('mkdir '+module.exports.root+'/'+resource+'/'+group, cb)
        }, callback)
    },
    remove : function(options, group, callback) {
        async.each(options.resources, function(resource, cb) {
            chpr.exec('rmdir '+module.exports.root+'/'+resource+'/'+group, cb)
        }, callback)
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
