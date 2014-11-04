/**
 * 
 * @author Patrick Oladimeji
 * @date 11/21/13 15:03:48 PM
 */
/*jshint unused: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Promise*/
define(function (require, exports, module) {
	"use strict";
	var  CodeMirror             = require("cm/lib/codemirror"),
        PVSioWebClient          = require("PVSioWebClient"),
        d3                      = require("d3/d3"),
		ProjectManager			= require("project/ProjectManager"),
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
    require("cm/addon/hint/show-hint");
    require("cm/addon/hint/anyword-hint");
    require("cm/mode/pvs/pvs");
    require("cm/mode/mal/mal");
    
    function onProjectChanged(event) {
        var project = event.current;
        projectManager.renderSourceFileList(project.getFolderStructure());
        projectManager.selectFile(project.mainPVSFile() || project.pvsFilesList()[0] || project.name());
    }
    
	function TextEditor() {
        pvsioWebClient = PVSioWebClient.getInstance();
        projectManager = ProjectManager.getInstance();
        currentProject = projectManager.project();
        projectManager.addListener("SelectedFileChanged", function () {
            if (editor) {
                editor.refresh();
            }
        });
	}
	
    /////These are the api methods that the prototype builder plugin exposes
    TextEditor.prototype.getDependencies = function () { return []; };
    
	/**
		@returns {Promise} a promise that resolves when the prototype builder has been initialised
	*/
    TextEditor.prototype.initialise = function () {
        editorContainer = pvsioWebClient.createCollapsiblePanel({
            headerText: "Model Editor",
            showContent: false,
            onClick: function () {
                editor.refresh();
            },
            owner: "TextEditor"
        });
        editorContainer.append("div").html(sourceCodeTemplate);

        // this enables autocompletion
        editor = new CodeMirror(d3.select("#editor").node(), {
            mode: "txt",
            lineNumbers: true,
            foldGutter: true,
            autofocus: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            extraKeys: {"Ctrl-Space": "autocomplete"}
        });
        editor.setSize("100%", "100%");
        projectManager.editor(editor);
        
        projectManager.addListener("ProjectChanged", onProjectChanged);
        
        if (projectManager.project().name() !== "") {
            projectManager.renderSourceFileList(projectManager.project().getFolderStructure());
        }
		return Promise.resolve(true);
    };
   
    TextEditor.prototype.unload = function () {
        editor = null;
        projectManager.removeListener("ProjectChanged", onProjectChanged);
        pvsioWebClient.removeCollapsiblePanel(editorContainer);
		return Promise.resolve(true);
    };
    
    TextEditor.prototype.getEditor = function () {
        return editor;
    };
	
    module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new TextEditor();
            }
            return instance;
        }
    };
});
