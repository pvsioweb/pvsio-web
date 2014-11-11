/**
 * Binds user interface elements to events
 * @author Patrick Oladimeji
 * @date 11/15/13 16:29:55 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
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
        ProjectFile = require("project/ProjectFile"),
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
			if (currentProject.mainPVSFile() && currentProject.mainPVSFile().path() === pvsFile.path()) {
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
                var mainFile = project.mainPVSFile().path().replace(project.name() + "/", "");
                ws.startPVSProcess({fileName: mainFile, projectName: project.name()}, function (err) {
					pvsProcessReady(err);
					//make projectManager bubble the process ready event
					projectManager.fire({type: "PVSProcessReady", err: err});
				});
            } else {
                //close pvsio process for previous project
                ws.closePVSProcess(function (err) {
                    if (!err) {
                        pvsioStatus.append("span").attr("class", "glyphicon glyphicon-warning-sign");
                    }
                });
            }
        }).addListener("SelectedFileChanged", function (event) {
            var p = projectManager.project(), file = p.getProjectFile(event.selectedItem.path);
            updateEditorToolbarButtons(file, p);
        });
        
		d3.select("#header #txtProjectName").html("");
	
		
        
		d3.select("#btnSaveProject").on("click", function () {
			projectManager.saveProject();
		});
	
		d3.select("#openProject").on("click", function () {
            function _doOpenProject() {
                projectManager.selectProject(function (err, projectName) {
                    if (!err) {
                        projectManager.openProject(projectName, function (project) {
                            var notification = "Project " + project.name() + " opened successfully!";
                            Logger.log(notification);
                        });
                    }
                });
            }
            
            var currentProject = projectManager.project();
            if (currentProject && currentProject._dirty()) {
                //show save project dialog for the current project
                SaveProjectChanges.create(currentProject)
                    .on("yes", function (e, view) {
                        view.remove();
                        projectManager.saveProject(currentProject, _doOpenProject);
                    }).on("no", function (e, view) {
                        view.remove();
                        _doOpenProject();
                    });
            } else {
                _doOpenProject();
            }
		});
	
		d3.select("#newProject").on("click", function () {
			projectManager.newProject(function () {
                var notification = "New project created!";
                Logger.log(notification);
            });
		});
        
        function reloadPVSio() {
            //compilation is emulated by restarting the pvsioweb process on the server
            var project = projectManager.project(), ws = WSManager.getWebSocket();
            if (project && project.mainPVSFile()) {
                ws.lastState("init(0)");
                // the main file can be in a subfolder: we need to pass information about directories!
                var mainFile = project.mainPVSFile().path().replace(project.name() + "/", "");                
                ws.startPVSProcess({fileName: mainFile, projectName: project.name()}, pvsProcessReady);
            }
        }
        //handle typecheck event
		//this function should be edited to only act on the selected file when multiple files are in use
		d3.select("#btnTypeCheck").on("click", function () {
            function typecheck(pvsFile) {
                var btn = d3.select("#btnTypeCheck").html("Compiling...").attr("disabled", true);
                var ws = WSManager.getWebSocket();
                // note: to get the path right, we need to remove the initial part of the path (i.e., the project name)
                var fp = pvsFile.path().substring(pvsFile.path().indexOf("/") + 1);
                ws.send({type: "typeCheck", filePath: fp},
                     function (err, res) {
                        btn.html("Compile").attr("disabled", null);
                        var msg = res.stdout;
                        if (!err) {
                            reloadPVSio();
                            var project = projectManager.project();
                            var notification = "File " + fp + " compiled successfully!";
                            d3.select("#editor-notification-area").insert("p", "p").html(notification);
                            msg = msg.substring(msg.indexOf("Proof summary"), msg.length);
                            Notification.create({
                                header: "Compilation result for file " + pvsFile.name(),
                                notification: msg.split("\n")
                            }).on("ok", function (e, view) { view.remove(); });
                        } else {
                            msg = msg.substring(msg.indexOf("Writing output to file"), msg.length);
                            Notification.create({
                                header: "Compilation error, please check the PVS output file for details.",
                                notification: msg.split("\n")
                            }).on("ok", function (e, view) { view.remove(); });
                        }
                    });
            }
            
			var pvsFile = projectManager.getSelectedFile();
			if (!pvsFile || pvsFile.dirty()) {
                document.getElementById("btnSaveFile").click();
            }
            typecheck(pvsFile);
		});
        
		d3.select("#btnSetMainFile").on("click", function () {
			var pvsFile = projectManager.getSelectedFile(), project = projectManager.project();
			if (pvsFile) {
				var ws = WSManager.getWebSocket();
				ws.send({type: "setMainFile", projectName: project.name(), fileName: pvsFile.path()}, function (err) {
					//if there was no error update the main file else alert user
                    if (!err) {
                        // set main file
                        project.mainPVSFile(pvsFile);
                        // disable button
                        d3.select("#btnSetMainFile").attr("disabled", true);
                        var notification = pvsFile.path() + " is now the Main file";
                        d3.select("#editor-notification-area").insert("p", "p").html(notification);
                        Logger.log(notification);
                        // reload pvsio
                        reloadPVSio();
                    } else {
                        Logger.log(err);
                    }
				});
			}
		});
	
		d3.select("#btnSaveFile").on("click", function () {
			var project = projectManager.project();
			if (project) {
                var pvsFile = projectManager.getSelectedFile();
                var notification = "";
                projectManager.saveFiles([pvsFile], function (err) {
                    if (!err) {
                        notification = pvsFile + " saved successfully!";
                        d3.select("#editor-notification-area").insert("p", "p").html(notification);
                        Logger.log(notification);
                    } else {
                        notification = err;
                        d3.select("#editor-notification-area").insert("p", "p").html(notification);
                        Logger.log(err);
                    }
                });
			}
		});
        d3.select("#btnImportFiles").on("click", function () {
            projectManager.openFiles()
                .then(function (files) {
                    var promises = [], i;
                    for (i = 0; i < files.length; i++) {
                        promises.push(fs.readLocalFileAsText(files[i]));
                    }
                    Promise.all(promises)
                        .then(function (contents) {
                            var nImported = 0;
                            var nSkipped = 0;
                            var notification = "";
                            contents.forEach(function (f) {
                                var selectedFile = projectManager.getSelectedFile();
                                var selectedItem = projectManager.getSelectedItem();
                                // handle the special case where the project is empty -- the project home is the selected file
                                var pathPrefix = (selectedFile) ?
                                                    selectedFile.path().substr(0, selectedFile.path().lastIndexOf("/"))
                                                    : selectedItem;
                                var path = pathPrefix + "/" + f.fileName;
                                var pf = new ProjectFile(path, f.fileContent);
                                if (!projectManager.fileExists(pf)) {
                                    nImported++;
                                    projectManager.saveFiles([pf], function (err) {
                                        if (!err) {
                                            projectManager.project().addProjectFile(pf.path(), f.fileContent);
                                            projectManager.selectFile(pf);
                                            notification = pf.path() + " added to project successfully!";
                                            Logger.log(notification);
                                        } else {
                                            notification = "file " + pf.path() + " not imported (" + err + ")";
                                            alert("file " + pf.path() + " not imported (file already exists in project)");
                                            Logger.log(notification);
                                        }
                                    });
                                } else {
                                    notification = "file " + pf.path() + " not imported (file already exists in project)";
                                    nSkipped++;
                                    alert("file " + pf.path() + " not imported (file already exists in project)");
                                }
                            });
                            notification = nImported + " files imported successfully, " + nSkipped + " skipped.";
                            d3.select("#editor-notification-area").insert("p", "p").html(notification);
                        }, function (err) { Logger.log("error reading files " + err); });
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
            "change input[type='checkbox']": "checkboxClicked"
		},
        checkboxClicked: function (event) {
            this.trigger("pluginToggled", event);
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