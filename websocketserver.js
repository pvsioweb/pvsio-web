/**
 * A wrapper around ws: a nodejs websocket library
 * 
 * depends on ws see https://github.com/einaros/ws
 * depends on requirejs see http://requirejs.org
 * @author hogfather
 * @date Jul 27, 2012 2:05:11 PM
 * @project JSLib
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process, module*/
var ws = require("ws"),
	util = require('util');


var WebSocketServer = ws.Server;

module.exports = function (name) {
    "use strict";
    
	var messageFunctionMap = {};
	
	var o = {}, server, clientid = 0;
	o.port = 8081;
	name = name || "";
	
	/**
	 * starts a websocket server
	 * @param options may contain keys specifying host:String,port:Number,server:http.Server, 
	 * verifyClient:Function, path:String, noServer:Boolean, disableHixie:Boolean, clientTracking:Boolean
	 * @returns {___anonymous500_501}
	 */
	o.start = function (options) {
		options = options || {};
		server = new WebSocketServer(options);
		util.log("server instantiated. waiting for connection ...");
		server.on("connection", function (s) {
			var socketid = clientid++;
			util.log(util.format("client %d connected", socketid));
			/*handle messages from the client tokenstr should be a json str containing type and data*/
			s.on("message", function (tokenstr) {
				var token = JSON.parse(tokenstr);
				var f = messageFunctionMap[token.type];
				if (f && typeof f === 'function') {
					//call the function with token and socket as parameter
					f(token, s, socketid);
				} else {
					util.log("f is something unexpected -- I expected a function but got type " + typeof f);
				}
			});
			
		});
		
		server.on("error", function (err) {
			util.log(JSON.stringify(err));
		});
		
		util.log(util.format("%s websocket server started . Listening on localhost on port %s", name, o.port.toString()));
		return o;
	};
	
	/**
	 * utility function that binds a type of message to a custom function
	 * @param {string} type A name to attribute to a function call
	 * @param {function} f A function to call whenever a message of type is received
	 */
	o.bind = function (type, f) {
		messageFunctionMap[type] = f;
		return o;
	};
	
	return o;
};