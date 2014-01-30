# phantomizer-docco v0.1.x

> Generate Javascript documentation for a Phantomizer project

phantomizer-docco is a grunt task specialized
to generate documentation given a Phantomizer project
using Docco tool.


Find out more about Docco

http://jashkenas.github.com/docco/

Find out more about Phantomizer

http://github.com/maboiteaspam/phantomizer


# Documentation Index

http://maboiteaspam.github.io/phantomizer-docco/

http://maboiteaspam.github.io/phantomizer-docco/documentation/build.html


#### Example config

```javascript
{
  'phantomizer-docco': {         // Task
    document: {                  // Target
      options: {                 // Target options
        src_pattern:['...'],     // source directories
        out_dir:'...',           // output directory
        layout:'linear|parallel' // The Docco layout, default: linear
      }
    }
  }
}

```


## Release History


---

