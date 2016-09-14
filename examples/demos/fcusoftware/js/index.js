/**
 *
 * @author Paolo Masci, Patrick Oladimeji
 * @date 27/03/15 20:30:33 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
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

require([
        "widgets/Button",
        "widgets/Knob",
        "widgets/SingleDisplay",
        "widgets/DoubleDisplay",
        "widgets/LED",
        "widgets/TouchScreenButton",
        "plugins/graphbuilder/GraphBuilder",
        "stateParser",
        "PVSioWebClient"],
    function (Button,
              Knob,
              SingleDisplay,
              DoubleDisplay,
              LED,
              TouchScreenButton,
              GraphBuilder,
              stateParser,
              PVSioWebClient) {
        "use strict";

        var d3 = require("d3/d3");
        var serverLogs = [], maxLogSize = 40;

        var client = PVSioWebClient.getInstance();
        //create a collapsible panel using the pvsiowebclient instance
        var imageHolder = client.createCollapsiblePanel({
            parent: "#content",
            headerText: "Simulation of the FCU Software",
            showContent: true,
            isDemo: true,
            width: 1230
        }).style("position", "relative").style("width", "1230px");
        //insert the html into the panel (note that this could have used templates or whatever)
        imageHolder.html('<img src="FCU-Software-ext.png" usemap="#prototypeMap"/>').attr("id", "prototype").attr("class", "fcusoftware").style("float", "left");
        //d3.select(".collapsible-panel-parent").append("div").attr("id", "kccu").attr("class", "kccu").html('<img src="KCCU.png" usemap="#prototypeMap"/>').style("float", "left");

        /**
         function to handle when an output has been received from the server after sending a guiAction
         if the first parameter is truthy, then an error occured in the process of evaluating the gui action sent
         */
        function onMessageReceived(err, event) {
            function prettyprintState(str) {
                var state = stateParser.parse(str);
                state.data_entry.display = state.data_entry.display.replace(/"/g, "");
                return JSON.stringify(state, null, " ");
            }

            if (!err) {
                client.getWebSocket().lastState(event.data);
                var dbg = prettyprintState(event.data.toString());

                // logging
                var date = new Date();
                serverLogs.push({data: dbg, date: date, id: event.id, type: "dbg"});
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

                // rendering
                var res = event.data.toString();
                if (res.indexOf("(#") === 0) {
                    res = stateParser.parse(event.data.toString());
                    if (res) {
                        render(res);
                    }
                }
            } else {
                console.log(err);
            }
        }

        var tick = null;
        var start_tick = null, stop_tick = null;

        // append displays
        var fcu = {};
        fcu.cursorOverlay = new SingleDisplay("cursorOverlay",
                            {top: 0, left: 0, height: 800, width: 624 },
                            {
                                backgroundColor: "transparent",
                                parent: "prototype",
                                cursor: "url('./css/pilot_cursor.cur') 32 32, auto"
                            });

        fcu.editbox = new SingleDisplay("editbox_pressure",
                            { top: 333, left: 16, height: 28, width: 100},
                            {
                              backgroundColor: "black",
                              fontColor: "white",
                              parent: "prototype",
                              touchscreen: {callback: onMessageReceived, backgroundColor: "green", highlightOnMouseClick: true},
                              fontsize: 20,
                              cursor: "url('./css/pilot_cursor.cur') 32 32, auto"
                            });
        fcu.editbox_units = new SingleDisplay("FCU_editbox_units",
                            { top: 333, left: 112, height: 28, width: 36},
                            {
                              backgroundColor: "black",
                              fontColor: "cyan",
                              parent: "prototype",
                              fontsize: 16
                            });

        fcu.display = new SingleDisplay("FCU_display",
                            { top: 333, left: 16, height: 28, width: 100},
                            {
                              backgroundColor: "grey",
                              fontColor: "white",
                              parent: "prototype",
                              fontsize: 20
                            });
        fcu.display_units = new SingleDisplay("FCU_display_units",
                            { top: 333, left: 112, height: 28, width: 36},
                            {
                              backgroundColor: "grey",
                              fontColor: "white",
                              parent: "prototype",
                              fontsize: 16
                            });

        fcu.btn_toHPA = new SingleDisplay("hPa",
                            {top: 380, left: 12, height: 36, width: 140 },
                            {
                                backgroundColor: "black",
                                fontColor: "white",
                                parent: "prototype",
                                touchscreen: {callback: onMessageReceived, backgroundColor: "green", highlightOnMouseClick: true},
                                fontsize: 18,
                                cursor: "url('./css/pilot_cursor.cur') 32 32, auto"
                            });
        fcu.btn_toINHG = new SingleDisplay("inHg",
                            {top: 380, left: 12, height: 36, width: 140 },
                            {
                                backgroundColor: "black",
                                fontColor: "white",
                                parent: "prototype",
                                touchscreen: {callback: onMessageReceived, backgroundColor: "green", highlightOnMouseClick: true},
                                fontsize: 18,
                                cursor: "url('./css/pilot_cursor.cur') 32 32, auto"
                            });
        fcu.btn_CLEAR = new SingleDisplay("CLEAR",
                            {top: 752, left: 2, height: 45, width: 82 },
                            {
                                backgroundColor: "black",
                                fontColor: "white",
                                parent: "prototype",
                                touchscreen: {callback: onMessageReceived, functionText: "CLR", backgroundColor: "green", highlightOnMouseClick: true},
                                fontsize: 16,
                                cursor: "url('./css/pilot_cursor.cur') 32 32, auto"
                            });


        fcu.programmedValue = new SingleDisplay("programmedValue",
                            { top: 44, left: 46, height: 9, width: 32},
                            {
                              backgroundColor: "black",
                              fontColor: "white",
                              parent: "prototype"
                            });

        fcu.STD_LED = new LED("STD_LED", {top: 243, left: 10, height: 32, width: 32},
                            {
                                radius: 9,
                                parent: "prototype",
                                cursor: "url('./css/pilot_cursor.cur') 32 32, auto"
                            });
        fcu.btn_STD_RADIO = new SingleDisplay("STD_RADIO",
                            {top: 243, left: 10, height: 32, width: 72},
                            {
                                backgroundColor: "transparent",
                                parent: "prototype",
                                touchscreen: {callback: onMessageReceived, functionText: "STD_RADIO", backgroundColor: "transparent", highlightOnMouseClick: true},
                                cursor: "url('./css/pilot_cursor.cur') 32 32, auto"
                            });

        fcu.QNH_LED = new LED("QNH_LED", {top: 275, left: 10, height: 32, width: 32},
                            {
                                radius: 9,
                                parent: "prototype",
                                cursor: "url('./css/pilot_cursor.cur') 32 32, auto"
                            });
        fcu.btn_QNH_RADIO = new SingleDisplay("QNH_RADIO",
                            {top: 275, left: 10, height: 32, width: 72},
                            {
                                backgroundColor: "transparent",
                                parent: "prototype",
                                touchscreen: {callback: onMessageReceived, functionText: "QNH_RADIO", backgroundColor: "transparent", highlightOnMouseClick: true},
                                cursor: "url('./css/pilot_cursor.cur') 32 32, auto"
                            });

        fcu.btn_key1 = new Button("digit_1", {left: 1032, top: 294}, {callback: onMessageReceived, keyCode:49, keyName:"key 1"});
        fcu.btn_key2 = new Button("digit_2", {left: 1080, top: 294}, {callback: onMessageReceived, keyCode:50, keyName:"key 2"});
        fcu.btn_key3 = new Button("digit_3", {left: 1126, top: 294}, {callback: onMessageReceived, keyCode:51, keyName:"key 3"});
        fcu.btn_key4 = new Button("digit_4", {left: 1032, top: 340}, {callback: onMessageReceived, keyCode:52, keyName:"key 4"});
        fcu.btn_key5 = new Button("digit_5", {left: 1080, top: 340}, {callback: onMessageReceived, keyCode:53, keyName:"key 5"});
        fcu.btn_key6 = new Button("digit_6", {left: 1126, top: 340}, {callback: onMessageReceived, keyCode:54, keyName:"key 6"});
        fcu.btn_key7 = new Button("digit_7", {left: 1032, top: 383}, {callback: onMessageReceived, keyCode:55, keyName:"key 7"});
        fcu.btn_key8 = new Button("digit_8", {left: 1080, top: 383}, {callback: onMessageReceived, keyCode:56, keyName:"key 8"});
        fcu.btn_key9 = new Button("digit_9", {left: 1126, top: 383}, {callback: onMessageReceived, keyCode:57, keyName:"key 9"});
        fcu.btn_point = new Button("point",  {left: 1032, top: 428}, {callback: onMessageReceived, keyCode:190, keyName:"."});
        fcu.btn_key0 = new Button("digit_0", {left: 1080, top: 428}, {callback: onMessageReceived, keyCode:48, keyName:"key 0"});
        fcu.btn_CLR = new Button("CLR", {left: 672, top: 82}, {callback: onMessageReceived, keyCode:46, keyName:"delete"});
        fcu.btn_ESC = new Button("ESC", {left: 680, top: 34}, {callback: onMessageReceived, keyCode:27, keyName:"esc"});
        fcu.btn_OK = new Button("OK", {left: 1110, top: 234}, {callback: onMessageReceived, keyCode:13, keyName:"enter"});

        // utility functions
        function evaluate(str) {
            str = str.replace(/"/g, "");
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return Math.floor(v * 100) / 100;
        }
        function render_display(res) {
            if (res.current_state.trim() !== "STD") {
                var str = res.data_entry.display.replace(/"/g, "");
                fcu.editbox.render(str);
                if (res.current_state.trim() === "EDIT_PRESSURE") {
                    fcu.editbox_units.hide();
                } else {
                    fcu.editbox_units.render(res.data_entry.units);
                }
                fcu.display.hide();
                fcu.display_units.hide();
            } else {
                fcu.editbox.hide();
                fcu.editbox_units.hide();
                fcu.display.render(evaluate(res.data_entry.display));
                fcu.display_units.render(res.data_entry.units);
            }
        }
        function render_STD_QNH_buttons(res) {
            if (res.current_state.trim() === "STD") {
                fcu.STD_LED.on();
                fcu.QNH_LED.off();
            } else {
                fcu.STD_LED.off();
                fcu.QNH_LED.on();
            }
        }
        function render_inHg_hPa_buttons(res) {
            if (res.data_entry.units.trim() === "inHg") {
                fcu.btn_toHPA.render("INHG -> HPA");
                fcu.btn_toINHG.hide();
            } else {
                fcu.btn_toHPA.hide();
                fcu.btn_toINHG.render("HPA -> INHG");
            }
        }
        function render_cursorOverlay(res) {
//            if (res.current_state.trim() === "EDIT_PRESSURE") {
//                fcu.cursorOverlay.hide();
//            } else {
                fcu.cursorOverlay.render();
//            }
        }

        // display
        function render(res) {
            render_display(res);
            render_STD_QNH_buttons(res);
            render_inHg_hPa_buttons(res);
            fcu.btn_CLEAR.render("CLR INFO");
            fcu.btn_QNH_RADIO.render();
            fcu.btn_STD_RADIO.render();
            render_cursorOverlay(res);
        }



        //--- tick function -------------------
        start_tick = function () {
            if (!tick) {
                tick = setInterval(function () {
                    client.getWebSocket()
                        .sendGuiAction("tick(" + client.getWebSocket().lastState() + ");", onMessageReceived);
                }, 2000);
            }
        };

        stop_tick = function () {
            if (tick) {
                clearInterval(tick);
                tick = null;
            }
        };


        //register event listener for websocket connection from the client
        client.addListener('WebSocketConnectionOpened', function (e) {
            console.log("web socket connected");
            //start pvs process
            client.getWebSocket().startPVSProcess({name: "emucharts_FCU_th.pvs", demoName: "fcusoftware/pvs"}, function (err, event) {
                client.getWebSocket().sendGuiAction("init(0);", onMessageReceived);
                d3.select(".demo-splash").style("display", "none");
                d3.select(".content").style("display", "block");
                speak("ready");
            });
        }).addListener("WebSocketConnectionClosed", function (e) {
            console.log("web socket closed");
        }).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
            console.log(msg);
        });

        client.connectToServer();

    });
