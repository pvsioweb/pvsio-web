/**
 * 
 * @author Paolo Masci, Patrick Oladimeji
 * @date 27/03/15 20:30:33 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, document, PVSioWebClient */
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

require(["pvsioweb/Button", "widgets/SingleDisplay", "widgets/DoubleDisplay", "widgets/TripleDisplay", "widgets/LED", "widgets/CursoredDisplay", "plugins/graphbuilder/GraphBuilder", "stateParser", "PVSioWebClient"], function (Button, SingleDisplay, DoubleDisplay, TripleDisplay, LED, CursoredDisplay, GraphBuilder, stateParser, PVSioWebClient) {
    "use strict";
    
    var d3 = require("d3/d3");

	var client = PVSioWebClient.getInstance();
    //create a collapsible panel using the pvsiowebclient instance
    var imageHolder = client.createCollapsiblePanel({
        parent: "#content",
        headerText: "Simulation of Masimo Radical 7 PulseOximeter",
        showContent: true,
        isDemo: true
    }).style("position", "relative");
    //insert the html into the panel (note that this could have used templates or whatever)
    imageHolder.html('<img src="radical-7.png" usemap="#prototypeMap"/>').attr("id", "prototype");
    
    var content = imageHolder.append("div").style("position", "absolute").style("top", "20px").style("left", "600px")
					.style("height", "186px").style("width", "400px").attr("class", "dbg");
    
    //append a div that will contain the canvas elements
    var tick = null;
    var start_tick = null, stop_tick = null;

    //spo2
    var spo2 = new SingleDisplay("spo2",
                                 { top: 54, left: 164, height: 36, width: 50 },
                                 { parent: "prototype", font: "Times" });
    var spo2_label = new SingleDisplay("spo2_label",
                                 { top: 86, left: 164, height: 10, width: 50 },
                                 { parent: "prototype", font: "Times" });
    var spo2_alarm = new SingleDisplay("spo2_alarm",
                                 { top: 48, left: 214, height: 12, width: 12 },
                                 { parent: "prototype", align: "left", fontColor: "red" });
    var spo2_max = new SingleDisplay("spo2_max",
                                 { top: 68, left: 214, height: 8, width: 20 },
                                 { parent: "prototype", align: "left" });
    var spo2_min = new SingleDisplay("spo2_min",
                                 { top: 76, left: 214, height: 8, width: 20 },
                                 { parent: "prototype", align: "left" });

    function evaluate_spo2(str) {
        var v = +str;
        if (str.indexOf("/") >= 0) {
            var args = str.split("/");
            v = +args[0] / +args[1];
        }
        return (v < 10) ? v.toFixed(1).toString() : v.toFixed(0).toString();
    }
    function evaluate_spo2range(str) {
        var v = +str;
        if (str.indexOf("/") >= 0) {
            var args = str.split("/");
            v = +args[0] / +args[1];
        }
        return (v < 0) ? "--" : v.toFixed(1).toString();
    }
    
    
    function render_spo2(res) {
        if (res.isOn === "TRUE") {
            spo2.render(evaluate_spo2(res.spo2));
            spo2_label.render("%" + res.spo2_label.replace(/\"/g, ""));
            spo2_max.render(evaluate_spo2range(res.spo2_max));
            spo2_min.render(evaluate_spo2range(res.spo2_min));
            start_tick();
        } else {
            spo2.hide();
            spo2_label.hide();
            spo2_max.hide();
            spo2_min.hide();
            stop_tick();
        }
    }
    
    function render_alarms(res) {
        if (res.isOn === "TRUE") {
            if (res.spo2_alarm === "off") {
                spo2_alarm.hide();
            } else if (res.spo2_alarm === "alarm") {
                spo2_alarm.renderGlyphicon("glyphicon-bell");
            } else if (res.spo2_alarm === "mute") {
                spo2_alarm.renderGlyphicon("glyphicon-mute");
            }
        } else {
            spo2_alarm.hide();
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
            client.getWebSocket().lastState(event.data);
            var dbg = prettyprintState(event.data.toString());
            d3.select(".dbg").node().innerHTML = new Date() + "<br>" +
                dbg.split("\n").join("<br>") + "<br><br>" + d3.select(".dbg").node().innerHTML;
            var res = event.data.toString();
            if (res.indexOf("(#") === 0) {
                res = stateParser.parse(event.data.toString());
				if (res) {
                    render_spo2(res);
                    render_alarms(res);
                }
            }
        } else { console.log(err); }
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
            stop_tick();
            client.getWebSocket()
                .sendGuiAction("spo2_sensor_data(" + data + ")(" + client.getWebSocket().lastState() + ");", onMessageReceived);
            start_tick();
        }
    });
    
    // TODO: need to understand how to use Buttons
//    var btn_on = new Button("btn_on");
//    btn_on.recallRate(250);
//    btn_on.evts("click");
//    btn_on.functionText("btn_on");
//    var region_btn_on = d3.select(".btn_on");
//    btn_on.element(region_btn_on);
//    btn_on.createImageMap(client.getWebSocket(), onMessageReceived);


    //register event listener for websocket connection from the client
	client.addListener('WebSocketConnectionOpened', function (e) {
		console.log("web socket connected");
		//start pvs process
		client.getWebSocket().startPVSProcess({name: "main.pvs", demoName: "Radical7/pvs"}, function (err, event) {
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
