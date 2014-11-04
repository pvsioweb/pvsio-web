/**
 * 
 * @author Patrick Oladimeji
 * @date 11/21/13 15:03:48 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, layoutjs, Promise*/
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
    require("cm/addon/hint/show-hint");
    require("cm/addon/hint/pvs-hint");
    require("cm/addon/edit/closebrackets");
    require("cm/addon/edit/matchbrackets");
    require("cm/addon/selection/active-line");
    require("cm/addon/display/placeholder");
    require("cm/addon/dialog/dialog");
    require("cm/addon/search/searchcursor");
    require("cm/addon/search/search");
    require("cm/mode/pvs/pvs");
    require("cm/mode/mal/mal");
    
	function PrototypeBuilder() {
        pvsioWebClient = PVSioWebClient.getInstance();
		currentProject = new Project("");
        projectManager = new ProjectManager(currentProject);
        projectManager.addListener("SelectedFileChanged", function () {
            if (editor) {
                editor.refresh();
            }
        });
	}
	
    /////These are the api methods that the prototype builder plugin exposes
    PrototypeBuilder.prototype.getDependencies = function () { return []; };
    
	/**
		@returns {Promise} a promise that resolves when the prototype builder has been initialised
	*/
    PrototypeBuilder.prototype.initialise = function () {
        editorContainer = pvsioWebClient.createCollapsiblePanel({
            headerText: "Model Editor",
            showContent: false,
            onClick: function () {
                editor.refresh();
            },
            owner: "PrototypeBuilder"
        });
        editorContainer.append("div").html(sourceCodeTemplate);

        // this enables autocompletion
        editor = new CodeMirror(d3.select("#editor").node(), {
            mode: "txt",
            lineNumbers: true,
            foldGutter: true,
            autofocus: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"],
            autoCloseBrackets: true,
            matchBrackets: true,
            styleActiveLine: true,
            placeholder: "The formal model goes here...",
            extraKeys: {
                "Ctrl-Space": "autocomplete",
            }
        });
        editor.on("gutterClick", function(cm, n) {
            function makeMarker() {
                var marker = document.createElement("div");
                marker.style.position = "absolute";
                marker.style.border = "2px solid steelblue";
                marker.style.height = "16px";
                return marker;
            }            
            console.log("line = " + n);
            var info = cm.lineInfo(n);
            cm.setGutterMarker(n, "breakpoints", info.gutterMarkers ? null : makeMarker());
        });
        var showHint = true;
        editor.on("inputRead", function(cm) {
            if (showHint) {
                CodeMirror.showHint(cm, CodeMirror.hint.pvs, { completeSingle: false });
            }
        });
        editor.on("keyup", function(cm, event) {    
            var keyCode = event.keyCode || event.which;
            // show hints only when typing words
            if (keyCode < 65 || keyCode > 90) { // 65 = a, 90 = z
                showHint = false;
            } else {
                showHint = true;
            }
        });        
        editor.setSize("100%", "100%");
        projectManager.editor(editor);
        projectManager.preparePageForImageUpload();
		return Promise.resolve(true);
    };
   
    PrototypeBuilder.prototype.unload = function () {
        editor = null;
        pvsioWebClient.removeCollapsiblePanel(editorContainer);
		return Promise.resolve(true);
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
