/**
 * Main entry point for pvsioweb module
 * @author Patrick Oladimeji
 * @date 4/19/13 17:23:31 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true*/
/*global define, d3, require, $, brackets, _, window, MouseEvent, FormData, document, setTimeout, clearInterval, FileReader */

define(function (require, exports, module) {
    "use strict";
	var PVSioWebClient = require("PVSioWebClient"),
		Logger = require("util/Logger"),
        ui = require("plugins/prototypebuilder/interface"),
		PrototypeBuilder = require("plugins/prototypebuilder/PrototypeBuilder"),
        Emulink = require("plugins/emulink/Emulink"),
		GraphBuilder			= require("plugins/graphbuilder/GraphBuilder"),
        PluginManager = require("plugins/PluginManager");
		
	var client = PVSioWebClient.getInstance(), pb, pm = PluginManager.getInstance();
    client.connectToServer()
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
//            pb = new PrototypeBuilder(client);
//            pb.initialise();
//            
//            var projectManager = pb.getProjectManager();
//            var editor = pb.getEditor();
//            
//            //register the graphbuilder plugin and add an event handler to reinitialise the plugin when the project changes
//            var gb = new GraphBuilder(client);
//            gb.initialise();
//            projectManager.addListener("ProjectChanged", function () {
//                gb.reInitialise();
//            });
            
//            var emulink = Emulink.getInstance();
//            pm.enablePlugin(emulink);
            
            pb = PrototypeBuilder.getInstance();
            pm.enablePlugin(pb);
            ui.bindListeners(pb.getProjectManager());
            
        });
	/**
     * utility function to pretty print pvsio output
     * @private
     */
    function prettyPrint(msg) {
        return msg ? msg.toString().replace(/,,/g, ",") : msg;
    }
    
    client.addListener('WebSocketConnectionOpened', function (e) {
		Logger.log("connection to pvsio server established");
		d3.select("#btnCompile").attr("disabled", null);
		d3.select("#lblWebSocketStatus").select("span").attr("class", "glyphicon glyphicon-ok");
	}).addListener("WebSocketConnectionClosed", function (e) {
		Logger.log("connection to pvsio server closed");
		d3.select("#btnCompile").attr("disabled", true);
		d3.select("#lblWebSocketStatus").select("span").attr("class", "glyphicon glyphicon-warning-sign");
	}).addListener("pvsoutput", function (e) {
		console.log(e);
		var response = prettyPrint(e.data), tmp;
		console.log(response);
		Logger.pvsio_response_log(response);
	}).addListener("processExited", function (e) {
		var msg = "Warning!!!\r\nServer process exited. See console for details.";
		Logger.log("Server process exited -- server message was ...");
		Logger.log(JSON.stringify(e));
		d3.select("#lblPVSioStatus").select("span").attr("class", "glyphicon glyphicon-warning-sign");
	});
	
});
