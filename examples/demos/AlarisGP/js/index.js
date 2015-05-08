/**
 *
 * @author Paolo Masci, Patrick Oladimeji, Piergiuseppe Mallozzi
 * @date 27/03/15 20:30:33 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, unused: false */
/*global*/
require.config({
    baseUrl: "../../client/app",
    paths: {
        d3: "../lib/d3",
        "pvsioweb": "plugins/prototypebuilder",
        "imagemapper": "../lib/imagemapper",
        "text": "../lib/text",
        "lib": "../lib",
        "cm": "../lib/cm",
        stateParser: './util/PVSioStateParser'
    }
});

require(["widgets/Button", "widgets/SingleDisplay", "widgets/DoubleDisplay", "widgets/TripleDisplay", "widgets/LED", "widgets/CursoredDisplay", "plugins/graphbuilder/GraphBuilder", "stateParser", "PVSioWebClient", "widgets/ButtonActionsQueue"], function (Button, SingleDisplay, DoubleDisplay, TripleDisplay, LED, CursoredDisplay, GraphBuilder, stateParser, PVSioWebClient, ButtonActionsQueue) {
    "use strict";

    var alaris = {}; // this variable collects references to buttons and displays
    var d3 = require("d3/d3");

    var sapere_websocket;
    var deviceID = "Alaris";
    var deviceAdded = false;
    var socketClosed;

    var serverLogs = [], maxLogSize = 40;
    var client = PVSioWebClient.getInstance();
    //create a collapsible panel using the pvsiowebclient instance
    var imageHolder = client.createCollapsiblePanel({
        parent: "#content",
        headerText: "Simulation of the Alaris GP infusion pump.",
        showContent: true,
        isDemo: true
    }).style("position", "relative");
    //insert the html into the panel (note that this could have used templates or whatever)
    imageHolder.html('<img src="image.jpg" usemap="#prototypeMap"/>').attr("id", "prototype");

    var content = imageHolder.append("div").style("position", "absolute").style("top", "0px").style("left", "400px")
                    .style("height", "40px").style("width", "800px").attr("class", "dbgbuttons");
    content.append("button").text("Pause").attr("id", "btn_pause");
    content.append("button").text("Resume").attr("id", "btn_resume");

    content = imageHolder.append("div").style("position", "absolute").style("top", "40px").style("left", "400px")
                    .style("height", "460px").style("width", "400px").attr("class", "dbg");

    content = imageHolder.append("div").style("position", "absolute").style("top", "40px").style("left", "850px")
                    .style("height", "460px").style("width", "400px").attr("id", "monitor").attr("class", "dbg");


    //topline
    alaris.topline = new SingleDisplay("topline", { top: 112, left: 92, height: 10, width: 120 }, { parent: "prototype" });

    //middisp
    alaris.middisp_drate = new TripleDisplay("middisp_drate", { top: 126, left: 94, height: 30, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 28, align: "left" },
                                            center_display: { width: 64, align: "right" },
                                            right_display: { height: 12, top: 142 }});
    alaris.middisp_dnewvtbi = new TripleDisplay("middisp_dnewvtbi", { top: 132, left: 94, height: 26, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 28, align: "left" },
                                            center_display: { width: 64, align: "right" },
                                            right_display: { height: 12, top: 144 }});
    alaris.middisp_dshowvol = new TripleDisplay("middisp_dshowvol", { top: 126, left: 94, height: 30, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 118, align: "center" },
                                            center_display: { height: 22, width: 74, top: 140, left: 94, align: "right" },
                                            right_display: { height: 12, width: 20, top: 148, left: 168 }});
    alaris.middisp_dvtbi = new TripleDisplay("middisp_dvtbi", { top: 168, left: 94, height: 12, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 34, align: "left" },
                                            center_display: { width: 62, align: "right" }});
    alaris.middisp_dvol = new TripleDisplay("middisp_dvol", { top: 186, left: 94, height: 12, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 34, align: "left" },
                                            center_display: { width: 62, align: "right" }});
    alaris.middisp_dtime = new TripleDisplay("middisp_dtime", { top: 204, left: 94, height: 12, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 34, align: "left" },
                                            center_display: { width: 62, align: "right" }});
    //middisp_dbags
    alaris.middisp_dbags = new SingleDisplay("middisp_dbags", { top: 126, left: 94, height: 90, width: 118 },
                                          { parent: "prototype"});

    //fndisp
    alaris.fndisp1 = new SingleDisplay("fndisp1", { top: 222, left: 96, height: 8, width: 38 },
                                    { parent: "prototype", font: "Courier New"});
    alaris.fndisp2 = new SingleDisplay("fndisp2", { top: 222, left: 134, height: 8, width: 38 },
                                    { parent: "prototype", font: "Courier New"});
    alaris.fndisp3 = new SingleDisplay("fndisp3", { top: 222, left: 172, height: 8, width: 38 },
                                    { parent: "prototype", font: "Courier New"});

    //LEDs
    alaris.onlight = new LED("onlight", { top: 356, left: 138, height: 10, width: 10 },
                          { parent: "prototype" });
    alaris.pauselight = new LED("pauselight", { top: 323, left: 122, height: 10, width: 10 },
                          { parent: "prototype", color:  "rgb(236, 149, 17)" }); // light orange
    alaris.runlight = new LED("runlight", { top: 297, left: 122, height: 10, width: 10 },
                          { parent: "prototype", blinking: true, blinkingRate: 1000 });

    var render_LEDs = function (res) {
        if (res.onlight === "TRUE") { alaris.onlight.on(); } else { alaris.onlight.off(); }
        if (res.pauselight === "TRUE") { alaris.pauselight.on(); } else { alaris.pauselight.off(); }
        if (res.runlight === "TRUE") { alaris.runlight.on(); } else { alaris.runlight.off(); }
    };

    function render_middisp_dbags(res) {
        var menu = [
            res.bagsval0 + " ml",
            res.bagsval1 + " ml",
            res.bagsval2 + " ml",
            res.bagsval3 + " ml",
            res.bagsval4 + " ml",
            res.bagsval5 + " ml",
            res.bagsval6 + " ml",
            res.bagsval7 + " ml",
            res.bagsval8 + " ml",
            res.bagsval9 + " ml"
        ];
        if (res.middisp_dbags === "TRUE") {
            alaris.middisp_dbags.renderMultiline(menu, { selected: res.bagscursor, direction: "inverted" });
        } else {
            alaris.middisp_dbags.hide();
        }
    }

    var tick;

    function render_fndisp(res) {
        function fn2string(fn) {
            if (fn.toUpperCase() === "FVOL") {
                return "VOLUME";
            } else if (fn.toUpperCase() === "FVTBI") {
                return "VTBI";
            } else if (fn.toUpperCase() === "FCANCEL") {
                return "CANCEL";
            } else if (fn.toUpperCase() === "FCLEAR") {
                return "CLEAR";
            } else if (fn.toUpperCase() === "FNULL") {
                return "";
            } else if (fn.toUpperCase() === "FBACK") {
                return "BACK";
            } else if (fn.toUpperCase() === "FOK") {
                return "OK";
            } else if (fn.toUpperCase() === "FBAGS") {
                return "BAGS";
            } else if (fn.toUpperCase() === "FQUIT") {
                return "QUIT";
            } else if (fn.toUpperCase() === "FKEEP") {
                return "KEEP";
            }
            return fn;
        }
        alaris.fndisp1.render(fn2string(res.fndisp1));
        alaris.fndisp2.render(fn2string(res.fndisp2));
        alaris.fndisp3.render(fn2string(res.fndisp3));
    }
    function evaluate(str) {
        var v = +str;
        if (str.indexOf("/") >= 0) {
            var args = str.split("/");
            v = +args[0] / +args[1];
        }
        return (v < 100) ? v.toFixed(1).toString() : v.toFixed(0).toString();
    }
    function render_middisp_drate(res) {
        if (res.middisp_drate === "TRUE") {
            alaris.middisp_drate.renderLabel("RATE");
            alaris.middisp_drate.renderValue(evaluate(res.device.infusionrate));
            alaris.middisp_drate.renderUnits("ml/h");
        } else {
            alaris.middisp_drate.hide();
        }
    }
    function render_middisp_dvtbi(res) {
        if (res.middisp_dvtbi === "TRUE") {
            alaris.middisp_dnewvtbi.hide();
            alaris.middisp_dvtbi.renderLabel("VTBI");
            alaris.middisp_dvtbi.renderValue(evaluate(res.device.vtbi));
            alaris.middisp_dvtbi.renderUnits("ml");
        } else if (res.middisp_dnewvtbi === "TRUE") {
            alaris.middisp_dvtbi.hide();
            alaris.middisp_dnewvtbi.renderLabel("VTBI");
            alaris.middisp_dnewvtbi.renderValue(evaluate(res.newvtbi));
            alaris.middisp_dnewvtbi.renderUnits("ml");
        } else {
            alaris.middisp_dvtbi.hide();
            alaris.middisp_dnewvtbi.hide();
        }
    }
    function render_middisp_dvol(res) {
        if (res.middisp_dvol === "TRUE") {
            if (res.topline.toUpperCase() === "VOLUME") { //Note: in the the model we should have middisp_dshowvol
                alaris.middisp_dvol.hide();
                alaris.middisp_dshowvol.renderLabel("VOLUME INFUSED");
                alaris.middisp_dshowvol.renderValue(evaluate(res.device.volumeinfused));
                alaris.middisp_dshowvol.renderUnits("ml");
            } else {
                alaris.middisp_dshowvol.hide();
                alaris.middisp_dvol.renderLabel("VOLUME INFUSED");
                alaris.middisp_dvol.renderValue(evaluate(res.device.volumeinfused));
                alaris.middisp_dvol.renderUnits("ml");
            }
        } else {
            alaris.middisp_dvol.hide();
        }
    }
    function render_middisp_dtime(res) {
        if (res.middisp_dtime === "TRUE") {
            alaris.middisp_dtime.renderLabel("TIME");
            alaris.middisp_dtime.renderValue(evaluate(res.device.time));
            alaris.middisp_dtime.renderUnits("sec");
        } else {
            alaris.middisp_dtime.hide();
        }
    }


    function render_topline(res) {
        function topline2string(msg) {
            msg = msg.toUpperCase();
            if (msg === "DISPVTBI") {
                return "VTBI";
            } else if (alaris.topline === "DISPKVO") {
                return "KVO";
            }
            return msg;
        }
        if (res.onlight === "TRUE") {
            alaris.topline.render(topline2string(res.topline));
        } else {
            alaris.topline.hide();
        }
    }

    function start_tick() {
        if (!tick) {
            tick = setInterval(function () {
                ButtonActionsQueue.getInstance().queueGUIAction("alaris_tick", onMessageReceived);
           }, 3000);
        }
    }

    function stop_tick() {
        if (tick) {
            clearInterval(tick);
            tick = null;
        }
    }

    /**
     * @function logOnDiv
     * @description Utility function, sends messages to different div elements in the html page
     */
    function logOnDiv(msg, logger) {
        var newP = document.createElement("p");
        newP.innerHTML = msg;
        var node = document.getElementById(logger);
        node.appendChild(newP);
        node.scrollTop = node.scrollHeight;
        //$("#" + logger).animate({ scrollTop: $("#" + logger)[0].scrollHeight}, 500);
    }


    /**
     * @function connectSapere
     * @description Called when clicking the button 'Connect' on the web page.
     * It connects to the Sapere middleware through a new WebSocket.
     * It takes the address from the corresponding field in the html page.
     */
    var connectSapere = function () {
        var url = "ws://localhost:8080/SapereEE/actions",
            sapere_log = "monitor";
        
        return new Promise(function (resolve, reject) {
            if (sapere_websocket && sapere_websocket.readyState === 1) {
                logOnDiv("Device already connected to ICE Network Controller.", sapere_log);
                resolve();
            } else {
                logOnDiv("Establishing connection with ICE Network Controller at " + url, sapere_log);
                sapere_websocket = new WebSocket(url);

                /*
                 * It starts the control process that send the information to Sapere
                 */
                sapere_websocket.onopen = function () {
                    var msg = "Connected to ICE Network Controller!";
                    logOnDiv(msg, sapere_log);
                    addDevice();
                    resolve();
                };
                /*
                 * Receive event
                 */
                sapere_websocket.onmessage = function (evt) {
                    onMessageReceivedSapere(evt);
                };
                /*
                 * Close event
                 */
                sapere_websocket.onclose = function () {
                    var msg = "Disconnected from ICE Network Controller (" + url + ")";
                    logOnDiv(msg, sapere_log);
                    sapere_websocket = null;
                    reject(msg);
                };
                /*
                 * Connection failed
                 */
                sapere_websocket.onerror = function () {
                    var msg = "Unable to connect to ICE Network Controller (" + url + ")";
                    logOnDiv(msg, sapere_log);
                    sapere_websocket = null;
                    reject(msg);
                };
            }
        });
    };

    function addDevice(){
        if (!deviceAdded){
            logOnDiv("Registering " + deviceID + "...", "monitor");
            var DeviceAction = {
                action: "add",
                deviceID: deviceID,
                type: "Pump",
                description: "Alaris GP infusion pump"
            };
            sapere_websocket.send(JSON.stringify(DeviceAction));
        }
        else{
            logOnDiv("Device already registered.", "monitor");
        }
    }

    function sendDataUpdate(message){

        logOnDiv('Sending Message \n'+ message, 'monitor');
        var DeviceAction = {
            action: "update",
            deviceID: deviceID,
            message: message,
        };
        sapere_websocket.send(JSON.stringify(DeviceAction));
    }


    /**
     * @function onMessageReceivedSapere
     * @description Callback function of sapere websocket <br>
     * Parse the data sent from Sapere and send it to PVS in order to process it
     */
    function onMessageReceivedSapere(event) {
        var text = event.data;

        // JSON FORMAT
        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            var device = JSON.parse(event.data);

            if (device.action === "remove") {
                logOnDiv('Device removed', 'monitor');
                deviceAdded = false;
            }
            if (device.action === "add") {
                logOnDiv("Device registered successfully", "monitor");
                deviceAdded = true;
            }
            if (device.action === "update"){
                var rcv = JSON.parse(device.message);
                if(rcv.to === "Alaris"){
                    logOnDiv("FROM:    " + device.from +
                             "\nTYPE:    " + device.type +
                             "\nMESSAGE: \n" + rcv.msg, "monitor");
                    if(rcv.msg === "click_btn_pause"){
                        alaris.btn_pause.click();
                    }
                }

            }
        } // NO JSON
        else{
            logOnDiv(text, "monitor");
        }
    }

    /**
        function to handle when an output has been received from the server after sending a guiAction
        if the first parameter is truthy, then an error occured in the process of evaluating the gui action sent
    */
    function onMessageReceived(err, event) {
        function prettyprintState(str) {
            var state = stateParser.parse(str);
            return JSON.stringify(state, null, " ");
        }

        if (!err) {
            var dbg = prettyprintState(event.data.toString());
            var date = new Date();
            serverLogs.push({data: dbg, date: date, id: event.id, type: "frompvs"});

            if (serverLogs.length > maxLogSize) {
                serverLogs = serverLogs.slice(-maxLogSize);
            }
            var logLines = d3.select(".dbg").selectAll("textarea").data(serverLogs, function (d, i) {
                return d.id;
            });
            logLines.enter()
                .insert("textarea", "textarea").html(function (d) {
                    return d.date.toString() + "\n" + d.data;
                }).style("width", "100%")
                .attr("readonly", true)
                .attr("rows", function (d) {
                    return d.data.split("\n").length + 1;
                }).attr("class", function (d) {
                    return d.type;
                });
            logLines.exit().remove();
            var res = event.data.toString();
            if (res.indexOf("(#") === 0) {
                res = stateParser.parse(event.data.toString());
                if (res) {
                    render_LEDs(res);
                    render_topline(res);
                    render_fndisp(res);
                    render_middisp_drate(res);
                    render_middisp_dvtbi(res);
                    render_middisp_dvol(res);
                    render_middisp_dtime(res);
                    render_middisp_dbags(res);
                    if (res.device["powered_on?"] === "TRUE") {
                        start_tick();
                    } else { stop_tick(); }
                }
            }
        } else { console.log(err); }
    }

    // region button definitions
    alaris.btn_on = new Button("btn_on", {left: 149, top: 347}, {callback: onMessageReceived});

    alaris.btn_fup   = new Button("btn_fup", {left: 91, top: 265}, {callback: onMessageReceived, evts: ['press/release']});
    alaris.btn_fdown = new Button("btn_fdown", {left: 186, top: 265}, {callback: onMessageReceived, evts: ['press/release']});
    alaris.btn_sup   = new Button("btn_sup", {left: 121, top: 265}, {callback: onMessageReceived, evts: ['press/release']});
    alaris.btn_sdown = new Button("btn_sdown", {left: 158, top: 265}, {callback: onMessageReceived, evts: ['press/release']});

    alaris.btn_key1 = new Button("btn_key1", {left: 95, top: 234}, {callback: onMessageReceived});
    alaris.btn_key2 = new Button("btn_key2", {left: 136, top: 234}, {callback: onMessageReceived});
    alaris.btn_key3 = new Button("btn_key3", {left: 172, top: 234}, {callback: onMessageReceived});

    alaris.btn_run   = new Button("btn_run", {left: 89, top: 299}, {callback: onMessageReceived});
    alaris.btn_pause = new Button("btn_pause", {left: 89, top: 324}, {callback: onMessageReceived});
    alaris.btn_query = new Button("btn_query", {left: 136, top: 324}, {callback: onMessageReceived});
    //endregion

    //register event listener for websocket connection from the client
    client.addListener('WebSocketConnectionOpened', function (e) {
        console.log("web socket connected");
        //start pvs process
        client.getWebSocket().startPVSProcess({name: "main.pvs", demoName: "AlarisGP/pvs"}, function (err, event) {
            d3.select(".demo-splash").style("display", "none");
            d3.select(".content").style("display", "block");
            start_tick();
        });
    }).addListener("WebSocketConnectionClosed", function (e) {
        console.log("web socket closed");
    }).addListener("processExited", function (e) {
        var msg = "Warning!!!\r\nServer process exited. See console for details.";
        console.log(msg);
    });

    client.connectToServer();
    connectSapere();

});
