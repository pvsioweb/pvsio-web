/**
 * 
 * @author Patrick Oladimeji
 * @date 11/21/13 15:03:48 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
	"use strict";
	var  CodeMirror             = require("cm/lib/codemirror"),
        Project                 = require("project/Project"),
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
    require("cm/mode/pvs/pvs");
    
	function PrototypeBuilder() {
        pvsioWebClient = PVSioWebClient.getInstance();
		currentProject = new Project("");
        projectManager = new ProjectManager(currentProject);
        projectManager.addListener("SelectedFileChanged", function (event) {
            if (editor) {
                editor.refresh();
            }
        });
	}
	
    /////These are the api methods that the prototype builder plugin exposes
    PrototypeBuilder.prototype.getDependencies = function () { return []; };
    
    ///FIXME this should have a callback or return a promise since it calls an async function "createDefaultProject"
    PrototypeBuilder.prototype.initialise = function () {
        editorContainer = pvsioWebClient.createCollapsiblePanel({headerText: "PVS Editor", showContent: false, onClick: function () {
            editor.refresh();
        }, owner: "PrototypeBuilder"});
        editorContainer.append("div").html(sourceCodeTemplate);

        // this enables autocompletion
        editor = new CodeMirror(d3.select("#editor").node(), {
            mode: "pvs",
            lineNumbers: true,
            foldGutter: true,
            autofocus: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });
        editor.setSize("100%", "100%");
        projectManager.editor(editor);
        projectManager.preparePageForImageUpload();
        // create and default initial empty project containing an empty file (main.pvs)
        projectManager.createDefaultProject();
        d3.select("#project-notification-area").insert("p", "p").html("PVSio-web Ready!");
        d3.select("#editor-notification-area").insert("p", "p").html("PVS Editor Ready!");
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
