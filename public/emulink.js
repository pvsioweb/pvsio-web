/**
 * Interactive prototype builder for PVSio based on the html map attribute
 * @author Patrick Oladimeji
 * @date Dec 3, 2012 : 4:42:55 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require,module, WebSocket*/
require.config({
    baseUrl: 'pvsioweb/app',
    paths: {
        "ace": "../lib/ace",
        "d3": "../lib/d3",
        "pvsioweb": "plugins/prototypebuilder",
        "imagemapper": "../lib/imagemapper",
        "text": "../lib/text",
        "lib": "../lib"
    }
});

require(["PVSioWebClient", "util/Logger", "plugins/emulink/Emulink"], function (PVSioWeb, Logger, Emulink) {
    "use strict";
	var client = new PVSioWeb();
	
	client.registerPlugin(Emulink);
	
	/**
     * utitlity function to pretty print pvsio output
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
		client.getWebSocket().lastState(e.data);
		console.log(response);
		Logger.pvsio_response_log(response);
	}).addListener("processExited", function (e) {
		var msg = "Warning!!!\r\nServer process exited. See console for details.";
		Logger.log("Server process exited -- server message was ...");
		Logger.log(JSON.stringify(e));
		d3.select("#lblPVSioStatus").select("span").attr("class", "glyphicon glyphicon-warning-sign");
	});
	
	client.connectToServer();
});
