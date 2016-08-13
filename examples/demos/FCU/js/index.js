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
            headerText: "Simulation of the EFIS Control Panel",
            showContent: true,
            isDemo: true
        }).style("position", "relative").style("width", "1200px");
        //insert the html into the panel (note that this could have used templates or whatever)
        imageHolder.html('<img src="Airbus-KCCU.jpg" usemap="#prototypeMap"/>').attr("id", "prototype");

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
        fcu.editbox = new SingleDisplay("editbox_pressure",
                              { top: 58, left: 20, height: 16, width: 60},
                              {
                                  backgroundColor: "black",
                                  fontColor: "white",
                                  parent: "prototype",
                                  touchscreen: {callback: onMessageReceived, backgroundColor: "green", highlightOnMouseClick: true}
                              });
        fcu.dispQNH = new SingleDisplay("dispQNH",
                              { top: 44, left: 22, height: 9, width: 20},
                              {
                                  backgroundColor: "black",
                                  parent: "prototype"
                              });
        fcu.dispSTD = new SingleDisplay("dispSTD",
                              { top: 58, left: 20, height: 16, width: 60},
                              {
                                  backgroundColor: "black",
                                  fontColor: "white",
                                  parent: "prototype"
                              });
        fcu.programmedValue = new SingleDisplay("programmedValue",
                              { top: 44, left: 46, height: 9, width: 32},
                              {
                                  backgroundColor: "black",
                                  fontColor: "white",
                                  parent: "prototype"
                              });

        fcu.btn_key1 = new Button("digit_1", {left: 205, top: 315}, {callback: onMessageReceived, keyCode:49, keyName:"key 1"});
        fcu.btn_key2 = new Button("digit_2", {left: 230, top: 315}, {callback: onMessageReceived, keyCode:50, keyName:"key 2"});
        fcu.btn_key3 = new Button("digit_3", {left: 255, top: 315}, {callback: onMessageReceived, keyCode:51, keyName:"key 3"});
        fcu.btn_key4 = new Button("digit_4", {left: 205, top: 340}, {callback: onMessageReceived, keyCode:52, keyName:"key 4"});
        fcu.btn_key5 = new Button("digit_5", {left: 230, top: 340}, {callback: onMessageReceived, keyCode:53, keyName:"key 5"});
        fcu.btn_key6 = new Button("digit_6", {left: 255, top: 340}, {callback: onMessageReceived, keyCode:54, keyName:"key 6"});
        fcu.btn_key7 = new Button("digit_7", {left: 205, top: 365}, {callback: onMessageReceived, keyCode:55, keyName:"key 7"});
        fcu.btn_key8 = new Button("digit_8", {left: 230, top: 365}, {callback: onMessageReceived, keyCode:56, keyName:"key 8"});
        fcu.btn_key9 = new Button("digit_9", {left: 255, top: 365}, {callback: onMessageReceived, keyCode:57, keyName:"key 9"});
        fcu.btn_key0 = new Button("digit_0", {left: 230, top: 390}, {callback: onMessageReceived, keyCode:48, keyName:"key 0"});
        fcu.btn_point = new Button("point", {left: 205, top: 390}, {callback: onMessageReceived, keyCode:190, keyName:"."});
        fcu.btn_CLR = new Button("CLR", {left: 12, top: 205}, {callback: onMessageReceived, keyCode:46, keyName:"delete"});
        fcu.btn_ESC = new Button("ESC", {left: 16, top: 180}, {callback: onMessageReceived, keyCode:27, keyName:"esc"});
        fcu.btn_OK = new Button("OK", {left: 250, top: 285}, {callback: onMessageReceived, keyCode:13, keyName:"enter"});

        fcu.btn_inHg_hPa = new Knob("std", {left: 24, top: 120}, {callback: onMessageReceived, keyCode:17, keyName:"ctrl"});

        // utility functions
        function evaluate(str) {
            str = str.replace(/"/g, "");
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return v.toFixed(2).toString();
        }
        function render_display(res) {
            if (res.current_state !== "STD") {
                var str = res.data_entry.display.replace(/"/g, "");
                fcu.editbox.render(str);
            } else {
                fcu.editbox.hide();
            }
        }
        function render_state(res) {
            if (res.current_state === "STD") {
                fcu.dispSTD.render("Std");
                fcu.dispQNH.hide();
            } else {
                fcu.dispQNH.render("QNH");
                fcu.dispSTD.hide();
            }
        }
        function render_programmedValue(res) {
            if (res.current_state === "EDIT_PRESSURE") {
                fcu.programmedValue.render(evaluate(res.data_entry.programmedValue))
            } else {
                fcu.programmedValue.hide();
            }
        }

        // display
        function render(res) {
          render_display(res);
          render_state(res);
          render_programmedValue(res);
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


        d3.select(".btn_on").on("click", function () {
            stop_tick();
            client.getWebSocket()
                .sendGuiAction("click_btn_on(" + client.getWebSocket().lastState() + ");", onMessageReceived);
            start_tick();
        });

        d3.select("#submit_spo2_sensor_data").on("click", function () {
            var data = d3.select("#spo2_sensor_data").node().value;
            if (data) {
                data = (isNaN(parseFloat(data))) ? -1 : parseFloat(data);
                stop_tick();
                client.getWebSocket()
                    .sendGuiAction("spo2_sensor_data(" + data + ")(" + client.getWebSocket().lastState() + ");", onMessageReceived);
                start_tick();
            }
        });

        d3.select("#submit_rra_sensor_data").on("click", function () {
            var data = d3.select("#rra_sensor_data").node().value;
            if (data) {
                data = (isNaN(parseFloat(data))) ? -1 : parseFloat(data);
                stop_tick();
                client.getWebSocket()
                    .sendGuiAction("rra_sensor_data(" + data + ")(" + client.getWebSocket().lastState() + ");", onMessageReceived);
                start_tick();
            }
        });


        //register event listener for websocket connection from the client
        client.addListener('WebSocketConnectionOpened', function (e) {
            console.log("web socket connected");
            //start pvs process
            client.getWebSocket().startPVSProcess({name: "emucharts_FCU_th.pvs", demoName: "FCU/pvs"}, function (err, event) {
                client.getWebSocket().sendGuiAction("init(0);", onMessageReceived);
                d3.select(".demo-splash").style("display", "none");
                d3.select(".content").style("display", "block");
            });
        }).addListener("WebSocketConnectionClosed", function (e) {
            console.log("web socket closed");
        }).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
            console.log(msg);
        });

        client.connectToServer();

    });
