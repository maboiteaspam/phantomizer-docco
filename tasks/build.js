'use strict';

module.exports = function(grunt) {

    var fs = require("fs");
    var path = require("path");
    var childProcess = require('child_process');

    grunt.registerTask("phantomizer-docco", "", function () {
        var done = this.async();

        var options = this.options();
        var src_paths = options.src_pattern;
        var out_dir = options.out_dir;
        // - Generate documentation for script files
        var output = out_dir.replace(/\\/g,"/");

        if( fs.existsSync(output) == false ){
            fs.mkdirSync(output);
        }


        var filescount = 0;
        var cur_f_count = 0;

        var docco_runs = [];
        var current_docco = 0;
        for( var n in src_paths ){
            var src_path = src_paths[n];
            var files = grunt.file.expand({}, src_path+"**/*.js");
            filescount += files.length-1;
            var files_by_dir = grouped_by_directory(files);

            for(var dir in files_by_dir ){
                docco_runs.push({
                    out: output+dir.substr(src_path.length-1),
                    files: files_by_dir[dir]
                });
            }
        }


        var run_docco = function(){
            if( current_docco >= docco_runs.length ){
                done();
                return;
            }
            var docco_path = path.dirname(require.resolve("docco"))+"/bin/docco";
            var docco_run = docco_runs[current_docco];
            var args = [
                docco_path,
                "--verbose",
                "-l", "parallel",
                "-o", docco_run.out
            ];
            for( var f in docco_run.files ){
                args.push(docco_run.files[f]);
            }
            try{
                filescount = docco_run.files.length-1;
                cur_f_count = 0;

                childProcess.execFile(process.execPath, args, function(err, stdout, stderr) {
                    console.log(stdout)
                    current_docco++;
                    run_docco();
                })
            }catch(ex){
                console.log(ex)
                done(false);
            }
        }
        run_docco();


    });

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

};
