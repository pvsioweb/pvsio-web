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
        handlerFile             = require("util/fileHandler"),
        pvsWriter               = require("lib/statemachine/stateToPvsSpecificationWriter"),
        parserSpecification     = require("lib/statemachine/parserSpecification"),
		PrototypeBuilder		= require("pvsioweb/PrototypeBuilder"),
		Logger					= require("util/Logger");
        
    var emulinkHasBeenUsed = false; //Default: Current Project is not Emulink Project
    var ws;
	
	function createHtmlElements(pvsioWebClient) {
		var content = require("text!plugins/emulink/forms/maincontent.handlebars");
        var canvas = pvsioWebClient.createCollapsiblePanel("Statechart editor");
        canvas = canvas.html(content); 
	}
	function showEmulinkStatus()
    {
        document.getElementById("emulinkInfo").value = "Emulink Status: Active ";
        document.getElementById("emulinkInfo").style.color = "#53760D";
        
    }
	function Emulink(pvsioWebClient) {
		//register prototype builder as a plugin since this plugin depends on it
		var pb = pvsioWebClient.registerPlugin(PrototypeBuilder);
		var projectManager = pb.getProjectManager(),
			editor = pb.getEditor();
        ws = pvsioWebClient.getWebSocket();
        var currentProject = projectManager.project();	
        var fileCounter = 0;
    
		//create the user interface elements
		createHtmlElements(pvsioWebClient);
		/** NEW: StateChart **************************************************************************/   
        d3.select("#state_machine").on("click", function () { stateMachine.init(editor, ws, currentProject, projectManager); });
        d3.select("#button_state").on("click", function () { stateMachine.add_node_mode(); });
        d3.select("#button_transition").on("click", function () { stateMachine.add_transition_mode(); });
        d3.select("#button_self_transition").on("click", function () { stateMachine.add_self_transition_mode(); });
        
        /// When User clicks on New File button #new_file a pvs file is created and showed in file list box
        d3.select("#new_file").on("click", function ( ) {	
            projectManager.newFile();
        });
    
        d3.select("#save_file").on("click", function () {
            
        });

    
        /// When user clicks on open_file button #open_file, a form is showed 
        d3.select("#open_file").on("click", function () {
	       projectManager.openFiles(function () {
               //insert anything here if you need something to happen after files are added
           });
        });
	
        /// User wants to rename a file 
        d3.select("#rename_file").on("click", function () {
            projectManager.renameFile(projectManager.getSelectedFile());
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
	       projectManager.deleteFile(projectManager.getSelectedFile(), function () {
                //do somethng when file is deleted 
           });
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
            showEmulinkStatus();
            emulinkHasBeenUsed = true;
        });
        
	
        /* d3.select("#infoBoxModifiable").on("change", function () {
	
	    stateMachine.changeTextArea();
	 
        });*/
        document.getElementById("emulinkInfo").value = "Emulink status: NOT active";
        document.getElementById("startEmulink").disabled = false;
        /// User wants to start emulink 
        d3.select("#startEmulink").on("click", function () {
            showEmulinkStatus();
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
             var emulinkSvg = d3.select("#ContainerStateMachine").selectAll("svg");
             //Checking if svg has been already created, if dirty we will clear it 
             if( emulinkSvg[0].length ){ emulinkSvg.remove(); stateMachine.clearSvg(); }             
             emulinkHasBeenUsed = false;
             var project = event.current; 
             var f = project.path() + "/" + "graphDefinition.json";
             ws.getFile(f, function (err, res) {
					if (!err) {
                        var graphDefinitionObject = JSON.parse(res.fileContent);
                        stateMachine.restoreGraph(graphDefinitionObject, editor, ws, project, projectManager);
                        emulinkHasBeenUsed = true;
                        showEmulinkStatus();
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
