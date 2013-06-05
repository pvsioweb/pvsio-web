/**
 * module defining functions for communicating with the gip
 * @author Patrick Oladimeji
 * @date Dec 6, 2012 : 9:59:26 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process, window, WebSocket*/
define(['util/property', 'd3/d3'], function (property) {
    "use strict";
	var o = {}, gip;
	o.server = property.call(o, "localhost");
	o.port = property.call(o, 1234);
	
	o.connect = function () {
		if (window.WebSocket) {
			o.log("opening websocket. ...");
			gip = new WebSocket("ws://" + o.server() + ":" + o.port(), "GIP");
			 // open event: create messages and send data using send()
		    gip.onopen = function () {
                o.log("Connection to GIP state controller is established!");
		    };

		    // receive event
		    gip.onmessage = function (evt) {
		     // var received_msg = evt.data;
                o.log("Message received from GIP state controller ...");
		    };
		    
		    // close event
		    gip.onclose = function () {
		      // websocket is closed.
                o.log("Connection to GIP state controller is closed...");
		    };
		} else {
            alert("You browser does not support websockets.");
		}
		
		return o;
	};
	
	o.sendMessage = function (msg) {
		gip.send(msg);
		return o;
	};
	
	o.log = function (msg) {
		console.log(msg);
		return o;
	};
	return o;
});