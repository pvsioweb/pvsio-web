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
    var Project_UnitTest  = require("test/Project_UnitTest");
    var Descriptor_UnitTest = require("test/Descriptor_UnitTest");
    var UI_UnitTest = require("test/UI_UnitTest");

    var ProjectManager_UnitTest = require("test/ProjectManager_UnitTest").getInstance();
    ProjectManager_UnitTest.run();
    Project_UnitTest.run();
    Descriptor_UnitTest.run();
    UI_UnitTest.run();
    
});
