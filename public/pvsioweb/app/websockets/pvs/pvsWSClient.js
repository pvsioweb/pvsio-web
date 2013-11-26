/**
 * wrapper around the generic websocket client specifically for pvsio websocket functions
 * @author Patrick Oladimeji
 * @date 6/4/13 21:58:31 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var wsclient            = require("websockets/wsClient"),
        eventDispatcher     = require("util/eventDispatcher"),
        property            = require("util/property"),
        wsSingleton;
    
    function createWebSocket() {
        var wscBase = wsclient();
        var o  = eventDispatcher({});
        /**
            Get or set the server url for the websocket connection
        */
        o.serverUrl = function (url) {
            if (url) {
                wscBase.url(url);
                return o;
            }
            return wscBase.url();
        };
        /**
            Get or set the port for the websocket connection
        */
		o.port = function (port) {
			if (port) {
				wscBase.port(port);
				return o;
			}
			return wscBase.port();
		};
		
        /**
            Get or set the last state of the model being executed in pvsio
        */
        o.lastState = property.call(o, "init(0)");
        /**
            Initiates a connection to the pvsioweb websocket server
        */
        o.logon = function () {
            wscBase.logon();
            return o;
        };
        
        /**
            Closes the connection to the pvsioweb server
        */
        o.close = function () {
            wscBase.close();
        };
        
        /**
            Starts the pvsio process with the parameters supplied
            @param {{fileName: string, projectName: ?string, demoName: ?string}} data This contains information about the file to start and the folder containing that file relative to the server public folder
            @param {callback} cb The callback function to invoke when the process has started
        */
        o.startPVSProcess = function (data, cb) {
            var sourceFile = data.fileName.split(".pvs")[0];
            wscBase.send({type: "startProcess", data: {fileName: sourceFile, projectName: data.projectName, demoName: data.demoName}}, cb);
        };
        
        /**
            Sends a user interface command to be executed by the pvsio process. This method fires a "GraphUpdate" event whenever there is a response from the server due to the callback
            @param {string} action The action to send to the process
            @param {callback} cb The function to invoke with the results of performing the passed action on the process
        */
        o.sendGuiAction = function (action, cb) {
            wscBase.send({type: "sendCommand", data: {command: action}}, function (err, res) {
				//do stuff to update the explored state graph and invoke the callback with the same parameters
				wscBase.fire({type: "GraphUpdate", transition: action, target: res.data, source: o.lastState()});
				//update the lastState 
				o.lastState(res.data);
				if (cb && typeof cb === "function") { cb(err, res); }
			});
            wscBase.fire({type: "InputUpdated", data: action});
            return o;
        };
        /**
            Gets the content of the file passed in the parameter
            @param {string} fileName The file whose content is desired
            @param {callback} cb The function to invoke when content has been loaded. res parameter contains file content.
        */
        o.getFile = function (fileName, cb) {
            var token = {type: "readFile", fileName: fileName};
            wscBase.send(token, cb);
            return o;
        };
        /**
            Writes the content passed using the specified fileName
            @param {{fileName: string, fileContent: string}} data The details of the file to write
            @param {callback} cb The callback to invoke with the result of the write operation.
        */
        o.writeFile = function (data, cb) {
            var token = {type: "writeFile", data: data};
            wscBase.send(token, cb);
            return o;
        };
        /**
            Sends a generic message to the server to call a function on the server
            @param {} token The JSON token to send to the server
            @param {callback} The callback function to invoke once the server responds with a message
        */
        o.send = function (token, cb) {
            wscBase.send(token, cb);
            return o;
        };
        
        /**
            Add an event listener of the specified type
            @param {string} type The string specifying the type of event
            @param {eventCallback} callback The function to invoke when event 'type' occurs
        */
        o.addListener = function (type, callback) {
            wscBase.addListener(type, callback);
            return o;
        };
        return o;
    }
    
    module.exports = function () {
        wsSingleton = wsSingleton || createWebSocket();
        return wsSingleton;
    };
    
/**
 * @callback callback
 * @param {object} err This value is set if any error occurs during the save operation.
 * @param {obj} res The response data. The type varies depending on the caller
 */
/**
 * @callback eventCallback
 * @param {object} event
 */
});