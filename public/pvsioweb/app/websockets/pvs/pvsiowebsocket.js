/**
 * Client library to make a Websocket connection to a pvsio-web server
 * @author patrick
 * @date 28 Jul 2012 23:14:53
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require,module, WebSocket*/
define(function (require, exports, module) {
    "use strict";
    
    var eventDispatcher                 = require("util/eventDispatcher"),
        pvsEvents                       = require("formal/pvs/prototypebuilder/events"),
        wsEvents                        = require("websockets/events"),
        property                        = require("util/property");
    
    /**
	 * parses pvs output into a json object map
	 */
	function parseState(state) {
		var st = state[0].substr(2, state[0].length - 4);
		var props = st.split(",");
		var res = {};
		props.forEach(function (p) {
			var args = p.split(":=");
			res[args[0].trim()] = args[1] ? args[1].trim() : args[1];
		});
		
		return res;
	}
	
	module.exports = function () {
		var o = eventDispatcher({}), ws, url = "ws://localhost:8081";
		o.serverUrl = property.call(o, url);
		
		o.lastState = property.call(o, "init(0)");
		o.value = property.call(o, "0");
		/**
		 * creates a connection to the pvsio webserver
		 * This emits the 'ConnectionOpened' event when the connection has been established
		 *	'ConnectionClosed' event when the connection has been closed
		 *	'ProcessReady' event when the pvsio process is ready
		 *	'OutputUpdated' event when there is some response data from the server
		 *	'SourceCodeReceived' event when the source code has been received
		 */
		o.logon = function () {
			if (!ws) {
				ws = new WebSocket(o.serverUrl());
				ws.onopen = function (event) {
					o.fire({type: wsEvents.ConnectionOpened, event: event});
				};
				ws.onclose = function (event) {
					o.fire({type: wsEvents.ConnectionClosed, event: event});
				};
				//add on message received event
				///TODO fix this block so that the type in the server token matches the event type emitted by
				///the event listener.
				ws.onmessage = function (event) {
					var token = JSON.parse(event.data);
					switch (token.type) {
					case "processReady":
						o.fire({type: pvsEvents.ServerReady, data: token.data, socketId: token.socketId});
						break;
					case "pvsoutput":
						o.lastState(token.data);
						o.value(parseState(token.data).display);
						o.fire({type: pvsEvents.OutputUpdated, data: token.data});
						//fire state changed as well
						o.fire({type: pvsEvents.StateChanged, display: o.value()});
						break;
					case "sourcecode":
						o.fire({type: pvsEvents.SourceCodeReceived, data: token.data});
						break;
					case "processExited":
						o.fire({type: pvsEvents.ProcessExited, data: token.data, code: token.code});
						break;
					case "sourceCodeSaved":
						o.fire({type: pvsEvents.SourceCodeSaved, data: token.data});
						break;
					case "projectCreated":
						o.fire({type: pvsEvents.ProjectCreated, data: token.data});
						break;
					case "tempFileSaved":
						o.fire({type: pvsEvents.TempFileSaved, data: token.data});
						break;
					}
				};
			}
			return o;
		};
		
		/**
		 * closes the websocket connection to the server
		 */
		o.close = function () {
			if (ws) {
				ws.close();
			}
		};
		
		/**
		 * Starts the PVSProcess on the server
		 * @param {string} sourceFile The path to the source file to initiate the pvsio process with. 
         * @param {string} projectName The name of the project. This is a folder on the server containing all project
         * files and will be used to set the workspace directory for the session
		 */
		o.startPVSProcess = function (sourceFile, projectName) {
			sourceFile = sourceFile || "pvscode/alarisGP_oldFW";
			var token = {type: "startProcess", data: {fileName: sourceFile, projectName: projectName}};
			ws.send(JSON.stringify(token));
			return o;
		};
		/**
		 * Sends a pvsio command to the server
		 * @param {string} action The command to send
		 */
		o.sendGuiAction = function (action) {
			var token = {type: "sendCommand", data: {command: action}};
			ws.send(JSON.stringify(token));
			o.fire({type: pvsEvents.InputUpdated, data: action});
			return o;
		};
		
		/**
		 * Retrieves the source code of the file the pvsio process was initiated with
		 */
		o.getSourceCode = function () {
			var token = {type: "getSourceCode"};
			ws.send(JSON.stringify(token));
			return o;
		};
		
		/**
		 * saves the source code back to the server
		 * @param {*} data Object containing fileName:String and fileContent:String of
		 * what to save
		 */
		o.saveSourceCode = function (data) {
			var token = {type: "saveSourceCode", data: data};
			ws.send(JSON.stringify(token));
			return o;
		};
//		
//		o.createProject = function(data){
//			var token = {type:"createProject", data:data};
//			ws.send(JSON.stringify(token));
//			return o;
//		};
//		
//		o.saveTempFile = function(data){
//			var token = {type:"saveTempFile", data:data};
//			ws.send(JSON.stringify(token));
//			return o;
//		}
		/**
		 * Special function used to maintain state on the client side.
		 * Particularly useful in the hold_down mode of the alaris
		 */
		o.resetLastState = function () {
			o.lastState("init(" + o.value() + ")");
			return o;
		};
		
		return o;
	};
});