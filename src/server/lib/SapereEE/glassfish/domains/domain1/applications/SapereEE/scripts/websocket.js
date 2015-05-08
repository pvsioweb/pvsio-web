/**
 * Created by piergiuseppe on 4/13/15.
 */
var socket = new WebSocket("ws://localhost:8080/SapereEE/monitor");
socket.onmessage = onMessage;


function logOnDiv(msg, logger) {

    var p = $("<p>", {class: "console_element"});
    p.html(msg);
    $("#" + logger)
        .append(p)
        .animate({scrollTop: $("#" + logger)[0].scrollHeight}, 500);
}


function onMessage(event) {

    var text = event.data;

    // JSON FORMAT
    if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
            replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
            replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        var data = JSON.parse(event.data);

        if (data.action === "add") {
            if (data.type == "Orchestrator") {
                printOrchestrator(data);
            }
            else {
                printDeviceElement(data);
            }
            cosyAlert("Device " + data.deviceID + " Added", "success", {vPos: 'top', hPos: 'left'});
        }

        if (data.action === "remove") {
            device_div = $("#" + data.deviceID);

            device_div.removeClass("bounceInUp").removeClass("pulse infinite").addClass("bounceOutDown");
            device_div.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                function (e) {
                    device_div.remove();
                });
            cosyAlert("Device " + data.deviceID + " Removed", "success", {vPos: 'top', hPos: 'left'});
        }

        if (data.action === "toggle") {
            var container_div = $("#" + data.deviceID);
            var status_span = container_div.find(".device_status");

            if (data.status === "ON") {
                container_div.removeClass("bounceInUp").removeClass("shake").addClass("pulse infinite");
                status_span.html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" OnClick=toggleDevice(" + data.deviceID + ")>Turn OFF</a>)");
                cosyAlert("Device " + data.deviceID + " Injected into Sapere", "success", {vPos: 'top', hPos: 'left'});
            } else if (data.status === "OFF") {
                container_div.removeClass("pulse infinite").addClass("shake");
                status_span.html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" OnClick=toggleDevice(" + data.deviceID + ")>Turn ON</a>)");
                cosyAlert("Device " + data.deviceID + " Removed from Sapere", "success", {vPos: 'top', hPos: 'left'});
            }
        }

        if (data.action === "publish") {
            var container_div = $("#" + data.deviceID);
            var agents_span = container_div.find(".device_agents");

            var circle_div = $("<div>", {
                id: data.deviceID + "-pub-" + data.publishKey,
                class: "agent_publish " + " animated bounceInUp"
            });
            var circle_figure = $("<div>", {
                id: data.deviceID + "-pubC-" + data.publishKey,
                class: "circle-publish " + " animated bounceInUp device tooltip",
                title: data.deviceID + " publishing as " + data.publishKey
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
        }

        if (data.action === "subscribe") {
            var container_div = $("#" + data.deviceID);
            var agents_span = container_div.find(".device_agents");

            var circle_div = $("<div>", {
                id: data.deviceID + "-sub-" + data.subscribingKey,
                class: "agent_subscribe " + " animated bounceInUp"
            });
            var circle_figure = $("<div>", {
                id: data.deviceID + "-subC-" + data.subscribingKey,
                class: "circle-subscribe" + " animated bounceInUp device tooltip",
                title: data.deviceID + " subscribed to " + data.subscribingKey
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
        }

        if (data.action === "publish-remove") {
            var container_div = $("#" + data.deviceID);
            var agents_span = container_div.find(".device_agents");
            var circle_div = agents_span.find("#" + data.deviceID + "-pub-" + data.publishKey);
            var circle_figure = agents_span.find("#" + data.deviceID + "-pubC-" + data.publishKey);

            circle_figure.connections('remove');
            circle_div.removeClass("bounceInUp").addClass("bounceOutDown");
            circle_div.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                function (e) {
                    circle_div.remove();
                });
        }

        if (data.action === "subscribe-remove") {
            var container_div = $("#" + data.deviceID);
            var agents_span = container_div.find(".device_agents");
            var circle_div = agents_span.find("#" + data.deviceID + "-sub-" + data.subscribingKey);
            var circle_figure = agents_span.find("#" + data.deviceID + "-subC-" + data.subscribingKey);

            circle_figure.connections('remove');
            circle_div.removeClass("bounceInUp").addClass("bounceOutDown");
            circle_div.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
                function (e) {
                    circle_div.remove();
                });
        }


        if (data.action === "bond") {

            var nodePub = '#' + data.publisher_ID + '-pubC-' + data.key;
            var nodeSub = '#' + data.subscriber_ID + '-subC-' + data.key;

            $(nodeSub).connections('remove');

            //$(nodeSub).on('webkitAnimationEnd oanimationend msAnimationEnd animationend',
            //    function(e) {
                    $(nodeSub).connections({
                        to: nodePub,
                        class: 'connection'
                    });
                //});
        }


    } // NO JSON
    else {
        logOnDiv(text, "monitor");
    }

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
        child.removeClass("bounceInUp").removeClass("shake").addClass("pulse infinite");
        status = $("<span>", {class: "device_status"}).html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" OnClick=toggleDevice(" + data.deviceID + ")>Turn OFF</a>)");
    } else if (data.status === "OFF") {
        status = $("<span>", {class: "device_status"}).html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" OnClick=toggleDevice(" + data.deviceID + ")>Turn ON</a>)");
    }
    ;
    description = $("<span>", {class: "device_description"}).html("<b>Comments:</b> " + data.description);
    remove = $("<span>", {class: "device_remove"}).html("<a href=\"#!\" class=\"remove_switch\" OnClick=removeDevice(" + data.deviceID + ")>Remove device</a>");
    agents = $("<span>", {class: "device_agents"});

    child.append(id).append(type).append(status).append(description).append(remove).append(agents);
    container.append(child);

}

function printOrchestrator(data) {
    var container = $("#orchestrator");
    var child = $("<div>", {id: data.deviceID, class: data.type + " animated bounceInUp device"});

    var id;
    var status;
    var remove;
    var agents;

    id = $("<span>", {class: "device_id", style: "margin-top: 20px"}).html(data.deviceID);

    if (data.status === "ON") {
        child.removeClass("bounceInUp").removeClass("shake").addClass("pulse infinite");
        status = $("<span>", {class: "device_status"}).html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" OnClick=toggleDevice(" + data.deviceID + ")>Turn OFF</a>)");
    } else if (data.status === "OFF") {
        status = $("<span>", {class: "device_status"}).html("<b>Status:</b> " + data.status + " (<a href=\"#!\" class=\"toggle_switch\" OnClick=toggleDevice(" + data.deviceID + ")>Turn ON</a>)");
    }
    remove = $("<span>", {class: "device_remove"}).html("<a href=\"#!\" class=\"remove_switch\" OnClick=removeDevice(" + data.deviceID + ")>Remove device</a>");
    agents = $("<span>", {class: "device_agents", style: "margin-top: -110px"});

    child.append(id).append(status).append(remove).append(agents);
    container.append(child);

}


function removeDevice(element) {
    var id = element.getAttribute("id");
    var DeviceAction = {
        action: "remove",
        deviceID: id
    };
    socket.send(JSON.stringify(DeviceAction));
    return false;
}

function toggleDevice(element) {
    var id = element.getAttribute("id");
    var DeviceAction = {
        action: "toggle",
        deviceID: id
    };
    socket.send(JSON.stringify(DeviceAction));
    return false;
}