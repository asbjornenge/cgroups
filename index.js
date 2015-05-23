require('shelljs/global')
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
    addprocess : function(pid) {

    }
}

