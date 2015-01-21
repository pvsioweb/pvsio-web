/**
 * user interface tests
 * @author Patrick Oladimeji
 * @date 6/25/14 20:07:07 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global d3, $, it, expect, define, describe, beforeEach, afterAll, beforeAll, spyOn, Promise, Event*/
define(function (require, exports, module) {
    "use strict";
    var main = require("main"),
        ProjectManager			= require("project/ProjectManager");
    
    module.exports = {
        run: function () {
            var pm = ProjectManager.getInstance(),
                p;
            function wait(milliseconds) {
                return function () {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve("time up");
                        }, milliseconds);
                    });
                };
            }
            
            function click(elid) {
                return function () {
                    var el = d3.select(elid).node();
                    return new Promise(function (resolve, reject) {
                        if (el) {
                            el.click();
                            setTimeout(function () {
                                resolve(elid);
                            }, 200);
                        } else {
                            reject(elid + " does not exist in the dom");
                        }
                    });
                };
            }
			
			function rightclick(el) {
                return function () {
                    var element = d3.select(el).node();
                    var event = new Event("contextmenu");
                    element.dispatchEvent(event);
                    return new Promise(function (resolve) {
                        setTimeout(function () {
                            resolve(event);
                        }, 200);
                    });
                };
			}
            /**
                Utility function to select context menu item (i.e., right click menu) on an element
                @param {string} el html element selector (e.g., class, tag or id) for the element
                    recieving the right click
                @param {string} menu the html element selector for the menu item to select
                @returns {Promise} a promise that is settled when the context menu item has been clicked
            */
            function listViewContextMenu(el, menu) {
                return function () {
                    el = el || "#pvsFiles";
                    return rightclick(el)()
                        .then(click(".contextmenu " + menu));
                };
            }
            
            function expectError(done) {
                return function (err) {
                    expect(err).toBeFalsy();
                    done();
                };
            }
            
            function dialogCanBeDismissed(btnTrigger, title) {
                title = title || "dialog triggered by " + btnTrigger;
                var str = title + " can be dismissed",
                    clickbutton = click(btnTrigger);
                it(str, function (done) {
                    clickbutton()
                        .then(click("div.overlay #btnCancel"))
                        .then(function () {
                            //expect overlay to have disappeared after clicking cancel
                            expect($("div.overlay").length).toEqual(0);
                            done();
                        }).catch(expectError(done));
                });
            }
            
            function pressingButtonOpensDialog(btnTrigger, title) {
                title = title || "dialog triggered by " + btnTrigger;
                var str = title + " is opened by clicking " + btnTrigger;
                var clickbutton = click(btnTrigger);
                it(str, function (done) {
                    clickbutton()
                        .then(function () {
                            var dialogTitle = $("div.overlay .panel-heading").html();
                            expect(dialogTitle).toEqual(title);
                            done();
                        }).catch(expectError(done));
                });
            }
            
            function openSampleProject(projectName) {
                var str = projectName + " project opens successfully",
                    clickOpenProject = click("#openProject"),
                    clickProject = click("button[data-project='" + projectName + "']");
                it(str, function (done) {
                    clickOpenProject()
                        .then(clickProject)
                        .then(function () {
                            expect(pm.project().name()).toEqual(projectName);
                            done();
                        }).catch(expectError(done));
                });
            }
            
            function loadPlugin(pluginName) {
                var str = pluginName + " plugin adds a collapsible panel to the ui",
                    clickPlugin = click("input[name='" + pluginName + "']");
                it(str, function (done) {
					clickPlugin()
						.then(function () {
							var pluginPanel = d3.select(".collapsible-panel-parent[plugin-owner='" + pluginName + "']");
							expect(pluginPanel.empty()).toBeFalsy();
							done();
						}).catch(expectError(done));
                });
            }
            
            function unloadPlugin(pluginName) {
                var str = pluginName + " plugin can be unloaded from the ui",
                    clickPlugin = click("input[name='" + pluginName + "']");
                it(str, function (done) {
					clickPlugin()//to load
						.then(clickPlugin)
                        .then(function () {
                            var pluginPanel = d3.select(".collapsible-panel-parent[plugin-owner='" + pluginName + "']");
                            expect(pluginPanel.empty()).toEqual(true);
                            done();
                        }).catch(expectError(done));
                });
            }
			/**
				used to toggle (expand/collapse) a collapsible panel
			*/
			function togglePanel(pluginName) {
				var el = "div.collapsible-panel-parent[plugin-owner='" + pluginName + "'] span.toggle-collapse";
				return click(el);
			}
			
            
            describe("User interface Elements", function () {
                beforeEach(function (done) {
                    d3.select("div.overlay").remove();
                    pm = ProjectManager.getInstance();
                    main.start({noSplash: true}).then(function () {
                        p = pm.project();
                        done();
                    });
                });

                pressingButtonOpensDialog("#openProject", "Open Project");
                dialogCanBeDismissed("#openProject", "Open Project");

                pressingButtonOpensDialog("#newProject", "New Project");
                dialogCanBeDismissed("#newProject", "New Project");
                pressingButtonOpensDialog("#btnImportFiles", "Import files into Project");
                dialogCanBeDismissed("#btnImportFiles", "Import files into Project");
                openSampleProject("AlarisGP");
                openSampleProject("AlarisPC_PumpModules");
                openSampleProject("SmithsMedical_MedFusion3500");

                loadPlugin("Emulink");
                unloadPlugin("Emulink");
                loadPlugin("GraphBuilder");
                unloadPlugin("GraphBuilder");
            });

            describe("Prototype Builder", function () {
                beforeEach(function (done) {
                    d3.select("div.overlay").remove();
                    pm = ProjectManager.getInstance();
                    main.start({noSplash: true}).then(function () {
                        p = pm.project();
                        done();
                    }).catch(expectError(done));
                });

                it("can be collapsed", function (done) {
                    var editorPanel = "div.collapsible-panel-parent[plugin-owner='PrototypeBuilder'] .collapsible-panel";
                    togglePanel("PrototypeBuilder")()
                        .then(function () {
                            expect(d3.select(editorPanel).style("display")).toEqual("none");
                            done();
                        }).catch(expectError(done));
                });

                it("can be collapsed and expanded", function (done) {
                    var editorPanel = "div.collapsible-panel-parent[plugin-owner='PrototypeBuilder'] .collapsible-panel";
                    togglePanel("PrototypeBuilder")()
                        .then(togglePanel("PrototypeBuilder"))
                        .then(function () {
                            expect(d3.select(editorPanel).style("display")).toEqual("block");
                            done();
                        }).catch(expectError(done));
                });

                describe("Editor File Lists", function () {
                    it("has context menus", function (done) {
                        togglePanel("PrototypeBuilder")()
                            .then(rightclick("#pvsFiles"))
                            .then(function () {
                                expect(d3.select("div.contextmenu").empty()).toBeFalsy();
                                done();
                            }).catch(expectError(done));
                    });
                });
            });

            describe("FileSystem management in ListView", function () {
                beforeAll(function (done) {
                    d3.select("div.overlay").remove();
                    pm = ProjectManager.getInstance();
                    main.start({noSplash: true}).then(function () {
                        setTimeout(done, 0);//using a timeout to push this to the end of the event queue so any files are added and project is ready before performing tests
                    });
                });

                it("can add files to the project", function (done) {
                    var filesLength = pm.project().getDescriptors().length;
                    click("div.collapsible-panel-parent[plugin-owner='ModelEditor'] .header")()
                        .then(listViewContextMenu("#pvsFiles", "#newfile"))
                        .then(function () {
                            setTimeout(function () {
                                expect(pm.project().getDescriptors().length).toEqual(filesLength + 1);
                                var desc = pm.project().getDescriptors()[pm.project().getDescriptors().length - 1];
                                expect(desc.path.indexOf(pm.project().name()) === 0).toBeTruthy();
                                done();
                            }, 300);
                        }).catch(expectError(done));
                });
                
                it("can remove files from the project", function (done) {
                    var filesLength = pm.project().getDescriptors().length;
                    click("div.collapsible-panel-parent[plugin-owner='ModelEditor'] .header")()
                        .then(listViewContextMenu("#pvsFiles", "#newfile"))
                        .then(click("#pvsFiles li:last-child"))
                        .then(listViewContextMenu("#pvsFiles", "#delete"))
                        .then(click("div.overlay #btnOk"))
                        .then(function () {
                            setTimeout(function () {
                                expect(pm.project().getDescriptors().length).toEqual(filesLength);
                                done();
                            }, 500);
                        }).catch(expectError(done));
                });
            });
           
        }
    };
});
