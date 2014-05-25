/** enter emulink code here **/
/**
 * 
 * @author Patrick Oladimeji
 * @date 11/21/13 21:24:31 PM
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
        EmuchartsManager    = require("plugins/emulink/EmuchartsManager");
    
    var instance;
    var projectManager;
    var editor;
    var ws;
    var selectedFileChanged;
    var pvsioWebClient;
    var canvas;
    
    var emuchartsManager;
    var MODE = new EditorModeUtils();
    
	function createHtmlElements() {
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
                
        d3.select("#btn_toolbarAddState").on("click", function () {
            emuchartsManager.set_editor_mode(MODE.ADD_STATE());
        });
        d3.select("#btn_toolbarAddTransition").on("click", function () {
            emuchartsManager.set_editor_mode(MODE.ADD_TRANSITION());
        });
        d3.select("#btn_toolbarBrowse").on("click", function () {
            emuchartsManager.set_editor_mode(MODE.BROWSE());
        });
        d3.select("#btn_toolbarRename").on("click", function () {
            emuchartsManager.set_editor_mode(MODE.RENAME());
        });

	}

    function resetToolbarColors() {
        document.getElementById("btn_toolbarBrowse").style.background = "black";
        document.getElementById("btn_toolbarAddState").style.background = "black";
        document.getElementById("btn_toolbarAddTransition").style.background = "black";
        document.getElementById("btn_toolbarRename").style.background = "black";
    }
    
	function highlightSelectedFunction(m) {
		// reset toolbar colors
        resetToolbarColors();
        if (m === MODE.BROWSE()) {
            document.getElementById("btn_toolbarBrowse").style.background = "green";
        } else if (m === MODE.ADD_STATE()) {
            document.getElementById("btn_toolbarAddState").style.background = "steelblue";
        } else if (m === MODE.ADD_TRANSITION()) {
            document.getElementById("btn_toolbarAddTransition").style.background = "steelblue";
        } else if (m === MODE.RENAME()) {
            document.getElementById("btn_toolbarRename").style.background = "steelblue";
        }
        
//		document.getElementById("button_state").style.background = "";
//		document.getElementById("button_transition").style.background = "";
//		document.getElementById("button_add_field").style.background = "";
//		// highlight selected function in the menu
//		if (m === stateMachine.MODE.ADD_NODE
//                && document.getElementById("button_state")) {
//            document.getElementById("button_state").style.background = "steelblue";
//		}
//		if (m === stateMachine.MODE.ADD_TRANSITION
//                && document.getElementById("button_transition")) {
//            document.getElementById("button_transition").style.background = "steelblue";
//		}
//		if (m === stateMachine.MODE.ADD_SELF_TRANSITION
//                && document.getElementById("button_self_transition")) {
//			document.getElementById("button_self_transition").style.background = "steelblue";
//		}
//		if (m === stateMachine.MODE.ADD_FIELD
//                && document.getElementById("button_add_field")) {
//			document.getElementById("button_add_field").style.background = "steelblue";
//		}
	}

    
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
			infoBox.value = (event.message && event.message !== "") ?
                    event.message : MODE.modeTooltip(event.mode);
		}
		// highlight selected function in the menu
		highlightSelectedFunction(event.mode);
	}

    
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

    /**
	 * Constructor
	 * @memberof Emulink
	 */
    function Emulink() {
        pvsioWebClient = PVSioWebClient.getInstance();
        emuchartsManager = new EmuchartsManager();
        emuchartsManager.addListener("emuCharts_editorModeChanged", modeChange_callback);
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
        addProjectManagerListeners();
        // add state machine editor listener
        stateMachine.addListener("editormodechanged", modeChange_callback);
        
        // create user interface elements
		createHtmlElements();
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
