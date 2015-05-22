/**
 *
 * @author Piergiuseppe Mallozzi
 * @date 14/05/2015 11:33 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, Promise*/
define(function (require, exports, module) {
    "use strict";
    var _this;

    var nc_websocket_monitor;
    var eventDispatcher = require("util/eventDispatcher");

    /**
     * @function NCMonitor
     * @description Constructor.
     * @param opt {Object} It contains the url of NC endpoint <br>
     *     <li>url </li>
     * @memberof module:NCMonitor
     * @instance
     */
    function NCMonitor(opt) {
        opt = opt || {};
        this.url = opt.url || "ws://localhost:8080/NetworkController/monitor";
        _this = this;
        eventDispatcher(this);
        return this;
    }

    NCMonitor.prototype.start = function () {
        return new Promise(function (resolve, reject) {
            nc_websocket_monitor = new WebSocket(_this.url);
            /*
             * It starts the control process that send the information to NC
             */
            nc_websocket_monitor.onopen = function () {
                _this.fire({type: "notify", message: "[MONITOR] Connected to ICE Network Controller!"});
                resolve();
            };

            nc_websocket_monitor.onmessage = onMessageReceivedNCMonitor;
            /*
             * Close event
             */
            nc_websocket_monitor.onclose = function () {
                _this.fire({type: "notify", message: "[MONITOR] Disconnected from ICE Network Controller (" + _this.url + ")"});
                nc_websocket_monitor = null;
                reject({ code: "CLOSED" });
            };
            /*
             * Connection failed
             */
            nc_websocket_monitor.onerror = function () {
                _this.fire({type: "error", message: "[MONITOR] Unable to connect to ICE Network Controller (" + _this.url + ")"});
                nc_websocket_monitor = null;
                reject({ code: "ERROR" });
            };
        });
    };

    /**
     * Callback function when a message is received from the nc websocket
     * @param event
     */
    function onMessageReceivedNCMonitor(event) {

        var text = event.data;

        // JSON FORMAT
        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            var data = JSON.parse(event.data);

            /**
             * Notifies when a device has been successfully added to Sapere
             */
            if (data.action === "add"){
                if (data.type === "Supervisor") {
                    printSupervisor(data);
                }
                else {
                    printDeviceElement(data);
                }
            }

            /**
             * Notifies when a device has been successfully removed from Sapere
             */
            if (data.action === "remove") {
                $("#" + data.deviceID).remove();
            }

            /**
             * Notifies when a device has been successfully activated or deactivated
             */
            if (data.action === "toggle") {
                var container_div = $("#" + data.deviceID);
                var status_span = container_div.find(".device_status");

                if (data.status === "ON") {
                    container_div.removeClass("tada");
                    status_span.html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" >Turn OFF</a>)");
                } else if (data.status === "OFF") {
                    container_div.addClass("tada");
                    status_span.html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" >Turn ON</a>)");
                }
            }

            /**
             * Notifies when a publish-agent has been injected into the LSA space in NC.
             * Every publish-agent is is strictly connected to the device it publishes the data for.
             */
            if (data.action === "publish") {
            }

            /**
             * Notifies when a subscribe-agent has been injected into the LSA space in NC.
             * A device could have multiple subscribe-agents. For example the Supervisor has a subscribe-agent for every device.
             */
            if (data.action === "subscribe") {
            }

            /**
             * Notifies when a publish-agent has been removed from the LSA space in NC.
             */
            if (data.action === "publish-remove") {
            }

            /**
             * Notifies when a subscribe-agent has been removed from the LSA space in NC.
             */
            if (data.action === "subscribe-remove") {
            }

            /**
             * Notifies when a two agents have bonded so are exchanging data.
             */
            if (data.action === "bond") {
            }

            /**
             * Sends the whole LSASpace of NC
             */
            if (data.action === "lsaspace") {
            }
        }
        // NO JSON
        else {
            _this.fire({type: "notify", message: text});
        }
    }


    /**
     * Sends a remove message to NC
     * @param element
     */
    function removeDevice(event) {

        var id = event.currentTarget.parentElement.getAttribute("id");
        var DeviceAction = {
            action: "remove",
            deviceID: id
        };
        nc_websocket_monitor.send(JSON.stringify(DeviceAction));
    }

    /**
     * Sends a toggle message to NC
     * @param element
     */
    function toggleDevice(event) {
        var id = event.currentTarget.parentElement.getAttribute("id");
        var DeviceAction = {
            action: "toggle",
            deviceID: id
        };
        nc_websocket_monitor.send(JSON.stringify(DeviceAction));
    }


    function printDeviceElement(data) {
        var container = $("#devices");
        var child = $("<div>", {id: data.deviceID, class: data.type + " animated bounceInUp device"});

        var id;
        var type;
        var status;
        var description;
        var remove;
        var agents;

        id = $("<span>", {class: "device_id"}).html(data.deviceID);
        type = $("<span>", {class: "device_type"}).html("<b>Type:</b> " + data.type);
        if (data.status === "ON") {
            status = $("<span>", {class: "device_status"}).html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" >Turn OFF</a>)");
        } else if (data.status === "OFF") {
            status = $("<span>", {class: "device_status"}).html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" >Turn ON</a>)");
        }
        status.on("click", toggleDevice);
        description = $("<span>", {class: "device_description"}).html("<b>Comments:</b> " + data.description);
        remove = $("<span>", {class: "device_remove"}).html("<a href=\"#!\" class=\"remove_switch\")>Remove device</a>");
        remove.on("click", removeDevice);
        agents = $("<span>", {class: "agents_block device_agents"});

        child.append(id).append(type).append(status).append(description).append(remove).append(agents);
        container.append(child);
    }

    function printSupervisor(data) {
        var container = $("#devices");
        var child = $("<div>", {id: data.deviceID, class: data.type + " animated bounceInUp device"});

        var id;
        var type;
        var status;
        var remove;
        var agents;

        id = $("<span>", {class: "device_id", style: "margin-top: 20px"}).html(data.deviceID);
        type = $("<span>", {class: "device_type"}).html("<b>Type:</b> " + data.type);
        if (data.status === "ON") {
            status = $("<span>", {class: "device_status"}).html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" >Turn OFF</a>)");
        } else if (data.status === "OFF") {
            status = $("<span>", {class: "device_status"}).html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" >Turn ON</a>)");
        }
        status.on("click", toggleDevice);
        remove = $("<span>", {class: "device_remove"}).html("<a href=\"#!\" class=\"remove_switch\")>Remove device</a>");
        remove.on("click", removeDevice);
        agents = $("<span>", {class: "agents_block supervisor_agents"});

        child.append(id).append(type).append(status).append(remove).append(agents);
        container.append(child);
    }

    module.exports = NCMonitor;

});