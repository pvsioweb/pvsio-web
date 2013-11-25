/**
 * 
 * @author Patrick Oladimeji
 * @date 11/21/13 15:03:48 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
	"use strict";
	var  ace                    = require("ace/ace"),
        ListView                = require("pvsioweb/ListView"),
        Project                 = require("project/Project"),
        d3                      = require("d3/d3"),
		ProjectManager			= require("project/ProjectManager"),
		Logger					= require("util/Logger"),
		ui						= require("pvsioweb/interface"),
        pvsLanguage             = require("lib/statemachine/pvsLanguage"),
		GraphBuilder			= require("plugins/graphbuilder/GraphBuilder"),
		sourceCodeTemplate		= require("text!pvsioweb/forms/templates/sourceCodeEditorPanel.handlebars");
	
	function PrototypeBuilderPlugin(pvsioWebClient) {
		var currentProject = new Project(""),
			projectManager = new ProjectManager(currentProject);
		
		ui.init();//this renders the basic templates for the page
		var editorContainer = pvsioWebClient.createCollapsiblePanel("Source code Editor");
		var aceContainer = editorContainer.append("div").html(sourceCodeTemplate);
		var editor = ace.edit("editor");
		projectManager.editor(editor);
		
		ui.bindListeners(projectManager);

		projectManager.preparePageForImageUpload();
		projectManager.prepareListBoxForFileDrag();
		editor.getSession().setMode('ace/mode/pvsLanguage');
		
		//register the graphbuilder plugin and add an event handler to reinitialise the plugin when the project changes
		var gb = pvsioWebClient.registerPlugin(GraphBuilder);
		
		projectManager.addListener("ProjectChanged", function () {
			gb.reInitialise();
		});
		/////These are the api methods that the prototype builder plugin exposes
		return {
			getProjectManager: function () {
				return projectManager;
			},
			getEditor: function () {
				return editor;
			}
		};
	}
	
	module.exports = PrototypeBuilderPlugin;
});
