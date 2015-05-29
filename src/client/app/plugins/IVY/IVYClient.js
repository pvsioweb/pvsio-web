/**
 *
 * @author Paolo Masci
 * @date 28/05/2015
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, Promise*/
define(function (require, exports, module) {
    "use strict";

    var eventDispatcher = require("util/eventDispatcher");

    /**
     * @function IVYClient
     * @description Constructor.
     * @param ...
     * @memberof module:IVYClient
     * @instance
     */
    function IVYClient(opt) {
        opt = opt || {};
        this.url = opt.url || "ws://localhost:2317";
        eventDispatcher(this);
        _this = this;
        return this;
    }

    var _this;

    IVYClient.prototype.connect = function () {
        return new Promise(function (resolve, reject) {
            _this.ws = new WebSocket(_this.url);
            _this.ws.onopen = function () {
                _this.fire({type: "WebSocketConnectionOpened", message: "Connected to IVY!"});
                resolve();
            };
            _this.ws.onmessage = onMessageReceived;
            _this.ws.onclose = function () {
                _this.fire({type: "WebSocketConnectionClosed", message: "Disconnected from IVY (" + _this.url + ")"});
                _this.ws = null;
                reject({ code: "CLOSED" });
            };
            _this.ws.onerror = function () {
                _this.fire({type: "WebSocketConnectionError", message: "Unable to connect to IVY (" + _this.url + ")"});
                _this.ws = null;
                reject({ code: "ERROR" });
            };
        });
    };

    IVYClient.prototype.send = function(cmd) {
        if(_this.ws && _this.ws.OPEN) {
            _this.ws.send(cmd);
        }
        else{
            _this.fire({type: "WebSocketConnectionError", message: "Websocket not opened"});
        }
    };


    /**
     * Callback function when a message is received from the nc websocket
     * @param event
     */
    var onMessageReceived = function(event) {
        var res = event;
        console.log(res);
        _this.fire({type: "ivyMessageReceived", res: res});
    };

    module.exports = IVYClient;

});