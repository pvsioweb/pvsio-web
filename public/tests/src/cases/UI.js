/**
 * user interface tests
 * @author Patrick Oladimeji
 * @date 6/25/14 20:07:07 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global d3, $, it, expect, define, describe, beforeEach, Promise*/
define(function (require, exports, module) {
    "use strict";
    var main = require("main"),
        PrototypeBuilder = require("plugins/prototypebuilder/PrototypeBuilder");
    
    
    module.exports = {
        run: function () {
             var pb = PrototypeBuilder.getInstance(),
					pm = pb.getProjectManager(),
					p;
            
            function click(elid) {
                d3.select(elid).node().click();
                return new Promise(function  (resolve) {
                   setTimeout(function() {
                       resolve(elid);
                   }, 200);
                });
            }
            
            function dialogCanBeDismissed(btnTrigger, title) {
                title = title || "dialog triggered by " + btnTrigger;
                var str = title + " can be dismissed";
                it(str, function (done) {
                    click(btnTrigger)
                        .then(function () {
                            click("div.overlay #btnCancel")
                                .then(function () {
                                    //expect overlay to have disappeared after clicking cancel
                                    expect($("div.overlay").length).toEqual(0);
                                    done();
                                });
                        });
                });
            }
            
            function pressingButtonOpensDialog(btnTrigger, title) {
                title = title || "dialog triggered by " + btnTrigger;
                var str = title + " is opened by clicking " + btnTrigger;
                it(str, function (done) {
                    click(btnTrigger)
                        .then(function () {
                            var dialogTitle = $("div.overlay .panel-heading").html();
                            expect(dialogTitle).toEqual(title);
                            done();
                        });
                });
            }
            
            function openSampleProject(projectName) {
                var str = projectName + " project opens successfully";
                it(str, function (done) {
                    click("#openProject")
                        .then(function () {
                            d3.selectAll("div.overlay select option").attr("selected", null)
                                .each(function () {
                                    if (d3.select(this).html() === projectName) {
                                        d3.select(this).attr("selected", true);
                                    }
                                });
                            click("div.overlay #btnOk")
                                .then(function () {
                                    expect(pm.project().name()).toEqual(projectName);
                                    done();
                                });
                        });
                });
            }
            
            function loadPlugin(pluginName) {
                var str = pluginName + " plugin adds a collapsible panel to the ui";
                it(str, function (done) {
                    click("#btnPlugins")
                        .then(function () {
                            click("input[name='" + pluginName + "']")
                                .then(function () {
                                 	var pluginPanel = d3.select(".collapsible-panel-parent[plugin-owner='" + pluginName + "']");
                                    expect(pluginPanel.empty()).toBeFalsy();
                                    done();
                                });
                        });
                });
            }
            
            function unloadPlugin(pluginName) {
                var str = pluginName + " plugin can be unloaded from the ui";
                it(str, function (done) {
                    click("#btnPlugins")
                        .then(function () {
                            click("input[name='" + pluginName + "']")//to load
                                .then(function () {//then unload
                                    click("input[name='" + pluginName + "']").then(function () {
                                        var pluginPanel = d3.select(".collapsible-panel-parent[plugin-owner='" + pluginName + "']");
                                        expect(pluginPanel.empty()).toEqual(true);
                                        done();
                                    });
                                });
                        });
                });
            }
            
            describe("User interface Elements", function () {
                
               
				beforeEach(function (done) {
                    d3.select("div.overlay").remove();
					pm = pb.getProjectManager();
					pm.addListener("PVSProcessReady", function (e) {
						console.log(e);
						p = pm.project();
						done();
					});
					main.start();
				});
                
                pressingButtonOpensDialog("#openProject", "Open Project");
                dialogCanBeDismissed("#openProject", "Open Project");
            
                pressingButtonOpensDialog("#newProject", "New Project");
                dialogCanBeDismissed("#newProject", "New Project");
                pressingButtonOpensDialog("#btnImportFiles", "Import PVS files into Project");
                dialogCanBeDismissed("#btnImportFiles", "Import PVS files into Project");
                openSampleProject("AlarisGP");
                openSampleProject("AlarisPC_PumpModules");
                openSampleProject("SmithsMedical_MedFusion3500");
                
                loadPlugin("Emulink");
                unloadPlugin("Emulink");
                loadPlugin("GraphBuilder");
                unloadPlugin("GraphBuilder");         
            });
        }
    };
});
