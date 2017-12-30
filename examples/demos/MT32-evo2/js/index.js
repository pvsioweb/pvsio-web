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
        "widgets/core/ButtonEVO",
        "widgets/core/BasicDisplayEVO",
        "widgets/LED",
        "widgets/media/MouseCursor",
        "widgets/media/Stylus",

        "util/playback/Player",
        "widgets/ButtonActionsQueue",
        "stateParser",
        "PVSioWebClient"
    ], function (
        TouchscreenButton,
        BasicDisplay,
        LED,
        MouseCursor,
        Stylus,

        Player,
        ButtonActionsQueue,
        stateParser,
        PVSioWebClient
    ) {
        "use strict";
        var client = PVSioWebClient.getInstance();

        function console_log(msg) {
            // console.log(msg);
        }

        var examData = {}; // stores monitoring data to be sent to ct64

        var tick;
        function single_tick(timeout) {
            setTimeout(function () {
               ButtonActionsQueue.getInstance().queueGUIAction("tick", onMessageReceived);
               tick = null;
           }, timeout);
        }
        function start_tick(opt) {
            opt = opt || {};
            opt.interval = opt.interval || 1000;
            if (!tick) {
                tick = setInterval(function () {
                    ButtonActionsQueue.getInstance().queueGUIAction("tick", onMessageReceived);
                }, opt.interval);
            }
        }
        function stop_tick() {
            if (tick) {
                clearInterval(tick);
                tick = null;
            }
        }
        // function evaluate(str) {
        //     var v = +str;
        //     if (str.indexOf("/") >= 0) {
        //         var args = str.split("/");
        //         v = +args[0] / +args[1];
        //     }
        //     var ans = (v < 100) ? v.toFixed(1).toString() : v.toFixed(0).toString();
        //     return parseFloat(ans);
        // }

        // Function automatically invoked by PVSio-web when the back-end sends states updates
        function onMessageReceived(err, event) {
            if (!err) {
                // get new state
                client.getWebSocket().lastState(event.data);
                // parse and render new state
                var res = event.data.toString();
                if (res.indexOf("(#") === 0) {
                    render(stateParser.parse(res));
                    console_log(res.replace(/\s\s+/g, ' '));
                }
            } else {
                console_log(err);
            }
        }

        var media = {};
        media.mousePointer = new MouseCursor("mousePointer", {
            top:400, left:100
        }, { parent: "ct64_mouse" });
        media.mousePointer.render();
        media.stylus = new Stylus("stylus", {
            top:800, left:60
        }, { parent: "mt32_stylus" });
        // media.stylus.render();

        var mt32 = {};
        mt32.off = new TouchscreenButton("mt32_off", {
            width: 0,
            height: 0,
            top: 0,
            left: 0
        }, {
            softLabel: "",
            customFunctionText: "set_mt32_off",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "device",
            visibleWhen: "false",
            callback: onMessageReceived
        });
        mt32.on_battery = new TouchscreenButton("mt32_on_battery", {
            width: 0,
            height: 0,
            top: 0,
            left: 0
        }, {
            softLabel: "",
            customFunctionText: "set_mt32_on_battery",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "device",
            visibleWhen: "false",
            callback: onMessageReceived
        });
        mt32.charging = new TouchscreenButton("mt32_charging", {
            width: 0,
            height: 0,
            top: 0,
            left: 0
        }, {
            softLabel: "",
            customFunctionText: "set_mt32_charging",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "device",
            visibleWhen: "false",
            callback: onMessageReceived
        });
        mt32.fully_charged = new TouchscreenButton("mt32_fully_charged", {
            width: 0,
            height: 0,
            top: 0,
            left: 0
        }, {
            softLabel: "",
            customFunctionText: "set_mt32_fully_charged",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "device",
            visibleWhen: "false",
            callback: onMessageReceived
        });
        mt32.charging_error = new TouchscreenButton("mt32_charging_error", {
            width: 0,
            height: 0,
            top: 0,
            left: 0
        }, {
            softLabel: "",
            customFunctionText: "set_mt32_charging_error",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "device",
            visibleWhen: "false",
            callback: onMessageReceived
        });


        mt32.umts = new TouchscreenButton("umts", {
            width: 48,
            height: 89,
            top: 130,
            left: 226
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        mt32.wireless = new TouchscreenButton("wireless", {
            width: 48,
            height: 89,
            top: 220,
            left: 226
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        mt32.bluetooth = new TouchscreenButton("bluetooth", {
            width: 48,
            height: 89,
            top: 310,
            left: 226
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        mt32.battery = new TouchscreenButton("battery", {
            width: 48,
            height: 87,
            top: 402,
            left: 226
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        mt32.view_alerts = new TouchscreenButton("view_alerts", {
            width: 46,
            height: 85,
            top: 495,
            left: 228
        }, {
            softLabel: "!",
            backgroundColor: "crimson",
            opacity: "0.8",
            fontsize: 48,
            borderColor: "#000066",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        mt32.leftpanel_back = new TouchscreenButton("back", {
            width: 48,
            height: 94,
            top: 582,
            left: 226
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        mt32.new_exam = new TouchscreenButton("new_exam", {
            width: 178,
            height: 89,
            top: 314,
            left: 277
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "homeScreen",
            callback: onMessageReceived
        });
        mt32.central = new TouchscreenButton("central", {
            width: 180,
            height: 89,
            top: 404,
            left: 366
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "homeScreen",
            callback: onMessageReceived
        });
        mt32.settings = new TouchscreenButton("settings", {
            width: 177,
            height: 89,
            top: 496,
            left: 458
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "homeScreen",
            callback: onMessageReceived
        });
        mt32.ecg12d = new TouchscreenButton("ecg12d", {
            width: 178,
            height: 89,
            top: 314,
            left: 277
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "examsScreen",
            callback: onMessageReceived
        });
        mt32.holter = new TouchscreenButton("holter", {
            width: 178,
            height: 89,
            top: 314,
            left: 459
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "examsScreen",
            callback: onMessageReceived
        });
        mt32.confirm_exams = new TouchscreenButton("confirm_exams", {
            width: 126,
            height: 84,
            top: 592,
            left: 281
        }, {
            softLabel: "",
            customFunctionText: "click_confirm",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "confirmHolterScreen",
            callback: onMessageReceived
        });
        mt32.test_electrodes = new TouchscreenButton("test_electrodes", {
            width: 180,
            height: 89,
            top: 494,
            left: 277
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "examsScreen",
            callback: onMessageReceived
        });
        mt32.download_updates = new TouchscreenButton("download_updates", {
            width: 178,
            height: 89,
            top: 314,
            left: 277
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "centralScreen",
            callback: onMessageReceived
        });
        mt32.upload_results = new TouchscreenButton("upload_results", {
            width: 178,
            height: 89,
            top: 314,
            left: 458
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "centralScreen",
            callback: onMessageReceived
        });
        mt32.terminate_operating_mode = new TouchscreenButton("terminate_operating_mode", {
            width: 178,
            height: 89,
            top: 402,
            left: 277
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "centralScreen",
            callback: onMessageReceived
        });
        mt32.connection_settings = new TouchscreenButton("connection_settings", {
            width: 178,
            height: 89,
            top: 314,
            left: 275
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "settingsScreen",
            callback: onMessageReceived
        });
        mt32.ecg_settings = new TouchscreenButton("ecg_settings", {
            width: 178,
            height: 89,
            top: 314,
            left: 458
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "settingsScreen",
            callback: onMessageReceived
        });
        mt32.security_settings = new TouchscreenButton("security_settings", {
            width: 178,
            height: 89,
            top: 404,
            left: 275
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "settingsScreen",
            callback: onMessageReceived
        });
        mt32.system_settings = new TouchscreenButton("system_settings", {
            width: 178,
            height: 89,
            top: 404,
            left: 458
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "settingsScreen",
            callback: onMessageReceived
        });
        mt32.info = new TouchscreenButton("info", {
            width: 178,
            height: 89,
            top: 492,
            left: 275
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "settingsScreen",
            callback: onMessageReceived
        });
        mt32.confirm_patient_details = new TouchscreenButton("confirm", {
            width: 89,
            height: 89,
            top: 585,
            left: 550
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "white",
            opacity: "0.2",
            parent: "checkPatientScreen",
            callback: onMessageReceived
        });
        mt32.quit_monitoring = new TouchscreenButton("quit", {
            width: 52,
            height: 104,
            top: 492,
            left: 230
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "#000066",
            parent: "monitoringScreen",
            callback: onMessageReceived
        });
        mt32.rec = new TouchscreenButton("rec", {
            width: 52,
            height: 104,
            top: 389,
            left: 230
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "monitoringScreen",
            callback: onMessageReceived
        });
        mt32.repeat_exam = new TouchscreenButton("repeat", {
            width: 342,
            height: 76,
            top: 224,
            left: 287
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "#000066",
            parent: "resultsScreen",
            callback: onMessageReceived
        });
        mt32.view_interpretation = new TouchscreenButton("mt32_view_interpretation", {
            width: 342,
            height: 75,
            top: 305,
            left: 287
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "#000066",
            parent: "resultsScreen",
            callback: onMessageReceived
        });
        mt32.physio = new TouchscreenButton("mt32_physio", {
            width: 342,
            height: 75,
            top: 382,
            left: 287
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "#000066",
            parent: "resultsScreen",
            callback: onMessageReceived
        });
        mt32.tick = new TouchscreenButton("mt32_tick", {
            width: 0,
            height: 0
        }, {
            customFunctionText: "tick",
            callback: onMessageReceived
        });
        mt32.home = new TouchscreenButton("mt32_home", {
            width: 86,
            height: 88,
            top: 588,
            left: 550
        }, {
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "MT32-screens",
            callback: onMessageReceived
        });
        mt32.back_edit_patient = new TouchscreenButton("back_edit_patient", {
            width: 48,
            height: 94,
            top: 128,
            left: 226
        }, {
            softLabel: "",
            functionText: "back",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "leftpanel_mt32EditPatientScreen",
            callback: onMessageReceived
        });
        mt32.edit_patient = new TouchscreenButton("mt32_edit_patient", {
            width: 86,
            height: 88,
            top: 588,
            left: 368
        }, {
            parent: "checkPatientScreen",
            callback: onMessageReceived
        });
        mt32.new_patient = new TouchscreenButton("mt32_new_patient", {
            width: 86,
            height: 88,
            top: 588,
            left: 458
        }, {
            parent: "checkPatientScreen",
            callback: onMessageReceived
        });
        mt32.recordLED = new LED("mt32_recordLED", {
            width: 32,
            height: 32,
            top: 424,
            left: 240
        }, {
            color: "red",
            parent: "monitoringScreen",
            callback: onMessageReceived
        });
        mt32.recPercentage = new BasicDisplay("recPercentage", {
            width: 52,
            height: 32,
            top: 457,
            left: 232
        }, {
            backgroundColor: "transparent",
            fontColor: "white",
            fontSize: 12,
            parent: "monitoringScreen",
            displayKey: "",
            callback: onMessageReceived
        });
        mt32.choose_physio = new TouchscreenButton("mt32_choose_physio", {
            width: 413,
            height: 54,
            top: 150,
            left: 227
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_1 = new TouchscreenButton("mt32_dataentry_1", {
            width: 65,
            height: 65,
            top: 406,
            left: 297
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_2 = new TouchscreenButton("mt32_dataentry_2", {
            width: 65,
            height: 65,
            top: 406,
            left: 365
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_3 = new TouchscreenButton("mt32_dataentry_3", {
            width: 65,
            height: 65,
            top: 406,
            left: 434
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_4 = new TouchscreenButton("mt32_dataentry_4", {
            width: 65,
            height: 65,
            top: 475,
            left: 297
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_5 = new TouchscreenButton("mt32_dataentry_5", {
            width: 65,
            height: 65,
            top: 475,
            left: 365
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_6 = new TouchscreenButton("mt32_dataentry_6", {
            width: 65,
            height: 65,
            top: 475,
            left: 434
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_7 = new TouchscreenButton("mt32_dataentry_7", {
            width: 65,
            height: 65,
            top: 544,
            left: 297
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_8 = new TouchscreenButton("mt32_dataentry_8", {
            width: 65,
            height: 65,
            top: 544,
            left: 365
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_9 = new TouchscreenButton("mt32_dataentry_9", {
            width: 65,
            height: 65,
            top: 544,
            left: 434
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_0 = new TouchscreenButton("mt32_dataentry_0", {
            width: 65,
            height: 65,
            top: 544,
            left: 503
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_POINT = new TouchscreenButton("mt32_dataentry_POINT", {
            width: 65,
            height: 65,
            top: 475,
            left: 503
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.dataentry_confirm = new TouchscreenButton("mt32_dataentry_confirm", {
            width: 202,
            height: 65,
            top: 612,
            left: 229
        }, {
            softLabel: "",
            functionText: "confirm",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "editPhysioScreen",
            callback: onMessageReceived
        });
        mt32.save_results = new TouchscreenButton("mt32_save_results", {
            width: 173,
            height: 88,
            top: 588,
            left: 461
        }, {
            softLabel: "",
            functionText: "confirm",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "resultsScreen",
            callback: onMessageReceived
        });
        mt32.confirm_upload = new TouchscreenButton("mt32_confirm_upload", {
            width: 358,
            height: 88,
            top: 588,
            left: 278
        }, {
            softLabel: "",
            functionText: "confirm",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "sendingResultsScreen",
            callback: onMessageReceived
        });
        mt32.back_interpretation = new TouchscreenButton("back_interpretation", {
            width: 268,
            height: 90,
            top: 588,
            left: 370
        }, {
            softLabel: "",
            functionText: "back",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "white",
            parent: "interpretationScreen",
            callback: onMessageReceived
        });




        var mt32_record_btn = new TouchscreenButton("mt32_record_btn", {
            width: 37,
            height: 194,
            top: 177,
            left: 66
        }, {
            softLabel: "",
            backgroundColor: "black",
            opacity: 0,
            borderColor: "#000066",
            borderWidth: 4,
            borderRadius: 20,
            parent: "MT32-right",
            toggleButton: true,
            callback: onMessageReceived
        });
        var mt32_power_btn = new TouchscreenButton("power_btn", {
            width: 37,
            height: 54,
            top: 709,
            left: 66
        }, {
            softLabel: "",
            backgroundColor: "black",
            opacity: "0",
            borderColor: "#000066",
            borderWidth: 4,
            borderRadius: 20,
            parent: "MT32-right",
            callback: onMessageReceived
        });
        mt32.confirm_poweroff = new TouchscreenButton("confirm_poweroff", {
            width: 132,
            height: 90,
            top: 588,
            left: 277
        }, {
            softLabel: "",
            customFunctionText: "click_confirm",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "confirmPowerOffScreen",
            callback: onMessageReceived
        });
        mt32.confirm_syncdone = new TouchscreenButton("confirm_syncdone", {
            width: 358,
            height: 90,
            top: 588,
            left: 277
        }, {
            softLabel: "",
            customFunctionText: "click_confirm",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "downloadingUpdatesScreen",
            callback: onMessageReceived
        });
        mt32.toggleLP = new TouchscreenButton("mt32_toggleLP", {
            width: 52,
            height: 104,
            top: 177,
            left: 230
        }, {
            softLabel: "",
            backgroundColor: "white",
            opacity: "0",
            borderColor: "#000066",
            parent: "monitoringScreen",
            callback: onMessageReceived
        });
        mt32.toggleHP = new TouchscreenButton("mt32_toggleHP", {
            width: 52,
            height: 104,
            top: 282,
            left: 230
        }, {
            softLabel: "",
            backgroundColor: "white",
            opacity: "0",
            borderColor: "#000066",
            parent: "monitoringScreen",
            callback: onMessageReceived
        });
        mt32.toggle_gain = new TouchscreenButton("mt32_toggle_gain", {
            width: 98,
            height: 74,
            top: 602,
            left: 332
        }, {
            softLabel: "",
            backgroundColor: "white",
            opacity: "0",
            borderColor: "#000066",
            parent: "monitoringScreen",
            callback: onMessageReceived
        });
        mt32.toggle_speed = new TouchscreenButton("mt32_toggle_speed", {
            width: 98,
            height: 74,
            top: 602,
            left: 434
        }, {
            softLabel: "",
            backgroundColor: "white",
            opacity: "0",
            borderColor: "#000066",
            parent: "monitoringScreen",
            callback: onMessageReceived
        });
        mt32.toggle_trace = new TouchscreenButton("mt32_toggle_trace", {
            width: 98,
            height: 74,
            top: 602,
            left: 536
        }, {
            softLabel: "",
            backgroundColor: "white",
            opacity: "0",
            borderColor: "#000066",
            parent: "monitoringScreen",
            callback: onMessageReceived
        });


        // buttons emulating a syncronisation channel between mt32 and ct64
        mt32.device_selected = new TouchscreenButton("device_selected", {
            width: 0,
            height: 0
        }, {
            callback: onMessageReceived
        });


        function viz(id, opt) {
            // console_log("revealing " + id);
            opt = opt || {};
            var elem = d3.select(id);
            if (!elem.empty()) {
                if (elem.style("display") !== "block" || elem.style("opacity") !== 1) {
                    if (opt.fade) {
                        elem.style("opacity", 0).transition().duration(300).style("opacity", 1).style("display", "block");
                    } else {
                        elem.transition().duration(0).style("opacity", 1).style("display", "block");
                    }
                } // else nothing to do, the element is already visible
            } else {
                console.log("Warning, viz could not find elem " + id);
            }
        }
        function hide(id) {
            // console_log("hiding " + id);
            d3.select(id).style("display", "none");
        }
        function hide_all_screens(res) {
            if ((res.mt32.mode !== "MONITORING" && res.mt32.mode !== "RECORDING")) {
                reset_tracing_display();
            }
            // d3.selectAll(".led").style("display", "none");

            // ct64 -- FIXME -- OPTIMIZE-ME!
            // d3.selectAll(".CT64frame").style("display", "none");
            // d3.selectAll(".MT32frame").style("display", "none");
            d3.selectAll(".CT64frame").style("opacity", 0);
            d3.selectAll(".MT32frame").style("opacity", 0);

            d3.selectAll(".CT64frame_inner").style("display", "none");
            d3.selectAll(".CT64Menu").style("display", "none");
            d3.selectAll(".monitorData").style("display", "none");
            d3.selectAll(".ptData").style("display", "none");
        }

        var ct64 = {};
        ct64.login = new TouchscreenButton("login", {
            width: 74,
            height: 36,
            top: 352,
            left: 905
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            borderWidth: "4px",
            parent: "ct64LoginScreen",
            callback: onMessageReceived
        });
        ct64.select_patient = new TouchscreenButton("select_patient", {
            width: 1324,
            height: 32,
            top: 284,
            left: 16
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "patientsScreen",
            toggleButton: true,
            visibleWhen: "ct64.known_patient = TRUE",
            callback: onMessageReceived
        });
        ct64.new_ecg = new TouchscreenButton("new_ecg", {
            width: 120,
            height: 36,
            top: 143,
            left: 1068
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            borderWidth: "4px",
            parent: "patientMGMScreen",
            callback: onMessageReceived
        });
        ct64.new_holter = new TouchscreenButton("new_holter", {
            width: 128,
            height: 36,
            top: 143,
            left: 1197
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            borderWidth: "4px",
            parent: "patientMGMScreen",
            callback: onMessageReceived
        });
        ct64.select_device = new TouchscreenButton("select_device", {
            width: 1229,
            height: 32,
            top: 431,
            left: 63
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            parent: "newMonitoringSessionScreen",
            toggleButton: true,
            callback: onMessageReceived
        });
        ct64.continue = new TouchscreenButton("continue", {
            width: 85,
            height: 34,
            top: 538,
            left: 1200
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            borderWidth: "4px",
            parent: "newMonitoringSessionScreen",
            callback: onMessageReceived
        });
        ct64.continue_holter_config = new TouchscreenButton("continue_holter_config", {
            width: 85,
            height: 34,
            top: 453,
            left: 1200
        }, {
            softLabel: "",
            customFunctionText: "click_continue",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            borderWidth: "4px",
            parent: "holterConfigScreen",
            callback: onMessageReceived
        });
        ct64.new_patient = new TouchscreenButton("new_patient", {
            width: 85,
            height: 36,
            top: 323,
            left: 1250
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            borderWidth: "4px",
            parent: "patientsScreen",
            callback: onMessageReceived
        });
        ct64.patients_screen = new TouchscreenButton("patients_screen", {
            width: 84,
            height: 46,
            top: 10,
            left: 271
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ct64-navigation-bar",
            callback: onMessageReceived
        });
        ct64.monitoring = new TouchscreenButton("monitoring", {
            width: 107,
            height: 46,
            top: 10,
            left: 355
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ct64-navigation-bar",
            callback: onMessageReceived
        });
        ct64.upload_exams = new TouchscreenButton("upload_exams", {
            width: 124,
            height: 46,
            top: 10,
            left: 462
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ct64-navigation-bar",
            callback: onMessageReceived
        });
        ct64.choose_exams_to_be_uploaded = new TouchscreenButton("choose_exams_to_be_uploaded", {
            width: 137,
            height: 38,
            top: 181,
            left: 32
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "uploadExamsScreen",
            callback: onMessageReceived
        });
        ct64.new_monitoring_session = new TouchscreenButton("new_monitoring_session", {
            width: 177,
            height: 36,
            top: 299,
            left: 1158
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ct64-monitoringScreen",
            callback: onMessageReceived
        });
        ct64.date_time_filters = new TouchscreenButton("date_time_filters", {
            width: 1324,
            height: 117,
            top: 78,
            left: 16
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ct64-monitoringScreen",
            callback: onMessageReceived
        });
        ct64.select_exam_data_hub = new TouchscreenButton("select_exam_data_hub", {
            width: 1324,
            height: 32,
            top: 260,
            left: 16
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ct64-monitoringScreen",
            callback: onMessageReceived
        });
        ct64.view_ecg = new TouchscreenButton("view_ecg", {
            width: 155,
            height: 44,
            top: 263,
            left: 33
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ecgMonitoringMenu",
            callback: onMessageReceived
        });
        ct64.HES = new TouchscreenButton("HES", {
            width: 84,
            height: 44,
            top: 263,
            left: 186
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ecgMonitoringMenu",
            callback: onMessageReceived
        });
        ct64.view_physio = new TouchscreenButton("view_physio", {
            width: 144,
            height: 44,
            top: 263,
            left: 268
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ecgMonitoringMenu",
            callback: onMessageReceived
        });
        ct64.write_report = new TouchscreenButton("write_report", {
            width: 134,
            height: 44,
            top: 263,
            left: 416
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ecgMonitoringMenu",
            callback: onMessageReceived
        });
        ct64.select_doctor = new TouchscreenButton("select_doctor", {
            width: 1017,
            height: 36,
            top: 390,
            left: 274
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "requestReportScreen",
            callback: onMessageReceived
        });
        ct64.select_exam_data_holter = new TouchscreenButton("select_exam_data_holter", {
            width: 1324,
            height: 32,
            top: 228,
            left: 16
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ct64-monitoringScreen",
            callback: onMessageReceived
        });
        ct64.select_visit = new TouchscreenButton("select_visit", {
            width: 1019,
            height: 36,
            top: 220,
            left: 274
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "newMonSessionScreen",
            callback: onMessageReceived
        });
        ct64.holter_duration = new TouchscreenButton("holter_duration", {
            width: 993,
            height: 36,
            top: 275,
            left: 284
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "holterConfigScreen",
            callback: onMessageReceived
        });
        ct64.holter_derivation = new TouchscreenButton("holter_derivation", {
            width: 993,
            height: 36,
            top: 326,
            left: 284
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "holterConfigScreen",
            callback: onMessageReceived
        });
        ct64.holter_accelerometer = new TouchscreenButton("holter_accelerometer", {
            width: 28,
            height: 28,
            top: 386,
            left: 277
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "holterConfigScreen",
            callback: onMessageReceived
        });
        ct64.select_ecg2d_new_pt = new TouchscreenButton("select_ecg2d_new_pt", {
            width: 1019,
            height: 46,
            top: 48,
            left: 0
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "visits_menu",
            callback: onMessageReceived
        });
        ct64.continue_yes_no = new TouchscreenButton("continue_yes_no", {
            width: 82,
            height: 34,
            top: 0,
            left: 77
        }, {
            softLabel: "",
            customFunctionText: "click_continue",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "yes_no",
            callback: onMessageReceived
        });
        ct64.browse_medicaltech = new TouchscreenButton("browse_medicaltech", {
            width: 1314,
            height: 22,
            top: 45,
            left: 65
        }, {
            softLabel: "",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "browser-navbar",
            callback: onMessageReceived
        });
        ct64.select_report_status = new TouchscreenButton("select_report_status", {
            width: 1019,
            height: 36,
            top: 1160,
            left: 274
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "compileReportScreen",
            callback: onMessageReceived
        });
        ct64.save_report = new TouchscreenButton("save_report", {
            width: 62,
            height: 36,
            top: 1340,
            left: 1235
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "compileReportScreen",
            callback: onMessageReceived
        });
        ct64.view_patient_profile = new TouchscreenButton("view_patient_profile", {
            width: 144,
            height: 44,
            top: 145,
            left: 34
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "patientMenu",
            callback: onMessageReceived
        });
        ct64.view_medical_report = new TouchscreenButton("view_medical_report", {
            width: 118,
            height: 44,
            top: 145,
            left: 275
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "patientMenu",
            callback: onMessageReceived
        });
        ct64.view_archived_medical_reports = new TouchscreenButton("view_archived_medical_reports", {
            width: 172,
            height: 44,
            top: 145,
            left: 390
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "patientMenu",
            callback: onMessageReceived
        });
        ct64.ct64_back = new TouchscreenButton("ct64_back", {
            width: 156,
            height: 34,
            top: 145,
            left: 32
        }, {
            softLabel: "",
            backgroundColor: "transparent",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "medicalReportScreen",
            callback: onMessageReceived
        });

        var main_tick = new TouchscreenButton("tick", {
            width: 0,
            height: 0
        }, {
            callback: onMessageReceived,
            customFunctionText: "tick"
        });


        function render_ct64_widgets (res) {
            viz("#ct64-navigation-bar");
            for(var key in ct64) {
                ct64[key].render(res);
            }
        }
        function render_mt32_widgets (res) {
            if (res.mt32.mode === "OFF" || res.mt32.mode === "VOICE_RECORDER") {
                for (var key in mt32) {
                    mt32[key].hide();
                }
            } else {
                for (var key in mt32) {
                    mt32[key].render(res);
                }
            }
            if (res.mt32.mo === "NONE") {
                viz("#operating_mode_btn_disabled");
            } else { hide("#operating_mode_btn_disabled"); }
            viz("#offScreen");
        }


        var Demo = { NONE: 0, ACCESS_HOME_PAGE: 1, HUB_NEW_PT: 2, HUB_KNOWN_PT: 3, HOLTER: 4, TERMINATE_HUB_MODE: 5, TERMINATE_HOLTER_MODE: 6,
                     NEW_EXAM_HUB_MODE: 7, TEST_ELECTRODES_HUB: 8, VIEW_EXAMS_HUB: 9, VIEW_INTERPRETATION_HUB: 10, VIEW_INTERPRETATION_HOLTER: 11,
                     REQUEST_REPORT: 12, WRITE_REPORT: 13, VIEW_MEDICAL_REPORT: 14, VIEW_ARCHIVED_MEDICAL_REPORTS: 15,
                     MT32_LED: 16, CREATE_NEW_PATIENT: 17, TRANSFER_DATA_MICROSD: 18, INTRO: 19, POWER_ON_MT32: 20, POWER_OFF_MT32: 21,
                     VIEW_ALERTS: 22, SEND_RESULTS: 23,
                     ECG_EXAM_12DER_KNOWN_PT: 24, HOLTER_EXAM: 25 };
        var demo = Demo.HOLTER_EXAM;

        console_log(mt32.central.getPosition())

        var filterSpeechDuration = 64000;
        var holterParamsSpeechDuration = 15000;
        let warp = 0;//237000 + holterParamsSpeechDuration;//-10000;
        // è à ó
        var player = new Player({ lang: "it-IT" });
        if (demo === Demo.ECG_EXAM_12DER_KNOWN_PT) {
            d3.select("body").style("overflow", "hidden");
            player.load([
                { trans: "#device", transform: "translate(-400px,200px)scale(0.5)", timeStamp: 100, duration: 0 },
                { trans: "#CT64", transform: "translateY(-100px)scale(1.2)", timeStamp: 110, duration: 0 },
                { speak: "Instruzioni per eseguire un esame ECG a 12 derivazioni con un nuovo dispositivo MT32.", timeStamp: 4000 - warp },
                { speak: "Consideriamo in questa fase il caso semplice, in cui i dati anagrafici del paziente sono già presenti sulla centrale CT64.", timeStamp: 12000 - warp },
                { speak: "Fai doppio click sull'anagrafica desiderata.", timeStamp: 18000 - warp },
                { click: ct64.select_patient, timeStamp: 23000 - warp, timeout: 3000, borderColor: "white", classed: "blink2", cursor: { type: media.mousePointer, offset: { top: 0, left: 200 } }},
                { speak: "La centrale mostrerà una pagina che permette di accedere a una lista di azioni e ai dati del paziente.", timeStamp: 26500 - warp },
                { speak: "Dalla lista di azioni disponibili, clicca Nuovo ECG.", timeStamp: 34000 - warp },
                { click: ct64.new_ecg, timeStamp: 36000 - warp, timeout: 2000, borderColor: "white", cursor: { type: media.mousePointer, offset: { top: 0, left: 0 } }},

                { speak: "A questo punto, prendi il dispositivo.", timeStamp: 40000 - warp },
                { trans: "#device", transform: "translate(0px,0px)scale(1)", timeStamp: 41000 - warp, duration: 1000 },
                { speak: "Clicca Centrale.", timeStamp: 43000 - warp },
                { reveal: media.stylus, timeStamp: 43000 - warp },
                { click: mt32.central, timeStamp: 44000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus, offset: { top: 0, left: 120 } }},
                { speak: "Clicca Scarica aggiornamenti.", timeStamp: 47000 - warp },
                { click: mt32.download_updates, timeStamp: 48000 - warp, timeout: 1000, cursor: { type: media.stylus, offset: { top: 0, left: 120} }},
                { hide: media.stylus, timeStamp: 52000 - warp },

                { speak: "Il dispositivo invierà alla centrale i comandi necessari per richiedere l'associazione del dispositivo.", timeStamp: 52000 - warp },
                { speak: "Al termine dell'invio dei comandi, il dispositivo comparirà nella lista di dispositivi noti alla centrale, e resterà in attesa di un comando di conferma.", timeStamp: 60000 - warp },
                { speak: "Per inviare il comando di conferma, seleziona il dispositivo dalla centrale.", timeStamp: 70000 - warp },
                { click: ct64.select_device, timeStamp: 74000 - warp, timeout: 2000, cursor: { type: media.mousePointer, offset: { top: 0, left: 200 } }},
                { speak: "Quindi, clicca Continua.", timeStamp: 76000 - warp },
                { click: ct64.continue, timeStamp: 78000 - warp, timeout: 2000, borderColor: "white", cursor: { type: media.mousePointer, offset: { top: 0, left: 0 } }},
                { speak: "Il dispositivo riceverà la conferma in pochi secondi.", timeStamp: 80000 - warp },
                { speak: "Clicca Conferma sul dispositivo, per completare l'associazione.", timeStamp: 86000 - warp },

                { reveal: media.stylus, timeStamp: 86000 - warp },
                { click: mt32.confirm_syncdone, timeStamp: 89000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus, offset: { top: 0, left: 120} }},
                { speak: "Clicca sul logo médicàl téc per andare alla pagina principale.", timeStamp: 93000 - warp },
                { click: mt32.home, timeStamp: 95000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},

                { speak: "Ora il dispositivo è in modalità operativa ECG12D. HUB, ed è quindi pronto per essere utilizzato per un esame ECG.", timeStamp: 97000 - warp },
                { hide: media.stylus, timeStamp: 103000 - warp },
                { speak: "Prima di cominciare l'esame, collega il cavo ECG a 12 derivazioni al dispositivo MT32.", timeStamp: 108000 - warp },
                { trans: "#device", transform: "translate(-400px,200px)scale(0.5)", timeStamp: 110000 - warp, duration: 1000 },
                { trans: "#MT32-cable10", transform: "translateY(-200px)", timeStamp: 112000 - warp, duration: 1000 },
                { trans: "#device", transform: "translate(0px,0px)scale(1)", timeStamp: 113000 - warp, duration: 1500 },

                { reveal: media.stylus, timeStamp: 114000 - warp },
                { speak: "Poi, clicca Nuovo Esame.", timeStamp: 116500 - warp },
                { click: mt32.new_exam, timeStamp: 118000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Nella nuova pagina, Clicca ECG12D.", timeStamp: 121000 - warp, borderColor: "white" },
                { click: mt32.ecg12d, timeStamp: 124000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Il dispositivo mostrerà l'anagrafica del paziente ricevuta dalla centrale.", timeStamp: 128000 - warp },
                { speak: "Verifica i dati del paziente.", timeStamp: 130000 - warp },
                { speak: "Se necessario, puoi modificare i dati anagrafici direttamente dal dispositivo.", timeStamp: 132000 - warp },
                { click: mt32.edit_patient, timeStamp: 138000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { click: mt32.back_edit_patient, timeStamp: 141800 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Clicca Conferma per iniziare l'esame ECG.", timeStamp: 146000 - warp },
                { click: mt32.confirm_patient_details, timeStamp: 148000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Attendi che l'icona di allerta si spenga. Questo indica l'andata a regime del segnale ECG.", timeStamp: 151000 - warp },
                { move: media.stylus, top: mt32.toggleLP.getPosition().top - 30, left: mt32.toggleLP.getPosition().left + 300, timeStamp: 152000 - warp },

                { speak: "A lato del display, sono disponibili due filtri che possono migliorare la visualizzazione del segnale.", timeStamp: 160000 - warp },
                { move: media.stylus, top: mt32.toggleLP.getPosition().top, left: mt32.toggleLP.getPosition().left, timeStamp: 161000 - warp },
                { speak: "Ad esempio, clicca il primo pulsante per abilitare un filtro passa basso.", timeStamp: 164000 - warp },
                { click: mt32.toggleLP, timeStamp: 169000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Clicca di nuovo il pulsante per disabilitare il filtro.", timeStamp: 171000 - warp },
                { click: mt32.toggleLP, timeStamp: 173000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},

                { move: media.stylus, top: mt32.toggle_gain.getPosition().top, left: mt32.toggle_gain.getPosition().left - 50, timeStamp: 180000 - warp },
                { speak: "Nella parte bassa del display viene visualizzata la frequenza cardiaca.", timeStamp: 180000 - warp },

                { speak: "Il secondo pulsante consente di configurare la sensibilità del segnale.", timeStamp: 185000 - warp },
                { click: mt32.toggle_gain, timeStamp: 187000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { click: mt32.toggle_gain, timeStamp: 190000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { click: mt32.toggle_gain, timeStamp: 194000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},

                { speak: "Il terzo pulsante cambia la velocità di acquisizione del segnale.", timeStamp: 196000 - warp },
                { move: media.stylus, top: mt32.toggle_speed.getPosition().top, left: mt32.toggle_speed.getPosition().left, timeStamp: 197000 - warp },
                { click: mt32.toggle_speed, timeStamp: 198000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { click: mt32.toggle_speed, timeStamp: 202000 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},

                { speak: "In fine, il quarto pulsante consente di visualizzare una terna differente di derivazioni.", timeStamp: 204000 - warp },
                { click: mt32.toggle_trace, timeStamp: 205500 - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Premi a lungo il pulsante per visualizzare una sola derivazione alla volta.", timeStamp: 208000 - warp },
                { click: mt32.toggle_trace, timeStamp: 209500 - warp, timeout: 3000, borderColor: "white", cursor: { type: media.stylus, longpress: true }},
                { speak: "Premi di nuovo a lungo il pulsante per tornare alla visualizzazione di tre derivazioni.", timeStamp: 215000 - warp },
                { click: mt32.toggle_trace, timeStamp: 218000 - warp, timeout: 3000, borderColor: "white", cursor: { type: media.stylus, longpress: true }},

                { speak: "Per cominciare l'acquisizione del segnale ECG, clicca il pulsante rec.", timeStamp: 222000 - warp },
                { click: mt32.rec, timeStamp: 226000 - warp, timeout: 1500, borderColor: "white", cursor: { type: media.stylus }},
                { move: media.stylus, top: mt32.view_interpretation.getPosition().top, left: mt32.view_interpretation.getPosition().left + mt32.view_interpretation.getSize().width, timeStamp: 230000 - warp },

                { speak: "Al termine dell'acquisizione si passa automaticamente alla pagina Risultato.", timeStamp: 231000 - warp },
                { speak: "In questa pagina, puoi visionare l'esito interpretativo dell'acquisizione.", timeStamp: 238000 - warp },
                { click: mt32.view_interpretation, timeStamp: 241500 - warp, timeout: 2000, borderColor: "white", cursor: { type: media.stylus, offset: { top: -10, left: mt32.view_interpretation.getSize().width - 10 } }},
                { click: mt32.back_interpretation, timeStamp: 246500 - warp, timeout: 2000, borderColor: "white", cursor: { type: media.stylus }},

                { speak: "Puoi anche inserire dati fisiologici rilevanti per l'esame.", timeStamp: 186000 + filterSpeechDuration - warp },
                { click: mt32.physio, timeStamp: 188000 + filterSpeechDuration - warp, timeout: 2000, borderColor: "white", cursor: { type: media.stylus, offset: { top: -10, left: mt32.physio.getSize().width - 10 } }},
                { speak: "Seleziona dal menu a tendina il tipo di dato fisiologico che vuoi inserire. Ad esempio, temperatura.", timeStamp: 190000 + filterSpeechDuration - warp, cursor: { type: media.stylus }},
                { click: mt32.choose_physio, timeStamp: 192000 + filterSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus, offset: { top: -10, left: 20} }},
                { click: mt32.choose_physio, timeStamp: 193500 + filterSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus, offset: { top: -10, left: 20} }},

                { speak: "Poi, usa il tastierino numerico per inserire il valore desiderato.", timeStamp: 196000 + filterSpeechDuration - warp },
                { click: mt32.dataentry_3, timeStamp: 198000 + filterSpeechDuration - warp, timeout: 500, borderColor: "white", cursor: { type: media.stylus, speed: 300 }},
                { click: mt32.dataentry_6, timeStamp: 198500 + filterSpeechDuration - warp, timeout: 500, borderColor: "white", cursor: { type: media.stylus, speed: 300 }},
                { click: mt32.dataentry_POINT, timeStamp: 199200 + filterSpeechDuration - warp, timeout: 500, borderColor: "white", cursor: { type: media.stylus, speed: 300 }},
                { click: mt32.dataentry_8, timeStamp: 200000 + filterSpeechDuration - warp, timeout: 500, borderColor: "white", cursor: { type: media.stylus, speed: 300 }},

                { speak: "Infine, clicca Conferma.", timeStamp: 203000 + filterSpeechDuration - warp },
                { click: mt32.dataentry_confirm, timeStamp: 204000 + filterSpeechDuration - warp, timeout: 2000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Se ritieni necessario ripetere l'esame, clicca Ripetizione.", timeStamp: 207000 + filterSpeechDuration - warp },
                { select: mt32.repeat_exam, timeStamp: 208000 + filterSpeechDuration - warp, borderColor: "white", classed: "blink2" },
                { deselect: mt32.repeat_exam, timeStamp: 210000 + filterSpeechDuration - warp, borderColor: "white", classed: "blink2" },
                { speak: "Altrimenti, clicca Conclusione.", timeStamp: 210000 + filterSpeechDuration - warp },
                { click: mt32.save_results, timeStamp: 213000 + filterSpeechDuration - warp, timeout: 2000, borderColor: "white", cursor: { type: media.stylus }},

                { speak: "A questo punto, l'esame è stato salvato sul dispositivo MT32.", timeStamp: 215000 + filterSpeechDuration - warp },
                { speak: "Per caricare l'esame sulla centrale CT64, procedi come segue.", timeStamp: 221000 + filterSpeechDuration - warp },
                { speak: "Clicca Centrale.", timeStamp: 228000 + filterSpeechDuration - warp },
                { click: mt32.central, timeStamp: 230000 + filterSpeechDuration - warp, timeout: 2000, cursor: { type: media.stylus }},

                { move: media.stylus, top: mt32.upload_results.getPosition().top, left: mt32.upload_results.getPosition().left + 100, timeStamp: 233000 + filterSpeechDuration - warp },
                { speak: "Il numero tra parentesi sul pulsante Invio Risultati indica quanti esami sono attualmente salvati sul dispositivo MT32.", timeStamp: 234000 + filterSpeechDuration - warp },
                { click: mt32.upload_results, timeStamp: 241000 + filterSpeechDuration - warp, timeout: 4000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Clicca Invio Risultati. In pochi secondi tutti gli esami saranno caricati sulla centrale.", timeStamp: 243000 + filterSpeechDuration - warp },
                { speak: "Al termine dell'invio, clicca Conferma.", timeStamp: 257000 + filterSpeechDuration - warp },
                { click: mt32.confirm_upload, timeStamp: 260000 + filterSpeechDuration - warp, timeout: 2000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Noterai che il pulsante Invio Risultati è ora disabilitato. Questo indica che tutti gli esami sono stati inviati correttamente alla centrale CT64.", timeStamp: 262000 + filterSpeechDuration - warp },
                { move: media.stylus, timeStamp: 263000 + filterSpeechDuration - warp, top: mt32.upload_results.getPosition().top, left: mt32.upload_results.getPosition().left },
                { hide: media.stylus, timeStamp: 272000 + filterSpeechDuration - warp },
                { speak: "Per visionare gli esami del paziente sulla centrale, seleziona Monitoraggi.", timeStamp: 272000 + filterSpeechDuration - warp },
                { click: ct64.monitoring, timeStamp: 274000 + filterSpeechDuration - warp, timeout: 2000, borderColor: "white", cursor: { type: media.mousePointer, offset: { top:0, left:0}}},
                { speak: "La pagina mostra la lista di tutti gli esami svolti.", timeStamp: 278000 + filterSpeechDuration - warp },
                { speak: "Nella lista, troverai anche l'esame ECG che hai appena inviato.", timeStamp: 285000 + filterSpeechDuration - warp },
                // { move: media.mousePointer, top: ct64.select_exam_data_holter.getPosition().top, left: ct64.select_exam_data_holter.getPosition().left, timeStamp: 286000, duration: 1000 },
                { select: ct64.select_exam_data_holter,  timeStamp: 287000 + filterSpeechDuration - warp, timeout: 16000, classed: "blink2", borderColor: "green", cursor: { type: media.mousePointer, offset: { top:0, left:0}}}
            ])//;.play();
        } else if (demo === Demo.HOLTER_EXAM) {
            d3.select("body").style("overflow", "hidden");
            player.load([
                { trans: "#device", transform: "translate(-400px,200px)scale(0.5)", timeStamp: 100, duration: 0 },
                { trans: "#CT64", transform: "translateY(-100px)scale(1.2)", timeStamp: 110, duration: 0 },
                { speak: "Instruzioni per eseguire un esame Hólter con un nuovo dispositivo MT32.", timeStamp: 6000 - warp },
                { speak: "Per effettuare questo tipo di esame, i dati anagrafici del paziente devono essere già presenti sulla centrale CT64.", timeStamp: 12000 - warp },
                { speak: "Fai doppio click sull'anagrafica del paziente.", timeStamp: 18000 - warp },
                { click: ct64.select_patient, timeStamp: 23000 - warp, timeout: 3000, borderColor: "white", classed: "blink2", cursor: { type: media.mousePointer, offset: { top: 0, left: 200 } }},
                { speak: "La centrale mostrerà una pagina che permette di accedere a una lista di azioni e ai dati del paziente.", timeStamp: 26500 - warp },
                { speak: "Dalla lista di azioni disponibili, clicca Nuovo Hólter.", timeStamp: 34000 - warp },
                { click: ct64.new_holter, timeStamp: 36000 - warp, timeout: 2000, borderColor: "white", cursor: { type: media.mousePointer, offset: { top: 0, left: 0 } }},

                { speak: "Nella nuova pagina, seleziona Durata Esame e Derivazione Precordiale che intendi utilizzare.", timeStamp: 40000 },
                { select: ct64.holter_duration, timeStamp: 40500, timeout: 1000, borderColor: "blue", classed: "blink2", cursor: { type: media.mousePointer } },
                { select: ct64.holter_derivation, timeStamp: 41500, timeout: 1000, borderColor: "blue", classed: "blink2", cursor: { type: media.mousePointer } },
                { speak: "Inotre, seleziona Attiva Accelerómetro se intendi attivare l'acquisizione dei dati acceleromètrici.", timeStamp: 45000 },
                { select: ct64.holter_accelerometer, timeStamp: 46000, timeout: 1000, borderColor: "blue", classed: "blink2", cursor: { type: media.mousePointer } },
                { speak: "Poi, clicca Continua.", timeStamp: 53000 },
                { click: ct64.continue_holter_config, timeStamp: 54000, timeout: 1000, borderColor: "white", cursor: { type: media.mousePointer, offset: { top: 0, left: 0 }} },

                { speak: "A questo punto, prendi il dispositivo.", timeStamp: 40500 + holterParamsSpeechDuration - warp },
                { trans: "#device", transform: "translate(0px,0px)scale(1)", timeStamp: 41500 + holterParamsSpeechDuration - warp, duration: 1000 },
                { speak: "Clicca Centrale.", timeStamp: 44000 + holterParamsSpeechDuration - warp },
                { reveal: media.stylus, timeStamp: 44000 + holterParamsSpeechDuration- warp },
                { click: mt32.central, timeStamp: 45000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus, offset: { top: 0, left: 120 } }},
                { speak: "Clicca Scarica aggiornamenti.", timeStamp: 47000 + holterParamsSpeechDuration - warp },
                { click: mt32.download_updates, timeStamp: 48000 + holterParamsSpeechDuration - warp, timeout: 1000, cursor: { type: media.stylus, offset: { top: 0, left: 120} }},
                { hide: media.stylus, timeStamp: 52000 + holterParamsSpeechDuration - warp },

                { speak: "Il dispositivo invierà alla centrale i comandi necessari per richiedere l'associazione del dispositivo.", timeStamp: 52000 + holterParamsSpeechDuration - warp },
                { speak: "Al termine dell'invio dei comandi, il dispositivo comparirà nella lista di dispositivi noti alla centrale, e resterà in attesa di un comando di conferma.", timeStamp: 60000 + holterParamsSpeechDuration - warp },
                { speak: "Per inviare il comando di conferma, seleziona il dispositivo dalla centrale.", timeStamp: 70000 + holterParamsSpeechDuration - warp },
                { click: ct64.select_device, timeStamp: 74000 + holterParamsSpeechDuration - warp, timeout: 2000, cursor: { type: media.mousePointer, offset: { top: 0, left: 200 } }},
                { speak: "Quindi, clicca Continua.", timeStamp: 76000 + holterParamsSpeechDuration - warp },
                { click: ct64.continue, timeStamp: 78000 + holterParamsSpeechDuration - warp, timeout: 2000, borderColor: "white", cursor: { type: media.mousePointer, offset: { top: 0, left: 0 } }},
                { speak: "Il dispositivo riceverà la conferma in pochi secondi.", timeStamp: 80000 + holterParamsSpeechDuration - warp },
                { speak: "Clicca Conferma sul dispositivo, per completare l'associazione.", timeStamp: 86000 + holterParamsSpeechDuration - warp },

                { reveal: media.stylus, timeStamp: 86000 + holterParamsSpeechDuration - warp },
                { click: mt32.confirm_syncdone, timeStamp: 89000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus, offset: { top: 0, left: 120} }},
                { speak: "Quindi, Clicca sul logo médicàl téc per andare alla pagina principale.", timeStamp: 92500 + holterParamsSpeechDuration - warp },
                { click: mt32.home, timeStamp: 95000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},

                { speak: "Ora il dispositivo è in modalità operativa Hólter, ed è quindi pronto per essere utilizzato.", timeStamp: 97000 + holterParamsSpeechDuration - warp },
                { hide: media.stylus, timeStamp: 103000 + holterParamsSpeechDuration - warp },

                { speak: "Prima di cominciare l'esame, collega il cavo ECG a 7 derivazioni al dispositivo MT32.", timeStamp: 106000 + holterParamsSpeechDuration - warp },
                { trans: "#device", transform: "translate(-400px,200px)scale(0.5)", timeStamp: 110000 + holterParamsSpeechDuration - warp, duration: 1000 },
                { trans: "#MT32-cable5", transform: "translateY(-200px)", timeStamp: 112000 + holterParamsSpeechDuration - warp, duration: 1000 },
                { trans: "#device", transform: "translate(0px,0px)scale(1)", timeStamp: 113000 + holterParamsSpeechDuration - warp, duration: 1500 },

                { reveal: media.stylus, timeStamp: 114000 + holterParamsSpeechDuration - warp },
                { speak: "Poi, clicca Nuovo Esame.", timeStamp: 116500 + holterParamsSpeechDuration - warp },
                { click: mt32.new_exam, timeStamp: 118000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Nella nuova pagina, Clicca Hólter.", timeStamp: 121000 + holterParamsSpeechDuration - warp, borderColor: "white" },
                { click: mt32.holter, timeStamp: 124000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Il dispositivo mostrerà l'anagrafica del paziente ricevuta dalla centrale.", timeStamp: 127500 + holterParamsSpeechDuration - warp },
                { speak: "Verifica i dati del paziente.", timeStamp: 130000 + holterParamsSpeechDuration - warp },
                { speak: "Se necessario, puoi modificare i dati anagrafici direttamente dal dispositivo.", timeStamp: 132000 + holterParamsSpeechDuration - warp },
                { click: mt32.edit_patient, timeStamp: 138000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { click: mt32.back_edit_patient, timeStamp: 141800 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Clicca Conferma per confermare i dati del paziente.", timeStamp: 145500 + holterParamsSpeechDuration - warp },
                { click: mt32.confirm_patient_details, timeStamp: 148000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},

                { speak: "Attendi che l'icona di allerta si spenga.", timeStamp: 150000 + holterParamsSpeechDuration - warp },
                { move: media.stylus, top: mt32.toggleLP.getPosition().top - 30, left: mt32.toggleLP.getPosition().left + 300, timeStamp: 152000 + holterParamsSpeechDuration - warp },
                { speak: "Questo indica l'andata a regime del segnale ECG.", timeStamp: 155000 + holterParamsSpeechDuration - warp },

                { speak: "A lato del display, sono disponibili due filtri che possono migliorare la visualizzazione del segnale.", timeStamp: 160000 + holterParamsSpeechDuration - warp },
                { move: media.stylus, top: mt32.toggleLP.getPosition().top, left: mt32.toggleLP.getPosition().left, timeStamp: 161000 + holterParamsSpeechDuration - warp },
                { speak: "Ad esempio, clicca il primo pulsante per abilitare un filtro passa basso.", timeStamp: 164000 + holterParamsSpeechDuration - warp },
                { click: mt32.toggleLP, timeStamp: 169000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Clicca di nuovo il pulsante per disabilitare il filtro.", timeStamp: 171000 + holterParamsSpeechDuration - warp },
                { click: mt32.toggleLP, timeStamp: 173000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},

                { move: media.stylus, top: mt32.toggle_gain.getPosition().top, left: mt32.toggle_gain.getPosition().left - 50, timeStamp: 180000 + holterParamsSpeechDuration - warp },
                { speak: "Nella parte bassa del display viene visualizzata la frequenza cardiaca.", timeStamp: 180000 + holterParamsSpeechDuration - warp },

                { speak: "Il secondo pulsante consente di configurare la sensibilità del segnale.", timeStamp: 185000 + holterParamsSpeechDuration - warp },
                { click: mt32.toggle_gain, timeStamp: 187000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { click: mt32.toggle_gain, timeStamp: 190000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { click: mt32.toggle_gain, timeStamp: 194000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},

                { speak: "Il terzo pulsante cambia la velocità di acquisizione del segnale.", timeStamp: 196000 + holterParamsSpeechDuration - warp },
                { move: media.stylus, top: mt32.toggle_speed.getPosition().top, left: mt32.toggle_speed.getPosition().left, timeStamp: 197000 + holterParamsSpeechDuration - warp },
                { click: mt32.toggle_speed, timeStamp: 198000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { click: mt32.toggle_speed, timeStamp: 202000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},

                { speak: "In fine, il quarto pulsante consente di visualizzare una terna differente di derivazioni.", timeStamp: 204000 + holterParamsSpeechDuration - warp },
                { click: mt32.toggle_trace, timeStamp: 205500 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Premi a lungo il pulsante per visualizzare una sola derivazione alla volta.", timeStamp: 208000 + holterParamsSpeechDuration - warp },
                { click: mt32.toggle_trace, timeStamp: 209500 + holterParamsSpeechDuration - warp, timeout: 3000, borderColor: "white", cursor: { type: media.stylus, longpress: true }},
                { speak: "Premi di nuovo a lungo il pulsante per tornare alla visualizzazione di tre derivazioni.", timeStamp: 215000 + holterParamsSpeechDuration - warp },
                { click: mt32.toggle_trace, timeStamp: 218000 + holterParamsSpeechDuration - warp, timeout: 3000, borderColor: "white", cursor: { type: media.stylus, longpress: true }},

                { speak: "Dopo aver selezionato i filtri che ritieni necessari, clicca il pulsante rec.", timeStamp: 222000 + holterParamsSpeechDuration - warp },
                { click: mt32.rec, timeStamp: 226000 + holterParamsSpeechDuration - warp, timeout: 1500, borderColor: "white", cursor: { type: media.stylus }},
                { move: media.stylus, top: mt32.view_interpretation.getPosition().top, left: mt32.view_interpretation.getPosition().left + mt32.view_interpretation.getSize().width, timeStamp: 230000 + holterParamsSpeechDuration - warp },

                { speak: "Comparirà una finestra di conferma.", timeStamp: 231000 + holterParamsSpeechDuration - warp },
                { speak: "Clicca conferma, per cominciare la registrazione Hólter.", timeStamp: 234000 + holterParamsSpeechDuration - warp },
                { click: mt32.confirm_exams, timeStamp: 237000 + holterParamsSpeechDuration - warp, timeout: 1000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Il display del dispositivo si spegnerà, e la registrazione Hólter verrà effettuata per la durata impostata in fase di configurazione dell'esame. In questo caso, 24 ore.", timeStamp: 238000 + holterParamsSpeechDuration - warp },
                { hide: media.stylus, timeStamp: 240000 + holterParamsSpeechDuration - warp },

                { speak: "Per interrompere anticipatamente l'esame Hólter, premi a lungo il pulsante di accensione del dispositivo.", timeStamp: 252000 + holterParamsSpeechDuration - warp },
                { trans: ".MT32-case-rightside", selectAll: true, transform: "rotateY(22deg)translateZ(-10px)translateY(-12px)skewY(10deg)scaleY(0.9)", duration: 200, timeStamp: 255000 + holterParamsSpeechDuration - warp },
                { trans: "#MT32-screens", transform: "rotateY(-22deg)translateZ(-183px)translateY(-112px)translateX(140px)skewY(-10deg)scaleY(1.4)", duration: 1600, timeStamp: 256000 + holterParamsSpeechDuration - warp },
                { trans: ".MT32-case-rightside", selectAll: true, transform: "rotateY(0deg)translateZ(0px)translateY(0px)skewY(0deg)scaleY(1)", duration: 1600, timeStamp: 256000 + holterParamsSpeechDuration - warp },
                { trans: "#MT32-cable5", transform: "rotateY(-22deg) translateZ(-183px) translateY(-10px) translateX(-19px) skewY(-10deg) scaleY(1.4)", duration: 1400, timeStamp: 256000 + holterParamsSpeechDuration - warp },
                { select: mt32_power_btn, timeStamp: 258000 + holterParamsSpeechDuration - warp, borderColor: "white", classed: "blink" },
                { deselect: mt32_power_btn, timeStamp: 261000 + holterParamsSpeechDuration - warp, borderColor: "white", classed: "blink" },

                { speak: "Durante l'esame, puoi eseguire brevi registrazioni vocali premendo a lungo il pulsante Voice Recorder che si trova a lato del dispositivo.", timeStamp: 262000 + holterParamsSpeechDuration - warp },
                { click: mt32_record_btn, timeStamp: 266000 + holterParamsSpeechDuration - warp, timeout: 5000, borderColor: "white", classed: "blink" },
                { speak: "Quando il LED frontale del dispositivo diventa blu lampeggiante, la registrazione vocale è attiva.", timeStamp: 270000 + holterParamsSpeechDuration - warp },
                { reveal: "#record_voice", timeStamp: 277000 + holterParamsSpeechDuration - warp },
                { speak: "Le registrazioni vocali hanno una durata predefinita di 20 secondi.", timeStamp: 277000 + holterParamsSpeechDuration - warp },
                { hide: "#record_voice", timeStamp: 289000 + holterParamsSpeechDuration - warp },
                { speak: "Per terminare anticipatamente la registrazione vocale, premi di nuovo a lungo il pulsante Voice Recorder.", timeStamp: 290000 + holterParamsSpeechDuration - warp },
                { click: mt32_record_btn, timeStamp: 290000 + holterParamsSpeechDuration - warp, timeout: 5000, borderColor: "white", classed: "blink" },

                { trans: ".MT32-case-rightside", selectAll: true, transform: "rotateY(22deg)translateZ(-10px)translateY(-12px)skewY(10deg)scaleY(0.9)", duration: 1400, timeStamp: 296000 + holterParamsSpeechDuration - warp },
                { trans: "#MT32-screens", transform: "rotateY(0deg)translateZ(0px)translateY(0px)translateX(0px)skewY(0deg)scaleY(1)", duration: 1600, timeStamp: 296000 + holterParamsSpeechDuration - warp },
                { trans: "#MT32-cable5", transform: "rotateY(0deg) translateZ(0px) translateY(-200px) translateX(0px) skewY(0deg) scaleY(1)", duration: 1600, timeStamp: 296000 + holterParamsSpeechDuration - warp },

                { speak: "Quando la registrazione Hólter è completa, il dispositivo riaccenderà il display e mostrerà una pagina di notifica.", timeStamp: 298000 + holterParamsSpeechDuration - warp },
                { click: mt32.tick, timeStamp: 300000 + holterParamsSpeechDuration - warp },
                { speak: "Dopo 5 secondi, il dispositivo andrà automaticamente sulla home page.", timeStamp: 304000 + holterParamsSpeechDuration - warp },
                { click: mt32.tick, timeStamp: 309000 + holterParamsSpeechDuration - warp },
                //-----
                { speak: "A questo punto, l'esame è stato salvato sul dispositivo MT32.", timeStamp: 315000 + holterParamsSpeechDuration - warp },
                { speak: "Per caricare l'esame sulla centrale CT64, procedi come segue.", timeStamp: 321000 + holterParamsSpeechDuration - warp },
                { speak: "Clicca Centrale.", timeStamp: 328000 + holterParamsSpeechDuration - warp },
                { click: mt32.central, timeStamp: 330000 + holterParamsSpeechDuration - warp, timeout: 2000, cursor: { type: media.stylus }},

                { move: media.stylus, top: mt32.upload_results.getPosition().top, left: mt32.upload_results.getPosition().left + 100, timeStamp: 333000 + holterParamsSpeechDuration - warp },
                { speak: "Il numero tra parentesi sul pulsante Invio Risultati indica quanti esami sono attualmente salvati sul dispositivo MT32.", timeStamp: 334000 + holterParamsSpeechDuration - warp },
                { click: mt32.upload_results, timeStamp: 341000 + holterParamsSpeechDuration - warp, timeout: 4000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Clicca Invio Risultati. In pochi secondi tutti gli esami saranno caricati sulla centrale.", timeStamp: 343000 + holterParamsSpeechDuration - warp },
                { speak: "Al termine dell'invio, clicca Conferma.", timeStamp: 357000 + holterParamsSpeechDuration - warp },
                { click: mt32.confirm_upload, timeStamp: 360000 + holterParamsSpeechDuration - warp, timeout: 2000, borderColor: "white", cursor: { type: media.stylus }},
                { speak: "Noterai che il pulsante Invio Risultati è ora disabilitato. Questo indica che tutti gli esami sono stati inviati correttamente alla centrale CT64.", timeStamp: 362000 + holterParamsSpeechDuration - warp },
                { move: media.stylus, timeStamp: 363000 + holterParamsSpeechDuration - warp, top: mt32.upload_results.getPosition().top, left: mt32.upload_results.getPosition().left },
                { hide: media.stylus, timeStamp: 372000 + holterParamsSpeechDuration - warp },
                { speak: "Per visionare gli esami del paziente sulla centrale, seleziona Monitoraggi.", timeStamp: 372000 + holterParamsSpeechDuration - warp },
                { click: ct64.monitoring, timeStamp: 374000 + holterParamsSpeechDuration - warp, timeout: 2000, borderColor: "white", cursor: { type: media.mousePointer, offset: { top:0, left:0}}},
                { speak: "La pagina mostra la lista di tutti gli esami svolti.", timeStamp: 378000 + holterParamsSpeechDuration - warp },
                { speak: "Nella lista, troverai anche l'esame ECG che hai appena inviato.", timeStamp: 384000 + holterParamsSpeechDuration - warp },
                { select: ct64.select_exam_data_holter,  timeStamp: 387000 + holterParamsSpeechDuration - warp, timeout: 16000, classed: "blink2", borderColor: "green", cursor: { type: media.mousePointer, offset: { top:0, left:0}}}
            ]);//.play();
        }


        var timers = {};
        timers.curr_speed = 25;

        // emulates a communication link between ct64 and mt32
        var comm = {};

        function render(res) {
            hide_all_screens(res);
            render_ct64_widgets(res);
            render_mt32_widgets(res);

            // to improve performance, tick is activated only when necessary
            if (res.mt32.mode === "POWERING_OFF" || res.mt32.mode === "SAVE_RESULTS") {
                start_tick();
            } else if (res.mt32.mode === "MONITORING" || res.mt32.mode === "RECORDING") {
                if (res.mt32.speed === "25") {
                    if (timers.curr_speed === "50") {
                        stop_tick();
                    }
                    start_tick({ interval: 1000 });
                    timers.curr_speed = "25";
                } else {
                    if (timers.curr_speed === "25") {
                        stop_tick();
                    }
                    start_tick({ interval: 400 });
                    timers.curr_speed = "50";
                }
            } else if (res.ct64.mode === "WAITING_RESULTS") {
                start_tick();
            } else { stop_tick(); }

            //-- mt32
            if (res.mt32.mode === "HOME") {
                viz("#homeScreen");
                // mt32.home.hide();
            } else if (res.mt32.mode === "EXAMS") {
                viz("#examsScreen");
                if (res.mt32.mo === "HUB") {
                    hide("#examsDISABLED");
                    viz("#examsHUB");
                    viz("#div_ecg12d");
                    hide("#examsHOLTER");
                    hide("#div_holter");
                    // mt32.ecg12d.render();
                    // mt32.test_electrodes.render();
                } else if (res.mt32.mo === "HOLTER") {
                    hide("#examsDISABLED");
                    hide("#examsHUB");
                    hide("#div_ecg12d");
                    viz("#examsHOLTER");
                    viz("#div_holter");
                    // mt32.holter.render();
                    // mt32.test_electrodes.render();
                } else {
                    // mode:none
                    viz("#examsDISABLED");
                    hide("#examsHUB");
                    hide("#div_ecg12d");
                    hide("#examsHOLTER");
                    hide("#div_holter");
                }
            } else if (res.mt32.mode === "CENTRAL") {
                viz("#centralScreen");
                // mt32.download_updates.render();
                // mt32.upload_results.render();
                // mt32.terminate_operating_mode.render();
                if (res.mt32.results_saved === "TRUE") {
                    hide("#send_results_btn_disabled");
                    d3.select("#nresults").text("(1)");
                } else {
                    viz("#send_results_btn_disabled");
                    d3.select("#nresults").text("");
                }
            } else if (res.mt32.mode === "SETTINGS") {
                viz("#settingsScreen");
                // mt32.connection_settings.render();
                // mt32.ecg_settings.render();
                // mt32.security_settings.render();
                // mt32.system_settings.render();
                // mt32.info.render();
            } else if (res.mt32.mode === "TEST") {
                viz("#testScreen");
                if (res.mt32.mo === "HUB") {
                    viz("#testHUB");
                    viz("#div_electrodes_status");
                    hide("#testHOLTER");
                    hide("#div_electrodes_status_holter");
                } else if (res.mt32.mo === "HOLTER") {
                    hide("#testHUB");
                    hide("#div_electrodes_status");
                    viz("#testHOLTER");
                    viz("#div_electrodes_status_holter");
                }
            } else if (res.mt32.mode === "CHECK_PATIENT") {
                viz("#checkPatientScreen");
                mt32.home.hide();
                // mt32.confirm_patient_details.render();
            } else if (res.mt32.mode === "MONITORING" || res.mt32.mode === "RECORDING") {
                if (res.mt32.rec === "0") {
                    examData.start = date.text() + " " + hhmmss.text();
                }
                viz("#monitoringScreen");
                mt32.home.hide();
                // mt32.quit_monitoring.render();
                update_tracing_display(res);
                if (res.mt32.mode === "RECORDING") {
                    mt32.recordLED.reveal();
                    mt32.recPercentage.render(res.mt32.rec + "%");
                } else {
                    mt32.recordLED.hide();
                    mt32.recPercentage.hide();
                }
                //set filters
                if (res.mt32.hpfilter === "TRUE") {
                    viz("#hipassfilter_on");
                } else { hide("#hipassfilter_on"); }
                if (res.mt32.lpfilter === "TRUE") {
                    viz("#lowpassfilter_on");
                } else { hide("#lowpassfilter_on"); }
                // set gain
                if (res.mt32.gain === "GAIN_5") {
                    d3.select("#div_gain").text("5");
                } else if (res.mt32.gain === "GAIN_10") {
                    d3.select("#div_gain").text("10");
                } else if (res.mt32.gain === "GAIN_20") {
                    d3.select("#div_gain").text("20");
                }
                // set speed
                d3.select("#div_speed").text(res.mt32.speed);
                // set trace type
                if (res.mt32.trace === "v2") {
                    viz("#traceV2");
                    hide("#traceV1V2V3");
                    hide("#traceOneTwoThree");
                } else if (res.mt32.trace === "v1v2v3") {
                    viz("#traceV1V2V3");
                    hide("#traceV2");
                    hide("#traceOneTwoThree");
                } else { // res.mt32.trace === "v1v2v3"
                    viz("#traceOneTwoThree");
                    hide("#traceV1V2V3");
                    hide("#traceV2");
                }

            } else if (res.mt32.mode === "RESULTS") {
                examData.stop = date.text() + " " + hhmmss.text();
                viz("#resultsScreen");
                mt32.home.hide();
                // mt32.repeat_exam.render();
                // mt32.view_interpretation.render();
                // mt32.physio.render();
                if (isNaN(parseFloat(res.mt32.dataentry.replace(/"/g,'')))) {
                    d3.select("#hasphysio").text("Assenti");
                } else {
                    d3.select("#hasphysio").text("Presenti");
                }
            } else if (res.mt32.mode === "CONFIRM_REC") {
                viz("#confirmHolterScreen");
                mt32.home.hide();
                // mt32.confirm_exams.render();
            } else if (res.mt32.mode === "CONFIRM_POWER_OFF") {
                viz("#confirmPowerOffScreen");
                mt32.home.hide();
                // mt32.confirm_poweroff.render();
            } else if (res.mt32.mode === "POWERING_OFF") {
                viz("#poweringOffScreen");
                mt32.home.hide();
            } else if (res.mt32.mode === "VIEW_ALERTS") {
                viz("#viewAlertsScreen");
            } else if (res.mt32.mode === "SENDING_RESULTS" || res.mt32.mode === "RESULTS_SENT") {
                viz("#sendingResultsScreen");
                d3.select("#div_confirm_cancel_send").text("Annulla");
                mt32.home.hide();
                if (!timers.send_results) {
                    timers.send_results = new Player().load([
                        { input: "#res_send_1", value: "- Avvio applicazione", timeStamp: 500, lineFeed: true },
                        { input: "#res_send_2", value: "- Accensione modulo cellulare", timeStamp: 1000, lineFeed: true },
                        { input: "#res_send_3", value: "- Attesa registrazione SIM", timeStamp: 2000, lineFeed: true },
                        { click: mt32.tick, timeStamp: 2500 },
                        { input: "#res_send_4", value: "- Avvio connessione dati", timeStamp: 6000, lineFeed: true },
                        { click: mt32.tick, timeStamp: 6500 },
                        { input: "#res_send_5", value: "- Invio esami", timeStamp: 8000, lineFeed: true },
                        { input: "#res_send_6", value: "- 8828285a-c395-148d-e55c-abc170102009", timeStamp: 9000, lineFeed: true },
                        { input: "#res_send_7", value: "- 8828285a-c395-148d-e55c-abc170102009.log", timeStamp: 9300, lineFeed: true },
                        { input: "#res_send_8", value: "- 8828285a-c395-148d-e55c-abc170102009-00000732.hecg", timeStamp: 9600, lineFeed: true },
                        { input: "#res_send_9", value: "- 8828285a-c395-148d-e55c-abc170102009-00000295.hecg", timeStamp: 9900, lineFeed: true },
                        { input: "#res_send_10", value: "- 8828285a-c395-148d-e55c-abc170102009-00000732.hacc", timeStamp: 10200, lineFeed: true },
                        { click: mt32.tick, timeStamp: 11000 }
                    ]).play();
                }
                if (res.mt32.mode === "SENDING_RESULTS" && res.mt32.umts === "UMTS_TX") {
                    viz("#send_spinner", { fade: true });
                }

                if (res.mt32.mode === "RESULTS_SENT") {
                    hide("#send_spinner");
                    d3.select("#div_confirm_cancel_send").text("Conferma");
                    // the following writes the results in the first line of the ct64 table
                    d3.select("#results_line1-start").text(examData.start);
                    d3.select("#results_line1-stop").text(examData.stop);
                    if (res.mt32.mo === "HOLTER") {
                        d3.select("#results_line1-type").text("HOLTER");
                    } else {
                        d3.select("#results_line1-type").text("ECG12D");
                    }
                    d3.select("#results_line1").classed("animated flash", true);
                    setTimeout(function () {
                        d3.select("#results_line1").classed("animated flash", false);
                    }, 2000);
                }
            } else if (res.mt32.mode === "DOWNLOADING_UPDATES") {
                viz("#downloadingUpdatesScreen");
                mt32.home.hide();
                if (!timers.updates_player) {
                    timers.updates_player = new Player().load([
                        { input: "#send_1", value: "- Avvio applicazione", timeStamp: 500, lineFeed: true },
                        { input: "#send_2", value: "- Accensione modulo cellulare", timeStamp: 600, lineFeed: true },
                        { click: mt32.tick, timeStamp: 2000 },
                        { input: "#send_3", value: "- Attesa registrazione SIM", timeStamp: 5000, lineFeed: true },
                        { click: mt32.tick, timeStamp: 7600 },
                        { input: "#send_4", value: "- Avvio connessione dati", timeStamp: 9000, lineFeed: true },
                        { click: mt32.tick, timeStamp: 11200 },
                        { input: "#send_5", value: "- Sincronizzazione", timeStamp: 13000, lineFeed: true },
                        { click: mt32.tick, timeStamp: 15000 }
                    ]).play();
                }
                if (res.ct64.device_available === "TRUE") {
                    viz("#spinnerWaitingConnection", { fade: true });
                } else {
                    hide("#spinnerWaitingConnection");
                }
                viz("#div_abort_downloadingupdates");
                hide("#div_confirm_downloadingupdates");
            } else if (res.mt32.mode === "SYNC_DONE") {
                // btn confirm
                viz("#downloadingUpdatesScreen");
                hide("#spinnerWaitingConnection");
                viz("#div_confirm_downloadingupdates");
                hide("#div_abort_downloadingupdates");
                if (!timers.sync_player) {
                    timers.sync_player = new Player().load([
                        { input: "#send_6", value: "- Ricevuti nuovi aggiornamenti", timeStamp: 1000, lineFeed: true },
                        { input: "#send_7", value: "- Termine applicazione", timeStamp: 2000, lineFeed: true }
                    ]).play();
                }
                mt32.home.hide();
            } else if (res.mt32.mode === "EDIT_PATIENT") {
                viz("#mt32EditPatientScreen");
                viz("#edit_mariabianchi");
                hide("#blankPT");
                mt32.home.hide();
            } else if (res.mt32.mode === "NEW_PATIENT") {
                viz("#mt32EditPatientScreen");
                hide("#edit_mariabianchi");
                viz("#blankPT");
                mt32.home.hide();
            } else if (res.mt32.mode === "SAVE_RESULTS") {
                viz("#saveResultsScreen");
            } else if (res.mt32.mode === "INTERPRETATION") {
                viz("#interpretationScreen");
                mt32.home.hide();
            } else if (res.mt32.mode === "VOICE_RECORDER" || res.mt32.mode === "RCORDING_HOLTER") {
                // viz off screen
                mt32.home.hide();
                if (res.mt32.mode === "VOICE_RECORDER") {
                    mt32_power_btn.reveal();
                    mt32_record_btn.reveal();
                }
            } else if (res.mt32.mode === "NOTIFY_HOLTER_COMPLETE") {
                viz("#notifyHolterCompleteScreen");
                examData.stop = // FIXME: write a proper function to compute the next day.
                    (parseInt(examData.start.split("/")[0]) + 1).toString() + "/" + examData.start.split("/").slice(1).join("/"); //date.text() + " " + hhmmss.text();
                mt32.home.hide();
            }


            // render mt32 LED
            render_mt32_led(res);
            // render mt32 mode
            if (res.demo === "TERMINATE_HUB_MODE" || res.demo === "TERMINATE_HOLTER_MODE") {
                render_mt32_mode(res, { flash: true });
            } else if (res.demo === "NEW_EXAM_HUB_MODE" ) {
                render_mt32_mode(res);
                setTimeout(function () {
                    render_mt32_mode(res, { flash: true });
                }, 6500);
            } else if (res.mt32.mode === "HOME" && res.demo === "NEW_EXAM_HUB_MODE") {
                render_mt32_mode(res);
                setTimeout(function () {
                    render_mt32_mode(res, { flash: true });
                }, 4000);
            } else if (res.mt32.mode === "HOME" && res.demo === "NEW_EXAM_HOLTER_MODE") {
                render_mt32_mode(res);
                setTimeout(function () {
                    render_mt32_mode(res, { flash: true });
                }, 6000);
            } else if (res.mt32.mode === "EDIT_PHYSIO" || res.mt32.mode === "CHOOSE_PHYSIO") {
                viz("#EDIT_PHYSIO");
                viz("#editPhysioScreen");
                mt32.home.hide();
                if (res.mt32.mode === "CHOOSE_PHYSIO") {
                    viz("#menu-physio", { fade: true });
                } else {
                    hide("#menu-physio")
                }
                d3.select("#dataentry_val").attr("value", res.mt32.dataentry.replace(/"/g,''));
            } else {
                render_mt32_mode(res);
            }
            // left panel
            if (res.mt32.mode === "HOME" || res.mt32.mode === "EXAMS" || res.mt32.mode === "CENTRAL"
                    || res.mt32.mode === "SETTINGS" || res.mt32.mode === "TEST" || res.mt32.mode === "CHECK_PATIENT"
                    || res.mt32.mode === "RESULTS" || res.mt32.mode === "DOWNLOADING_UPDATES" || res.mt32.mode === "SENDING_RESULTS") {
                viz("#leftPanel");
                mt32.umts.render();
                mt32.wireless.render();
                mt32.bluetooth.render();
                mt32.battery.render();
                if (res.mt32.mode !== "HOME" && res.mt32.mode !== "RESULTS") {
                    mt32.leftpanel_back.render();
                }
                if (res.mt32.umts === "UMTS_OFF") {
                    viz("#umts_off");
                    hide("#umts_on");
                    hide("#umts_tx");
                } else if (res.mt32.umts === "UMTS_ON") {
                    hide("#umts_off");
                    viz("#umts_on");
                    hide("#umts_tx");
                } else if (res.mt32.umts === "UMTS_TX") {
                    hide("#umts_off");
                    hide("#umts_on");
                    viz("#umts_tx");
                }
            }
            if (res.mt32.alerts === "TRUE") {
                mt32.view_alerts.render(res);
            } else {
                mt32.view_alerts.hide(res);
            }

            //-- render ct64, based on selected demo mode
            // if (res.demo === "ACCESS_HOME_PAGE") {
                viz("#ct64AccessHomePage");
            // }
                if (res.ct64.mode === "google") {
                    viz("#ct64google", { fade: true });
                } else if (res.ct64.mode === "LOGIN") {
                    viz("#ct64LoginScreen", { fade: true });
                }
                // else if (res.ct64.mode === "PATIENTS_SCREEN") {
                //     viz("#ct64homePage", { fade: true });
                // }
            // else if (res.demo === "HUB_KNOWN_PT" || res.demo === "HOLTER" || res.demo === "HUB_NEW_PT") {
                if (demo !== Demo.INTRO && demo !== Demo.ACCESS_HOME_PAGE) {
                    d3.select("#ct64_address").attr("value", "http://www.medicaltech.it");
                }

                if (res.ct64.mode === "PATIENTS_SCREEN") {
                    viz("#PATIENT_SCREENS");
                    viz("#patientsScreen");
                    if (res.ct64.known_patient === "TRUE") {
                        d3.selectAll(".ptData").style("display", "block");
                    } else { d3.selectAll(".ptData").style("display", "none"); }
                } else if (res.ct64.mode === "PATIENT_MANAGEMENT") {
                    viz("#PATIENT_SCREENS");
                    viz("#patientMenu");
                    if (res.ct64.patient_management_tab === "ARCHIVED_MEDICAL_REPORTS") {
                        viz("#archiveMedicalReportsScreen");
                    } else {
                        viz("#patientMGMScreen");
                    }
                } else if (res.ct64.mode === "MONITORING") {
                    viz("#ct64-monitoringScreen");
                } else if (res.ct64.mode === "NEW_MONITORING_SESSION" || res.ct64.mode === "SELECT_HOLTER_DEVICE") {
                    viz("#newMonitoringSessionScreen", { flash: true });
                    viz("#selectDevice");
                    if (res.ct64.mode === "NEW_MONITORING_SESSION") {
                        hide("#knownPT-HOLTER");
                        if (res.ct64.known_patient === "TRUE") {
                           viz("#knownPT-ECG12D");
                        } else { viz("#newPT"); }
                    } else {
                        hide("#knownPT-ECG12D");
                        if (res.ct64.known_patient === "TRUE") {
                           viz("#knownPT-HOLTER");
                        } else { viz("#newPT"); }
                    }
                    if (res.ct64.holter_mode === "TRUE") { viz("#holter_mode") }
                    if (res.ct64.hub_mode === "TRUE") { viz("#hub_mode") }
                    viz("#mariabianchi");
                    if (res.ct64.device_available === "TRUE") {
                        d3.select("#deviceDataNotAvailable").text("").classed("animated flash", true);
                        setTimeout(function () {
                            hide("#deviceDataNotAvailable");
                        }, 1500);
                    } else {
                        viz("#deviceDataNotAvailable");
                    }
                    if (res.ct64.device_selected === "TRUE") {
                       ct64.select_device.select();
                    } else {
                       ct64.select_device.deselect();
                    }
                } else if (res.ct64.mode === "SHOW_MENU_VISITS") {
                    viz("#newMonSessionScreen");
                    viz("#visits_menu");
                    if (res.ct64.visit === "VISIT_ECG2D_NEW_PT") {
                        viz("#the_visit");
                    } else {
                        hide("#the_visit");
                    }
                } else if (res.ct64.mode === "NEW_MONITORING_SESSION_ECG2D_NEW_PT") {
                    viz("#newMonSessionScreen");
                    hide("#visits_menu");
                    if (res.ct64.visit === "VISIT_ECG2D_NEW_PT") {
                        viz("#the_visit");
                    } else {
                        hide("#the_visit");
                    }
                } else if (res.ct64.mode === "HOLTER_CONFIG") {
                    viz("#holterConfigScreen");
                } else if (res.ct64.mode === "WAITING_RESULTS" || res.ct64.mode === "MT32_HOLTER_MODE" || res.ct64.mode === "MT32_HUB_MODE") {
                    viz("#waitingResultsScreen");
                    if (res.ct64.known_patient === "TRUE") {
                        if (res.ct64.mt32_mode === "MT32_HOLTER") {
                            viz("#knownPT-HOLTER");
                        } else {
                            viz("#knownPT-ECG12D");
                        }
                    } else { viz("#newPT"); }
                    if (res.ct64.holter_mode === "TRUE") { viz("#holter_mode") }
                    if (res.ct64.hub_mode === "TRUE") { viz("#hub_mode") }
                    viz("#mariabianchi");
                    if (res.ct64.mode === "WAITING_RESULTS") {
                        if (res.ct64.device_available === "TRUE") {
                            viz("#deviceID");
                        } else { hide("#deviceID"); }
                        viz("#waiting_device");
                    } else {
                        viz("#deviceID");
                        viz("#waiting_results");
                        setTimeout(function () {
                            d3.select("#waiting_results").classed("animated flash", false);
                        }, 1500);
                        if (!comm.device_selected) {
                            comm.device_selected = mt32.device_selected.click();
                        }
                    }
                } else if (res.ct64.mode === "ECG_ANALYSIS_RESULTS") {
                    viz("#MONITORING_SCREENS")
                    viz("#ecgAnalysisResultsScreen")
                    viz("#ecgMonitoringMenu");
                } else if (res.ct64.mode === "HOLTER_ANALYSIS_RESULTS") {
                    viz("#MONITORING_SCREENS")
                    viz("#holterAnalysisResultsScreen")
                } else if (res.ct64.mode === "ECG_RESULTS_INTERPRETATION") {
                    viz("#MONITORING_SCREENS")
                    viz("#ecgResultsInterpretationScreen")
                    viz("#ecgMonitoringMenu");
                } else if (res.ct64.mode === "ECG_PHYSIO") {
                    viz("#MONITORING_SCREENS")
                    viz("#ecgResultsPhysioScreen")
                    viz("#ecgMonitoringMenu");
                } else if (res.ct64.mode === "REPORT") {
                    viz("#MONITORING_SCREENS")
                    if (res.ct64.report_auth === "TRUE") {
                        if (res.ct64.ecg_report_saved === "TRUE") {
                            viz("#reportSavedScreen")
                        } else { viz("#compileReportScreen"); }
                    } else { viz("#requestReportScreen"); }
                    viz("#ecgMonitoringMenu");
                } else if (res.ct64.mode === "MEDICAL_REPORT") {
                    viz("#PATIENT_SCREENS");
                    viz("#medicalReportScreen");
                } else if (res.ct64.mode === "CREATE_NEW_PATIENT") {
                    viz("#PATIENT_SCREENS");
                    viz("#createNewPatientScreen");
                } else if (res.ct64.mode === "UPLOAD_EXAMS") {
                    viz("#PATIENT_SCREENS");
                    viz("#uploadExamsScreen");
                }
            // }
        }

        var hour = d3.select("#div_hour");
        var date = d3.select("#div_date");
        var hhmmss = d3.select("#div_hhmmss");
        function set_clock() {
            var d = new Date();
            var hh = d.getHours();
            if (hh < 10) { hh = "0" + hh; }
            var mm = d.getMinutes();
            if (mm < 10) { mm = "0" + mm; }
            var ss = d.getSeconds();
            if (ss < 10) { ss = "0" + ss; }
            hour.text(hh + ":" + mm);
            date.text(d.toLocaleDateString("it-IT"));
            hhmmss.text(hh + ":" + mm + ":" + ss);
        }
        set_clock();
        var clock = setInterval(set_clock, 1000);

        var streaming = false;
        var run_trace_width = 0;
        var max_trace_width = 340;
        var run_trace_cursor_position = 0;
        var init_trace = "#div_run_trace_init";
        var trace = "#div_run_trace_init";
        var run_trace_cursor = d3.select("#div_run_trace_cursor");
        var step = 90;
        var duration = 800;
        d3.select(trace).style("width", "0px");
        function reset_tracing_display() {
            run_trace_width = run_trace_cursor_position = 0;
            run_trace_cursor.transition().duration(0).style("margin-left", "0px");
            d3.selectAll(".mainrun").transition().duration(0).style("width", "0px");
            viz("#filter_warning");
            d3.select("#div_run_trace_init").select(".mainrun").style("opacity", 1).style("width", "0px");
            d3.selectAll(".runtrace").style("opacity", 0);
            streaming = false;
        }
        function update_tracing_display(res) {
            d3.selectAll(".runtrace").transition().duration(duration/4).style("opacity", 0);
            if (res.mt32.gain === "GAIN_5") {
                trace = "#div_run_trace_5-LP";
            } else if (res.mt32.gain === "GAIN_10") {
                trace = "#div_run_trace_10-LP";
            } else if (res.mt32.gain === "GAIN_20") {
                if (res.mt32.lpfilter === "TRUE") {
                    trace = "#div_run_trace_20-LP";
                } else {
                    if (res.mt32.trace === "v2") {
                        console_log("div_run_trace_20-V2 selected");
                        trace = "#div_run_trace_20-V2";
                    } else if (res.mt32.trace === "v1v2v3") {
                        console_log("div_run_trace_20-V1V2V3 selected");
                        trace = "#div_run_trace_20-V1V2V3";
                    } else {
                        console_log("div_run_trace_20 selected");
                        trace = "#div_run_trace_20";
                    }
                }
            }
            if (res.mt32.speed === "25") {
                duration = 900;
            } else {
                duration = 500;
            }
            if (run_trace_cursor_position < max_trace_width) {
                run_trace_cursor_position += step;
                run_trace_width += step;
                if (streaming) {
                    viz(trace);
                    d3.selectAll(".mainrun").transition().duration(duration/2).style("width", run_trace_width + "px");
                    d3.select(trace).style("opacity", 1);
                } else {
                    viz(init_trace);
                    d3.select(init_trace).select(".mainrun").transition().duration(duration/2).style("width", run_trace_width + "px");
                    d3.select(init_trace).style("opacity", 1);
                }
            } else {
                hide("#filter_warning");
                d3.select("#div_run_trace_init").transition().duration(duration/2).style("opacity", 0);
                d3.select(init_trace).select(".mainrun").transition().duration(duration/2).style("opacity", 0);
                streaming = true;
                run_trace_width = 0;
                viz(trace);
                d3.selectAll(".mainrun").transition().duration(duration/2).style("width", "0px");
                run_trace_cursor_position = 0;
            }
            run_trace_cursor.transition().duration(duration/2).style("margin-left", run_trace_cursor_position + "px");
        }

        function render_mt32_led(res) {
            viz("#mt32_off");
            if (res.mt32.mode === "OFF" || res.mt32.mode === "RCORDING_HOLTER") {
                hide("#mt32_on");
                hide("#mt32_charging");
                hide("#mt32_fully_charged");
                hide("#mt32_charging_error");
            } else {
                if (res.mt32.battery_status === "ON_BATTERY") {
                    viz("#mt32_on");
                } else if (res.mt32.battery_status === "CHARGING") {
                    viz("#mt32_charging");
                } else if (res.mt32.battery_status === "FULLY_CHARGED") {
                    viz("#mt32_fully_charged");
                } else if (res.mt32.battery_status === "CHARGING_ERROR") {
                    viz("#mt32_charging_error");
                }
            }
        }
        function render_mt32_mode(res, opt) {
            opt = opt || {};
            if (res.mt32.mo === "HUB") {// && res.ct64.mode === "MT32_HUB_MODE") {
                setTimeout(function () {
                    hide("#mode_none");
                    viz("#mode_hub", { fade: true });
                    hide("#mode_holter");
                    if (opt.flash) {
                        d3.select("#mode_hub").classed("animated flash", true);
                    } else {
                        d3.select("#mode_hub").classed("animated flash", false);
                    }
                }, 250);
            } else if (res.mt32.mo === "HOLTER") {// && res.ct64.mode === "MT32_HOLTER_MODE") {
                setTimeout(function () {
                    hide("#mode_none");
                    hide("#mode_hub");
                    viz("#mode_holter", { fade: true });
                    if (opt.flash) {
                        d3.select("#mode_holter").classed("animated flash", true);
                    } else {
                        d3.select("#mode_holter").classed("animated flash", false);
                    }
                }, 250);
            } else {
                setTimeout(function () {
                    viz("#mode_none", { fade: true });
                    if (opt.flash) {
                        d3.select("#mode_none").classed("animated flash", true);
                    } else {
                        d3.select("#mode_none").classed("animated flash", false);
                    }
                    hide("#mode_hub");
                    hide("#mode_holter");
                }, 250);
            }
        }

        function fill(id, val, opt) {
            opt = opt || {};
            if (val && typeof val === "string") {
                var current_value = d3.select(id).attr("value");
                var i = 1;
                var elapse = opt.delay || 250;
                val.split("").forEach(function (c) {
                    setTimeout(function () {
                        d3.select(id).attr("value", current_value + c);
                        console_log(current_value);
                        current_value = d3.select(id).attr("value");
                    }, elapse);
                    elapse += (c === "@")? 400 : (Math.random() * (150 - 200) + 100);
                });
            }
        }

        var demoFolder = "MT32-evo2";

        //register event listener for websocket connection from the client
        client.addListener('WebSocketConnectionOpened', function (e) {
            console_log("web socket connected");
            //start pvs process
            client.getWebSocket()
                .startPVSProcess({name: "main.pvs", demoName: demoFolder + "/pvs"}, function (err, event) {
                    if (demo === Demo.ECG_EXAM_12DER_KNOWN_PT || demo === Demo.HOLTER_EXAM) {
                        client.getWebSocket().sendGuiAction("init(ECG_EXAM_12DER_KNOWN_PT);", onMessageReceived);
                        d3.selectAll(".MT32-case").style("display", "none");
                        // client.getWebSocket().sendGuiAction("init(ECG_EXAM_12DER_KNOWN_PT) WITH [ mt32 := mtinit WITH [ mo := HUB ]];", onMessageReceived);
                    } else {
                        client.getWebSocket().sendGuiAction("init(STD);", onMessageReceived);
                    }
                d3.select(".demo-splash").style("display", "none");

                d3.selectAll(".CT64frame").style("display", "none");
                d3.selectAll(".MT32frame").style("display", "none");

                d3.select(".content").style("display", "block");
            });
        }).addListener("WebSocketConnectionClosed", function (e) {
            console_log("web socket closed");
        }).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
            console_log(msg);
        });

        client.connectToServer();
    });
