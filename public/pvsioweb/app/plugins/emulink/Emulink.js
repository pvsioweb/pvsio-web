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
	var stateMachine            = require("lib/statemachine/stateMachine"),
        handlerFile             = require("lib/fileHandler/fileHandler"),
        pvsWriter               = require("lib/statemachine/stateToPvsSpecificationWriter"),
		PrototypeBuilder		= require("pvsioweb/PrototypeBuilder"),
		Logger					= require("util/Logger");
	
	function createHtmlElements() {
		var content = require("text!plugins/emulink/forms/maincontent.handlebars");
		$("#content").append(content);
	}
	
	function Emulink(pvsioWebClient) {
		//register prototype builder as a plugin since this plugin depends on it
		var pb = pvsioWebClient.registerPlugin(PrototypeBuilder);
		var projectManager = pb.getProjectManager(),
			editor = pb.getEditor();
		
		//create the user interface elements
		createHtmlElements();
		
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
	
		document.getElementById("startEmulink").disabled = false;
		/// User wants to start emulink
		d3.select("#startEmulink").on("click", function () {
			stateMachine.init(projectManager.editor());
		});
		
		return this;
	}
	
	module.exports = Emulink;
});
