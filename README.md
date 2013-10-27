# phantomizer-docco v0.1.x

> Generate Javascript documentation for a Phantomizer project

phantomizer-docco is a grunt task specialized
to generate documentation given a Phantomizer project
using Docco tool.


Find out more about Docco

http://jashkenas.github.com/docco/

Find out more about Phantomizer

http://github.com/maboiteaspam/phantomizer


#### Example config

```javascript
{
  'phantomizer-docco': {                // Task
    document: {                         // Target
      options: {                        // Target options
        src_pattern:['...'],            // source directories, default:"<%= src_dir %>/js/","<%= wbm_dir %>/js/"
        out_dir:'...',                  // output directories, default:'<%= documentation_dir %>/js/'
        layout:'linear|parallel'        // The Docco layout, default: linear
      }
    }
  }
}

```


## Release History


---

