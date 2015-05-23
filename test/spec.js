require('shelljs/global')
var fs     = require('fs')
var assert = require('assert')
var cgroup = require('../index')

var groupWrapper = function(opts, group, callback) {
    cgroup.create(opts, group, function(err) {
        var cleanUp = function(cb) {
            cgroup.remove(opts, group, cb)
        }
        callback(err, cleanUp)
    })
}

it('can create a cgroup', function(done) {
    groupWrapper({resources : ['cpuset']}, 'testgroup', function(err, cleanup) {
        assert(!err)
        assert(fs.lstatSync(cgroup.root+'/cpuset/testgroup').isDirectory())
        cleanup(function(err) {
            assert(!err)
            assert(!fs.existsSync(cgroup.root+'/cpuset/testgroup'))
            done()
        })        
    })
})

//it('can put a process inside a cgroup', function(done) {
//    cgroup.create(
//})
