/**
 * wrapper around the websocket client specifically for pvsio websocket functions
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
        serverFunctions     = require("websockets/pvs/ServerFunctions");
    
    module.exports = function () {
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
        o.value = property.call(o, "0");
        
        o.close = function () {
            wscBase.close();
        };
        
        o.startPVSProcess = function (sourceFile, projectName, cb) {
            wscBase.send({type: serverFunctions.StartProcess, data: {fileName: sourceFile, projectName: projectName}},
                    cb);
        };
        
        o.sendGuiAction = function (action, cb) {
            wscBase.send({type: serverFunctions.SendUICommand, data: {command: action}}, cb);
            return o;
        };
        
        o.getSourceCode = function (cb) {
            var token = {type: serverFunctions.GetSourceCode};
            wscBase.send(token, cb);
            return o;
        };
        
        o.saveSourceCode = function (data, cb) {
            var token = {type: serverFunctions.SaveSourceCode, data: data};
            wscBase.send(token, cb);
            return o;
        };
        
        o.resetLastState = function () {
            o.lastState("init(" + o.value() + ")");
            return o;
        };
        return o;
    };
    
});