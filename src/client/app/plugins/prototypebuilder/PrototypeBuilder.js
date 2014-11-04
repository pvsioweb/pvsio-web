/**
 * 
 * @author Patrick Oladimeji
 * @date 11/21/13 15:03:48 PM
 */
/*jshint unused: true */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Promise, layoutjs, d3*/
define(function (require, exports, module) {
	"use strict";
	var  PVSioWebClient          = require("PVSioWebClient"),
        WSManager = require("websockets/pvs/WSManager"),
		ProjectManager			= require("project/ProjectManager"),
        WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager(),
        Logger = require("util/Logger"),
        Recorder = require("util/ActionRecorder"),
        Prompt  = require("pvsioweb/forms/displayPrompt"),
        WidgetsListView = require("pvsioweb/forms/WidgetsListView"),
        template		= require("text!pvsioweb/forms/templates/prototypeBuilderPanel.handlebars");
	var instance;
    var currentProject,
        projectManager,
        pbContainer,
        pvsioWebClient;
    
	function PrototypeBuilder() {
        pvsioWebClient = PVSioWebClient.getInstance();
        projectManager = ProjectManager.getInstance();
        currentProject = projectManager.project();
	}
	
    function updateImageAndLoadWidgets() {
        var p = projectManager.project();
        var image = p.getImage();
        WidgetManager.clearWidgetAreas();
        d3.select("div#body").style("display", null);
        if (image) {
            return new Promise(function (resolve, reject) {
                projectManager.updateImage(image, function (res, scale) {
                    if (res.type !== "error") {
                        WidgetManager.updateMapCreator(scale, function () {
                            try {
                                var wdStr = p.getWidgetDefinitionFile().content();
                                if (wdStr && wdStr !== "") {
                                    var wd = JSON.parse(p.getWidgetDefinitionFile().content());
                                    WidgetManager.restoreWidgetDefinitions(wd);
                                    //update the widget area map scales 
                                    WidgetManager.scaleAreaMaps(scale);
                                }
                            } catch (err) {
                                Logger.log(err);
                            }
                            resolve();
                        });
                        d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
                    } else {
                        Logger.log(res);
                        //show the image drag and drop div
                        d3.select("#imageDragAndDrop.dndcontainer").style("display", null);
                        reject(res);
                    }
                });
            });
        } else {
            // remove previous image, if any
            d3.select("#imageDiv img").attr("src", "").attr("height", "430").attr("width", "1128");
            //show the image drag and drop div
            d3.select("#imageDragAndDrop.dndcontainer").style("display", null);
            return Promise.resolve();
        }
    }
    
    function onProjectChanged() {
        switchToBuilderView();
        updateImageAndLoadWidgets().then(function () {
            WidgetsListView.create();  
        }).catch(function (err) {
            Logger.error(err);
        });        
    }
    
    /**
	 * Switches the prototoyping layer to the builder layer
     * @private
	 */
    function switchToBuilderView() {
        d3.select(".image-map-layer").style("opacity", 1).style("z-index", 190);
        d3.selectAll("#controlsContainer button, div.display").classed("selected", false);
		d3.select("#controlsContainer .active").classed("active", false);
        d3.select("#btnBuilderView").classed('active', true);
        d3.selectAll("div.display,#controlsContainer button").classed("builder", true);
        d3.selectAll("div.display,#controlsContainer button").classed("simulator", false);
        d3.selectAll("#record").style("display", "none");
    }
	/** Switches the prototyping layer to the simulator/testing layer 
        @private
    */
    function switchToSimulatorView() {
        d3.select(".image-map-layer").style("opacity", 0.1).style("z-index", -2);
        d3.selectAll("#controlsContainer button, div.display").classed("selected", false);
		d3.select("#controlsContainer .active").classed("active", false);
        d3.select("#btnSimulatorView").classed("active", true);
        d3.select("#btnSimulatorView").classed("selected", true);
        d3.selectAll("div.display,#controlsContainer button").classed("simulator", true);
        d3.selectAll("div.display,#controlsContainer button").classed("builder", false);
        d3.selectAll("#record").style("display", "block");
    }
    
    function bindListeners() {
        var actions, recStartState, recStartTime, scriptName;
        /**
		 * Add event listener for toggling the prototyping layer and the interaction layer
		 */
		d3.select("#btnBuilderView").classed("selected", true).on("click", function () {
			switchToBuilderView();
		});
	
		d3.select("#btnSimulatorView").on("click", function () {
            var img = d3.select("#imageDiv img");
            var msg = "";
            if (!img || !img.attr("src") || img.attr("src") === "") {
                msg = "Please load a user interface picture before switching to Simulator View.\n\n " +
                        "This can be done from within the Builder View, using the \"Load Picture\" button.";
                return alert(msg);
            }
            if (!projectManager.project().mainPVSFile()) {
                msg = "Please set a Main File before switching to Simulator View.\n\n" +
                        "This can be done using the Model Editor:\n" +
                        "  (i) select a file from the file browser shown on the right panel of the Model Editor\n" +
                        "  (ii) click on \"Set as Main File\" to set the selected file as Main File.";
                return alert(msg);
            }
            switchToSimulatorView();
		});
	
        d3.select("#record").on("click", function () {
            var label = d3.select(this).html().trim(), script;
            if (label === "Record") {
                d3.select(this).html(" Stop Recording").classed("recording", true);
                Recorder.startRecording();
                recStartState = WSManager.getWebSocket().lastState();
                recStartTime = new Date().getTime();
                scriptName = "Script_" + recStartTime;
            } else {
                d3.select(this).html(" Record").classed("recording", false);
                actions = Recorder.stopRecording();
                //do something with actions
                Logger.log(actions);
                //ask user to give name to script
                Prompt.create({header: "Would you like to save this script?",
                               message: "Please enter a name for your script",
                               buttons: ["Delete", "Save"]})
                    .on("save", function (e, view) {
                        scriptName = e.data.prompt.trim() || scriptName;
                        view.remove();
                        script = {name: scriptName, actions: actions, startState: recStartState};
                        //add the script to the project
                        projectManager.project().addScript(script);
                    }).on("delete", function (e, view) {
                        view.remove();
                    });
            }
        });
    }
    
    /////These are the api methods that the prototype builder plugin exposes
    PrototypeBuilder.prototype.getDependencies = function () { return []; };
    
	/**
		@returns {Promise} a promise that resolves when the prototype builder has been initialised
	*/
    PrototypeBuilder.prototype.initialise = function () {
        pbContainer = pvsioWebClient.createCollapsiblePanel({
            headerText: "Prototype Builder",
            showContent: true,
            onClick: function () {},
            parent: "#body",
            owner: "PrototypeBuilder"
        });
        pbContainer.html(template);
        layoutjs({el: "#body"});
        projectManager.preparePageForImageUpload();
        projectManager.addListener("ProjectChanged", onProjectChanged);
        bindListeners();
		return updateImageAndLoadWidgets();
    };
   
    PrototypeBuilder.prototype.unload = function () {
        pvsioWebClient.removeCollapsiblePanel(pbContainer);
        projectManager.removeListener("ProjectChanged", onProjectChanged);
		return Promise.resolve(true);
    };
    
    /**
        Gets an instance of the project manager
        @deprecated use ProjectManager.getInstance()
    */
    PrototypeBuilder.prototype.getProjectManager = function () {
        console.log("deprecated call to PrototypeBuilder.getProjectManager() use ProjectManager.getInstance() instead");
        return projectManager;
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
