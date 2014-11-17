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
    
    function onProjectChanged(event) {
        var project = event.current;
        projectManager.renderSourceFileList(project.getFolderStructure());
        projectManager.selectFile(project.mainPVSFile() || project.pvsFilesList()[0] || project.name());
    }
    
	function ModelEditor() {
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
    ModelEditor.prototype.getDependencies = function () { return []; };
    
	/**
		@returns {Promise} a promise that resolves when the prototype builder has been initialised
	*/
    ModelEditor.prototype.initialise = function () {
        editorContainer = pvsioWebClient.createCollapsiblePanel({
            headerText: "Model Editor",
            showContent: false,
            onClick: function () {
                editor.refresh();
            },
            owner: "ModelEditor"
        });
        editorContainer.append("div").html(sourceCodeTemplate);

        // this enables autocompletion
        editor = new CodeMirror(d3.select("#editor").node(), {
            mode: "txt",
            lineNumbers: true,
            foldGutter: true,
            autofocus: false,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "breakpoints"],
            autoCloseBrackets: true,
            matchBrackets: true,
            styleActiveLine: false,
            placeholder: "Type the formal model here...",
            extraKeys: {
                "Ctrl-Space": "autocomplete",
                "Ctrl-S": function (instance) {
                    d3.select("#editorToolbar").select("#btnSaveFile").node().click();
                }
            }
        });
        editor.on("gutterClick", function (cm, n) {
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
        editor.on("inputRead", function (cm) {
            if (showHint) {
                CodeMirror.showHint(cm, CodeMirror.hint.pvs, { completeSingle: false, alignWithWord: true });
            }
        });
        editor.on("keyup", function (cm, event) {
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
        
        projectManager.addListener("ProjectChanged", onProjectChanged);
        document.getElementById("model-editor-search-input").addEventListener("click", function () {
            editor.options.search = document.getElementById("model-editor-search-input").value;
            CodeMirror.commands.find(editor);
        });
        
        if (projectManager.project().name() !== "") {
            projectManager.renderSourceFileList(projectManager.project().getFolderStructure());
        }
		return Promise.resolve(true);
    };
   
    ModelEditor.prototype.unload = function () {
        editor = null;
        projectManager.removeListener("ProjectChanged", onProjectChanged);
        pvsioWebClient.removeCollapsiblePanel(editorContainer);
		return Promise.resolve(true);
    };
    
    ModelEditor.prototype.getEditor = function () {
        return editor;
    };
	
    module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new ModelEditor();
            }
            return instance;
        }
    };
});
