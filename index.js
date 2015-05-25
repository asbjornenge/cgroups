var fs    = require('fs')
var async = require('async') 

module.exports = {
    root : '/sys/fs/cgroup',

    create : function(group, resources, callback) {
        async.each(Object.keys(resources), function(resource, cb) {
            if (Object.keys(resources[resource]).length > 0) {
                // If we are settings values, swap the callback
                var resourceTree = {}
                resourceTree[resource] = resources[resource] 
                cb = module.exports.set.bind(undefined, group, resourceTree, cb)
            }
            fs.mkdir(module.exports.root+'/'+resource+'/'+group, cb)
        }, callback)
    },
    remove : function(group, resources, callback) {
        async.each(Object.keys(resources), function(resource, cb) {
            fs.rmdir(module.exports.root+'/'+resource+'/'+group, cb)
        }, callback)
    },
    set : function(group, resourceTree, callback) {
        Object.keys(resourceTree).forEach(function(resource) {
            async.each(Object.keys(resourceTree[resource]), function(resourcePath, cb) {
                var value = resourceTree[resource][resourcePath]
                fs.writeFile(module.exports.root+'/'+resource+'/'+group+'/'+resource+'.'+resourcePath, value, cb)
            }, callback)
        })
    },
    getGroups: function(pid, callback) {
        if (!fs.existsSync('/proc/'+pid+'/cgroup')) callback(null, [])
        fs.readFile('/proc/'+pid+'/cgroup', function(err, data) {
            if (err) { callback(err); return }
            callback(null, parseCgroups(data.toString()))
        })
    },
    movePid : function(pid, group, callback) {
        fs.writeFile(module.exports.root+'/'+group+'/cgroup.procs', pid, callback)
    }
}

var parseCgroups = function(data) {
    return data.split('\n').map(function(line) {
        return line.split(':').reduce(function(obj, current, index) {
            if (index == 0) obj['cgid']     = current
            if (index == 1) obj['resource'] = current
            if (index == 2) obj['group']    = current
            return obj 
        }, {})
    })
}
