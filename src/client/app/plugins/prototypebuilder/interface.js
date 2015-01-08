/**
 * Binds user interface elements to events
 * @author Patrick Oladimeji
 * @date 11/15/13 16:29:55 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, $, Backbone, Handlebars, Promise, layoutjs */
define(function (require, exports, module) {
	"use strict";
	var WSManager = require("websockets/pvs/WSManager"),
        ModelEditor = require("plugins/modelEditor/ModelEditor"),
        Emulink = require("plugins/emulink/Emulink"),
		SafetyTest = require("plugins/safetyTest/SafetyTest"),
        GraphBuilder = require("plugins/graphbuilder/GraphBuilder"),
        PrototypeBuilder = require("plugins/prototypebuilder/PrototypeBuilder"),
		Logger	= require("util/Logger"),
        SaveProjectChanges = require("project/forms/SaveProjectChanges"),
        Notification = require("pvsioweb/forms/displayNotification"),
        NotificationManager = require("project/NotificationManager"),
        Descriptor = require("project/Descriptor"),
        fs = require("util/fileHandler"),
        PluginManager = require("plugins/PluginManager");
	
    var template = require("text!pvsioweb/forms/maincontent.handlebars");
    
    
	///FIXME need to distinguish between process started and process restarted
    function pvsProcessReady(err) {
        var pvsioStatus = d3.select("#lblPVSioStatus");
        pvsioStatus.select("span").remove();
        if (!err) {
            var msg = "PVSio process ready!";
            Logger.log(msg);
            pvsioStatus.append("span").attr("class", "glyphicon glyphicon-ok");
        } else {
            Logger.log(err);
            pvsioStatus.append("span").attr("class", "glyphicon glyphicon-warning-sign");
        }
    }

    function updateEditorToolbarButtons(pvsFile, currentProject) {
		//update status of the set main file button based on the selected file
		if (pvsFile) {
			if (currentProject.mainPVSFile() && currentProject.mainPVSFile().path === pvsFile.path) {
				d3.select("#btnSetMainFile").attr("disabled", true);
			} else {
				d3.select("#btnSetMainFile").attr("disabled", null);
			}
        }
	}
    
	function bindListeners(projectManager) {
        var actions, recStartState, recStartTime, scriptName;
        //add event listener for restarting the pvsio web server whenever the project changes
        projectManager.addListener("ProjectChanged", function (event) {
            var pvsioStatus = d3.select("#lblPVSioStatus");
            pvsioStatus.select("span").remove();
            
            var project = event.current;
            var ws = WSManager.getWebSocket();
            ws.lastState("init(0)");
            if (project.mainPVSFile()) {
                // the main file can be in a subfolder: we need to pass information about directories!
                var mainFile = project.mainPVSFile().path.replace(project.name() + "/", "");
                ws.startPVSProcess({name: mainFile, projectName: project.name()}, function (err) {
					pvsProcessReady(err);
					//make projectManager bubble the process ready event
					projectManager.fire({type: "PVSProcessReady", err: err});
				});
            } //else {
                // don't close the process just because the main file is not defined,
                // closing the process creates issues with fs file watcher -- the project folder is not monitored anymore
//                //close pvsio process for previous project
//                ws.closePVSProcess(function (err) {
//                    if (!err) {
//                        pvsioStatus.append("span").attr("class", "glyphicon glyphicon-warning-sign");
//                    }
//                });
//            }
        }).addListener("SelectedFileChanged", function (event) {
            var p = projectManager.project(), file = p.getDescriptor(event.selectedItem.path);
            updateEditorToolbarButtons(file, p);
        });
        
		d3.select("#header #txtProjectName").html("");

		d3.select("#btnSaveProject").on("click", function () {
			projectManager.saveProject();
		});
	
		d3.select("#btnSaveProjectAs").on("click", function () {
            var name = projectManager.project().name() + "_" + (new Date().getFullYear()) + "." +
                            (new Date().getMonth() + 1) + "." + (new Date().getDate());
			projectManager.saveProjectDialog(name);
		});
        
		d3.select("#openProject").on("click", function () {
            function openProject() {
                projectManager.openProjectDialog().then(function (project) {
                    var notification = "Project " + project.name() + " opened successfully!";
                    Logger.log(notification);
                }).catch(function (err) {
                    if (err && err.error) {
                        NotificationManager.error(err.error);
                    } else {
                        Logger.log(JSON.stringify(err));
                    }
                });
            }
            var currentProject = projectManager.project();
            if (currentProject && currentProject._dirty()) {
                //show save project dialog for the current project
                SaveProjectChanges.create(currentProject)
                    .on("yes", function (e, view) {
                        view.remove();
                        projectManager.saveProject().then(function (res) {
                            openProject();
                        }).catch(function (err) { alert(err); });
                    }).on("no", function (e, view) {
                        view.remove();
                        openProject();
                    });
            } else {
                openProject();
            }
		});
	
		d3.select("#newProject").on("click", function () {
			projectManager.createProjectDialog().then(function (res) {
                var notification = "Project " + res.project().name() + "created!";
                Logger.log(notification);
            });
		});
        
        function reloadPVSio() {
            //compilation is emulated by restarting the pvsioweb process on the server
            var project = projectManager.project(), ws = WSManager.getWebSocket();
            if (project && project.mainPVSFile()) {
                ws.lastState("init(0)");
                // the main file can be in a subfolder: we need to pass information about directories!
                var mainFile = project.mainPVSFile().path.replace(project.name() + "/", "");
                ws.startPVSProcess({name: mainFile, projectName: project.name()}, pvsProcessReady);
            }
        }
        //handle typecheck event
		//this function should be edited to only act on the selected file when multiple files are in use
		d3.select("#btnTypeCheck").on("click", function () {
            function typecheck(pvsFile) {
                var btn = d3.select("#btnTypeCheck").html("Compiling...").attr("disabled", true);
                var ws = WSManager.getWebSocket();
                var fp = pvsFile.path;
                ws.send({type: "typeCheck", path: fp},
                     function (err, res) {
                        btn.html("Compile").attr("disabled", null);
                        var msg = res.stdout;
                        if (!err) {
                            reloadPVSio();
                            var project = projectManager.project();
                            var notification = "File " + fp + " compiled successfully!";
                            msg = msg.substring(msg.indexOf("Proof summary"), msg.length);
                            Notification.create({
                                header: pvsFile.name + " compiled successfully! ",
                                notification: msg.split("\n")
                            }).on("ok", function (e, view) { view.remove(); });
                        } else {
                            var logFile = projectManager.project().name() + "/" + fp.substring(0, fp.length - 4) + ".log";
                            var header = "Compilation error";
                            ws.getFile(logFile, function (err, res) {
                                if (!err) {
                                    msg = res.content.substring(res.content.indexOf("Parsing "));
                                    msg = msg.replace("Parsing", "Error while parsing");
                                } else {
                                    msg = msg.substring(msg.indexOf("Writing output to file"));
                                    header += ", please check the PVS output file for details.";
                                }
                                Notification.create({
                                    header: header,
                                    notification: msg.split("\n")
                                }).on("ok", function (e, view) { view.remove(); });
                            });
                        }
                    });
            }
            
            // if the pvsFile is not specified, we compile the main file
            // note: this happens when a directory is selected
			var pvsFile = projectManager.getSelectedFile() || projectManager.project().mainPVSFile();
            if (!pvsFile) { return; }
			if (pvsFile.dirty()) {
                document.getElementById("btnSaveFile").click();
            }
            typecheck(pvsFile);
		});
        
		d3.select("#btnSetMainFile").on("click", function () {
			var pvsFile = projectManager.getSelectedFile(), project = projectManager.project();
			if (pvsFile) {
				var ws = WSManager.getWebSocket();
				ws.send({type: "setMainFile", projectName: project.name(), name: pvsFile.path}, function (err) {
					//if there was no error update the main file else alert user
                    if (!err) {
                        // set main file
                        project.mainPVSFile(pvsFile);
                        // disable button
                        d3.select("#btnSetMainFile").attr("disabled", true);
                        var notification = pvsFile.path + " is now the Main file";
                        NotificationManager.show(notification);
                        // reload pvsio
                        reloadPVSio();
                    } else {
                        NotificationManager.err(err);
                    }
				});
			}
		});
	
		d3.select("#btnSaveFile").on("click", function () {
			var project = projectManager.project();
			if (project) {
                var descriptor = projectManager.getSelectedFile();
                if (descriptor) {
                    descriptor.content = ModelEditor.getInstance().getEditor().doc.getValue();
                    descriptor.dirty(false);
                    projectManager.project().saveFiles([descriptor], { overWrite: true }).then(function (res) {
                        var notification = descriptor.name + " saved successfully!";
                        NotificationManager.show(notification);
                    }).catch(function (err) {
                        NotificationManager.error(err);
                    });
                }
			}
		});
        d3.select("#btnImportFiles").on("click", function () {
            return new Promise(function (resolve, reject) {
                projectManager.readLocalFileDialog().then(function (files) {
                    var promises = [];
                    function getImportFolderName() {
                        var selectedData = projectManager.getSelectedData();
                        return (selectedData.isDirectory) ? selectedData.path
                                : selectedData.path.split("/").slice(0, -1).join("/");
                    }
                    var importFolder = getImportFolderName();
                    files.forEach(function (file) {
                        file.path = importFolder + "/" + file.path;
                        promises.push(projectManager.writeFileDialog(file.path, file.content, { encoding: file.encoding }));
                    });
                    Promise.all(promises).then(function (res) {
                        resolve(res);
                    }).catch(function (err) { reject(err); });
                }).catch(function (err) { reject(err); });
            });
        });
	}
	
    var  MainView = Backbone.View.extend({
        initialize: function (data) {
			this.render(data);
		},
		render: function (data) {
			var t = Handlebars.compile(template);
			this.$el.html(t(data));
			$("body").append(this.el);
			layoutjs({el: "#content", useFullHeight: true});
			return this;
		},
		events: {
            "change input[type='checkbox']": "checkboxClicked",
            "click .plugin-box": "pluginClicked"
		},
        checkboxClicked: function (event) {
            this.trigger("pluginToggled", event);
        },
        pluginClicked: function (event) {
            d3.select(event.target).select("input[type='checkbox']").node().click();
        },
		scriptClicked: function (event) {
            this.trigger("scriptClicked", $(event.target).attr("name"));
        }
    });
    
    function createHtmlElements(data) {
        return new MainView(data);
    }
	module.exports = {
		init: function (data) {
            data = data || {plugins: [PrototypeBuilder.getInstance(), ModelEditor.getInstance(),
                                      Emulink.getInstance(), GraphBuilder.getInstance(), SafetyTest.getInstance()].map(function (p) {
                return {label: p.constructor.name, plugin: p};
            })};
            PluginManager.getInstance().init();
            PluginManager.getInstance().addListener("PluginEnabled", function (event) {
                d3.select("#plugin_" + event.plugin.constructor.name).property("checked", true);
            }).addListener("PluginDisabled", function (event) {
                d3.select("#plugin_" + event.plugin.constructor.name).property("checked", false);
            });
            if (this._view) { this.unload(); }
            this._view = createHtmlElements(data);
            return this._view;
        },
        unload: function () {
            this._view.remove();
        },
		bindListeners: function (projectManager) {
			bindListeners(projectManager);
		}
	};
});