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
        "cm": "../lib/cm"
    }
});

require(["pvsioweb/Button", "widgets/CursoredDisplay", "plugins/graphbuilder/GraphBuilder", "PVSioWebClient"], function (Button, CursoredDisplay, GraphBuilder, PVSioWebClient) {
    "use strict";
    
    var d3 = require("d3/d3");
    

	var client = PVSioWebClient.getInstance();
    //create a collapsible panel using the pvsiowebclient instance
    var imageHolder = client.createCollapsiblePanel({
        parent: "#content",
        headerText: "Simulation of the Alaris GP infusion pump.",
        showContent: true,
        isDemo: true
    }).style("position", "relative");
    //insert the html into the panel (note that this could have used templates or whatever)
    imageHolder.html('<img src="image.jpg" usemap="#prototypeMap"/>');
    
    var content = imageHolder.append("div").style("position", "absolute").style("top", "0px").style("left", "400px")
					.style("height", "500px").style("width", "800px").attr("class", "dbg");
    
    //append a div that will contain the canvas elements
    //topline
    var w = 120, h = 20;
    content = imageHolder.append("div").style("position", "absolute").style("top", "110px").style("left", "92px")
					.style("height", h + "px").style("width", w + "px").attr("class", "topline_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "topline").attr("class", "topline");
    var topline = new CursoredDisplay("topline", w, h, { font: "Courier New" });
    
    //middisp_drate
    w = 32;
    h = 16;
    content = imageHolder.append("div").style("position", "absolute").style("top", "124px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_drate_label_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_drate_label").attr("class", "middisp_drate_label");
    var middisp_drate_label = new CursoredDisplay("middisp_drate_label", w, h, { font: "Courier New", align: "left" });
    w = 96;
    h = 46;
    content = imageHolder.append("div").style("position", "absolute").style("top", "122px").style("left", "114px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_drate_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_drate").attr("class", "middisp_drate");
    var middisp_drate = new CursoredDisplay("middisp_drate", w, h);

    //middisp_dvtbi
    w = 32;
    h = 16;
    content = imageHolder.append("div").style("position", "absolute").style("top", "168px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dvtbi_label_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dvtbi_label").attr("class", "middisp_dvtbi_label");
    var middisp_dvtbi_label = new CursoredDisplay("middisp_dvtbi_label", w, h, { font: "Courier New", align: "left" });
    w = 60;
    h = 20;
    content = imageHolder.append("div").style("position", "absolute").style("top", "166px").style("left", "132px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dvtbi_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dvtbi").attr("class", "middisp_dvtbi");
    var middisp_dvtbi = new CursoredDisplay("middisp_dvtbi", w, h);


    //middisp_dvol
    w = 32;
    h = 16;
    content = imageHolder.append("div").style("position", "absolute").style("top", "184px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dvol_label_div");
	content.append("canvas").attr("width", 90).attr("height", h).attr("id", "middisp_dvol_label").attr("class", "middisp_dvol_label");
    var middisp_dvol_label = new CursoredDisplay("middisp_dvol_label", 90, h, { font: "Courier New", align: "left" });
    w = 60;
    h = 20;
    content = imageHolder.append("div").style("position", "absolute").style("top", "182px").style("left", "132px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dvol_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dvol").attr("class", "middisp_dvol");
    var middisp_dvol = new CursoredDisplay("middisp_dvol", w, h);


    //middisp_dtime
    w = 32;
    h = 16;
    content = imageHolder.append("div").style("position", "absolute").style("top", "200px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dtime_label_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dtime_label").attr("class", "middisp_dtime_label");
    var middisp_dtime_label = new CursoredDisplay("middisp_dtime_label", w, h, { font: "Courier New", align: "left" });
    w = 60;
    h = 20;
    content = imageHolder.append("div").style("position", "absolute").style("top", "198px").style("left", "132px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dtime_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dtime").attr("class", "middisp_dtime");
    var middisp_dtime = new CursoredDisplay("middisp_dtime", w, h);

    //middisp_dbags
    w = 96;
    h = 16;
    content = imageHolder.append("div").style("position", "absolute").style("top", "124px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dbags9_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dbags9").attr("class", "middisp_dbags9");
    var middisp_dbags9 = new CursoredDisplay("middisp_dbags9", w, h, { align: "left" });
    content = imageHolder.append("div").style("position", "absolute").style("top", "134px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dbags8_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dbags8").attr("class", "middisp_dbags8");
    var middisp_dbags8 = new CursoredDisplay("middisp_dbags8", w, h, { align: "left" });
    content = imageHolder.append("div").style("position", "absolute").style("top", "144px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dbags7_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dbags7").attr("class", "middisp_dbags7");
    var middisp_dbags7 = new CursoredDisplay("middisp_dbags7", w, h, { align: "left" });
    content = imageHolder.append("div").style("position", "absolute").style("top", "154px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dbags6_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dbags6").attr("class", "middisp_dbags6");
    var middisp_dbags6 = new CursoredDisplay("middisp_dbags6", w, h, { align: "left" });
    content = imageHolder.append("div").style("position", "absolute").style("top", "164px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dbags5_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dbags5").attr("class", "middisp_dbags5");
    var middisp_dbags5 = new CursoredDisplay("middisp_dbags5", w, h, { align: "left" });
    content = imageHolder.append("div").style("position", "absolute").style("top", "174px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dbags4_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dbags4").attr("class", "middisp_dbags4");
    var middisp_dbags4 = new CursoredDisplay("middisp_dbags4", w, h, { align: "left" });
    content = imageHolder.append("div").style("position", "absolute").style("top", "184px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dbags3_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dbags3").attr("class", "middisp_dbags3");
    var middisp_dbags3 = new CursoredDisplay("middisp_dbags3", w, h, { align: "left" });
    content = imageHolder.append("div").style("position", "absolute").style("top", "194px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dbags2_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dbags2").attr("class", "middisp_dbags2");
    var middisp_dbags2 = new CursoredDisplay("middisp_dbags2", w, h, { align: "left" });
    content = imageHolder.append("div").style("position", "absolute").style("top", "204px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dbags1_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dbags1").attr("class", "middisp_dbags1");
    var middisp_dbags1 = new CursoredDisplay("middisp_dbags1", w, h, { align: "left" });
    content = imageHolder.append("div").style("position", "absolute").style("top", "124px").style("left", "94px")
					.style("height", h + "px").style("width", w + "px").attr("class", "middisp_dbags0_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "middisp_dbags0").attr("class", "middisp_dbags0");
    var middisp_dbags0 = new CursoredDisplay("middisp_dbags0", w, h, { align: "left" });

    //fndisp1
    w = 40;
    h = 16;
    content = imageHolder.append("div").style("position", "absolute").style("top", "214px").style("left", "96px")
					.style("height", h + "px").style("width", w + "px").attr("class", "fndisp1_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "fndisp1").attr("class", "fndisp1");
    var fndisp1 = new CursoredDisplay("fndisp1", w, h, { font: "Courier New", align: "center" });

    //fndisp2
    content = imageHolder.append("div").style("position", "absolute").style("top", "214px").style("left", "134px")
					.style("height", h + "px").style("width", w + "px").attr("class", "fndisp2_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "fndisp2").attr("class", "fndisp2");
    var fndisp2 = new CursoredDisplay("fndisp2", w, h, { font: "Courier New", align: "center" });

    //fndisp3
    content = imageHolder.append("div").style("position", "absolute").style("top", "214px").style("left", "174px")
					.style("height", h + "px").style("width", w + "px").attr("class", "fndisp3_div");
	content.append("canvas").attr("width", w).attr("height", h).attr("id", "fndisp3").attr("class", "fndisp3");
    var fndisp3 = new CursoredDisplay("fndisp3", w, h, { font: "Courier New", align: "left" });

    //on light
    content = imageHolder.append("div").style("position", "absolute").style("top", "350px").style("left", "198px")
                .style("height", "10px").style("width", "10px").attr("class", "onlight_div");
    var onlight = content.append("canvas").attr("width", 8).attr("height", 8).attr("id", "onlight").attr("class", "onlight");

	//pause light
    content = imageHolder.append("div").style("position", "absolute").style("top", "318px").style("left", "122px")
                .style("height", "10px").style("width", "10px").attr("class", "pauselight_div");
    var pauselight = content.append("canvas").attr("width", 8).attr("height", 8).attr("id", "pauselight").attr("class", "pauselight");

	//run light
    content = imageHolder.append("div").style("position", "absolute").style("top", "291px").style("left", "122px")
                .style("height", "10px").style("width", "10px").attr("class", "runlight_div");
    var runlight = content.append("canvas").attr("width", 8).attr("height", 8).attr("id", "runlight").attr("class", "runlight");

	//register the graph builder plugin -- so we can visualise the interaction
    var gb = GraphBuilder.getInstance();
//    var gb = client.registerPlugin(GraphBuilder);
    
    /**
        parse the raw state string from pvsio process into key value pairs
    */
    function parseState(str) {
        var args = str.split(","), res = {};
        args.forEach(function (d) {
            var t = d.split(":=");
			if (t[1]) { //FIXME!
				res[t[0].replace("(#", "").trim()] = t[1].replace("#)", "").trim();
			}
        });
        return res;
    }
    
    /**
        using this (instead of encouraging the use of eval()) to evaluate the rational numbers send from the pvsio process.
    */
    function evaluate(str) {
        var v = +str;
        if (str.indexOf("/") >= 0) {
            var args = str.split("/");
            v = +args[0] / +args[1];
        }
        return v.toFixed(1).toString();
    }

	var render_onLight = function (res) {
        if (res.onlight === "TRUE") {
            d3.select(".onlight_div").style("display", "block");
            var led = d3.select(".onlight").node();
            var context = led.getContext("2d");
            var centerX = led.width / 2;
            var centerY = led.height / 2;
            context.beginPath();
            context.globalAlpha = 0.9;
            context.arc(centerX, centerY, 4, 0, 2 * Math.PI, false);
            context.fillStyle = "#00FF66"; // light green
            context.fill();
            context.stroke();
        } else {
            d3.select(".onlight_div").style("display", "none");
        }
	};

	var render_pauseLight = function (res) {
        if (res.pauselight === "TRUE") {
            d3.select(".pauselight_div").style("display", "block");
            var led = d3.select(".pauselight").node();
            var context = led.getContext("2d");
            var centerX = led.width / 2;
            var centerY = led.height / 2;
            context.beginPath();
            context.globalAlpha = 0.9;
            context.arc(centerX, centerY, 4, 0, 2 * Math.PI, false);
            context.fillStyle = "rgb(236, 149, 17)"; // light orange
            context.fill();
            context.stroke();
        } else {
            d3.select(".pauselight_div").style("display", "none");
        }
	};

	var render_runLight = function (res) {
        if (res.runlight === "TRUE") {
            d3.select(".runlight_div").style("display", "block");
            var led = d3.select(".runlight").node();
            var context = led.getContext("2d");
            var centerX = led.width / 2;
            var centerY = led.height / 2;
            context.beginPath();
            context.globalAlpha = 0.9;
            context.arc(centerX, centerY, 4, 0, 2 * Math.PI, false);
            context.fillStyle = "#00FF66"; // light green
            context.fill();
            context.stroke();
        } else {
            d3.select(".runlight_div").style("display", "none");
        }
	};
    
    function render_middisp_dbags(res) {
        middisp_dbags9.renderText(res.bagsval9 + " ml");
        middisp_dbags8.renderText(res.bagsval8 + " ml");
        middisp_dbags7.renderText(res.bagsval7 + " ml");
        middisp_dbags6.renderText(res.bagsval6 + " ml");
        middisp_dbags5.renderText(res.bagsval5 + " ml");
        middisp_dbags4.renderText(res.bagsval4 + " ml");
        middisp_dbags3.renderText(res.bagsval3 + " ml");
        middisp_dbags2.renderText(res.bagsval2 + " ml");
        middisp_dbags1.renderText(res.bagsval1 + " ml");
        middisp_dbags0.renderText(res.bagsval0 + " ml");
        var i = 0;
        for (i = 0; i < 10; i++) {
            d3.select(".middisp_dbags" + i + "_div").style("display", "none");
        }
        if (res.middisp_dbags === "TRUE") {
            var hc = ".middisp_dbags" + res.bagscursor + "_div";
            d3.select(hc).style("display", "block");
        }
    }
    
    var tick;
    var start_tick, stop_tick;
    
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
    
    function render_middisp_drate(res) {
        if (res.middisp_drate === "TRUE") {
            d3.select(".middisp_drate_div").style("display", "block");
            d3.select(".middisp_drate_label_div").style("display", "block");
            middisp_drate_label.renderText("RATE");
            middisp_drate.renderNumber(evaluate(res.infusionrate));
        } else {
            d3.select(".middisp_drate_div").style("display", "none");
            d3.select(".middisp_drate_label_div").style("display", "none");
            middisp_drate_label.renderText("");
            middisp_drate.renderText("");
        }
    }
    function render_middisp_dvtbi(res) {
        if (res.middisp_dvtbi === "TRUE" || res.middisp_dnewvtbi === "TRUE") {
            d3.select(".middisp_dvtbi_div").style("display", "block");
            d3.select(".middisp_dvtbi_label_div").style("display", "block");
            if (res.middisp_dvtbi === "TRUE") {
                // move the display section to the bottom
                d3.select(".middisp_dvtbi_label_div").style("top", "166px");
                d3.select(".middisp_dvtbi_div").style("top", "168px");
            } else {
                // move the display section to the top
                d3.select(".middisp_dvtbi_label_div").style("top", "134px");
                d3.select(".middisp_dvtbi_div").style("top", "132px");
            }
            middisp_dvtbi_label.renderText("VTBI");
            middisp_dvtbi.renderNumber(evaluate(res.vtbi));
        } else {
            d3.select(".middisp_dvtbi_div").style("display", "none");
            d3.select(".middisp_dvtbi_label_div").style("display", "none");
            middisp_dvtbi_label.renderText("");
            middisp_dvtbi.renderText("");
        }
    }
    function render_middisp_dvol(res) {
        if (res.middisp_dvol === "TRUE") {
            d3.select(".middisp_dvol_div").style("display", "block");
            d3.select(".middisp_dvol_label_div").style("display", "block");
            if (res.topline.toUpperCase() === "VOLUME") { //Note: the model does not have dnewvol, this is why we need to do this
                // move the display section to the top center
                d3.select(".middisp_dvol_label_div").style("top", "124px").style("left", "118px");
                d3.select(".middisp_dvol_div").style("top", "142px");
                // and show the full label
                middisp_dvol_label.renderText("VOLUME INFUSED");
            } else {
                // move the display section to the bottom left
                d3.select(".middisp_dvol_label_div").style("top", "184px").style("left", "94px");
                d3.select(".middisp_dvol_div").style("top", "182px");
                // and show the short label
                middisp_dvol_label.renderText("VOLUME");
            }
            middisp_dvol.renderNumber(evaluate(res.volumeinfused));
        } else {
            d3.select(".middisp_dvol_div").style("display", "none");
            d3.select(".middisp_dvol_label_div").style("display", "none");
            middisp_dvol_label.renderText("");
            middisp_dvol.renderText("");
        }
    }
    function render_middisp_dtime(res) {
        if (res.middisp_dtime === "TRUE") {
            d3.select(".middisp_dtime_div").style("display", "block");
            d3.select(".middisp_dtime_label_div").style("display", "block");
            middisp_dtime_label.renderText("TIME");
            middisp_dtime.renderNumber(evaluate(res.time));
        } else {
            d3.select(".middisp_dtime_div").style("display", "none");
            d3.select(".middisp_dtime_label_div").style("display", "none");
            middisp_dtime_label.renderText("");
            middisp_dtime.renderText("");
        }
    }
    
    
    function render_topline(res) {
        function topline2string(topline) {
            topline = topline.toUpperCase();
            if (topline === "DISPVTBI") {
                return "VTBI";
            } else if (topline === "DISPKVO") {
                return "KVO";
            }
            return topline;
        }
        if (res.onlight === "TRUE") {
            d3.select(".topline_div").style("display", "block");
            topline.renderText(topline2string(res.topline));
        } else {
            d3.select(".topline_div").style("display", "none");
        }
    }
    
    /**
        function to handle when an output has been received from the server after sending a guiAction
        if the first parameter is truthy, then an error occured in the process of evaluating the gui action sent
    */
    function onMessageReceived(err, event) {
        if (!err) {
            client.getWebSocket().lastState(event.data);
            var res = event.data.toString();
            d3.select(".dbg").node().innerHTML = new Date() + "<br>" + res + "<br><br>" + d3.select(".dbg").node().innerHTML;
            // FIXME: event.type === commandResult when pvsio-web was not able to evaluate the expression (e.g., because of missing pvs function)
            if (res.indexOf("(#") === 0) {
                res = parseState(event.data.toString());
				if (res) {
                    render_onLight(res);
					render_pauseLight(res);
					render_runLight(res);
                    render_topline(res);
                    fndisp1.renderText(fn2string(res.fndisp1));
                    fndisp2.renderText(fn2string(res.fndisp2));
                    fndisp3.renderText(fn2string(res.fndisp3));
                    render_middisp_drate(res);
                    render_middisp_dvtbi(res);
                    render_middisp_dvol(res);
                    render_middisp_dtime(res);
                    render_middisp_dbags(res);
                    if (res["powered_on?"]) {
                        start_tick();
                    } else { stop_tick(); }
                    //disp.renderNumber(evaluate(res.d).toString(), +res.c);
                }
            }
        } else { console.log(err); }
	}
    
    start_tick = function () {
        if (!tick) {
            tick = setInterval(function () {
                client.getWebSocket()
                        .sendGuiAction("alaris_tick(" + client.getWebSocket().lastState() + ");", onMessageReceived);
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
    
    // TODO: need to understand how to use Buttons
//    var btn_on = new Button("btn_on");
//    btn_on.recallRate(250);
//    btn_on.evts("click");
//    btn_on.functionText("btn_on");
//    var region_btn_on = d3.select(".btn_on");
//    btn_on.element(region_btn_on);
//    btn_on.createImageMap(client.getWebSocket(), onMessageReceived);

	d3.select('.btn_fup').on("mousedown", function () {
        stop_tick();
		client.getWebSocket()
            .sendGuiAction("release_btn_fup(press_btn_fup(" +
                           client.getWebSocket().lastState() + "));", onMessageReceived);
        start_tick();
	});
	d3.select(".btn_sup").on("mousedown", function () {
        stop_tick();
		client.getWebSocket()
            .sendGuiAction("release_btn_sup(press_btn_sup(" +
                           client.getWebSocket().lastState() + "));", onMessageReceived);
        start_tick();
	});
	d3.select('.btn_fdown').on("mousedown", function () {
        stop_tick();
		client.getWebSocket()
            .sendGuiAction("release_btn_fdown(press_btn_fdown(" +
                           client.getWebSocket().lastState() + "));", onMessageReceived);
        start_tick();
	});
	d3.select(".btn_sdown").on("mousedown", function () {
        stop_tick();
		client.getWebSocket()
            .sendGuiAction("release_btn_sdown(press_btn_sdown(" +
                           client.getWebSocket().lastState() + "));", onMessageReceived);
        start_tick();
	});
    d3.select(".btn_run").on("click", function () {
        stop_tick();
		client.getWebSocket()
            .sendGuiAction("click_btn_run(" + client.getWebSocket().lastState() + ");", onMessageReceived);
        start_tick();
    });
    d3.select(".btn_pause").on("click", function () {
        stop_tick();
		client.getWebSocket()
            .sendGuiAction("click_btn_pause(" + client.getWebSocket().lastState() + ");", onMessageReceived);
        start_tick();
    });
    d3.select(".btn_query").on("click", function () {
        stop_tick();
		client.getWebSocket()
            .sendGuiAction("click_btn_query(" + client.getWebSocket().lastState() + ");", onMessageReceived);
        start_tick();
    });
    d3.select(".btn_key1").on("click", function () {
        stop_tick();
		client.getWebSocket()
            .sendGuiAction("click_btn_key1(" + client.getWebSocket().lastState() + ");", onMessageReceived);
        start_tick();
    });
    d3.select(".btn_key2").on("click", function () {
        stop_tick();
		client.getWebSocket()
            .sendGuiAction("click_btn_key2(" + client.getWebSocket().lastState() + ");", onMessageReceived);
        start_tick();
    });
    d3.select(".btn_key3").on("click", function () {
        stop_tick();
		client.getWebSocket()
            .sendGuiAction("click_btn_key3(" + client.getWebSocket().lastState() + ");", onMessageReceived);
        start_tick();
    });
    
	    
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
