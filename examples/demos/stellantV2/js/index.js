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
        "widgets/TouchscreenButton",
        "widgets/BasicDisplay",
        "widgets/med/Syringe/Syringe",
        "widgets/LED",
        "widgets/LED2",
        "widgets/ButtonActionsQueue",
        "stateParser",
        "PVSioWebClient"],
    function (TouchscreenButton,
              BasicDisplay,
              Syringe,
              LED,
              LED2,
              ButtonActionsQueue,
              stateParser,
              PVSioWebClient) {
        "use strict";
        var d3 = require("d3/d3");
        var client = PVSioWebClient.getInstance();

        var tick = {
            plunger: null,
            time: null
        };
        function start_tick_plunger() {
            if (!tick.plunger) {
                tick.plunger = setInterval(function () {
                    ButtonActionsQueue.getInstance().queueGUIAction("tick", onMessageReceived);
                }, 500);
            }
        }
        function start_tick_time() {
            if (!tick.time) {
                tick.time = setInterval(function () {
                    ButtonActionsQueue.getInstance().queueGUIAction("tick", onMessageReceived);
                }, 60 * 1000);
            }
        }
        function stop_tick_plunger() {
            if (tick.plunger) {
                clearInterval(tick.plunger);
                tick.plunger = null;
            }
        }
        function stop_tick_time() {
            if (tick.time) {
                clearInterval(tick.time);
                tick.time = null;
            }
        }
        function stop_tick() {
            stop_tick_time();
            stop_tick_plunger();
        }
        function getDate() {
            function format(x) {
                if (parseFloat(x) < 9) {
                    return "0" + x;
                }
                return x.toString();
            }
            var date = new Date();
            return date.getDate() + "/" + format(date.getMonth() + 1) + date.getFullYear()
                        + " " +  format(date.getHours()) + ":" + format(date.getMinutes());// + ":" + format(date.getSeconds());
        }

        var device = {};

        //TODO: transform these displays in proper pvsioweb widgets
        device.plunger_saline = new SegmentDisplay("vol_saline");
        device.plunger_saline.pattern = "###";
        device.plunger_saline.displayAngle = 10;
        device.plunger_saline.digitHeight = 3;
        device.plunger_saline.digitWidth = 2;
        device.plunger_saline.digitDistance = 1;
        device.plunger_saline.segmentWidth = 0.3;
        device.plunger_saline.segmentDistance = 0.1;
        device.plunger_saline.segmentCount = 7;
        device.plunger_saline.cornerType = 3;
        device.plunger_saline.colorOn = "#001fff";
        device.plunger_saline.colorOff = "#1b0033";
        device.plunger_saline.draw();
        device.plunger_saline.setValue("");

        device.plunger_contrast = new SegmentDisplay("vol_contrast");
        device.plunger_contrast.pattern = "###";
        device.plunger_contrast.displayAngle = 10;
        device.plunger_contrast.digitHeight = 3;
        device.plunger_contrast.digitWidth = 2;
        device.plunger_contrast.digitDistance = 1;
        device.plunger_contrast.segmentWidth = 0.3;
        device.plunger_contrast.segmentDistance = 0.1;
        device.plunger_contrast.segmentCount = 7;
        device.plunger_contrast.cornerType = 3;
        device.plunger_contrast.colorOn = "#24ff22";
        device.plunger_contrast.colorOff = "#082605";
        device.plunger_contrast.draw();
        device.plunger_contrast.setValue("");

        device.btn_inc_saline = new TouchscreenButton("inc_saline", {
            top: 612,
            left: 176,
            width: 25,
            height: 25
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent"
        });
        device.btn_inc_contrast = new TouchscreenButton("inc_contrast", {
            top: 612,
            left: 261,
            width: 25,
            height: 25
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent"
        });
        device.btn_dec_saline = new TouchscreenButton("dec_saline", {
            top: 652,
            left: 176,
            width: 25,
            height: 25
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent"
        });
        device.btn_dec_contrast = new TouchscreenButton("dec_contrast", {
            top: 652,
            left: 261,
            width: 25,
            height: 25
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent"
        });

        device.btn_auto_LED = new LED2("btn_auto_LED", {
            top: 631,
            left: 216,
            width: 30,
            height: 30
        }, {
            parent: "stellant"
        });
        device.btn_auto = new TouchscreenButton("btn_auto", {
            top: 627,
            left: 212,
            width: 38,
            height: 38
        }, {
            parent: "stellant",
            callback: onMessageReceived,
            backgroundColor: "transparent", // does this button light up?
            borderRadius: 20,
            opacity: 0.5
        });

        device.btn_manual_LED = new LED2("btn_manual_LED", {
            top: 796,
            left: 214,
            width: 30,
            height: 30
        }, {
            parent: "stellant"
        });
        device.btn_manual = new TouchscreenButton("btn_manual", {
            top: 792,
            left: 210,
            width: 38,
            height: 38
        }, {
            parent: "stellant",
            callback: onMessageReceived,
            backgroundColor: "transparent", // does this button light up?
            borderRadius: 20,
            opacity: 0.5
        });
        device.btn_fUP_saline = new TouchscreenButton("btn_fUP_saline", {
            top: 700,
            left: 118,
            width: 63,
            height: 78
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent",
            borderRadius: 20
        });
        device.btn_fUP_contrast = new TouchscreenButton("btn_fUP_contrast", {
            top: 700,
            left: 277,
            width: 63,
            height: 78
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent",
            borderRadius: 20
        });
        device.btn_sUP_saline = new TouchscreenButton("btn_sUP_saline", {
            top: 780,
            left: 120,
            width: 63,
            height: 60
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent",
            borderRadius: 20
        });
        device.btn_sUP_contrast = new TouchscreenButton("btn_sUP_contrast", {
            top: 780,
            left: 275,
            width: 63,
            height: 60
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent",
            borderRadius: 20
        });
        device.btn_sDOWN_saline = new TouchscreenButton("btn_sDOWN_saline", {
            top: 845,
            left: 120,
            width: 63,
            height: 60
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent",
            borderRadius: 20
        });
        device.btn_sDOWN_contrast = new TouchscreenButton("btn_sDOWN_contrast", {
            top: 845,
            left: 275,
            width: 63,
            height: 60
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent",
            borderRadius: 20
        });
        device.btn_fDOWN_saline = new TouchscreenButton("btn_fDOWN_saline", {
            top: 900,
            left: 118,
            width: 63,
            height: 78
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent",
            borderRadius: 20
        });
        device.btn_fDOWN_contrast = new TouchscreenButton("btn_fDOWN_contrast", {
            top: 900,
            left: 277,
            width: 63,
            height: 78
        }, {
            parent: "stellant",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent",
            borderRadius: 20
        });


        device.btn_fill_saline = new TouchscreenButton("btn_fill_saline", {
            top: 625,
            left: 110,
            width: 63,
            height: 36
        }, {
            parent: "stellant",
            callback: onMessageReceived,
            backgroundColor: "transparent",
            borderRadius: 20,
            opacity: 0.6
        });
        device.btn_fill_contrast = new TouchscreenButton("btn_fill_contrast", {
            top: 627,
            left: 289,
            width: 63,
            height: 36
        }, {
            parent: "stellant",
            callback: onMessageReceived,
            backgroundColor: "transparent",
            borderRadius: 20,
            opacity: 0.6
        });

        device.btn_prime_LED = new LED2("btn_prime_LED", {
            top: 719,
            left: 215,
            width: 30,
            height: 30
        }, {
            parent: "stellant"
        });
        device.btn_prime = new TouchscreenButton("btn_prime", {
            top: 715,
            left: 211,
            width: 38,
            height: 38
        }, {
            parent: "stellant",
            callback: onMessageReceived,
            backgroundColor: "transparent", // does this button light up?
            borderRadius: 20,
            opacity: 0.5
        });

        device.btn_confirm_LED = new LED2("btn_confirm_LED", {
            top: 869,
            left: 213,
            width: 30,
            height: 30
        }, {
            parent: "stellant"
        });
        device.btn_confirm = new TouchscreenButton("btn_confirm", {
            top: 863,
            left: 210,
            width: 38,
            height: 38
        }, {
            parent: "stellant",
            callback: onMessageReceived,
            backgroundColor: "transparent", // does this button light up?
            borderRadius: 20,
            opacity: 0.5
        });

        device.btn_engage_LED = new LED2("btn_engage_LED", {
            top: 960,
            left: 211,
            width: 30,
            height: 30
        }, {
            parent: "stellant"
        });
        device.btn_engage = new TouchscreenButton("btn_engage", {
            top: 953,
            left: 209,
            width: 38,
            height: 38
        }, {
            parent: "stellant",
            callback: onMessageReceived,
            backgroundColor: "transparent", // does this button light up?
            borderRadius: 20,
            opacity: 0.5
        });
        // device.lock = new BasicDisplay("lock", {
        //     top: 913,
        //     left: 220,
        //     width: 24,
        //     height: 24
        // }, {
        //     parent: "stellant",
        //     callback: onMessageReceived,
        //     fontColor: "black",
        //     backgroundColor: "transparent" // does this button light up?
        // });
        device.ready_LED = new LED("ready_LED", {
            top: 916,
            left: 221,
            width: 13,
            height: 13
        }, {
            parent: "stellant",
            visibleWhen: "mode = LOCKED",
            callback: onMessageReceived,
            backgroundColor: "transparent" // does this button light up?
        });
        device.syringe_saline = new Syringe("syringe_saline", {
            top: 21,
            left: 110
        }, {
            needle_style: "blue",
            fluid_color: "aqua",
            large_syringe: true,
            automatic_plunger: true,
            parent: "stellant"
        });
        device.syringe_contrast = new Syringe("syringe_contrast", {
            top: 21,
            left: 270
        }, {
            needle_style: "green",
            large_syringe: true,
            automatic_plunger: true,
            parent: "stellant"
        });
        device.console = {};
        device.console.btn_ACC = new TouchscreenButton("btn_ACC", {
            top: 1075,
            left: 884,
            width: 30,
            height: 32
        }, {
            parent: "stellant_console_base",
            label: "ACC",
            evts: ["press/release"],
            callback: onMessageReceived,
            backgroundColor: "transparent"
        });
        device.console.LED_ACC = new LED("console_LED_ACC", {
            top: 1060,
            left: 886,
            width: 20,
            height: 20
        }, {
            parent: "stellant_console_base",
            color: "orange",
            callback: onMessageReceived,
            backgroundColor: "transparent" // does this button light up?
        });
        // device.console.btn_START = new TouchscreenButton("btn_START", {
        //     top: 1075,
        //     left: 980,
        //     width: 110,
        //     height: 32
        // }, {
        //     parent: "stellant_console_base",
        //     label: "ACC",
        //     evts: ["press/release"],
        //     callback: onMessageReceived,
        //     backgroundColor: "transparent"
        // });
        device.console.btn_confirm_security = new TouchscreenButton("btn_confirm_security", {
            top: 920,
            left: 1100,
            width: 130,
            height: 38
        }, {
            parent: "security_screen",
            softLabel: "Continue",
            fontsize: "14",
            fontColor: "black",
            callback: onMessageReceived,
            backgroundColor: "whitesmoke"
        });
        device.console.rate_contrast = new BasicDisplay("console_rate_contrast", {
            top: 505,
            left: 915,
            width: 80,
            height: 30
        }, {
            parent: "protocol_screen",
            backgroundColor: "#7FE817", // bright green
            fontColor: "black"
        });
        device.console.vol_contrast = new BasicDisplay("console_vol_contrast", {
            top: 505,
            left: 1000,
            width: 80,
            height: 30
        }, {
            parent: "protocol_screen",
            backgroundColor: "#7FE817", // bright green
            fontColor: "black"
        });
        device.console.time_contrast = new BasicDisplay("console_time_contrast", {
            top: 505,
            left: 1085,
            width: 80,
            height: 30
        }, {
            parent: "protocol_screen",
            backgroundColor: "transparent",
            fontColor: "white",
            format: "mm:ss",
            fontsize: 16
        });
        device.console.rate_saline = new BasicDisplay("console_rate_saline", {
            top: 544,
            left: 915,
            width: 80,
            height: 30
        }, {
            parent: "protocol_screen",
            backgroundColor: "cyan",
            fontColor: "black"
        });
        device.console.vol_saline = new BasicDisplay("console_vol_saline", {
            top: 544,
            left: 1000,
            width: 80,
            height: 30
        }, {
            parent: "protocol_screen",
            backgroundColor: "cyan",
            fontColor: "black"
        });
        device.console.time_saline = new BasicDisplay("console_time_saline", {
            top: 544,
            left: 1085,
            width: 80,
            height: 30
        }, {
            parent: "protocol_screen",
            backgroundColor: "transparent",
            fontColor: "white",
            format: "mm:ss",
            fontsize: 16
        });
        device.console.protocol = new BasicDisplay("console_protocol", {
            top: 420,
            left: 740,
            width: 420,
            height: 30
        }, {
            parent: "protocol_screen",
            backgroundColor: "transparent",
            fontColor: "black",
            align: "left",
            fontsize: 26
        });
        device.console.btn_console_lock = new TouchscreenButton("btn_console_lock", {
            top: 945,
            left: 1180,
            width: 160,
            height: 38
        }, {
            parent: "protocol_screen",
            softLabel: "Blocca",
            fontsize: "14",
            fontColor: "black",
            callback: onMessageReceived,
            borderRadius: 20,
            backgroundColor: "gold"
        });
        device.console.btn_console_manage_protocol = new TouchscreenButton("btn_console_manage_protocol", {
            top: 416,
            left: 1180,
            width: 160,
            height: 38
        }, {
            parent: "protocol_screen",
            softLabel: "Gestione protocollo",
            fontsize: "14",
            fontColor: "black",
            callback: onMessageReceived,
            backgroundColor: "whitesmoke"
        });



        // utility function
        function evaluate(str) {
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            return str;
        }

        /**
         function to handle when an output has been received from the server after sending a guiAction
         if the first parameter is truthy, then an error occured in the process of evaluating the gui action sent
         */
        function onMessageReceived(err, event) {
            function prettyprint(v) {
                var x = parseInt(v);
                if (x < 10 ) {
                    return "00" + v;
                } else if (x < 100) {
                    return "0" + v;
                } else return v;
            }
            function render_saline_volume(res) {
                if (res.display_saline === "MIRROR_PLUNGER_LEVEL") {
                    d3.select("#display_saline").node().setAttribute("class", "");
                    device.plunger_saline.setValue(prettyprint(res.plunger_saline));
                } else if (res.display_saline === "MIRROR_TARGET_VOLUME") {
                    d3.select("#display_saline").node().setAttribute("class", "");
                    device.plunger_saline.setValue(prettyprint(res.vol_saline));
                } else if (res.display_saline === "DISP_INIT") {
                    d3.select("#display_saline").node().setAttribute("class", "blink");
                    device.plunger_saline.setValue("---");
                } else {
                    device.plunger_saline.setValue("");
                }
            }
            function render_contrast_volume(res) {
                if (res.display_contrast === "MIRROR_PLUNGER_LEVEL") {
                    d3.select("#display_contrast").node().setAttribute("class", "");
                    device.plunger_contrast.setValue(prettyprint(res.plunger_contrast));
                } else if (res.display_contrast === "MIRROR_TARGET_VOLUME") {
                    d3.select("#display_contrast").node().setAttribute("class", "");
                    device.plunger_contrast.setValue(prettyprint(res.vol_contrast));
                } else if (res.display_contrast === "DISP_INIT") {
                    d3.select("#display_contrast").node().setAttribute("class", "blink");
                    device.plunger_contrast.setValue("---");
                } else {
                    device.plunger_contrast.setValue("");
                }
            }
            function render_button(b, res) {
                if (b === "btn_fill_saline" || b === "btn_fill_contrast") {
                    if (res[b] === "BLINKING") {
                        if (b === "btn_fill_saline") {
                            device[b].render("", { blinking: true, backgroundColor: "cyan" });
                        } else {
                            device[b].render("", { blinking: true, backgroundColor: "#7FE817" }); // Bright Green
                        }
                    } else if (res[b] === "LIGHT") {
                        if (b === "btn_fill_saline") {
                            device[b].render("", { blinking: false, backgroundColor: "deepskyblue" });
                        } else {
                            device[b].render("", { blinking: false, backgroundColor: "#7FE817" });
                        }
                    } else {
                        device[b].render();
                    }
                } else {
                    device[b].render();
                }
                if (device[b + "_LED"]) {
                    if (res[b] === "BLINKING") {
                        device[b + "_LED"].blink();
                    } else if (res[b] === "LIGHT") {
                        device[b + "_LED"].on();
                    } else {
                        device[b + "_LED"].off();
                    }
                }
            }
            function render_lock(res) {
                // if (res.mode === "READY") {
                //     device.lock.renderGlyphicon("glyphicon-lock");
                // } else {
                //     device.lock.hide();
                // }
            }
            function render_protocol(res) {
                if (res.console_protocol === "TOTAL_BODY_BARG") {
                    device.console.protocol.render(res.console_protocol.replace(/_/g," ") + "*");
                }
            }
            function render_date() {
                d3.select("#date").html(getDate());
            }
            function render_syringes(res) {
                if (res.syringe_saline_present === "TRUE") {
                    if (res.bag_saline_present === "TRUE") {
                        device.syringe_saline.containsFluid();
                        device.syringe_saline.render(res.plunger_saline);
                    } else {
                        device.syringe_saline.noFluid();
                        device.syringe_saline.render(res.plunger_saline);
                    }
                } else { device.syringe_saline.hide(); }
                if (res.syringe_contrast_present === "TRUE") {
                    if (res.bag_contrast_present === "TRUE") {
                        device.syringe_contrast.containsFluid();
                        device.syringe_contrast.render(res.plunger_contrast);
                    } else {
                        device.syringe_contrast.noFluid();
                        device.syringe_contrast.render(res.plunger_contrast);
                    }
                } else { device.syringe_contrast.hide(); }

                if (res.mode === "INIT_SYRINGE" || res.mode === "AUTO" || res.mode === "PRIMING" || res.mode === "MANUAL") {
                    stop_tick_time();
                    start_tick_plunger();
                } else if (res.console_screen === "CONSOLE_PROTOCOL") {
                    stop_tick_plunger();
                    start_tick_time();
                } else {
                    stop_tick();
                }
            }
            if (!err) {
                client.getWebSocket().lastState(event.data);
                // rendering
                var res = event.data.toString();
                if (res.indexOf("(#") === 0) {
                    res = stateParser.parse(event.data.toString());
                    if (res) {
                        render_saline_volume(res);
                        render_contrast_volume(res);
                        device.btn_inc_saline.render();
                        device.btn_inc_contrast.render();
                        device.btn_dec_saline.render();
                        device.btn_dec_contrast.render();
                        render_button("btn_fill_saline", res);
                        render_button("btn_fill_contrast", res);
                        render_button("btn_auto", res);
                        render_button("btn_manual", res);
                        render_button("btn_prime", res);
                        render_button("btn_confirm", res);
                        render_button("btn_engage", res);
                        device.ready_LED.render(res);
                        render_lock(res);

                        render_syringes(res);

                        device.btn_sUP_saline.render();
                        device.btn_sUP_contrast.render();
                        device.btn_fUP_saline.render();
                        device.btn_fUP_contrast.render();
                        device.btn_sDOWN_saline.render();
                        device.btn_sDOWN_contrast.render();
                        device.btn_fDOWN_saline.render();
                        device.btn_fDOWN_contrast.render();
                        //-- console buttons & LEDs
                        device.console.btn_ACC.render();
                        if (res.console_LED_ACC === "GREEN") {
                            device.console.LED_ACC.render(res, { color: "#5cb85c" }); // bright green
                        } else {
                            device.console.LED_ACC.render(res, { color: "orange" });
                        }
                        if (res.console_screen === "CONSOLE_SECURITY") {
                            d3.select("#security_screen").attr("style", "display:block");
                            device.console.btn_confirm_security.render();
                        } else {
                            d3.select("#security_screen").attr("style", "display:none");
                            device.console.btn_confirm_security.hide();
                        }
                        if (res.console_screen === "CONSOLE_PROTOCOL") {
                            d3.select("#protocol_screen").attr("style", "display:block");
                            device.console.vol_contrast.render(res);
                            device.console.vol_saline.render(res);
                            device.console.rate_contrast.render(res);
                            device.console.rate_saline.render(res);
                            device.console.time_contrast.render(res);
                            device.console.time_saline.render(res);
                            device.console.btn_console_lock.render(res);
                            device.console.btn_console_manage_protocol.render(res);
                            render_protocol(res);
                            render_date();
                        } else {
                            d3.select("#protocol_screen").attr("style", "display:none");
                            device.console.vol_contrast.hide();
                            device.console.vol_saline.hide();
                            device.console.rate_contrast.hide();
                            device.console.rate_saline.hide();
                            device.console.time_contrast.hide();
                            device.console.time_saline.hide();
                            device.console.protocol.hide();
                            device.console.btn_console_lock.hide();
                            device.console.btn_console_manage_protocol.hide();
                        }
                    }
                }
            } else {
                console.log(err);
            }
        }


        var sim = {
            plug_syringe_saline: true,
            plug_syringe_contrast: true,
            spike_saline_bag: false,
            spike_contrast_bag: false,
            saline_ready: false,
            contrast_ready: false,
            connect_infusion_set: false
        }
        d3.select("#plug_syringe_saline").on("click", function () {
            if (sim.plug_syringe_saline) {
                ButtonActionsQueue.getInstance().queueGUIAction("plug_syringe_saline", onMessageReceived);
                d3.select("#plug_syringe_saline").attr("style", "opacity:0.1;");
                d3.select("#spike_saline_bag").attr("style", "opacity:1;");
                sim.plug_syringe_saline = false;
                sim.spike_saline_bag = true;
            }
        });
        d3.select("#spike_saline_bag").on("click", function () {
            if (sim.spike_saline_bag) {
                ButtonActionsQueue.getInstance().queueGUIAction("plug_bag_saline", onMessageReceived);
                device.syringe_saline.plugVial();
                d3.select("#spike_saline_bag").attr("style", "opacity:0.1;");
                sim.spike_saline_bag = false;
                sim.saline_ready = true;
                if (sim.contrast_ready) {
                    d3.select("#connect_infusion_set").attr("style", "opacity:1;");
                    sim.connect_infusion_set = true;
                }
            }
        });
        d3.select("#plug_syringe_contrast").on("click", function () {
            if (sim.plug_syringe_contrast) {
                ButtonActionsQueue.getInstance().queueGUIAction("plug_syringe_contrast", onMessageReceived);
                d3.select("#plug_syringe_contrast").attr("style", "opacity:0.1;");
                d3.select("#spike_contrast_bag").attr("style", "opacity:1;");
                sim.plug_syringe_contrast = false;
                sim.spike_contrast_bag = true;
            }
        });
        d3.select("#spike_contrast_bag").on("click", function () {
            if (sim.spike_contrast_bag) {
                ButtonActionsQueue.getInstance().queueGUIAction("plug_bag_contrast", onMessageReceived);
                device.syringe_contrast.plugVial();
                d3.select("#spike_contrast_bag").attr("style", "opacity:0.1;");
                sim.spike_contrast_bag = false;
                sim.contrast_ready = true;
                if (sim.saline_ready) {
                    d3.select("#connect_infusion_set").attr("style", "opacity:1;");
                    sim.connect_infusion_set = true;
                }
            }
        });
        d3.select("#connect_infusion_set").on("click", function () {
            if (sim.connect_infusion_set) {
                device.syringe_saline.plugInfusionSet();
                device.syringe_contrast.plugLateralConnectionLine();
                d3.select("#connect_infusion_set").attr("style", "opacity:0.1;");
                sim.connect_infusion_set = false;
            }
        });

        d3.select("#restart_simulation").on("click", function () {
            ButtonActionsQueue.getInstance().queueGUIAction("restart_simulation", onMessageReceived);
        });

        //register event listener for websocket connection from the client
        client.addListener('WebSocketConnectionOpened', function (e) {
            console.log("web socket connected");
            //start pvs process
            client.getWebSocket().startPVSProcess({name: "main.pvs", demoName: "stellantV2/pvs"}, function (err, event) {
                client.getWebSocket().sendGuiAction("init(0);", onMessageReceived);
                d3.select(".demo-splash").style("display", "none");
                d3.select(".content").style("display", "inline-flex");
            });
        }).addListener("WebSocketConnectionClosed", function (e) {
            console.log("web socket closed");
        }).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
            console.log(msg);
        });

        client.connectToServer();

    });
