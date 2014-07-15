/**
 * 
 * @author Patrick Oladimeji
 * @date 7/15/14 17:40:45 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global module, require */
module.exports = function (grunt) {
	"use strict";
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			options: {
				banner: '/*!<%= pkg.name %><%= grunt.template.today("yyyy-mm-dd")%>*/\n'
			},
			build: {
				src: 'src/client/index.js',
				dest: 'build/<%=pkg.name%>.min.js'
			}
		}
//		,
//		requirejs: {
//			compile: {
//				options: {
//					baseUrl: "src/client/app",
//					mainConfigFile: "src/client/index.js",
//					out: "build/<%=pkg.name%>.min.js",
//					name: "../index",
//					optimize: "none"
//				}
//			}
//		},
//		copy: {
//			main: {
//				files: [
//					{expand: true, cwd: "src/client", src: "**/*", dest: "build"}
//				]
//			}
//		}
	});
	
//	grunt.loadNpmTasks("grunt-contrib-uglify");
//	grunt.loadNpmTasks("grunt-contrib-requirejs");
//	grunt.loadNpmTasks("grunt-contrib-copy");
//	grunt.registerTask("default", ["requirejs", "copy"]);
};