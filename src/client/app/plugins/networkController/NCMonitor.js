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
        this.extended = opt.extended || false;
        this.debugging = opt.debugging || false;
        this.url = opt.url || "ws://localhost:8080/NetworkController/monitor";
        this.critical_sessions_free = true;
        this.requests = [];
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
                sendMonitorOptions();
            };

            nc_websocket_monitor.onmessage = onMessageReceivedNCMonitor;
            /*
             * Close event
             */
            nc_websocket_monitor.onclose = function () {
                _this.fire({
                    type: "notify",
                    message: "[MONITOR] Disconnected from ICE Network Controller (" + _this.url + ")"
                });
                nc_websocket_monitor = null;
                reject({code: "CLOSED"});
            };
            /*
             * Connection failed
             */
            nc_websocket_monitor.onerror = function () {
                _this.fire({
                    type: "error",
                    message: "[MONITOR] Unable to connect to ICE Network Controller (" + _this.url + ")"
                });
                nc_websocket_monitor = null;
                reject({code: "ERROR"});
            };
        });
    };


    /**
     * Callback function when a message is received from the sapere_handler network_controller
     * @param event
     */
    function onMessageReceivedNCMonitor(event) {

        var data = event.data;

        // JSON FORMAT
        if (tryJSON(data)) {

            data = tryJSON(data);
            parseAction(data);

        }
        // NO JSON
        else {
            console.log(data);
        }

    }

    function lock() {
        _this.critical_sessions_free = false;
    }

    function notify_request() {
        _this.critical_sessions_free = true;
        if (_this.requests.length != 0) {
            _this.fire({type: "notify", message: "           ** NOTIFY  " + (_this.requests.length - 1)});
            parseAction(_this.requests.shift());
        }
    }

    function store_request(data) {
        _this.requests.push(data);
        _this.fire({type: "notify", message: "           ** REQUEST " + _this.requests.length});
    }


    function parseAction(data) {
        /**
         * Notifies when a device has been successfully added to Sapere
         */
        if (data.action === "add") {
            if (_this.critical_sessions_free) {
                printElement(data);
            }
            else {
                store_request(data);
            }
        }

        /**
         * Notifies when a device has been successfully removed from Sapere
         */
        if (data.action === "remove") {
            if (_this.critical_sessions_free) {
                remove(data);
            }
            else {
                store_request(data);
            }
        }

        /**
         * Notifies when a device has been successfully activated or deactivated
         */
        if (data.action === "connected") {
            if (_this.critical_sessions_free) {
                turnON(data);
                _this.fire({type: "connected", device_id: data.deviceID});
            }
            else {
                store_request(data);
            }
        }

        /**
         * Notifies when a device has been successfully activated or deactivated
         */
        if (data.action === "disconnected") {
            if (_this.critical_sessions_free) {
                turnOFF(data);
                _this.fire({type: "disconnected", device_id: data.deviceID});
            }
            else {
                store_request(data);
            }
        }

        /**
         * Notifies when a publish-agent has been injected into the LSA space in Sapere.
         * Every publish-agent is is strictly connected to the device it publishes the data for.
         */
        if (data.action === "publish") {
            if (_this.critical_sessions_free) {
                printPublisher(data);
            }
            else {
                store_request(data);
            }
        }

        /**
         * Notifies when a subscribe-agent has been injected into the LSA space in Sapere.
         * A device could have multiple subscribe-sapere_handler. For example the Supervisor has a subscribe-agent for every device.
         */
        if (data.action === "subscribe") {
            if (_this.critical_sessions_free) {
                printSubscriber(data);
            }
            else {
                store_request(data);
            }
        }

        /**
         * Notifies when a publish-agent has been removed from the LSA space in Sapere.
         */
        if (data.action === "publish-remove") {
            if (_this.critical_sessions_free) {
                agents_remove(data, "publish");
            }
            else {
                store_request(data);
            }

        }

        /**
         * Notifies when a subscribe-agent has been removed from the LSA space in Sapere.
         */
        if (data.action === "subscribe-remove") {
            if (_this.critical_sessions_free) {
                agents_remove(data, "subscribe");
            }
            else {
                store_request(data);
            }
        }

        /**
         * Notifies when a two sapere_handler have bonded so are exchanging data.
         */
        if (data.action === "bond-update") {
            if (_this.critical_sessions_free) {
                bondUpdate(data);
            }
            else {
                store_request(data);
            }
        }

        /**
         * Notifies when a two sapere_handler have bonded so are exchanging data.
         */
        if (data.action === "bond-added") {
            if (_this.critical_sessions_free) {
                bondAdded(data);
            }
            else {
                store_request(data);
            }
        }

        /**
         * Notifies when a the device connected to the agent received a message;
         */
        if (data.action === "msg-update") {
            msgUpdate(data);
        }


        /**
         * Sends the whole LSASpace of Sapere
         */
        if (data.action === "lsaspace") {
            printLSASpace(data.space, "monitor");
        }

        /**
         * Sends the whole LSASpace of Sapere
         */
        if (data.action === "error") {
            _this.fire({type: "error", message: data.message});
        }
    }


    /**
     * Sends Monitor options
     */
    function sendMonitorOptions() {
        var MonitorOptions = {
            action: "add_monitor",
            extended: _this.extended,
            debugging: _this.debugging
        };
        nc_websocket_monitor.send(JSON.stringify(MonitorOptions));
    }

    /**
     * Sends a toggle message to NC
     * @param element
     */
    function toggleDevice(event) {
        var id = event.currentTarget.parentElement.parentElement.getAttribute("id");
        var DeviceAction = {
            action: "toggle",
            deviceID: id
        };
        nc_websocket_monitor.send(JSON.stringify(DeviceAction));
    }

    /**
     * Sends a remove message to NC
     * @param element
     */
    function removeDevice(event) {

        var id = event.currentTarget.parentElement.parentElement.getAttribute("id");
        var DeviceAction = {
            action: "remove",
            deviceID: id
        };
        nc_websocket_monitor.send(JSON.stringify(DeviceAction));
    }


    function tryJSON(jsonString) {
        try {
            var o = JSON.parse(jsonString);

            if (o && typeof o === "object" && o !== null) {
                return o;
            }
        }
        catch (e) {
        }

        return false;
    }


    function printLSASpace(msg, logger) {
        var jsonMsg = JSON.parse(msg);
        var LSAtreeDiv = $("#LSAtree");
        LSAtreeDiv.html("");
        $.each(jsonMsg, function (index, jsonObject) {
            var div = $("<div>", {class: "sapere_node grid_3"});
            var node = new PrettyJSON.view.Node({
                el: div,
                data: jsonObject
            });
            node.expandAll();
            LSAtreeDiv.append(div);
        });
    }

    function printSubscriber(data) {
        if ($("#" + data.deviceID + "-sub-" + data.key).length == 0) {

            lock();
            _this.fire({type: "notify", message: "           >> SUBSCRIBE " + data.key});

            var container_div = $("#" + data.deviceID);
            var agents_span = container_div.find(".agents_block");

            var circle_div = $("<div>", {
                id: data.deviceID + "-sub-" + data.key,
                class: "agent_subscribe " + " animated bounceInUp"
            });
            var circle_figure = $("<div>", {
                id: data.deviceID + "-subC-" + data.key,
                class: "circle-subscribe" + " animated bounceInUp device tooltip",
                title: data.deviceID + " subscribed to " + data.key
            });
            circle_figure.tooltipster({
                animation: 'fade',
                delay: 0,
                theme: 'tooltipster-default',
                touchDevices: false,
                trigger: 'hover'
            });
            agents_span.append(circle_div);
            circle_div.append(circle_figure);
            _this.fire({type: "notify", message: "           << SUBSCRIBE " + data.key});
            notify_request();
        }
        else {
            _this.fire({type: "error", message: "        " + "#" + data.deviceID + "-sub-" + data.key + " already present"});
        }
    }

    function printPublisher(data) {
        if ($("#" + data.deviceID + "-pub-" + data.key).length == 0) {
            lock();
            _this.fire({type: "notify", message: "           >> PUBLISH " + data.key});
            var container_div = $("#" + data.deviceID);
            var agents_span = container_div.find(".agents_block");

            var circle_div = $("<div>", {
                id: data.deviceID + "-pub-" + data.key,
                class: "agent_publish " + " animated bounceInUp"
            });
            var circle_figure = $("<div>", {
                id: data.deviceID + "-pubC-" + data.key,
                class: "circle-publish " + " animated bounceInUp device tooltip",
                title: data.deviceID + " publishing as " + data.key
            });
            circle_figure.tooltipster({
                animation: 'fade',
                delay: 0,
                theme: 'tooltipster-default',
                touchDevices: false,
                trigger: 'hover'
            });
            agents_span.append(circle_div);
            circle_div.append(circle_figure);
            _this.fire({type: "notify", message: "           << PUBLISH " + data.key});
            notify_request();
        }
        else {
            _this.fire({type: "error", message: "        " + "#" + data.deviceID + "-pub-" + data.key + " already present"});

        }
    }


    function printElement(data) {
        lock();
        _this.fire({type: "notify", message: "           >> ADD " + data.deviceID});

        var container;
        var agents;
        var commands;

        if (data.type === "Supervisor") {
            if(_this.extended){
                container = $("#supervisor");
            }
            else{
                container = $("#devices");
            }
            agents = $("<span>", {class: "agents_block supervisor_agents"});
            commands = $("<span>", {class: "commands_block supervisor_commands"});
        }
        else {
            container = $("#devices");
            agents = $("<span>", {class: "agents_block device_agents"});
            commands = $("<span>", {class: "commands_block device_commands"});
        }
        var child = $("<div>", {id: data.deviceID, class: data.type + " animated bounceInUp device"});
        child.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
            function (e) {
                if(_this.extended){
                    _this.printConnectionsSapere();
                }
            });

        if(!_this.extended){
            child.css("width", 212).css("height", 165).css("text-align", "left");
        }

        var id;
        var type;
        var status;
        var remove;
        var remove_content;
        var toggle;
        var toggle_content;

        id = $("<span>", {class: "device_id"}).html(data.deviceID);
        type = $("<span>", {class: "device_type"}).html("<b>Type:</b> " + data.type);
        if (data.status === "ON") {
            status = $("<span>", {class: "device_status"}).html("<b>Status:</b> " + "Connected");
            toggle_content = $("<button>").html("Disconnect");

        } else if (data.status === "OFF") {
            status = $("<span>", {class: "device_status"}).html("<b>Status:</b> " + "Disconnected");
            toggle_content = $("<button>").html("Connect");
        }
        toggle = $("<section>", {class: "flat toggle_device"});
        toggle.on("click", toggleDevice);
        toggle.append(toggle_content);

        remove = $("<section>", {class: "flat remove_device"});
        remove_content = $("<button>").html("Remove");
        remove.on("click", removeDevice);
        remove.append(remove_content);

        if(_this.extended && data.type === "Supervisor"){
            toggle.css("left", "80px");
            remove.css("right", "80px");
        }

        commands.append(toggle).append(remove);

        child.append(id).append(type).append(status).append(commands).append(agents);
        container.append(child);

        _this.fire({type: "notify", message: "           << ADD " + data.deviceID});
        notify_request();
    }

    NCMonitor.prototype.printConnectionsSapere = function () {

        var connections = $('connection');
        setInterval(function () {
            connections.connections('update')
        }, 50);

        $('.device').connections('remove');
        $('.device').connections({
            to: $('#sapere'),
            class: 'channel'
        });
    };

    NCMonitor.prototype.activateDebug = function(){
        var MonitorOptions = {
            action: "debug"
        };
        nc_websocket_monitor.send(JSON.stringify(MonitorOptions));
    };

    NCMonitor.prototype.deactivateDebug = function(){
        var MonitorOptions = {
            action: "no_debug"
        };
        nc_websocket_monitor.send(JSON.stringify(MonitorOptions));
    };

    function turnON(data) {
        lock();
        _this.fire({type: "notify", message: "           >> CONNECT " + data.deviceID});

        var container_div = $("#" + data.deviceID);
        container_div.removeClass("tada");
        var status = container_div.find(".device_status");
        var toggle = container_div.find(".toggle_device");
        var toggle_content = toggle.first();
        status.html("<b>Status:</b> " + "Connected");
        toggle_content.children().html("Disconnect");

        _this.fire({type: "notify", message: "           << CONNECT " + data.deviceID});
        notify_request();
    }

    function turnOFF(data) {
        lock();
        _this.fire({type: "notify", message: "           >> DISCONNECT " + data.deviceID});

        var container_div = $("#" + data.deviceID);
        container_div.removeClass("tada");
        var status = container_div.find(".device_status");
        var toggle = container_div.find(".toggle_device");
        var toggle_content = toggle.first();
        status.html("<b>Status:</b> " + "Disconnected");
        toggle_content.children().html("Connect");

        _this.fire({type: "notify", message: "           << DISCONNECT " + data.deviceID});
        notify_request();
    }

    function bondUpdate(data) {
        lock();
        _this.fire({type: "notify", message: "           >> BONDUP " + data.key});

        var divPub = $('#' + data.publisher_ID + '-pub-' + data.key);
        var divSub = $('#' + data.subscriber_ID + '-sub-' + data.key);

        divPub.removeClass("bounceInUp");
        divPub.addClass("tada");
        setTimeout(function () {
            divPub.removeClass("tada");
            divSub.removeClass("bounceInUp");
            divSub.addClass("tada");
            setTimeout(function () {
                divSub.removeClass("tada");
            }, 500);
        }, 500);

        // Re-draw the connection TODO: better connection managment
        var nodePub = '#' + data.publisher_ID + '-pubC-' + data.key;
        var nodeSub = '#' + data.subscriber_ID + '-subC-' + data.key;

        $(nodeSub).connections('remove');
        $(nodeSub).connections({
            to: nodePub,
            class: 'connection',
        });
        var connections = $('connection');
        setInterval(function () {
            connections.connections('update')
        }, 2000);

        _this.fire({type: "notify", message: "           << BONDUP " + data.key});
        notify_request();
    }

    function bondAdded(data) {
        lock();
        _this.fire({type: "notify", message: "           << BONDADD " + data.key});

        var nodePub = '#' + data.publisher_ID + '-pubC-' + data.key;
        var nodeSub = '#' + data.subscriber_ID + '-subC-' + data.key;

        $(nodeSub).connections('remove');
        $(nodeSub).connections({
            to: nodePub,
            class: 'connection',
        });
        var connections = $('connection');
        setInterval(function () {
            connections.connections('update')
        }, 2000);
        _this.fire({type: "notify", message: "           << BONDADD " + data.key});
        notify_request();
    }

    function msgUpdate(data) {
        lock();
        _this.fire({type: "notify", message: "           >> MSGUPD " + data.key});

        var divSub = $('#' + data.subscriber_ID + '-sub-' + data.key);

        var divParent = divSub.parent();
        var oldDiv = divParent.find('.message_delivered');
        if (oldDiv != null) {
            oldDiv.remove();
        }
        var circle_div = $("<div>", {
            class: "message_delivered " + " animated fadeOutDown"
        });
        divParent.append(circle_div);
        setInterval(function () {
            circle_div.remove();
        }, 700);

        _this.fire({type: "notify", message: "           << MSGUPD " + data.key});
        notify_request();
    }


    function remove(data) {
        lock();
        _this.fire({type: "notify", message: "           >> REMOVE " + data.deviceID});

        var device_div = $("#" + data.deviceID);
        device_div.removeClass("bounceInUp").addClass("bounceOutDown");
        device_div.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
            function (e) {
                device_div.remove();
                _this.fire({type: "notify", message: "           << REMOVE " + data.deviceID});
                notify_request();
            });
    }


    function agents_remove(data, type) {

        if (document.getElementById(data.deviceID) != null) {
            lock();
            _this.fire({type: "notify", message: "           >> AG_REMOVE " + data.key});

            var container_div = $("#" + data.deviceID);
            var agents_span = container_div.find(".agents_block");

            var circle_div;
            var circle_figure;

            if (type === "publish") {
                circle_div = agents_span.find("#" + data.deviceID + "-pub-" + data.key);
                circle_figure = agents_span.find("#" + data.deviceID + "-pubC-" + data.key);
            }
            if (type === "subscribe") {
                circle_div = agents_span.find("#" + data.deviceID + "-sub-" + data.key);
                circle_figure = agents_span.find("#" + data.deviceID + "-subC-" + data.key);
            }

            if (circle_div.length != 0) {
                circle_figure.connections('remove');
                circle_div.removeClass("bounceInUp").addClass("bounceOutDown");
                circle_div.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                    function (e) {
                        circle_div.remove();
                        _this.fire({type: "notify", message: "           << AG_REMOVE " + data.key});
                        notify_request();
                    });
            }
            else {
                _this.fire({type: "error", message: "           Agent has not been found " + data.key});
                _this.fire({type: "notify", message: "           << AG_REMOVE " + data.key});
                notify_request();
            }
        }
        else {
            _this.fire({type: "error", message: "           Device has not been found " + data.key});
        }

    }


    module.exports = NCMonitor;

});