/**
 * Binds user interface elements to events
 * @author Patrick Oladimeji
 * @date 11/15/13 16:29:55 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, $, Backbone, Handlebars, Promise */
define(function (require, exports, module) {
	"use strict";
	var WSManager = require("websockets/pvs/WSManager"),
        Emulink = require("plugins/emulink/Emulink"),
        GraphBuilder = require("plugins/graphbuilder/GraphBuilder"),
		Logger	= require("util/Logger"),
        Recorder = require("util/ActionRecorder"),
        SaveProjectChanges = require("project/forms/SaveProjectChanges"),
        Prompt  = require("pvsioweb/forms/displayPrompt"),
        Notification = require("pvsioweb/forms/displayNotification"),
        ProjectFile = require("project/ProjectFile"),
        fs = require("util/fileHandler");
	
    var template = require("text!pvsioweb/forms/maincontent.handlebars");
    
	/**
	 * Switches the prototoyping layer to the builder layer
     * @private
	 */
    function switchToBuilderView() {
        d3.select(".image-map-layer").style("opacity", 1).style("z-index", 190);
        d3.selectAll("#controlsContainer button, div.display").classed("selected", false);
        d3.select("#btnBuilderView").classed('selected', true);
        d3.selectAll("div.display,#controlsContainer button").classed("builder", true);
        d3.selectAll("div.display,#controlsContainer button").classed("simulator", false);
        d3.selectAll("#record").style("display", "none");
    }
	/** Switches the prototyping layer to the simulator/testing layer 
        @private
    */
    function switchToSimulatorView() {
        d3.select(".image-map-layer").style("opacity", 0.1).style("z-index", -2);
        d3.selectAll("#controlsContainer button, div.display").classed("selected", false);
        d3.select("#btnSimulatorView").classed('selected', true);
        d3.selectAll("div.display,#controlsContainer button").classed("simulator", true);
        d3.selectAll("div.display,#controlsContainer button").classed("builder", false);
        d3.selectAll("#record").style("display", "block");
    }
    
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
			if (currentProject.mainPVSFile() && currentProject.mainPVSFile().name() === pvsFile.name()) {
				d3.select("#btnSetMainFile").attr("disabled", true);
			} else {
				d3.select("#btnSetMainFile").attr("disabled", null);
			}

			//update status of file save button based on the selected file
			if (pvsFile.dirty()) {
				d3.select("#btnSaveFile").attr("disabled", null);
			} else {
				d3.select("#btnSaveFile").attr("disabled", true);
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
                ws.startPVSProcess({fileName: project.mainPVSFile().name(),
                                    projectName: project.name()}, pvsProcessReady);
            } else {
                //close pvsio process for previous project
                ws.closePVSProcess(function (err) {
                    if (!err) {
                        pvsioStatus.append("span").attr("class", "glyphicon glyphicon-warning-sign");
                    }
                });
            }
            switchToBuilderView();
        }).addListener("SelectedFileChanged", function (event) {
            var p = projectManager.project(), file = p.getProjectFile(event.selectedItem.path);
            updateEditorToolbarButtons(file, p);
        });
        
		d3.select("#header #txtProjectName").property("value", "");
	
		/**
		 * Add event listener for toggling the prototyping layer and the interaction layer
		 */
		d3.select("#btnBuilderView").classed("selected", true).on("click", function () {
			switchToBuilderView();
		});
	
		d3.select("#btnSimulatorView").on("click", function () {
			switchToSimulatorView();
		});
	
        d3.select("#record").on("click", function () {
            var label = d3.select(this).html().trim(), script;
            if (label === "Record") {
                d3.select(this).html(" Stop Recording").classed("recording", true);
                Recorder.startRecording();
                recStartState = WSManager.getWebSocket().lastState();
                recStartTime = new Date().getTime();
                scriptName = "Script_" + recStartTime;
            } else {
                d3.select(this).html(" Record").classed("recording", false);
                actions = Recorder.stopRecording();
                //do something with actions
                Logger.log(actions);
                //ask user to give name to script
                Prompt.create({header: "Would you like to save this script?",
                               message: "Please enter a name for your script",
                               buttons: ["Delete", "Save"]})
                    .on("save", function (e, view) {
                        scriptName = e.data.prompt.trim() || scriptName;
                        view.remove();
                        script = {name: scriptName, actions: actions, startState: recStartState};
                        //add the script to the project
                        projectManager.project().addScript(script);
                    }).on("delete", function (e, view) {
                        view.remove();
                    });
            }
        });
        
		d3.select("#saveProject").on("click", function () {
			projectManager.saveProject();
		});
	
		d3.select("#openProject").on("click", function () {
            function _doOpenProject() {
                projectManager.selectProject(function (err, projectName) {
                    if (!err) {
                        projectManager.openProject(projectName, function (project) {
                            Logger.log("Project " + project.name() + " opened successfully!");
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
                Logger.log("new project created!");
            });
		});
		//handle typecheck event
		//this function should be edited to only act on the selected file when multiple files are in use
		d3.select("#btnTypeCheck").on("click", function () {
            function typecheck(pvsFile) {
                var btn = d3.select("#btnTypeCheck").html("Typechecking ...").attr("disabled", true);
                var ws = WSManager.getWebSocket();
                ws.send({type: "typeCheck", filePath: pvsFile.name()},
                         function (err, res) {
                        btn.html("Typecheck").attr("disabled", null);
                        var msg = res.stdout;
                        if (err) {
                            Logger.log(res);
                            Logger.log(err);
                            msg = msg.substring(msg.indexOf("Writing output to file"), msg.length);
                            Notification.create({
                                header: "Typecheck error, please check the output file for details.",
                                notification: msg.split("\n")
                            }).on("ok", function (e, view) { view.remove(); });
                        } else {
                            Logger.log(res);
                            msg = msg.substring(msg.indexOf("Proof summary"), msg.length);
                            Notification.create({
                                header: "Theories in " + projectManager.project().name() + " typechecked successfully!",
                                notification: msg.split("\n")
                            }).on("ok", function (e, view) { view.remove(); });
                        }
                    });
            }
            
			var pvsFile = projectManager.getSelectedFile();
			if (!pvsFile || pvsFile.dirty()) {
                //ask user to give name to script
                var msg = "File " + pvsFile.name() + " has unsaved changes."
                            + "\nPlease save file before typechecking.";
                Notification.create({
                    header: "Typechecking unsaved files",
                    notification: msg.split("\n")
                }).on("ok", function (e, view) {
                    view.remove();
                });
            } else { typecheck(pvsFile); }
		});

        function reloadPVSio() {
            //compilation is emulated by restarting the pvsioweb process on the server
            var project = projectManager.project(), ws = WSManager.getWebSocket();
            if (project && project.mainPVSFile()) {
                ws.lastState("init(0)");
                ws.startPVSProcess({fileName: project.mainPVSFile().name(), projectName: project.name()},
                              pvsProcessReady);
            }
        }
        
		d3.select("#btnSetMainFile").on("click", function () {
			var pvsFile = projectManager.getSelectedFile(), project = projectManager.project();
			if (pvsFile) {
				var ws = WSManager.getWebSocket();
				ws.send({type: "setMainFile", projectName: project.name(), fileName: pvsFile.path()}, function (err) {
					//if there was no error update the main file else alert user
                    if (!err) {
                        // set main file
                        project.mainPVSFile(pvsFile);
                        // reload pvsio
                        reloadPVSio();
                        Logger.log("main file is now " + pvsFile.path());
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
                projectManager.saveFiles([pvsFile], function (err) {
                    if (err) {
                        Logger.log(err);
                    } else {
                        Logger.log(pvsFile.path() + " saved successfully!");
                    }
                });
			}
		});

		d3.select("#btnSaveAll").on("click", function () {
			var project = projectManager.project();
			if (project) {
                var pvsFiles = project.pvsFilesList();
                projectManager.saveFiles(pvsFiles, function (err) {
                    if (err) {
                        Logger.log(err);
                    } else {
                        Logger.log(pvsFiles + " saved successfully!");
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
                            contents.forEach(function (f) {
                                var selectedFilePath = projectManager.getSelectedItem();
                                // handle the special case where the project is empty -- the project home is the selected file
                                var pathPrefix = (selectedFilePath && selectedFilePath.lastIndexOf("/") > 0) ?
                                                    selectedFilePath.substr(0, selectedFilePath.lastIndexOf("/"))
                                                    : projectManager.project().name();
                                var path = pathPrefix + "/" + f.fileName;
                                var pf = new ProjectFile(path, f.fileContent);
                                if (!projectManager.fileExists(pf)) {
                                    projectManager.saveFiles([pf], function (err) {
                                        if (!err) {
                                            projectManager.project().addProjectFile(pf.path(), f.fileContent);
                                            projectManager.selectFile(pf);
                                            Logger.log(pf.path() + " added to project successfully!");
                                        } else { Logger.log(err); }
                                    });
                                } else {
                                    alert("file " + pf.path() + " not imported (file already exists in project)");
                                }
                            });
                        }, function (err) { Logger.log("error reading files " + err); });
                });
        });
        
		d3.select("#btnCompile").on("click", function () {
            var pvsFile = projectManager.getSelectedFile();
			if (!pvsFile || pvsFile.dirty()) {
                // prompt a message that the file has not been saved yet
                var msg = "File " + pvsFile.name() + " has unsaved changes."
                            + "\nPlease save file before compiling.";
                Notification.create({
                    header: "Compiling unsaved file",
                    notification: msg.split("\n")
                }).on("ok", function (e, view) {
                    view.remove();
                });
            } else { reloadPVSio(); }
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
        data = data || {plugins: [Emulink.getInstance(), GraphBuilder.getInstance()].map(function (p) {
            return {label: p.constructor.name, plugin: p};
        })};
        return new MainView(data);
    }
	module.exports = {
		init: function (data) {
            return createHtmlElements(data);
        },
        unload: function () {
            d3.select("div#content.center").remove();
        },
		bindListeners: function (projectManager) {
			bindListeners(projectManager);
		}
	};
});