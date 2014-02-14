'use strict';

module.exports = function(grunt) {

  var fs = require("fs");
  var path = require("path");
  var childProcess = require('child_process');

  grunt.registerTask("phantomizer-docco", "Docco litteral documentation tool support for phantomizer", function () {

    // this task is async, save async handler for later consumption
    var done = this.async();

    // default options
    // src_pattern is a path array, **/*.js will be appended to it
    var options = this.options({
      src_pattern:[],
      out_dir:'',
      layout:'linear'
    });

    var src_paths = options.src_pattern;
    var out_dir = options.out_dir;
    var output = out_dir.replace(/\\/g,"/");

    // ensure output directory exists
    grunt.file.mkdir(output)

    // Array of batch for each directory, holds output, src_pattern and files found within
    var docco_runs = [];
    // current count of batch done
    var current_docco = 0;

    // iterate the sources paths
    for( var n in src_paths ){
      var src_path = path.normalize(src_paths[n]);
      // find all files to document
      var files = grunt.file.expand({}, src_path+"**/*.js");
      if( files.length == 0 ){
        grunt.log.warn("Did not find files in "+src_path)
      }else{
        // group them by diretory
        var files_by_dir = grouped_by_directory(files);
        for(var dir in files_by_dir ){
          if( files_by_dir[dir].length > 0 ){
            // create a new docco_run for later process
            docco_runs.push({
              out: path.normalize(output+dir.substr(src_path.length-1)),
              src_path: src_path,
              files: files_by_dir[dir]
            });
          }
        }

      }
    }


    // process a batch of file to comment
    var run_docco = function(){
      // if all tasks ended
      if( current_docco >= docco_runs.length ){
        // consume async handler
        done();
        return;
      }
      // prepare execution of dooco as an external binary, helped to solve some difficulties
      var docco_path = path.dirname(require.resolve("docco"))+"/bin/docco";
      var docco_run = docco_runs[current_docco];
      var args = [
        docco_path,
        "--verbose",
        "-l", options.layout,
        "-o", docco_run.out
      ];
      // for the current batch push files to docco bin's argv
      for( var f in docco_run.files ){
        args.push(docco_run.files[f]);
      }
      // execute docco
      try{
        childProcess.execFile(process.execPath, args, function(err, stdout, stderr) {
          // provide some statistics
          grunt.log.writeln("");
          grunt.log.ok("Directory "+(current_docco+1)+"/"+docco_runs.length);
          // display error on output
          if( err ) grunt.log.error(err);
          if( stderr ) grunt.log.error(stderr);
          // parse output and clean it from too long file paths
          stdout = treat_stdout(stdout,docco_run.src_path,docco_run.out)
          // display cleaned docco output
          grunt.log.ok(stdout);

          // update current count of tasks done
          current_docco++;
          // recall
          run_docco();
        })
      }catch(ex){
        // manage fatal error
        grunt.log.error(ex);
        done(false);
      }
    }
    run_docco();
  });

  /**
   *
   * @param files
   * @returns {{}}
   */
  function grouped_by_directory( files ){
    var retour = {};
    for(var n in files ){
      var f = files[n];
      var d = path.dirname(f);
      if( ! retour[d] ) retour[d] = [];
      retour[d].push(f);
    }
    return retour;
  }

  /**
   *
   * @param stdout
   * @param src_path
   * @param out_path
   * @returns {string}
   */
  function treat_stdout( stdout,src_path,out_path ){
    var retour = [];
    stdout = stdout.split("\n");
    for( var n in stdout ){
      retour.push(stdout[n].replace(src_path,"").replace(out_path,"").replace("docco: ",""))
    }
    return retour.join("\n");
  }

};
