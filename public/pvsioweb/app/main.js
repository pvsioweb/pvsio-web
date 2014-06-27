/**
 * Main entry point for pvsioweb module
 * @author Patrick Oladimeji
 * @date 4/19/13 17:23:31 PM
 */
/*jshint unused: false*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, d3*/

define(function (require, exports, module) {
    "use strict";
	var PVSioWebClient = require("PVSioWebClient"),
		Logger         = require("util/Logger"),
        ui             = require("plugins/prototypebuilder/interface"),
		PrototypeBuilder = require("plugins/prototypebuilder/PrototypeBuilder"),
        Emulink        = require("plugins/emulink/Emulink"),
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
							}

							if (event.target.checked) {
								pm.enablePlugin(plugin);
							} else {
								pm.disablePlugin(plugin);
							}
						});
					pb = PrototypeBuilder.getInstance();
					pm.enablePlugin(pb);
					ui.bindListeners(pb.getProjectManager());
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
