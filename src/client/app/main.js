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
        Constants      = require("util/Constants"),
        displayQuestion = require("pvsioweb/forms/displayQuestion");
		
	var client = PVSioWebClient.getInstance(), pluginManager = PluginManager.getInstance();
        
	//register event listeners
	client.addListener('WebSocketConnectionOpened', function (e) {
        ui.webSocketConnected();
	}).addListener("WebSocketConnectionClosed", function (e) {
        ui.webSocketDisconnected();
        ui.reconnectToServer();
	}).addListener("processExited", function (e) {
        ui.pvsProcessDisconnected();
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
                        return pluginManager.enablePlugin(ModelEditor.getInstance());
                    }).then(function () {
                        var projectManager = ProjectManager.getInstance();
                        ui.bindListeners(projectManager);
                        projectManager.createDefaultProject().then(function (res) {
                            layoutjs({el: "#model-editor-container"});
                            //enable autosave plugin
                            pluginManager.enablePlugin(ProjectAutoSaver.getInstance());
                            //hide pvsio-web loading screen and make the tool visible
                            setTimeout(function () {
                                d3.select("#PVSio-web-logo").style("display", "none");
                                d3.select("#content").style("display", "block");
                            }, 2400);
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