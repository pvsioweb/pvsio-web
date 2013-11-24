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
        o.serverUrl = function (url) {
            if (url) {
                wscBase.url(url);
                return o;
            }
            return wscBase.url();
        };
        
        o.lastState = property.call(o, "init(0)");
        
        o.logon = function () {
            wscBase.logon();
            return o;
        };
        
        o.close = function () {
            wscBase.close();
        };
        
        o.startPVSProcess = function (data, cb) {
            var sourceFile = data.fileName.split(".pvs")[0];
            wscBase.send({type: "startProcess", data: {fileName: sourceFile, projectName: data.projectName, demoName: data.demoName}}, cb);
        };
        
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
        
        o.getFile = function (fileName, cb) {
            var token = {type: "readFile", fileName: fileName};
            wscBase.send(token, cb);
            return o;
        };
        
        o.writeFile = function (data, cb) {
            var token = {type: "writeFile", data: data};
            wscBase.send(token, cb);
            return o;
        };
        
        o.send = function (token, cb) {
            wscBase.send(token, cb);
            return o;
        };
        
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
});