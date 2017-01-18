module.exports=function(grunt){ 
    //任务配置 
    var globalConfig = require('./config');
    grunt.initConfig({ 
        watch:{
            template:{
                files:['views/**','public/**'],
                options:{
                    livereload:35730,
                    delay:1000
                }
            }
        },
        open: {
            all: {
                path: 'http://'+globalConfig.host+':'+globalConfig.port
            },
            file : {
              path : '/etc/hosts'
            }
        },
        nodemon:{dev:{
                script:'bin/www',
                options:{
                    env:{
                        port:3000
                    }
                }
            }
        },
        concurrent:{
            tasks:['nodemon','watch','open'],
            options:{
               logConcurrentOutput:true
            }
        }
    }); 
    //载入任务 
    grunt.loadNpmTasks('grunt-contrib-watch'); 
    grunt.loadNpmTasks('grunt-nodemon'); 
    grunt.loadNpmTasks('grunt-concurrent'); 
    grunt.loadNpmTasks('grunt-open'); 
    //注册任务 
    grunt.registerTask('default',['concurrent']); 
} 