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
        imageHolder.html('<img src="Airbus-KCCU-ext-1.jpg" usemap="#prototypeMap"/>').attr("id", "prototype");

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
        fcu.display = new SingleDisplay("editbox",
                              { top: 70, left: 62, height: 24, width: 124},
                              {
                                  backgroundColor: "black",
                                  fontColor: "white",
                                  parent: "prototype",
                                  touchscreen: {callback: onMessageReceived, backgroundColor: "green"}
                              });
        fcu.qnh = new SingleDisplay("qnh",
                              { top: 652, left: 890, height: 9, width: 30},
                              {
                                  backgroundColor: "black",
                                  parent: "prototype"
                              });
        fcu.std = new SingleDisplay("std",
                              { top: 652, left: 860, height: 9, width: 30},
                              {
                                  backgroundColor: "black",
                                  fontColor: "white",
                                  parent: "prototype"
                              });

        fcu.btn_key1 = new Button("digit_1", {left: 245, top: 475}, {callback: onMessageReceived, keyCode:49, keyName:"key 1"});
        fcu.btn_key2 = new Button("digit_2", {left: 275, top: 475}, {callback: onMessageReceived, keyCode:50, keyName:"key 2"});
        fcu.btn_key3 = new Button("digit_3", {left: 305, top: 475}, {callback: onMessageReceived, keyCode:51, keyName:"key 3"});
        fcu.btn_key4 = new Button("digit_4", {left: 245, top: 505}, {callback: onMessageReceived, keyCode:52, keyName:"key 4"});
        fcu.btn_key5 = new Button("digit_5", {left: 275, top: 505}, {callback: onMessageReceived, keyCode:53, keyName:"key 5"});
        fcu.btn_key6 = new Button("digit_6", {left: 305, top: 505}, {callback: onMessageReceived, keyCode:54, keyName:"key 6"});
        fcu.btn_key7 = new Button("digit_7", {left: 245, top: 530}, {callback: onMessageReceived, keyCode:55, keyName:"key 7"});
        fcu.btn_key8 = new Button("digit_8", {left: 275, top: 530}, {callback: onMessageReceived, keyCode:56, keyName:"key 8"});
        fcu.btn_key9 = new Button("digit_9", {left: 305, top: 530}, {callback: onMessageReceived, keyCode:57, keyName:"key 9"});
        fcu.btn_key0 = new Button("digit_0", {left: 275, top: 560}, {callback: onMessageReceived, keyCode:48, keyName:"key 0"});
        fcu.btn_point = new Button("point", {left:
           245, top: 560}, {callback: onMessageReceived, keyCode:190, keyName:"."});
        fcu.btn_CLR = new Button("CLR", {left: 20, top: 345}, {callback: onMessageReceived, keyCode:46, keyName:"delete"});
        fcu.btn_OK = new Button("OK", {left: 295, top: 440}, {callback: onMessageReceived, keyCode:13, keyName:"enter"});

        fcu.btn_inHg_hPa = new Knob("std", {left: 864, top: 736}, {callback: onMessageReceived});
//        fcu.btn_std = new Button("std", {left: 876, top: 720}, {callback: onMessageReceived, keyCode:17, keyName:"ctrl"});

        // utility functions
        function evaluate(str) {
            str = str.replace(/"/g, "");
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return v;
        }
        function render_display(res) {
            var str = res.data_entry.display.replace(/"/g, "");
            fcu.display.render(str);
        }
        function render_state(res) {
            if (res.current_state === "STD") {
                fcu.std.render("STD");
                fcu.qnh.hide();
            } else {
                fcu.qnh.render("QNH");
                fcu.std.hide();
            }
        }

        // display
        function render(res) {
          render_display(res);
          render_state(res);
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
