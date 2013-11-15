/**
 * Binds user interface elements to events
 * @author Patrick Oladimeji
 * @date 11/15/13 16:29:55 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, document */
define(function (require, exports, module) {
	"use strict";
	var WSManager = require("websockets/pvs/WSManager"),
		Logger	= require("util/Logger"),
		stateMachine            = require("lib/statemachine/stateMachine"),
        handlerFile             = require("lib/fileHandler/fileHandler"),
        pvsWriter               = require("lib/statemachine/stateToPvsSpecificationWriter");
	
    function switchToBuilderView() {
        d3.select(".image-map-layer").style("opacity", 1).style("z-index", 190);
        d3.selectAll("#controlsContainer button, div.display").classed("selected", false);
        d3.select("#btnBuilderView").classed('selected', true);
        d3.select("div.display,#controlsContainer button").classed("builder", true);
        d3.select("div.display,#controlsContainer button").classed("simulator", false);
    }

    function switchToSimulatorView() {
        d3.select(".image-map-layer").style("opacity", 0.1).style("z-index", -2);
        d3.selectAll("#controlsContainer button, div.display").classed("selected", false);
        d3.select("#btnSimulatorView").classed('selected', true);
        d3.select("div.display,#controlsContainer button").classed("simulator", true);
        d3.select("div.display,#controlsContainer button").classed("builder", false);
    }
	
	
    function pvsProcessReady(err, e) {
        var pvsioStatus = d3.select("#lblPVSioStatus");
        pvsioStatus.select("span").remove();
        if (!err) {
            var msg = ("pvsio process ready");
            Logger.log(msg);
            pvsioStatus.append("span").attr("class", "glyphicon glyphicon-ok");

        } else {
            console.log(err);
            pvsioStatus.append("span").attr("class", "glyphicon glyphicon-warning-sign");
        }
    }

	function bindListeners(projectManager) {
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
	
		d3.select("#saveProject").on("click", function () {
			projectManager.saveProject();
		});
	
		d3.select("#openProject").on("click", function () {
			projectManager.openProject(function (project) {
				var ws = WSManager.getWebSocket();
				ws.lastState("init(0)");
				if (project.mainPVSFile()) {
					ws.startPVSProcess(project.mainPVSFile().name(), project.name(), pvsProcessReady);
				}
				switchToBuilderView();
			});
		});
	
		d3.select("#newProject").on("click", function () {
			projectManager.newProject();
		});
		//handle typecheck event
		//this function should be edited to only act on the selected file when multiple files are in use
		d3.select("#btnTypeCheck").on("click", function () {
			var pvsFile = projectManager.getSelectedFile(), project = projectManager.project();
			if (pvsFile) {
				var btn = d3.select(this).html("Typechecking ...").attr("disabled", true);
				var ws = WSManager.getWebSocket();
				ws.send({type: "typeCheck", filePath: project.path() + "/" + pvsFile.name()}, function (err, res) {
					btn.html("Typecheck").attr("disabled", null);
					if (err) {
						alert(JSON.stringify(err));
					} else {
						console.log(res);
						///TODO: show nicer alert and visualisation for type checking info
						alert(res.stdout);
					}
				});
			}
		});
	
		d3.select("#btnSetMainFile").on("click", function () {
			var pvsFile = projectManager.getSelectedFile(), project = projectManager.project();
			if (pvsFile) {
				var ws = WSManager.getWebSocket();
				ws.send({type: "setMainFile", projectName: project.name(), fileName: pvsFile.name()}, function (err, res) {
					//if there was no error update the main file else alert user
					project.mainPVSFile(pvsFile);
					///FIXME
	
				});
			}
		});
	
		d3.select("#btnSaveFile").on("click", function () {
			var pvsFile = projectManager.getSelectedFile(), project = projectManager.project();
			if (pvsFile) {
				project.saveFile(pvsFile, function (err, res) {
					if (!err) {
						pvsFile.dirty(false);
						projectManager.updateSourceCodeToolbarButtons(pvsFile);
					} else {
						console.log(err);
					}
				});
			}
		});
	
		d3.select("#btnRestartPVSioWeb").on("click", function () {
			//try to start process on server
			var project = projectManager.project(), ws = WSManager.getWebSocket();
			if (project && project.mainPVSFile()) {
				ws.lastState("init(0)");
				ws.startPVSProcess(project.mainPVSFile().name(), project.name(),
							  pvsProcessReady);
			}
		});
	
		/** NEW: StateChart **************************************************************************/
		d3.select("#state_machine").on("click", function () { stateMachine.init(projectManager.editor()); });
		d3.select("#button_state").on("click", function () { stateMachine.add_node_mode(); });
		d3.select("#button_transition").on("click", function () { stateMachine.add_transition_mode(); });
		d3.select("#button_self_transition").on("click", function () { stateMachine.add_self_transition_mode(); });
		var modifiedUser = 0;
		var myState = [];
		myState[0] = {
			name : "S1",
			id   : 0
		};
		myState[1] = {
			name : "S2",
			id   : 0
		};
		/// When User clicks on New File button #new_file a pvs file is created and showed in file list box
		d3.select("#new_file").on("click", function () {
			var editor = projectManager.editor();
			projectManager.newFile();
			/******MYTEST*****/
			editor.on("change", function (e) {
				//ideally one should use information from ace to set the dirty mark on the document
				//e.g editor.getSession().getUndoManager().hasUndo();
				if (modifiedUser) {
					return;
				}
				pvsWriter.userModification(e, editor);
			});
			modifiedUser = 1;
			pvsWriter.newPVSSpecification("myTheory", editor);
			modifiedUser = 0;
		});
	
	
		/// When user clicks on open_file button #open_file, a form is showed
		d3.select("#open_file").on("click", function () {
			projectManager.openFiles(function () {
				Logger.log("files added to project ..");
			});
		});
	
		/// User wants to rename a file
		d3.select("#rename_file").on("click", function () {
			projectManager.renameFile(projectManager.getSelectedFile());
		});
	
	   /// User wants to split the screen
		d3.select("#splitView").on("click", function () {
			document.getElementById("sourcecode-editor-wrapper").style.visibility = 'visible';
			document.getElementById("editor").style.top = "900px";
			document.getElementById("specification_log_Container").style.visibility = 'hidden';
			document.getElementById("ContainerStateMachine").style.weight = '400px';
		});
	
		/// User wants to close a file (it will be not shown in file list box on the right )
		d3.select("#close_file").on("click", function () {
			projectManager.closeFile(projectManager.getSelectedFile());
		});
	
		/// User wants to see all files of the project
		d3.select("#show_all_files").on("click", function () {
			projectManager.showAllFiles();
		});
	
		/// User wants to delete a file from the project
		d3.select("#delete_file").on("click", function () {
			projectManager.deleteFile(projectManager.getSelectedFile());
		});
	
	   /* d3.select("#infoBoxModifiable").on("change", function () {
	
		stateMachine.changeTextArea();
	
		});*/
	
		document.getElementById("startEmulink").disabled = false;
		/// User wants to start emulink
		d3.select("#startEmulink").on("click", function () {
			stateMachine.init(projectManager.editor());
		});
	}
	
	module.exports = {
		bindListeners: bindListeners
	};
});
