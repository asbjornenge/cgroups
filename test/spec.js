require('shelljs/global')
var fs      = require('fs')
var assert  = require('assert')
var chpr    = require('child_process')
var cgroups = require('../index')

var withGroup = function(group, opts, callback) {
    cgroups.create(group, opts, function(err) {
        var cleanUp = function(cb) {
            cgroups.remove(group, opts, cb)
        }
        callback(err, cleanUp)
    })
}

it('can create a cgroups', function(done) {
    withGroup('testgroup', {resources : ['cpuset']}, function(err, cleanup) {
        assert(!err)
        assert(fs.lstatSync(cgroups.root+'/cpuset/testgroup').isDirectory())
        cleanup(function(err) {
            assert(!err)
            assert(!fs.existsSync(cgroups.root+'/cpuset/testgroup'))
            done()
        })        
    })
})

it('can set group values', function(done) {
    withGroup('testgroup2', {resources : ['cpuset']}, function(err, cleanup) {
        assert(!err)
        cgroups.set('testgroup2', { cpuset : { cpus : '0' }}, function(err) {
            assert(!err)
            var numcpus = cat(cgroups.root+'/cpuset/testgroup2/cpuset.cpus').trim()
            assert(numcpus == '0')
            cleanup(done)
        })
    })
})


it('can put a process inside a cgroups', function(done) {
    withGroup('testgroup3', {resources : ['cpuset']}, function(err, cleanup) {
        assert(!err)
        var child = chpr.spawnSync('bash')
        cgroups.getGroups(child.pid, function(err, groups) {
            cleanup(done)
        })
    })
})
