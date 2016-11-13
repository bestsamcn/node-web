module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			js: {
				files: ['public/js/**'],
				//tasks: ['jshint'],
				options: {
					spawn:true
				}
			}
		},
		browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'public/**',
                        'views/**'
                    ]
                },
                options: {
                    watchTask: true,
                    proxy: 'localhost:3000',

                }
            }
        },
		nodemon: {
			 script: './app.js',
                options: {
                    args: ['dev'],
                    nodeArgs: ['--debug'],
                    ignore: ['README.md', 'node_modules/**', '.idea'],
                    ext: 'html,js',
                    watch: ['./views','./routes'],
                    delay: 1000,
                    env: {
                        PORT: '4000'
                    },
                    cwd: __dirname
                }
		},

		concurrent: {
			tasks: ['nodemon'],
			options: {
				logConcurrentOutput: true
			}
		}

	})

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.option('force', true)
	grunt.registerTask('default', ['concurrent']);


}