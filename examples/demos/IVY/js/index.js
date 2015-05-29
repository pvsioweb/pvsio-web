/**
 * 
 * @author Patrick Oladimeji
 * @date 11/25/13 23:10:09 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global require */
require.config({
    baseUrl: "../../client/app",
    paths: {
        d3: "../lib/d3",
		"pvsioweb": "plugins/prototypebuilder",
        "imagemapper": "../lib/imagemapper",
        "text": "../lib/text",
        "lib": "../lib",
        "cm": "../lib/cm"
    }
});

require(["widgets/SingleDisplay", "widgets/Button", "widgets/ButtonActionsQueue", "PVSioWebClient", "plugins/IVY/IVYClient"], function (SingleDisplay, Button, ButtonActionsQueue, PVSioWebClient, IVYClient) {
    "use strict";
    
    var d3 = require("d3/d3");
    
    var ivy = new IVYClient();
    function onWSOpen(data) { console.log("Connected to IVY!"); console.log(data); }
    function onWSClose(data) { console.log("Disconnected from IVY :(("); console.log(data); }
    function onWSError(data) { console.log("Error from IVY :(("); console.log(data); }
    function onIVYMessageReceived(data) { console.log("New message received from IVY!"); console.log(data); }
    ivy.addListener("WebSocketConnectionOpened", onWSOpen);
    ivy.addListener("WebSocketConnectionClosed", onWSClose);
    ivy.addListener("WebSocketConnectionError", onWSError);
    ivy.addListener("ivyMessageReceived", onIVYMessageReceived);
    
    
	var client = PVSioWebClient.getInstance();
    //create a collapsible panel using the pvsiowebclient instance
    var imageHolder = client.createCollapsiblePanel({
        parent: "#content",
        headerText: "Simulation of the data entry system of a medical infusion pump. Please use the up and down keys of the medical device to interact with the device.",
        showContent: true,
        isDemo: true
    }).style("position", "relative");
    //insert the html into the panel (note that this could have used templates or whatever)
    imageHolder.html('<img src="NL_250310_grey_large.png" usemap="#prototypeMap"/>');
//    //append a div that will contain the canvas element
//    var content = imageHolder.append("div").style("position", "absolute").style("top", "232px").style("left", "84px")
//        .style("height", h + "px").style("width", w + "px");
//    //append the canvas element
//	content.append("canvas").attr("width", w).attr("height", h).attr("id", "display");
//	//instantiate the cursored display using the id of the element we just created
//    var disp = new CursoredDisplay("display", w, h);
    
    /**
        parse the raw state string from pvsio process into key value pairs
    */
    function parseState(str) {
        var args = str.split(","), res = {};
        args.forEach(function (d) {
            var t = d.split(":=");
            res[t[0].replace("(#", "").trim()] = t[1].trim();
        });
        return res;
    }
    
    /**
        function to handle when an output has been received from the server after sending a guiAction
        if the first parameter is truthy, then an error occured in the process of evaluating the gui action sent
    */
    function onMessageReceived(err, event) {
        function evaluate(str) {
            if (str.indexOf("/") < 0) { return str; }
            var args = str.split("/");
            return +args[0] / +args[1];
        }        
        if (!err) {
            client.getWebSocket().lastState(event.data);
            var res = event.data.toString();
            if (res.indexOf("(#") === 0) {
                res = parseState(event.data.toString());
                device.display.render(evaluate(res.display));
            }
        } else { console.log(err); }
	}
	
    //bind ui elements with functions for sending messages to the server
    var device = {};
    device.btn_UP = new Button("UP", {left: 204, top: 28}, {callback: onMessageReceived});
    device.btn_DOWN = new Button("UP", {left: 204, top: 86}, {callback: onMessageReceived});
    device.display = new SingleDisplay("topline",
                        { top: 62, left: 50, height: 58, width: 145 }, { backgroundColor: "black" });
    
    d3.select("#startIVY").on("click", function () {
		client.getWebSocket().send({ type: "startIVY" }, function (err, event) {
            if (!err) {
                console.log("IVY started successfully!");
                ivy.connect();
            } else {
                console.log("Error while starting IVY :((");
                console.log(err);
            }
        });
    });
    d3.select("#stopIVY").on("click", function () {
		client.getWebSocket().send({type: "stopIVY"}, function (err) {
            if (!err) {
                console.log("IVY stoppped.");
            } else {
                console.log("Error while stopping IVY...");
                console.log(err);
            }
		});    
    });
    d3.select("#sendCommand").on("click", function () {
		if (ivy) {
            var cmd = d3.select("#ivyCommand").node().value;
            ivy.send(cmd);
        }
    });
    
    //register event listener for websocket connection from the client
	client.addListener('WebSocketConnectionOpened', function (e) {
		console.log("web socket connected");
		//-- uncomment these lines to start the bbraun demo in PVS
//		client.getWebSocket().startPVSProcess({
//            name: "emucharts_MedtronicMinimed530G_th", demoName: "IVY/pvs"
//        }, function (err, event) { });
	}).addListener("WebSocketConnectionClosed", function (e) {
		console.log("web socket closed");
	}).addListener("processExited", function (e) {
		var msg = "Warning!!!\r\nServer process exited. See console for details.";
		console.log(msg);
	});
	
	client.connectToServer();
	
});
