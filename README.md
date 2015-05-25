# cgroups

This module is an experiment in exposing the [cgroups](https://www.kernel.org/doc/Documentation/cgroups/cgroups.txt) "API" to node. Who know what will happen...

## Use

```js
var cgroups = require('cgroups')

// Make a cgroup
cgroups.create('yolo', {cpuset:{cpus:'0'}}, function(err) {
    var child = chpr.spawn('bash')
    cgroups.movePid(child.pid, 'cpuset/yolo', function(err) {
        // the child is not in the cpuset/yolo cgroup limited to cpu 0
    })
})
```

## API

```
create(name, resourceTree, callback)  // Make a cgroup
movePid(pid, path/to/group, callback) // Add pid to cgroup
remove(name, resourceTree, callback)  // Remove a cgroup
set(name, resourceTree, callback)     // Set values in cgroup
getGroups(pid, callback)              // Get cgroups for pid
```

enjoy.
