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
        ace_language_tools      = require("ace/ext/language_tools"),
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
        editor = ace.edit("editor");
        editor.setOptions({
            enableBasicAutocompletion: true
        });
        editor.commands.on("afterExec", function (e) {
            if (e.command.name === "insertstring" && /^[\w.]$/.test(e.args)) {
                editor.execCommand("startAutocomplete");
            }
        });
        // this enables syntax highlighting
        editor.getSession().setMode("ace/mode/pvsLanguage");
        // this removes the printing margin, which is not necessary for now
        editor.setShowPrintMargin(false);

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
