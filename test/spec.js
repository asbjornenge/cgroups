require('shelljs/global')
var fs     = require('fs')
var assert = require('assert')
var cgroup = require('../index')

it('can create a cgroup', function(done) {
    cgroup.create({resources : ['cpuset']}, 'testgroup', function(err) {
        assert(!err)
        assert(fs.lstatSync(cgroup.root+'/cpuset/testgroup').isDirectory())
        cgroup.remove({resources : ['cpuset']}, 'testgroup', function(err) {
            assert(!err)
            assert(!fs.existsSync(cgroup.root+'/cpuset/testgroup'))
            done()
        })
    })
})
