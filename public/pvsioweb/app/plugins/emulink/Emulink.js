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
        parserSpecification     = require("lib/statemachine/parserSpecification"),
		PrototypeBuilder		= require("pvsioweb/PrototypeBuilder"),
		Logger					= require("util/Logger");
        
    var emulinkHasBeenUsed = false; //Default: Current Project is not Emulink Project
    var ws;
	
	function createHtmlElements(pvsioWebClient) {
		var content = require("text!plugins/emulink/forms/maincontent.handlebars");
        var canvas = pvsioWebClient.createCollapsiblePanel("Visualisation of Emulink");
        canvas = canvas.html(content); 
	}
	
	function Emulink(pvsioWebClient) {
		//register prototype builder as a plugin since this plugin depends on it
		var pb = pvsioWebClient.registerPlugin(PrototypeBuilder);
		var projectManager = pb.getProjectManager(),
			editor = pb.getEditor();
        ws = pvsioWebClient.getWebSocket();
        var currentProject = projectManager.project();	
        
    
		//create the user interface elements
		createHtmlElements(pvsioWebClient);
		/** NEW: StateChart **************************************************************************/   
        d3.select("#state_machine").on("click", function () { stateMachine.init(editor, ws, currentProject, projectManager); });
        d3.select("#button_state").on("click", function () { stateMachine.add_node_mode(); });
        d3.select("#button_transition").on("click", function () { stateMachine.add_transition_mode(); });
        d3.select("#button_self_transition").on("click", function () { stateMachine.add_self_transition_mode(); });

        /// When User clicks on New File button #new_file a pvs file is created and showed in file list box
        d3.select("#new_file").on("click", function ( ) {	

            ListView.new_file(currentProject, editor, ws);
            ListView.showContentFileInEditor(currentProject, editor);	
        });
    
        d3.select("#save_file").on("click", function () {
        
        });

    
        /// When user clicks on open_file button #open_file, a form is showed 
        d3.select("#open_file").on("click", function () {
	
	        ListView.open_file_form(currentProject, editor, ws); //Define in: /public/pvsioweb/app/formal/pvs/prototypebuilder/ListView.js
            ListView.showContentFileInEditor(currentProject, editor);
        });
	
        /// User wants to rename a file 
        d3.select("#rename_file").on("click", function () {
            ListView.renameFileProject(currentProject, editor, ws);
        });
   

        /// User wants to close a file (it will be not shown in file list box on the right ) 
        d3.select("#close_file").on("click", function () {
	
            ListView.closeFile(currentProject, editor, ws );
	
        });

        /// User wants to see all files of the project 
        d3.select("#show_all_files").on("click", function () {
	
            ListView.showAllFiles(currentProject, editor, ws );
	
        });

        /// User wants to delete a file from the project  
        d3.select("#delete_file").on("click", function () {
	
            ListView.deleteFile(currentProject, editor, ws );	
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
    
        d3.select("#hideTags").on("click", function() {
            pvsWriter.hideTags();
        });
    
        d3.select("#showTags").on("click", function() {
            pvsWriter.showTags();
        });
        
        d3.select("#specificationToDiagram").on("click", function() {
            
            parserSpecification.init(editor, stateMachine, currentProject, ws, projectManager, false);
        });
	
        /* d3.select("#infoBoxModifiable").on("change", function () {
	
	    stateMachine.changeTextArea();
	 
        });*/

        document.getElementById("startEmulink").disabled = false;
        /// User wants to start emulink 
        d3.select("#startEmulink").on("click", function () {
	        stateMachine.init(editor, ws, currentProject, projectManager, true);
            currentProject.name("default_pvsProject");
            emulinkHasBeenUsed = true;
        });    
	
        //Adding Listener triggered when user saves a project
		projectManager.addListener("ProjectSaved", function (event) { 
            
            //Check If in the current project Emulink has been used
            if( emulinkHasBeenUsed )
            {    
                 var project = event.project;
                 var gd = stateMachine.getGraphDefinition();
		         var data  = {"fileName": project.path() + "/graphDefinition.json", fileContent: gd};
		         ws.writeFile(data, function (err, res) {
                 if (!err) {
                        console.log("Graph Saved");
                 }
                     else console.log("ERRORE SAVING JSON GRAPH", err);
                 });  
            }
        
        });
        
        
        projectManager.addListener("ProjectChanged", function (event) { 
            
             emulinkHasBeenUsed = false;
             var project = event.current; 
             var f = project.path() + "/" + "graphDefinition.json";
             ws.getFile(f, function (err, res) {
					if (!err) {
                        var graphDefinitionObject = JSON.parse(res.fileContent);
                        stateMachine.restoreGraph(graphDefinitionObject, editor, ws, project, projectManager);
                        emulinkHasBeenUsed = true;
					} else {
						///TODO show error loading file
						console.log(JSON.stringify(err));
                      }
             });
        
        });
        
        
        
		return this;
	}
	
	module.exports = Emulink;
});
