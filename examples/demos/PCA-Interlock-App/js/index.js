/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser:true*/
/*global require*/

require.config({
    baseUrl: '../../client/app',
    paths: {
        d3: '../lib/d3',
        stateParser: './util/PVSioStateParser',
        NCDevice: 'plugins/networkController/NCDevice',
        NCMonitor: 'plugins/networkController/NCMonitor'
    }
});
/**
 * Loading the module PVSioWebClient.
 */
require([
    'PVSioWebClient',
    'stateParser',
    'NCDevice',
    'NCMonitor',
    "widgets/med/PatientMonitorDisplay", "widgets/TripleDisplay", "widgets/SingleDisplay", "widgets/ButtonActionsQueue"
], function (PVSioWebClient, stateParser, NCDevice, NCMonitor, PatientMonitorDisplay, TripleDisplay, SingleDisplay, ButtonActionsQueue) {

    var deviceID = "Supervisor_ID";
    var deviceType = "Supervisor";
    //var deviceDescription = "Supervisor";

    var client;
    var tick = null;

    function parseNCUpdate(event) {
        var res = stateParser.parse(event.message);
        if (res.id === "\"AlarisGP\"") {
            ButtonActionsQueue.getInstance().queueGUIAction("update_pump(" + event.message + ")", onMessageReceived);
        } else if (res.id === "\"Radical7\"") {
            ButtonActionsQueue.getInstance().queueGUIAction("update_monitor(" + event.message + ")", onMessageReceived);
        }
        //        client.getWebSocket()
//            .sendGuiAction("update_spo2(" + res.spo2 + ")" +
//            "(" + client.getWebSocket().lastState() + ");",
//            onMessageReceived);
    }

    function errorMessage(event) {
        console.log("!!! " + event.message);
    }

    function notifyMessage(event) {
        console.log(">>> " + event.message);
    }


    var ncDevice = new NCDevice({id: deviceID, type: deviceType});
    ncDevice.addListener("update", parseNCUpdate);
    ncDevice.addListener("error", errorMessage);
    ncDevice.addListener("notify", notifyMessage);

    var ncMonitor = new NCMonitor({});
    ncMonitor.addListener("error", errorMessage);
    ncMonitor.addListener("notify", notifyMessage);


    function start_tick() {
        if (!tick) {
            tick = setInterval(function () {
                ButtonActionsQueue.getInstance().queueGUIAction("tick", onMessageReceived);
            }, 2000);
        }
    }

    function stop_tick() {
        if (tick) {
            clearInterval(tick);
            tick = null;
        }
    }


    function logOnDiv(msg, logger) {
        var p = $("<p>", {class: "console_element"});
        p.html(msg);
        $("#" + logger)
            .append(p)
            .animate({scrollTop: $("#" + logger)[0].scrollHeight}, 500);
    }


    /**
     function to handle when an output has been received from the server after sending a guiAction
     if the first parameter is truthy, then an error occured in the process of evaluating the gui action sent
     */
    function onMessageReceived(err, event) {
        if (!err) {
            logOnDiv(event.data.toString(), "monitor");
            var res = stateParser.parse(event.data.toString());
            if (res.pumpcmd.trim() === "pause") {
                console.log("pause pump");
                ncDevice.sendControlData("Alaris", "click_btn_pause");
            }
            // rendering
            res = event.data.toString();
            if (res.indexOf("(#") === 0) {
                res = stateParser.parse(event.data.toString());
                if (res) {
                    render_spo2(res.monitor);
                    render_rra(res.monitor);
                    render_alarms(res.monitor);
                    render_pump_data(res.pump);
                }
            }
        } else {
            console.log(err);
        }
    }


    /*
     * Get client instance and the websocket it uses to communicate with the server
     */
    client = PVSioWebClient.getInstance();
    var imageHolder = client.createCollapsiblePanel({
        parent: "#content",
        headerText: "Simulation of ICE Supervisor with PCA Interlock Application",
        showContent: true,
        isDemo: true
    }).style("position", "relative").style("width", "1200px");
    //insert the html into the panel (note that this could have used templates or whatever)
    var content = imageHolder.html('<img src="ICE-Supervisor.png" usemap="#prototypeMap"/>').attr("id", "prototype");
    content.attr("style", "margin-left: 0px; float: left;");


    var app = {monitor: {spo2_display: null, rra_display: null}, pump: {rate: null}};
    app.monitor.spo2_display = new PatientMonitorDisplay("spo2_display",
        {top: 286, left: 140, height: 34, width: 180},
        {font: "Times", label: "%SpO2"});
    app.monitor.rra_display = new PatientMonitorDisplay("rra_display",
        {top: 338, left: 140, height: 34, width: 180},
        {font: "Times", label: "RRa", fontColor: "aqua"});

    app.pump.topline = new SingleDisplay("topline",
        {top: 110, left: 140, height: 16, width: 190});
    app.pump.rate = new TripleDisplay("rate",
        {top: 160, left: 140, height: 30, width: 190},
        {
            left_display: {height: 14, width: 58, align: "left"},
            center_display: {width: 80, align: "right", top: 150},
            right_display: {height: 14, align: "right", top: 164}
        });
    app.pump.vtbi = new TripleDisplay("vtbi",
        {top: 200, left: 140, height: 30, width: 190},
        {
            left_display: {height: 14, width: 58, align: "left"},
            center_display: {width: 80, align: "right", top: 190},
            right_display: {height: 14, align: "right", top: 204}
        });
    app.pump.volume = new TripleDisplay("volume",
        {top: 240, left: 140, height: 30, width: 190},
        {
            left_display: {height: 14, width: 58, align: "left"},
            center_display: {width: 80, align: "right", top: 230},
            right_display: {height: 14, align: "right", top: 244}
        });


    // utility function
    function evaluate(str) {
        var v = +str;
        if (str.indexOf("/") >= 0) {
            var args = str.split("/");
            v = +args[0] / +args[1];
        }
        return (v <= 0) ? "--" : ((v < 10) ? v.toFixed(1).toString() : v.toFixed(0).toString());
    }

    // spo2
    function render_spo2(res) {
        if (res.isOn === "TRUE") {
            app.monitor.spo2_display.set_alarm({min: parseFloat(res.spo2_min), max: parseFloat(res.spo2_max)});
            app.monitor.spo2_display.set_range({min: 0, max: 100});
            if (res.spo2_fail === "FALSE") {
                if (res.spo2_alarm === "off") {
                    app.monitor.spo2_display.render(evaluate(res.spo2));
                } else {
                    app.monitor.spo2_display.render(evaluate(res.spo2), {fontColor: "red"});
                }
            } else {
                app.monitor.spo2_display.fail("FAIL");
            }
            start_tick();
        } else {
            app.monitor.spo2_display.hide();
            stop_tick();
        }
    }

    // RRa
    function render_rra(res) {
        if (res.isOn === "TRUE") {
            app.monitor.rra_display.set_alarm({min: parseFloat(res.rra_min), max: parseFloat(res.rra_max)});
            app.monitor.rra_display.set_range({min: 0, max: 70});
            if (res.rra_fail === "FALSE") {
                if (res.rra_alarm === "off") {
                    app.monitor.rra_display.render(evaluate(res.rra));
                } else {
                    app.monitor.rra_display.render(evaluate(res.rra), {fontColor: "red"});
                }
            } else {
                app.monitor.rra_display.fail("FAIL");
            }
            start_tick();
        } else {
            app.monitor.rra_display.hide();
            stop_tick();
        }
    }

    // alarms
    function render_alarms(res) {
        if (res.isOn === "TRUE") {
            if (res.spo2_alarm === "off") {
                app.monitor.spo2_display.alarm("off");
            } else if (res.spo2_alarm === "alarm") {
                app.monitor.spo2_display.alarm("glyphicon-bell");
            } else if (res.spo2_alarm === "mute") {
                app.monitor.spo2_display.alarm("glyphicon-mute");
            }
            if (res.rra_alarm === "off") {
                app.monitor.rra_display.alarm("off");
            } else if (res.rra_alarm === "alarm") {
                app.monitor.rra_display.alarm("glyphicon-bell");
            } else if (res.rra_alarm === "mute") {
                app.monitor.rra_display.alarm("glyphicon-mute");
            }
        } else {
            app.monitor.spo2_display.hide();
            app.monitor.rra_display.hide();
        }
    }

    // rate
    function render_pump_data(res) {
        function evaluate(str) {
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return v;
        }

        function render_topline(res) {
            function topline2string(msg) {
                msg = msg.toUpperCase();
                if (msg === "DISPVTBI") {
                    return "VTBI";
                } else if (msg === "DISPKVO") {
                    return "KVO";
                } else if (msg === "HOLDING") {
                    return "ON HOLD";
                } else if (msg === "SETRATE") {
                    return "ON HOLD - SET RATE";
                }
                return msg;
            }

            function topline2options(msg) {
                msg = msg.toUpperCase();
                if (msg === "HOLDING" || msg === "SETRATE" || msg === "ATTENTION") {
                    return {blinking: true};
                }
                return {};
            }

            if (res.topline === "SETRATE") {
                app.pump.topline.renderMultiline(["ON HOLD", "Set rate with chevron keys"], {fontSize: "10"});
            } else {
                app.pump.topline.render(topline2string(res.topline), topline2options(res.topline));
            }
        }

        if (res.isOn === "TRUE") {
            render_topline(res);
            app.pump.rate.renderLabel("RATE");
            app.pump.rate.renderValue(evaluate(res.rate));
            app.pump.rate.renderUnits("mL/h");
            app.pump.vtbi.renderLabel("VTBI");
            app.pump.vtbi.renderValue(evaluate(res.vtbi));
            app.pump.vtbi.renderUnits("mL");
            app.pump.volume.renderLabel("VOLUME");
            app.pump.volume.renderValue(evaluate(res.volume));
            app.pump.volume.renderUnits("mL");
        } else {
            app.pump.topline.render("OFF");
            app.pump.rate.hide();
            app.pump.vtbi.hide();
            app.pump.volume.hide();
        }
    }

    function startNetworkController() {
//        // Uncomment this to invoke glassfish from commands line
//        return new Promise(function (resolve, reject) {
//            resolve(msg);
//        });

        var msg = "Starting ICE Network Controller...";
        console.log(msg);
        return new Promise(function (resolve, reject) {
            client.getWebSocket().send({type: "startSapereEE"}, function (err) {
                if (!err) {
                    msg = "ICE Network Controller started successfully!";
                    console.log(msg);
                    resolve(msg);
                } else {
                    msg = "Error while starting ICE Network Controller (" + JSON.stringify(err) + ")";
                    console.log(msg);
                    reject(err);
                }
            });
        });
    }

    /*
     * Register event listener for websocket connection to the server.
     */
    client.addListener('WebSocketConnectionOpened', function () {
        console.log('web socket connected');
        logOnDiv('PVSio Web Socket connected', 'monitor');
        /*
         * Start the PVS Process for the pacemaker
         */
        client.getWebSocket().startPVSProcess({
            name: 'main.pvs',
            demoName: 'PCA-Interlock-App/pvs'
        }, function (err) {
            if (!err) {
                logOnDiv('PVS Process started', 'monitor');
                // start ICE Network Controller (NCEE) & connect ICE supervisor to it
                startNetworkController().then(function (res) {
                    ncMonitor.start().then(function (res) {
                        ncDevice.start().then(function (res) {
                            ncDevice.connect();
                            start_tick();
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }).catch(function (err) {
                        console.log(err);
                    });
                }).catch(function (err) {
                    // FIXME: receiving error when glassfish is already running
                    ncMonitor.start().then(function (res) {
                        ncDevice.start().then(function (res) {
                            ncDevice.connect();
                        }).catch(function (err) {
                            console.log(err);
                        });
                    }).catch(function (err) {
                        console.log(err);
                    });
                    console.log(err);
                });
            } else {
                console.log(err);
            }
        });
    }).addListener('WebSocketConnectionClosed', function () {
        logOnDiv('PVS Process closed', 'monitor');
        console.log('web socket closed');
    }).addListener('processExited', function () {
        var msg = 'Warning!!!\r\nServer process exited. See console for details.';
        console.log(msg);
    });
    /*
     * Initiate connection to the server
     */
    logOnDiv('Connecting to the PVSio server...', 'monitor');
    client.connectToServer();


});