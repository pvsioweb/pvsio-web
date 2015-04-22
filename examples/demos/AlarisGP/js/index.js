/**
 *
 * @author Paolo Masci, Patrick Oladimeji
 * @date 27/03/15 20:30:33 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
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

    var d3 = require("d3/d3");
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
                    .style("height", "460px").style("width", "800px").attr("class", "dbg");


    //append a div that will contain the canvas elements

//    var w = 120, h = 20;

    //topline
    var topline = new SingleDisplay("topline", { top: 112, left: 92, height: 10, width: 120 }, { parent: "prototype" });

    //middisp
    var middisp_drate = new TripleDisplay("middisp_drate", { top: 126, left: 94, height: 30, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 28, align: "left" },
                                            center_display: { width: 64, align: "right" },
                                            right_display: { height: 12, top: 142 }});
    var middisp_dnewvtbi = new TripleDisplay("middisp_dnewvtbi", { top: 132, left: 94, height: 26, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 28, align: "left" },
                                            center_display: { width: 64, align: "right" },
                                            right_display: { height: 12, top: 144 }});
    var middisp_dshowvol = new TripleDisplay("middisp_dshowvol", { top: 126, left: 94, height: 30, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 118, align: "center" },
                                            center_display: { height: 22, width: 74, top: 140, left: 94, align: "right" },
                                            right_display: { height: 12, width: 20, top: 148, left: 168 }});
    var middisp_dvtbi = new TripleDisplay("middisp_dvtbi", { top: 168, left: 94, height: 12, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 34, align: "left" },
                                            center_display: { width: 62, align: "right" }});
    var middisp_dvol = new TripleDisplay("middisp_dvol", { top: 186, left: 94, height: 12, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 34, align: "left" },
                                            center_display: { width: 62, align: "right" }});
    var middisp_dtime = new TripleDisplay("middisp_dtime", { top: 204, left: 94, height: 12, width: 118 },
                                          { parent: "prototype",
                                            left_display: { height: 8, width: 34, align: "left" },
                                            center_display: { width: 62, align: "right" }});
    //middisp_dbags
    var middisp_dbags = new SingleDisplay("middisp_dbags", { top: 126, left: 94, height: 90, width: 118 },
                                          { parent: "prototype"});

    //fndisp
    var fndisp1 = new SingleDisplay("fndisp1", { top: 222, left: 96, height: 8, width: 38 },
                                    { parent: "prototype", font: "Courier New"});
    var fndisp2 = new SingleDisplay("fndisp2", { top: 222, left: 134, height: 8, width: 38 },
                                    { parent: "prototype", font: "Courier New"});
    var fndisp3 = new SingleDisplay("fndisp3", { top: 222, left: 172, height: 8, width: 38 },
                                    { parent: "prototype", font: "Courier New"});

    //LEDs
    var onlight = new LED("onlight", { top: 355, left: 198, height: 10, width: 10 },
                          { parent: "prototype" });
    var pauselight = new LED("pauselight", { top: 322, left: 122, height: 10, width: 10 },
                          { parent: "prototype", color:  "rgb(236, 149, 17)" }); // light orange
    var runlight = new LED("runlight", { top: 295, left: 122, height: 10, width: 10 },
                          { parent: "prototype"});

    //register the graph builder plugin -- so we can visualise the interaction
//    var gb = GraphBuilder.getInstance();
//    var gb = client.registerPlugin(GraphBuilder);

    /**
        parse the raw state string from pvsio process into key value pairs
    */
    function parseState(str) {
        var res = stateParser.parse(str);
        return res;
    }

    var render_LEDs = function (res) {
        if (res.onlight === "TRUE") { onlight.on(); } else { onlight.off(); }
        if (res.pauselight === "TRUE") { pauselight.on(); } else { pauselight.off(); }
        if (res.runlight === "TRUE") { runlight.on(); } else { runlight.off(); }
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
            middisp_dbags.renderMultiline(menu, { selected: res.bagscursor, direction: "inverted" });
        } else {
            middisp_dbags.hide();
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
        fndisp1.render(fn2string(res.fndisp1));
        fndisp2.render(fn2string(res.fndisp2));
        fndisp3.render(fn2string(res.fndisp3));
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
            middisp_drate.renderLabel("RATE");
            middisp_drate.renderValue(evaluate(res.device.infusionrate));
            middisp_drate.renderUnits("ml/h");
        } else {
            middisp_drate.hide();
        }
    }
    function render_middisp_dvtbi(res) {
        if (res.middisp_dvtbi === "TRUE") {
            middisp_dnewvtbi.hide();
            middisp_dvtbi.renderLabel("VTBI");
            middisp_dvtbi.renderValue(evaluate(res.device.vtbi));
            middisp_dvtbi.renderUnits("ml");
        } else if (res.middisp_dnewvtbi === "TRUE") {
            middisp_dvtbi.hide();
            middisp_dnewvtbi.renderLabel("VTBI");
            middisp_dnewvtbi.renderValue(evaluate(res.newvtbi));
            middisp_dnewvtbi.renderUnits("ml");
        } else {
            middisp_dvtbi.hide();
            middisp_dnewvtbi.hide();
        }
    }
    function render_middisp_dvol(res) {
        if (res.middisp_dvol === "TRUE") {
            if (res.topline.toUpperCase() === "VOLUME") { //Note: in the the model we should have middisp_dshowvol
                middisp_dvol.hide();
                middisp_dshowvol.renderLabel("VOLUME INFUSED");
                middisp_dshowvol.renderValue(evaluate(res.device.volumeinfused));
                middisp_dshowvol.renderUnits("ml");
            } else {
                middisp_dshowvol.hide();
                middisp_dvol.renderLabel("VOLUME INFUSED");
                middisp_dvol.renderValue(evaluate(res.device.volumeinfused));
                middisp_dvol.renderUnits("ml");
            }
        } else {
            middisp_dvol.hide();
        }
    }
    function render_middisp_dtime(res) {
        if (res.middisp_dtime === "TRUE") {
            middisp_dtime.renderLabel("TIME");
            middisp_dtime.renderValue(evaluate(res.device.time));
            middisp_dtime.renderUnits("sec");
        } else {
            middisp_dtime.hide();
        }
    }


    function render_topline(res) {
        function topline2string(msg) {
            msg = msg.toUpperCase();
            if (msg === "DISPVTBI") {
                return "VTBI";
            } else if (topline === "DISPKVO") {
                return "KVO";
            }
            return msg;
        }
        if (res.onlight === "TRUE") {
            topline.render(topline2string(res.topline));
        } else {
            topline.hide();
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
                res = parseState(event.data.toString());
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
    new Button("btn_on", {left: 149, top: 347}, {callback: onMessageReceived});

    new Button("btn_fup", {left: 91, top: 265}, {callback: onMessageReceived, evts: ['press/release']});
    new Button("btn_fdown", {left: 186, top: 265}, {callback: onMessageReceived, evts: ['press/release']});
    new Button("btn_sup", {left: 121, top: 265}, {callback: onMessageReceived, evts: ['press/release']});
    new Button("btn_sdown", {left: 158, top: 265}, {callback: onMessageReceived, evts: ['press/release']});

    new Button("btn_key1", {left: 95, top: 234}, {callback: onMessageReceived});
    new Button("btn_key2", {left: 136, top: 234}, {callback: onMessageReceived});
    new Button("btn_key3", {left: 172, top: 234}, {callback: onMessageReceived});

    new Button("btn_run", {left: 89, top: 299}, {callback: onMessageReceived});
    new Button("btn_pause", {left: 89, top: 324}, {callback: onMessageReceived});
    new Button("btn_query", {left: 136, top: 324}, {callback: onMessageReceived});

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

});
