/**
 * front end test cases
 * @author Patrick Oladimeji
 * @date 6/24/14 16:35:39 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, require, brackets, window */

define(function (require, exports, module) {
    "use strict";
	//var main = require("main");
	var project  = require("test/Project");
	var projectFile = require("test/ProjectFile");
	var ui = require("test/UI");
    
    ui.run();
	project.run();
	projectFile.run();
});
