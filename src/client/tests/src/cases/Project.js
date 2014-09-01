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
        ProjectFile = require("project/ProjectFile"),
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
					pm.addListener("PVSProcessReady", function (e) {
						console.log(e);
						p = pm.project();
						done();
					});
					main.start();
				});
                
				it("user interface is loaded and there is connection to the websocket server and pvs process", function (done) {
					var websocketStatusOK = d3.select("#lblWebSocketStatus span").classed("glyphicon-ok"),
						pvsioStatusOK = d3.select("#lblPVSioStatus span").classed("glyphicon-ok");

					expect(pvsioStatusOK).toEqual(true);
					expect(websocketStatusOK).toEqual(true);
                    done();
				});

				describe("Project innards works fine", function () {
					it("default project is not dirty", function (done) {
						expect(p._dirty()).toBeFalsy();
                        done();
					});

					it("has one files on init", function (done) {
						expect(p.pvsFilesList()).not.toBeFalsy();
						expect(p.pvsFilesList().length).toEqual(1);
                        done();
					});

					//describe opening a project

					it("default project name after initialisation should contain 'default project'", function (done) {
						expect(p.name()).toEqual("defaultProject");
						console.log(p.name());
                        done();
					});
                    
                    it("should open project correctly", function (done) {
                        pm.openProject("AlarisPC", function (openedProject) {
                            expect(alarisProject).toEqual(openedProject.name());
                            done();
                        });
                    });
				});
			});
		}
	};
   
    
});
