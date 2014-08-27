module.exports = function(grunt) {
  'use strict';
  
  var distDir = 'dist',
      srcDir = 'src',
      slidesDir = 'slides',
      slidesDistDir = distDir + '/' + slidesDir,
      slidesSrcDir = srcDir + '/' + slidesDir,
      slidesHtmlPath = slidesDir + '/*.html',
      slidesSrcHtmlPath = srcDir + '/' + slidesHtmlPath,
      filesExtensions = 'html,js,png,json,css';
  
  var processHtml = function(content, srcpath){
    if(srcpath.indexOf('.html') !== -1 ){
      var replaceSlides = '##INCLUDE_SLIDES##';
      
      if(content.indexOf(replaceSlides) !== -1){
        var slidesContent = grunt.file.read(slidesDistDir + '/index.html');
        
        content = content.replace(replaceSlides, slidesContent);
      }
    }
    
    return content;
  };
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-express');
  
  grunt.initConfig({
    "pkg": grunt.file.readJSON('package.json'),
    express: {
      main: {
        options: {
          port: 9010,
          hostname: '0.0.0.0',
          bases: [distDir],
          livereload: 35710,
          debug: true,
          open: true
        }
      }      
    },
    copy: {
      files: {
        options: {
          process: processHtml
        },        
        files: [{
          expand: true,
          cwd: srcDir,
          src: ['**/*.{' + filesExtensions + '}'],
          dest: distDir,
          filter: 'isFile'
        }]
      },
      slides: {
        options: {
          process: processHtml
        },          
        files: [{
          expand: true,
          cwd: srcDir,
          src: [slidesHtmlPath, '*.html'],
          dest: distDir,
          filter: 'isFile'
        }]        
      }
    },
    watch: {
      options: {
        livereload: 35710
      },      
      files: {
        files: [srcDir + '/**/*.{' + filesExtensions + '}', '!' + slidesSrcHtmlPath],
        tasks: ['newer:copy:files']
      },
      slides: {
        files: [slidesSrcHtmlPath],
        tasks: ['copy:slides'],
      }
    }
  });

  grunt.registerTask('server', function(){
    grunt.task.run([
      'build',
      'express:',
      'watch'
    ]);
  });  

  grunt.registerTask('build', function(){
    grunt.task.run([
      'newer:copy:files'
    ]);
  });    
};