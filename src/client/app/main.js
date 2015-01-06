/**
 * Main entry point for pvsioweb module
 * @author Patrick Oladimeji
 * @date 4/19/13 17:23:31 PM
 */
/*jshint unused: false*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true*/
/*global define, d3, layoutjs, Promise*/

define(function (require, exports, module) {
    "use strict";
	var PVSioWebClient = require("PVSioWebClient"),
		Logger         = require("util/Logger"),
        ui             = require("plugins/prototypebuilder/interface"),
		PrototypeBuilder = require("plugins/prototypebuilder/PrototypeBuilder"),
        ProjectManager = require("project/ProjectManager"),
        ModelEditor    = require("plugins/modelEditor/ModelEditor"),
        Emulink        = require("plugins/emulink/Emulink"),
		SafetyTest     = require("plugins/safetyTest/SafetyTest"),
		GraphBuilder   = require("plugins/graphbuilder/GraphBuilder"),
        ProjectAutoSaver = require("plugins/autoSaver/ProjectAutoSaver"),
        PluginManager  = require("plugins/PluginManager"),
        Constants      = require("util/Constants");
		
	var client = PVSioWebClient.getInstance(), pluginManager = PluginManager.getInstance();
	//register event listeners
	client.addListener('WebSocketConnectionOpened', function (e) {
		Logger.log("connection to pvsio server established");
		d3.select("#btnCompile").attr("disabled", null);
		d3.select("#lblWebSocketStatus").select("span").attr("class", "glyphicon glyphicon-ok");
	}).addListener("WebSocketConnectionClosed", function (e) {
		Logger.log("connection to pvsio server closed");
		d3.select("#btnCompile").attr("disabled", true);
		d3.select("#lblWebSocketStatus").select("span").attr("class", "glyphicon glyphicon-warning-sign");
	}).addListener("processExited", function (e) {
		d3.select("#lblPVSioStatus").select("span").attr("class", "glyphicon glyphicon-warning-sign");
	});
	
	module.exports = {
		start: function () {
			return new Promise(function (resolve, reject) {
                client.connectToServer().then(function (ws) {
					ui.init()
						.on("pluginToggled", function (event) {
							var plugin;
							switch (event.target.getAttribute("name")) {
							case "Emulink":
                                plugin = Emulink.getInstance();
                                break;
							case "GraphBuilder":
                                plugin = GraphBuilder.getInstance();
                                break;
							case "SafetyTest":
                                plugin = SafetyTest.getInstance();
                                break;
                            case "ModelEditor":
                                plugin = ModelEditor.getInstance();
                                break;
                            case "PrototypeBuilder":
                                plugin = PrototypeBuilder.getInstance();
                                break;
							}
							if (event.target.checked) {
                                pluginManager.enablePlugin(plugin);
                            } else {
                                pluginManager.disablePlugin(plugin);
                            }
                        });
					var prototypeBuilder = PrototypeBuilder.getInstance();
					pluginManager.enablePlugin(prototypeBuilder).then(function () {
                        pluginManager.enablePlugin(ModelEditor.getInstance());
                    }).then(function () {
                        var projectManager = ProjectManager.getInstance();
                        ui.bindListeners(projectManager);
                        projectManager.createDefaultProject().then(function (res) {
                            layoutjs({el: "#sourcecode-editor-wrapper"});
                            //enable autosave plugin
                            pluginManager.enablePlugin(ProjectAutoSaver.getInstance());
                            resolve(res);
                        }).catch(function (err) { reject(err); });
                    }).catch(function (err) { reject(err); });
				}).catch(function (err) { reject(err); });
            });
		},
		reset: function () {///This function is not tested
			//client.disconnectFromServer();
            if (pluginManager.isLoaded(PrototypeBuilder.getInstance())) {
                pluginManager.disablePlugin(PrototypeBuilder.getInstance());
                ui.unload();
            }
		}
	};
});