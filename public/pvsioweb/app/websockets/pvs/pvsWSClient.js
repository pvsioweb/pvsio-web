/**
 * wrapper around the generic websocket client specifically for pvsio websocket functions
 * @author Patrick Oladimeji
 * @date 6/4/13 21:58:31 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
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
            Initiates a connection to the pvsioweb websocket server.
            Returns a promise that resolves when the connection is opened
        */
        o.logon = function () {
            return wscBase.logon();
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
			if (data && data.fileName) {
		        var sourceFile = data.fileName.split(".pvs")[0];
		        wscBase.send({
                    type: "startProcess",
                    data: {
                        fileName: sourceFile,
                        projectName: data.projectName,
                        demoName: data.demoName
                    }
                }, cb);
			} else {
				console.log("ERROR: Failed to load pvs file " + data.demoName + "/" + data.fileName);
			}
        };
        /**
            Closes the pvsio process attributed to this websocket connection if there is one
            @param {function} cb The function to invoke when process has been closed
        */
        o.closePVSProcess = function (cb) {
            wscBase.send({type: "closeProcess"}, cb);
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
            @param {string} filePath The relative path (from the base project dir) to the file whose content is desired
            @param {callback} cb The function to invoke when content has been loaded. res parameter contains file content.
        */
        o.getFile = function (filePath, cb) {
            var token = {type: "readFile", filePath: filePath};
            wscBase.send(token, cb);
            return o;
        };
        /**
            Writes the content passed using the specified fileName
            @param {{filePath: string, fileContent: string, projectName: string}} token The details of the file to write.
                Note that file path is relative to the base project directory
            @param {callback} cb The callback to invoke with the result of the write operation.
        */
        o.writeFile = function (token, cb) {
            token.type = "writeFile";
            wscBase.send(token, cb);
            return o;
        };
        /**
            creates a directory with the specified path.
            @param {string} path the path to the directory to create. This path is relative to the base project directory
            @param {callback} cb the callback function to invoke when the function returns from the server
        */
        o.writeDirectory = function (path, cb) {
            wscBase.send({type: "writeDirectory", path: path}, cb);
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
