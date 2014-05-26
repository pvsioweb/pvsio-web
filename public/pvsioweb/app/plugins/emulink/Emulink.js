/**
 * 
 * @author Paolo Masci
 * @date 25/05/14 6:39:02 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, document */
define(function (require, exports, module) {
	"use strict";
	var stateMachine		= require("plugins/emulink/stateMachine"),
        handlerFile         = require("util/fileHandler"),
        pvsWriter           = require("plugins/emulink/stateToPvsSpecificationWriter"),
        parserSpecification = require("plugins/emulink/parserSpecification"),
		PrototypeBuilder	= require("plugins/prototypebuilder/PrototypeBuilder"),
		Logger				= require("util/Logger"),
        Simulator           = require("plugins/emulink/simulator"),
        PVSioWebClient      = require("PVSioWebClient"),
        EditorModeUtils     = require("plugins/emulink/EmuchartsEditorModes"),
        EmuchartsManager    = require("plugins/emulink/EmuchartsManager"),
        displayAddState     = require("plugins/emulink/forms/displayAddState"),
        displayAddTransition = require("plugins/emulink/forms/displayAddTransition"),
        displayRename       = require("plugins/emulink/forms/displayRename"),
        displayDelete       = require("plugins/emulink/forms/displayDelete"),
        displayAddExpression = require("plugins/emulink/forms/displayAddExpression");
    
    var instance;
    var projectManager;
    var editor;
    var ws;
    var selectedFileChanged;
    var pvsioWebClient;
    var canvas;
    
    var emuchartsManager;
    var MODE;

	function modeChange_callback(event) {
		var EmuchartsEditorMode = document.getElementById("EmuchartsEditorMode");
		if (EmuchartsEditorMode) {
            if (event.mode === MODE.BROWSE()) {
                EmuchartsEditorMode.style.background = "green";
            } else { EmuchartsEditorMode.style.background = "steelblue"; }
			EmuchartsEditorMode.textContent = "Editor mode: " + MODE.mode2string(event.mode);
		}
		var infoBox = document.getElementById("infoBox");
		if (infoBox) {
			infoBox.value = MODE.modeTooltip(event.mode);
		}
	}

    /**
	 * Constructor
	 * @memberof Emulink
	 */
    function Emulink() {
        pvsioWebClient = PVSioWebClient.getInstance();
        MODE = new EditorModeUtils();
        emuchartsManager = new EmuchartsManager();
        emuchartsManager.addListener("emuCharts_editorModeChanged", modeChange_callback);
	}

    
	Emulink.prototype.createHtmlElements = function () {
		var content = require("text!plugins/emulink/forms/maincontent.handlebars");
        canvas = pvsioWebClient.createCollapsiblePanel("Emulink");
        canvas = canvas.html(content);
		var infoBox = document.getElementById("EmuchartsEditorMode");
		if (infoBox) {
			infoBox.style.background = "seagreen";
			infoBox.style.color = "white";
			infoBox.style.cursor = "default";
		}
        
        // add listeners
        // this first listner is obsolete
        d3.select("#button_newDiagram").on("click", function () {
			stateMachine.init(editor, ws, projectManager);
            d3.select("#EmuchartLogo").classed("hidden", true);
            d3.select("#graphicalEditor").classed("hidden", false);
		});
        d3.select("#button_state").on("click", function () {
			stateMachine.add_node_mode();
		});
        d3.select("#button_transition").on("click", function () {
			stateMachine.add_transition_mode();
		});
        d3.select("#button_self_transition").on("click", function () {
			stateMachine.add_self_transition_mode();
		});
		d3.select("#button_add_field").on("click", function () {
			stateMachine.add_field_mode_start();
			var newField =
                prompt("Please enter type and name"
                        + " of the new state variable"
                        + " (for example, int value)",
					   "fieldtype fieldname");
			if (!newField || newField.split(' ').length !== 2) {
                alert("Wrong format: new state variable has not been added");
				return stateMachine.add_field_mode_end(null, null);
			}
			var field_name = newField.split(' ')[0];
			var field_type = newField.split(' ')[1];
			var msg = "State variable " + field_name
					+ " of type " + field_type + " successfully added.";
			stateMachine.add_field_mode_end(field_name, field_type, msg);
		});
    
        /// User wants to perform an undo operation on the Editor    
        d3.select("#undoEditor").on("click", function () {
            pvsWriter.undo();
        });
        
        /// User want to perform a redo operation on the Editor 
        d3.select("#redoEditor").on("click", function () {
            pvsWriter.redo();
        });
    
        d3.select("#editor").on("click", function () {
            pvsWriter.click();
        });
    
        d3.select("#hideTags").on("click", function () {
            pvsWriter.hideTags();
        });
    
        d3.select("#showTags").on("click", function () {
            pvsWriter.showTags();
        });

        d3.select("#specificationToDiagram").on("click", function () {
            // User has just copied into the editor without opening any project
//            if (currentProject.pvsFilesList().length === 0) {
//                currentProject.name("default_pvsProject");
//                EmulinkFile.new_file(currentProject, editor,
//									 ws, "TheoryEmulink.pvs",
//                                     editor.getValue(), projectManager);
//            }
//            parserSpecification.init(editor, stateMachine, currentProject,
//										ws, projectManager, selectedFileChanged);
//            emulinkHasBeenUsed = true;
        });
        
        
        d3.select("#startSimulation").on("click", function () {
            var simulationIsActive = Simulator.init(ws);
            if (simulationIsActive) { d3.select(this).html("Disable Animation");
                } else { d3.select(this).html("Enable Animation"); }
            //Simulator.setInitState("INITSTATE");
        });
	
        /* d3.select("#infoBoxModifiable").on("change", function () {
	
	    stateMachine.changeTextArea();
	 
        });*/
/*        document.getElementById("emulinkInfo").value = "Emulink status: NOT active";
        document.getElementById("startEmulink").disabled = false;
        /// User wants to start emulink 
        d3.select("#startEmulink").on("click", function () {
			//d3.select(this).html("Diagram created").classed("btn-danger", false).classed("btn-success", true).attr("disabled", true);
            if( ! emulinkHasBeenUsed )
            {   
                showEmulinkStatus();
	            stateMachine.init(editor, ws, currentProject, projectManager, true);
                currentProject.name("default_pvsProject");
                emulinkHasBeenUsed = true;
            }
            stateMachine.addNewDiagram();          
        });    
	   */

        // bootstrap buttons
        d3.select("#btnNewEmuchart").on("click", function () {
            d3.select("#EmuchartLogo").classed("hidden", true);
            d3.select("#graphicalEditor").classed("hidden", false);
            emuchartsManager.newEmucharts("emucharts.pvs");
            // set initial editor mode
            emuchartsManager.set_editor_mode(MODE.BROWSE());
            // render emuchart
            emuchartsManager.render();
        });
        d3.select("#btnLoadEmuchart").on("click", function () {
            projectManager.openFiles(function (err, res) {
                if (!err) {
                    var emucharts = projectManager.project()
                                        .pvsFiles()["graphDefinition.json"];
                    if (emucharts) {
                        d3.select("#EmuchartLogo").classed("hidden", true);
                        d3.select("#graphicalEditor").classed("hidden", false);
                        emuchartsManager.importEmucharts(emucharts);
                        // set initial editor mode
                        emuchartsManager.set_editor_mode(MODE.BROWSE());
                        // render emuchart                        
                        emuchartsManager.render();
                    }
                } else {
                    alert(err.msg);
                    console.log(err);
                }
            });
		});
        
        // toolbar
        function resetToolbarColors() {
            document.getElementById("btn_toolbarBrowse").style.background = "black";
            document.getElementById("btn_toolbarAddState").style.background = "black";
            document.getElementById("btn_toolbarAddTransition").style.background = "black";
            document.getElementById("btn_toolbarRename").style.background = "black";
        }
        d3.select("#btn_toolbarAddState").on("click", function () {
            resetToolbarColors();
            this.style.background = "steelblue";
            emuchartsManager.set_editor_mode(MODE.ADD_STATE());
        });
        d3.select("#btn_toolbarAddTransition").on("click", function () {
            resetToolbarColors();
            this.style.background = "steelblue";
            emuchartsManager.set_editor_mode(MODE.ADD_TRANSITION());
        });
        d3.select("#btn_toolbarRename").on("click", function () {
            resetToolbarColors();
            this.style.background = "steelblue";
            emuchartsManager.set_editor_mode(MODE.RENAME());
        });
        d3.select("#btn_toolbarBrowse").on("click", function () {
            resetToolbarColors();
            this.style.background = "green";
            emuchartsManager.set_editor_mode(MODE.BROWSE());
        });

        // menu
        d3.select("#btn_menuNewState").on("click", function () {
            var label = emuchartsManager.getFreshStateName();
            displayAddState.create({
                header: "Please enter label for new state",
                textLabel: "New state",
                buttons: ["Cancel", "Create"]
            }).on("create", function (e, view) {
                var nodeLabel = e.data.labels.get("newLabel");
                emuchartsManager.add_state(nodeLabel);
                view.remove();
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
            });
        });
        d3.select("#btn_menuRenameState").on("click", function () {
            var states = emuchartsManager.getStates();
            var labels = [];
            states.forEach(function (state) {
                labels.push(state.name + "  (id: " + state.id + ")");
            });
            displayRename.create({
                header: "Please select state and enter new label...",
                textLabel: "Select state",
                currentLabels: labels,
                buttons: ["Cancel", "Rename"]
            }).on("rename", function (e, view) {
                var stateLabel = e.data.labels.get("newLabel");
                if (stateLabel && stateLabel.value !== "") {
                    var s = e.data.options.get("currentLabel");
                    var stateID = states[s].id;
                    emuchartsManager.rename_state(stateID, stateLabel);
                    view.remove();
                }
            }).on("cancel", function (e, view) {
                // just remove rename window
                view.remove();
            });
        });
        d3.select("#btn_menuDeleteState").on("click", function () {
            var states = emuchartsManager.getStates();
            var labels = [];
            states.forEach(function (state) {
                labels.push(state.name + "  (id: " + state.id + ")");
            });
            displayDelete.create({
                header: "Please select state to be deleted...",
                textLabel: "State to be deleted",
                currentLabels: labels,
                buttons: ["Cancel", "Delete"]
            }).on("delete", function (e, view) {
                var s = e.data.options.get("currentLabel");
                var stateID = states[s].id;
                emuchartsManager.delete_state(stateID);
                view.remove();
            }).on("cancel", function (e, view) {
                // just remove rename window
                view.remove();
            });
        });
        d3.select("#btn_menuNewTransition").on("click", function () {
            var newTransitionName = emuchartsManager.getFreshTransitionName();
            var states = emuchartsManager.getStates();
            var labels = [];
            states.forEach(function (state) {
                labels.push(state.name + "  (id: " + state.id + ")");
            });
            displayAddTransition.create({
                header: "Please enter label for new transition",
                textLabel: "New transition",
                sourceNodes: labels,
                targetNodes: labels,
                buttons: ["Cancel", "Create"]
            }).on("create", function (e, view) {
                var transitionLabel = e.data.labels.get("newLabel");
                if (transitionLabel && transitionLabel.value !== "") {
                    var sourceNode = e.data.options.get("sourceNode");
                    var sourceNodeID = states[sourceNode].id;
                    var targetNode = e.data.options.get("targetNode");
                    var targetNodeID = states[targetNode].id;
                    emuchartsManager.add_transition(transitionLabel, sourceNodeID, targetNodeID);
                    view.remove();
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
            });
        });
        d3.select("#btn_menuRenameTransition").on("click", function () {
            var transitions = emuchartsManager.getTransitions();
            var labels = [];
            transitions.forEach(function (transition) {
                labels.push(transition.name + "  ("
                            + transition.source.name + "->"
                            + transition.target.name + ")");
            });
            displayRename.create({
                header: "Please select transition and enter new label...",
                textLabel: "Select transition",
                currentLabels: labels,
                buttons: ["Cancel", "Rename"]
            }).on("rename", function (e, view) {
                var transitionLabel = e.data.labels.get("newLabel");
                var t = e.data.options.get("currentLabel");
                var transitionID = transitions[t].id;
                emuchartsManager.rename_transition(transitionID, transitionLabel);
                view.remove();
            }).on("cancel", function (e, view) {
                // just remove rename window
                view.remove();
            });
        });
        d3.select("#btn_menuDeleteTransition").on("click", function () {
            var transitions = emuchartsManager.getTransitions();
            var labels = [];
            transitions.forEach(function (transition) {
                labels.push(transition.name + "  ("
                            + transition.source.name + "->"
                            + transition.target.name + ")");
            });
            displayDelete.create({
                header: "Please select transition to be deleted...",
                textLabel: "Transition to be deleted",
                currentLabels: labels,
                buttons: ["Cancel", "Delete"]
            }).on("delete", function (e, view) {
                var t = e.data.options.get("currentLabel");
                var transitionID = transitions[t].id;
                emuchartsManager.delete_transition(transitionID);
                view.remove();
            }).on("cancel", function (e, view) {
                // just remove rename window
                view.remove();
            });
        });
        d3.select("#btn_menuNewConstant").on("click", function () {
            displayAddExpression.create({
                header: "Please enter new constant...",
                textLabel: "New constant",
                placeholder: "e.g., maxRate: real = 1200",
                buttons: ["Cancel", "Create"]
            }).on("create", function (e, view) {
                var newExpression = e.data.labels.get("newExpression");
                if (newExpression && newExpression.value !== "") {
                    emuchartsManager.add_constant(newExpression);
                    view.remove();
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
            });
        });
        d3.select("#btn_menuNewVariable").on("click", function () {
            displayAddExpression.create({
                header: "Please enter new state variable...",
                textLabel: "New state variable",
                placeholder: "e.g., display: real",
                buttons: ["Cancel", "Create"]
            }).on("create", function (e, view) {
                var newExpression = e.data.labels.get("newExpression");
                if (newExpression && newExpression.value !== "") {
                    emuchartsManager.add_variable(newExpression);
                    view.remove();
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
            });
        });
        
	};
    
    function addProjectManagerListeners() {
        projectManager.addListener("SelectedFileChanged", function (event) {
            selectedFileChanged = event.selectedItemString;
        });
        projectManager.addListener("SelectedFileChanged", function (event) {
            selectedFileChanged = event.selectedItemString;
        });
		projectManager.addListener("ProjectSaved", function (event) {
            var project = event.project;
            var gd = stateMachine.getGraphDefinition();
            var data  = {"fileName": project.path()
                         + "/graphDefinition.json", fileContent: gd};
            ws.writeFile(data, function (err, res) {
                if (!err) { console.log("Graph Saved");
                    } else { console.log("ERROR SAVING JSON GRAPH", err); }
            });
        });
        projectManager.addListener("ProjectChanged", function (event) {
            var emulinkSvg = d3.select("#ContainerStateMachine").selectAll("svg");
            //Checking if svg has been already created, if dirty we will clear it 
            if (!emulinkSvg.empty()) {
                emulinkSvg.remove();
                stateMachine.clearSvg();
            }
            var project = event.current;
            var fileToShow = project.mainPVSFile() || project.pvsFilesList()[0];
            fileToShow = fileToShow.name();
            var f = project.path() + "/" + "graphDefinition.json";
            ws.getFile(f, function (err, res) {
                if (!err) {
                    var graphDefinitionObject = JSON.parse(res.fileContent);
                    stateMachine.restoreGraph(graphDefinitionObject,
                                              editor, ws, project,
                                              fileToShow);
				} else { ///TODO: show error loading file
					console.log(JSON.stringify(err));
                }
            });
        });
        
    }

    
    Emulink.prototype.getDependencies = function () {
        return [PrototypeBuilder.getInstance()];
    };
    
    Emulink.prototype.initialise = function () {
        //enable the plugin -- this should also enable any dependencies defined in getDependencies method
        var prototypeBuilder = PrototypeBuilder.getInstance();
        // create local references to PVS editor, websocket client, and project manager
        editor = prototypeBuilder.getEditor();
        ws = pvsioWebClient.getWebSocket();
        projectManager = prototypeBuilder.getProjectManager();
        
        // add project manager listeners
//        addProjectManagerListeners();
        // add state machine editor listener
//        stateMachine.addListener("editormodechanged", modeChange_callback);
        
        // create user interface elements
		this.createHtmlElements();
    };
    
    Emulink.prototype.unload = function () {
        PVSioWebClient.getInstance().removeCollapsiblePanel(canvas);
        canvas = null;
    };
	
	module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new Emulink();
            }
            return instance;
        }
    };
});
