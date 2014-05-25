/**
 * 
 * @author Patrick Oladimeji
 * @date 11/21/13 15:03:48 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
	"use strict";
	var  CodeMirror                    = require("cm/lib/codemirror"),
        Project                 = require("project/Project"),
        PVSioWebClient          = require("PVSioWebClient"),
        d3                      = require("d3/d3"),
		ProjectManager			= require("project/ProjectManager"),
		Logger					= require("util/Logger"),
        pvsLanguage             = require("plugins/emulink/pvsLanguage"),
		sourceCodeTemplate		= require("text!pvsioweb/forms/templates/sourceCodeEditorPanel.handlebars");
	var instance;
    var currentProject,
        projectManager,
        editor,
        editorContainer,
        pvsioWebClient;
    
    require("cm/addon/fold/foldcode");
    require("cm/addon/fold/foldgutter");
    require("cm/addon/fold/indentFold");
    require("cm/mode/pvs/pvs");
    
	function PrototypeBuilder() {
        pvsioWebClient = PVSioWebClient.getInstance();
		currentProject = new Project("");
        projectManager = new ProjectManager(currentProject);
	}
	
    /////These are the api methods that the prototype builder plugin exposes
    PrototypeBuilder.prototype.getDependencies = function () { return []; };
    
    PrototypeBuilder.prototype.initialise = function () {
        editorContainer = pvsioWebClient.createCollapsiblePanel("PVS Editor");
        var aceContainer = editorContainer.append("div").html(sourceCodeTemplate);

        // this enable autocompletion
        editor = new CodeMirror(d3.select("#editor").node(), {
            mode: "pvs", lineNumbers: true, foldGutter: true, autofocus: true, gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]});
        editor.setSize("100%", "100%");
        projectManager.editor(editor);

        projectManager.preparePageForImageUpload();

        // create and default initial empty project containing an empty file (main.pvs)
        projectManager.createDefaultProject();

    };
   
    PrototypeBuilder.prototype.unload = function () {
        editor = null;
        pvsioWebClient.removeCollapsiblePanel(editorContainer);
    };
    PrototypeBuilder.prototype.getProjectManager = function () {
        return projectManager;
    };
    PrototypeBuilder.prototype.getEditor = function () {
        return editor;
    };
	
    module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new PrototypeBuilder();
            }
            return instance;
        }
    };
});
