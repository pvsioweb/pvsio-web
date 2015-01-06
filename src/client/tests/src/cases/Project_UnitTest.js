/**
 * Test cases for project
 * @author Patrick Oladimeji
 * @date 5/1/14 13:25:33 PM
 */
/*jshint undef: true, unused:false*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, describe, beforeEach, afterEach, expect, it, d3, jasmine */
define(function (require, exports, module) {
    "use strict";
    var Project = require("project/Project"),
		main = require("main"),
        PrototypeBuilder = require("plugins/prototypebuilder/PrototypeBuilder"),
        Descriptor = require("project/Descriptor"),
        baseProjectDir = "projects",
        alarisProject = "AlarisPC";
    
	module.exports = {
		run: function () {
			describe("Project", function () {
				var pb = PrototypeBuilder.getInstance(),
					pm = pb.getProjectManager(),
					p;
				beforeEach(function (done) {
					pm = pb.getProjectManager();
					main.start().then(function () {
                        p = pm.project();
                        done();
                    });
				});
                
				it("user interface is loaded and there is connection to the websocket server", function (done) {
					var websocketStatusOK = d3.select("#lblWebSocketStatus span").classed("glyphicon-ok");
					expect(websocketStatusOK).toEqual(true);
                    done();
				});
                
                it("default project name after initialisation should contain 'default project'", function (done) {
                    expect(p.name()).toEqual("defaultProject");
                    console.log(p.name());
                    done();
                });

                it("default project is not dirty", function (done) {
                    expect(p._dirty()).toBeFalsy();
                    done();
                });
                
				describe("Project innards works fine", function () {
                    //describe opening a project
					beforeEach(function (done) {
                        pm.openProject("AlarisPC").then(function (project) {
                            p = project;
                            done();
                        });
                    });
                    
					it("sample project should open project correctly", function () {
                        expect(alarisProject).toEqual(p.name());
                    });
					
					it(" and " + alarisProject + " has at least one pvs file on init", function () {
						expect(p.pvsFilesList()).not.toBeFalsy();
						expect(p.pvsFilesList().length).toBeGreaterThan(0);
					});
				});
			});
		}
	};
   
    
});
