/**
 * Main entry point for pvsioweb module
 * @author Patrick Oladimeji
 * @date 4/19/13 17:23:31 PM
 */
/*jshint unused: false*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, d3, layoutjs, Promise*/

define(function (require, exports, module) {
    "use strict";
	var PVSioWebClient = require("PVSioWebClient"),
		Logger         = require("util/Logger"),
        ui             = require("plugins/prototypebuilder/interface"),
		PrototypeBuilder = require("plugins/prototypebuilder/PrototypeBuilder"),
        Emulink        = require("plugins/emulink/Emulink"),
		SafetyTest		= require("plugins/safetyTest/SafetyTest"),
		GraphBuilder   = require("plugins/graphbuilder/GraphBuilder"),
        PluginManager  = require("plugins/PluginManager");
		
	var client = PVSioWebClient.getInstance(), pb, pm = PluginManager.getInstance();
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
			return client.connectToServer()
				.then(function (ws) {
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
							}

							if (event.target.checked) {
								pm.enablePlugin(plugin);
							} else {
								pm.disablePlugin(plugin);
							}
						});
					pb = PrototypeBuilder.getInstance();
					return pm.enablePlugin(pb).then(function () {
						var projectManager = pb.getProjectManager();
						ui.bindListeners(pb.getProjectManager());
						return new Promise(function (resolve, reject) {
							// create and default initial empty project containing an empty file (main.pvs)
							projectManager.createDefaultProject(function (err, res) {
								d3.select("#project-notification-area").insert("p", "p").html("PVSio-web Ready!");
								d3.select("#editor-notification-area").insert("p", "p").html("PVS Editor Ready!");
								//layout the sourcecode and files
								layoutjs({el: "#sourcecode-editor-wrapper"});
								if (err) { reject(err); }
								else { resolve(res); }
							});
						});
					});
				});
		},
		reset: function() {///This function is not tested
			//client.disconnectFromServer();
            if (pm.isLoaded(PrototypeBuilder.getInstance())) {
                pm.disablePlugin(PrototypeBuilder.getInstance());
                ui.unload();
            }
		}
	};
});