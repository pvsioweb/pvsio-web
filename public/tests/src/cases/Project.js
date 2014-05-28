/**
 * Test cases for project
 * @author Patrick Oladimeji
 * @date 5/1/14 13:25:33 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, describe, beforeEach, expect, it */

define(function (require, exports, module) {
    "use strict";
    var Project = require("project/Project"),
        ProjectFile = require("project/ProjectFile"),
        baseProjectDir = "projects",
        alarisProjectDir = baseProjectDir + "/AlarisPC";
    
    describe("Project", function () {
        var p;
        beforeEach(function () {
            p = new Project();
            p.name("Test Project");
        });
        it("is marked as dirty once created", function () {
            expect(p._dirty()).toBeTruthy();
        });
        
        it("has no files on init", function () {
            expect(p.pvsFilesList()).not.toBeFalsy();
            expect(p.pvsFilesList().length).toBeFalsy();
        });
        
        //describe opening a project
        
    });
});
