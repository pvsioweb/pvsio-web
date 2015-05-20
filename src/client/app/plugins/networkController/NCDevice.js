/**
 *
 * @author Piergiuseppe Mallozzi
 * @date 14/05/2015 11:33 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, Promise, d3*/
define(function (require, exports, module) {
    "use strict";

    var eventDispatcher = require("util/eventDispatcher");

    /**
     * @function NetworkController
     * @description Constructor.
     * @param device {!Object} This object describes the device. It has the following fields:<br>
     *     <li>id </li>
     *     <li>type </li>
     *     <li>description (optional) </li>
     * @param opt {Object} It contains the url of NC endpoint <br>
     *     <li>url </li>
     * @memberof module:NetworkController
     * @instance
     */
    function NCDevice(device, opt) {
        opt = opt || {};
        this.url = opt.url || "ws://localhost:8080/SapereEE/actions";
        this.deviceID = device.id;
        this.deviceType = device.type;
        this.deviceDescription = device.description || (device.type + "" + device.id);
        eventDispatcher(this);
        _this = this;
        return this;
    }


    var nc_websocket_device;
    var deviceAdded = false;
    var _this;

    NCDevice.prototype.connect = function () {
        nc_websocket_device = new WebSocket(_this.url);
        /*
         * It starts the control process that send the information to NC
         */
        nc_websocket_device.onopen = function () {
            console.log(">> Connected to ICE Network Controller!");
            addDevice();
            _this.fire({
                type: "connected"
            });
        };

        nc_websocket_device.onmessage = onMessageReceivedNCDevice;
        /*
         * Close event
         */
        nc_websocket_device.onclose = function () {
            console.log(">> Disconnected from ICE Network Controller (" + _this.url + ")");
            nc_websocket_device = null;
        };
        /*
         * Connection failed
         */
        nc_websocket_device.onerror = function () {
            console.log("!! Unable to connect to ICE Network Controller (" + _this.url + ")");
            nc_websocket_device = null;
        };
    };

    var addDevice = function() {
        if (!deviceAdded) {
            console.log("-> adding " + _this.deviceID);
            var SupervisorAction = {
                action: "add",
                deviceID: _this.deviceID,
                type: _this.deviceType,
                description: _this.deviceDescription
            };
            nc_websocket_device.send(JSON.stringify(SupervisorAction));
        }
        else {
            console.log("!! " + _this.deviceID + " already added !!")
        }
    };

    NCDevice.prototype.sendControlData = function(to, message) {
        console.log("-> " + message + "\n - " + to);
        var payload = {
            to: to,
            msg: message
        };
        var DeviceAction = {
            action: "orchestrate",
            deviceID: _this.deviceID,
            message: payload
        };
        nc_websocket_device.send(JSON.stringify(DeviceAction));
    };

    NCDevice.prototype.sendDataUpdate = function (message) {
        console.log("-> " + message);
        var DeviceAction = {
            action: "update",
            deviceID: _this.deviceID,
            message: message
        };
        nc_websocket_device.send(JSON.stringify(DeviceAction));
    };

    /**
     * Callback function when a message is received from the nc websocket
     * @param event
     */
    var onMessageReceivedNCDevice = function(event) {

        var text = event.data;

        // JSON FORMAT
        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            var device = JSON.parse(event.data);

            if (device.action === "add") {
                deviceAdded = true;
                console.log("<- " + _this.deviceID + " added to NC");
            }
            if (device.action === "remove") {
                deviceAdded = false;
                console.log("<- " + _this.deviceID + " removed from NC");
            }
            if (device.action === "update") {
                console.log("<- " + device.message);
                _this.fire({
                    type: "update",
                    message: device.message
                });
            }
        }
        // NO JSON
        else {
            console.log(text);
        }
    };

    module.exports = NCDevice;

});