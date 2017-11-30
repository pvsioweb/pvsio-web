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
        "widgets/TouchscreenButton",
        "widgets/TouchscreenDisplay",
        "widgets/BasicDisplay",
        "widgets/NumericDisplay",
        "widgets/SliderWidget",
        "widgets/ToggleButton",

        "util/playback/Player",
        "widgets/ButtonActionsQueue",
        "stateParser",
        "PVSioWebClient"
    ], function (
        Button,
        TouchscreenButton,
        TouchscreenDisplay,
        BasicDisplay,
        NumericDisplay,
        Slider,
        ToggleButton,

        Player,
        ButtonActionsQueue,
        stateParser,
        PVSioWebClient
    ) {
        "use strict";
        var client = PVSioWebClient.getInstance();

        var tick;
        function start_tick() {
            if (!tick) {
                tick = setInterval(function () {
                    ButtonActionsQueue.getInstance().queueGUIAction("tick", onMessageReceived);
                }, 1000);
            }
        }
        function stop_tick() {
            if (tick) {
                clearInterval(tick);
                tick = null;
            }
        }
        function evaluate(str) {
            var v = +str;
            if (str.indexOf("/") >= 0) {
                var args = str.split("/");
                v = +args[0] / +args[1];
            }
            var ans = (v < 100) ? v.toFixed(1).toString() : v.toFixed(0).toString();
            return parseFloat(ans);
        }

        // Function automatically invoked by PVSio-web when the back-end sends states updates
        function onMessageReceived(err, event) {
            if (!err) {
                // get new state
                client.getWebSocket().lastState(event.data);
                // parse and render new state
                var res = event.data.toString();
                if (res.indexOf("(#") === 0) {
                    render(stateParser.parse(res));
                    console.log(res);
                }
            } else {
                console.log(err);
            }
        }

        var leftpanel = {};
        leftpanel.umts = new TouchscreenButton("umts", {
            width: 48,
            height: 89,
            top: 130,
            left: 226
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "blue",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        leftpanel.wireless = new TouchscreenButton("wireless", {
            width: 48,
            height: 89,
            top: 220,
            left: 226
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "blue",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        leftpanel.bluetooth = new TouchscreenButton("bluetooth", {
            width: 48,
            height: 89,
            top: 310,
            left: 226
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "blue",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        leftpanel.battery = new TouchscreenButton("battery", {
            width: 48,
            height: 89,
            top: 400,
            left: 226
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "blue",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        leftpanel.alerts = new TouchscreenButton("alerts", {
            width: 48,
            height: 91,
            top: 490,
            left: 226
        }, {
            softLabel: "!",
            backgroundColor: "crimson",
            opacity: "0.8",
            fontsize: 48,
            borderColor: "#000066",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        leftpanel.back = new TouchscreenButton("back", {
            width: 48,
            height: 94,
            top: 582,
            left: 226
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "#000066",
            parent: "leftPanel",
            callback: onMessageReceived
        });
        var home = {};
        home.new_exam = new TouchscreenButton("new_exam", {
            width: 178,
            height: 89,
            top: 314,
            left: 277
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "homeScreen",
            callback: onMessageReceived
        });
        home.server = new TouchscreenButton("central", {
            width: 180,
            height: 89,
            top: 404,
            left: 366
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "homeScreen",
            callback: onMessageReceived
        });
        home.settings = new TouchscreenButton("settings", {
            width: 180,
            height: 89,
            top: 494,
            left: 458
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "homeScreen",
            callback: onMessageReceived
        });
        var exams = {};
        exams.ecg12d = new TouchscreenButton("ecg12d", {
            width: 178,
            height: 89,
            top: 314,
            left: 277
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "examsScreen",
            callback: onMessageReceived
        });
        exams.holter = new TouchscreenButton("holter", {
            width: 178,
            height: 89,
            top: 314,
            left: 459
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "examsScreen",
            callback: onMessageReceived
        });
        exams.confirm = new TouchscreenButton("exams-confirm", {
            width: 131,
            height: 84,
            top: 586,
            left: 278
        }, {
            softLabel: "",
            customFunctionText: "click_confirm",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "confirmHolterScreen",
            callback: onMessageReceived
        });
        exams.test = new TouchscreenButton("test_electrodes", {
            width: 180,
            height: 89,
            top: 492,
            left: 277
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "examsScreen",
            callback: onMessageReceived
        });

        var central = {};
        central.download_updates = new TouchscreenButton("download_updates", {
            width: 178,
            height: 89,
            top: 314,
            left: 277
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "centralScreen",
            callback: onMessageReceived
        });
        central.upload_results = new TouchscreenButton("upload_results", {
            width: 178,
            height: 89,
            top: 314,
            left: 458
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "centralScreen",
            callback: onMessageReceived
        });
        central.terminate_operating_mode = new TouchscreenButton("terminate_operating_mode", {
            width: 178,
            height: 89,
            top: 402,
            left: 277
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "centralScreen",
            callback: onMessageReceived
        });

        var settings = {};
        settings.connection_settings = new TouchscreenButton("connection_settings", {
            width: 178,
            height: 89,
            top: 314,
            left: 275
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "settingsScreen",
            callback: onMessageReceived
        });
        settings.ecg_settings = new TouchscreenButton("ecg_settings", {
            width: 178,
            height: 89,
            top: 314,
            left: 458
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "settingsScreen",
            callback: onMessageReceived
        });
        settings.security_settings = new TouchscreenButton("security_settings", {
            width: 178,
            height: 89,
            top: 404,
            left: 275
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "settingsScreen",
            callback: onMessageReceived
        });
        settings.system_settings = new TouchscreenButton("system_settings", {
            width: 178,
            height: 89,
            top: 404,
            left: 458
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "settingsScreen",
            callback: onMessageReceived
        });
        settings.info = new TouchscreenButton("info", {
            width: 178,
            height: 89,
            top: 492,
            left: 275
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "settingsScreen",
            callback: onMessageReceived
        });
        var check = {};
        check.confirm = new TouchscreenButton("confirm", {
            width: 89,
            height: 89,
            top: 585,
            left: 550
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            borderColor: "#0066ff",
            opacity: "0.2",
            parent: "checkPatientScreen",
            callback: onMessageReceived
        });

        var monitoring = {};
        monitoring.quit = new TouchscreenButton("quit", {
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
        monitoring.rec = new TouchscreenButton("rec", {
            width: 52,
            height: 104,
            top: 389,
            left: 230
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "#000066",
            parent: "monitoringScreen",
            pushButton: true,
            callback: onMessageReceived
        });

        var results = {};
        results.repeat = new TouchscreenButton("repeat", {
            width: 342,
            height: 54,
            top: 224,
            left: 287
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "#000066",
            parent: "resultsScreen",
            pushButton: true,
            callback: onMessageReceived
        });
        results.interpretation = new TouchscreenButton("interpretation", {
            width: 342,
            height: 54,
            top: 305,
            left: 287
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "#000066",
            parent: "resultsScreen",
            pushButton: true,
            callback: onMessageReceived
        });
        results.physio = new TouchscreenButton("physio", {
            width: 342,
            height: 54,
            top: 382,
            left: 287
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.2",
            borderColor: "#000066",
            parent: "resultsScreen",
            pushButton: true,
            callback: onMessageReceived
        });

        function viz(id, opt) {
            opt = opt || {};
            if (d3.select(id).node()) {
                if (opt.fade && d3.select(id).style("display") !== "block") {
                    d3.select(id).style("opacity", 0).transition().duration(300).style("opacity", 1).style("display", "block");
                } else {
                    d3.select(id).transition().duration(0).style("opacity", 1).style("display", "block");
                }
            }
        }
        function hide(id) {
            d3.select(id).style("display", "none");
        }
        function hide_all_screens(res) {
            // mt32
            hide("#homeScreen");
            hide("#examsScreen");
            hide("#centralScreen");
            hide("#settingsScreen");
            hide("#testScreen");
            hide("#checkPatientScreen");
            hide("#monitoringScreen");
            hide("#resultsScreen");
            hide("#confirmHolterScreen");
            if (res.mode !== "MONITORING" && streaming) {
                reset_tracing_display();
            }
            hide("#leftPanel");

            // ct64
            d3.selectAll(".CT64frame").style("display", "none");
            d3.selectAll(".monitorData").style("display", "none");
            d3.selectAll(".ptData").style("display", "none");
        }


        var ct64 = {};
        ct64.login = new TouchscreenButton("login", {
            width: 70,
            height: 34,
            top: 352,
            left: 905
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0.1",
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
            backgroundColor: "steelblue",
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
            backgroundColor: "steelblue",
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
            backgroundColor: "steelblue",
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
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            borderWidth: "4px",
            parent: "holterConfigScreen",
            callback: onMessageReceived
        });
        ct64.monitoring = new TouchscreenButton("monitoring", {
            width: 107,
            height: 46,
            top: 10,
            left: 355
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "patientsScreen",
            callback: onMessageReceived
        });
        ct64.new_monitoring_session = new TouchscreenButton("new_monitoring_session", {
            width: 177,
            height: 36,
            top: 299,
            left: 1158
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
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
            backgroundColor: "steelblue",
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
        ct64.HES = new TouchscreenButton("HES", {
            width: 84,
            height: 44,
            top: 263,
            left: 186
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ecgAnalysisResultsScreen",
            callback: onMessageReceived
        });
        ct64.view_physio = new TouchscreenButton("view_physio", {
            width: 144,
            height: 44,
            top: 263,
            left: 268
        }, {
            softLabel: "",
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "ecgResultsInterpretationScreen",
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
            opacity: "0.1",
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
            backgroundColor: "steelblue",
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
            backgroundColor: "steelblue",
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
            backgroundColor: "steelblue",
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
            opacity: "0.1",
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
            backgroundColor: "steelblue",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "yes_no",
            callback: onMessageReceived
        });
        ct64.browse_medicaltech = new TouchscreenButton("browse_medicaltech", {
            width: 830,
            height: 22,
            top: 45,
            left: 45
        }, {
            softLabel: "",
            opacity: "0",
            borderColor: "#000066",
            borderRadius: "6px",
            parent: "browser-navbar",
            callback: onMessageReceived
        });

        function render_ct64_widgets (res) {
            ct64.login.render(res);
            ct64.select_patient.render(res);
            ct64.new_ecg.render(res);
            ct64.new_holter.render(res);
            ct64.holter_duration.render(res);
            ct64.holter_derivation.render(res);
            ct64.holter_accelerometer.render(res);
            ct64.select_device.render(res);
            ct64.continue.render(res);
            ct64.continue_holter_config.render(res);
            ct64.monitoring.render(res);
            ct64.new_monitoring_session.render(res);
            ct64.date_time_filters.render(res);
            ct64.select_exam_data_hub.render(res);
            ct64.HES.render(res);
            ct64.view_physio.render(res);
            ct64.select_exam_data_holter.render(res);
            ct64.select_visit.render(res);
            ct64.select_ecg2d_new_pt.render(res);
            ct64.continue_yes_no.render(res);
            ct64.browse_medicaltech.render(res);
        }

        var Demo = { NONE: 0, ACCESS_HOME_PAGE: 1, HUB_NEW_PT: 2, HUB_KNOWN_PT: 3, HOLTER: 4, TERMINATE_HUB_MODE: 5, TERMINATE_HOLTER_MODE: 6,
                     NEW_EXAM_HUB_MODE: 7, TEST_ELECTRODES_HUB: 8, VIEW_EXAMS_HUB: 9, VIEW_INTERPRETATION_HUB: 10 };
        var demo = Demo.VIEW_INTERPRETATION_HUB;

        var player = new Player({ lang: "it-IT" });
        if (demo === Demo.ACCESS_HOME_PAGE) {
            //-- access home page
            player.load([
                { speak: "Instruzioni per eseguire l'accesso alla centrale CT64", timeStamp: 1000 },
                { speak: "Collégati al sito www punto médicàl téc punto it", timeStamp: 3000 },
                { input: "#ct64_address", value: "http://www.medicaltech.it", timeStamp: 5000 },
                { button: ct64.browse_medicaltech, timeStamp: 7500, borderColor: "transparent" },
                { speak: "Inserisci le credenziali di accesso fornite dall'amministratore", timeStamp: 8500 },
                { input: "#email", value: "mario.rossi@medicaltech.it", timeStamp: 10500 },
                { input: "#password", value: "mylongsecretpassword", timeStamp: 13000 },
                { speak: "Clicca accedi.", timeStamp: 15000 },
                { button: ct64.login, timeStamp: 17000, timeout: 1600, borderColor: "blue", classed: "blink" },
                { speak: "L'home page della centrale verrà visualizzata, ed è pronta all'utilizzo.", timeStamp: 17500 }
            ]).play();
        } else if (demo === Demo.HUB_NEW_PT) {
            //-- activate ECG12D - HUB with new patient
            player.load([
                { speak: "Instruzioni per attivare la modalità operativa Hub, sul dispositivo MT32 quando l'anagrafica del paziente in esame non è presente sulla centrale.", timeStamp: 1000 },
                { speak: "Clicca Monitoraggi nel Pannello di Navigazione della centrale.", timeStamp: 10500 },
                { button: ct64.monitoring, timeStamp: 13000, timeout: 2000, borderColor: "black", classed: "blink" },
                { speak: "Clicca Nuovo Monitoraggio dalla lista delle azioni.", timeStamp: 15000 },
                { button: ct64.new_monitoring_session, timeStamp: 17500, timeout: 2000, borderColor: "black", classed: "blink" },
                { speak: "Scegli Ecg12D Senza Anagrafica come Tipo Visita.", timeStamp: 18500 },
                { button: ct64.select_visit, timeStamp: 19000, timeout: 2000, borderColor: "transparent"},
                { button: ct64.select_ecg2d_new_pt, timeStamp: 21000, timeour: 2000, borderColor: "black", classed: "blink" },
                { speak: "Poi, clicca Continua.", timeStamp: 22000 },
                { button: ct64.continue_yes_no, timeStamp: 24000, timeout: 2000, borderColor: "black", classed: "blink" },
                { speak: "Clicca il nome del dispositivo per selezionarlo.", timeStamp: 26000 },
                { button: ct64.select_device, timeStamp: 28000, timeout: 2000 },
                { speak: "Poi, clicca Continua.", timeStamp: 29000 },
                { button: ct64.continue, timeStamp: 31000, timeout: 2000, borderColor: "black", classed: "blink" },
                { speak: "Attendi che il dispositivo MT32 abbia ricevuto gli aggiornamenti.", timeStamp: 32000 },
                { speak: "A questo punto, il dispositivo MT32 è configurato con la modalità operativa Hub, ed è pronto all’utilizzo.", timeStamp: 38000 },
                { speak: "L'anagrafica del paziente verrà inserita dal medico direttamente sull'MT32, in fase di avvio esame.", timeStamp: 45000 }
            ]).play();
        } else if (demo === Demo.HUB_KNOWN_PT) {
            //-- activate ECG12D - HUB with known patient
            player.load([
                { speak: "Instruzioni per attivare la modalità operativa Hub, sul dispositivo MT32 quando l'anagrafica del paziente in esame è già presente sulla centrale.", timeStamp: 1000 },
                { speak: "Fai doppio click sull'anagrafica desiderata.", timeStamp: 10500 },
                { button: ct64.select_patient, timeStamp: 15000, timeout: 1500, borderColor: "black", classed: "blink2" },
                { speak: "Clicca Nuovo ECG.", timeStamp: 16500 },
                { button: ct64.new_ecg, timeStamp: 19000, timeout: 2000, borderColor: "black", classed: "blink" },
                { speak: "Clicca il nome del dispositivo per selezionarlo.", timeStamp: 19500 },
                { button: ct64.select_device, timeStamp: 21000, timeout: 3000 },
                { speak: "Poi, clicca Continua.", timeStamp: 21500 },
                { button: ct64.continue, timeStamp: 23000, timeout: 1500, borderColor: "black", classed: "blink" },
                { speak: "Attendi che il dispositivo MT32 abbia ricevuto gli aggiornamenti.", timeStamp: 24000 },
                { speak: "A questo punto, il dispositivo MT32 è configurato con la modalità operativa Hub, ed è pronto all'utilizzo.", timeStamp: 30500 }
            ]).play();
        } else if (demo === Demo.HOLTER) {
            player.load([
                { speak: "Instruzioni per attivare la modalità operativa Hólter, sul dispositivo MT32.", timeStamp: 1000 },
                { speak: "Nell'home page della centrale, fai doppio click sull'anagrafe desiderata.", timeStamp: 8500 },
                { button: ct64.select_patient, timeStamp: 13500, timeout: 2500, borderColor: "black", classed: "blink2" },
                { speak: "Poi, nella pagina Gestione Paziente, clicca Nuovo Hólter.", timeStamp: 14500 },
                { button: ct64.new_holter, timeStamp: 18000, timeout: 2000, borderColor: "black", classed: "blink" },
                { speak: "Seleziona Durata Esame e Derivazione Precordiale che intendi utilizzare.", timeStamp: 19500 },
                { button: ct64.holter_duration, timeStamp: 20000, timeout: 1000, borderColor: "black", classed: "blink2" },
                { button: ct64.holter_derivation, timeStamp: 21000, timeout: 1000, borderColor: "black", classed: "blink2" },
                { speak: "Inotre, seleziona Attiva Accelerómetro se intendi attivare l'acquisizione dei dati acceleromètrici.", timeStamp: 24500 },
                { button: ct64.holter_accelerometer, timeStamp: 25500, timeout: 1000, borderColor: "black", classed: "blink2" },
                { speak: "Poi, clicca Continua.", timeStamp: 33000 },
                { button: ct64.continue_holter_config, timeStamp: 34500, timeout: 1500, borderColor: "black", classed: "blink" },
                { speak: "Clicca il nome del dispositivo per selezionarlo.", timeStamp: 37000 },
                { button: ct64.select_device, timeStamp: 38500, timeout: 3000 },
                { speak: "Poi, clicca Continua.", timeStamp: 40000 },
                { button: ct64.continue, timeStamp: 42000, timeout: 1500, borderColor: "black", classed: "blink" },
                { speak: "Attendi che il dispositivo MT32 abbia ricevuto gli aggiornamenti.", timeStamp: 43000 },
                { speak: "A questo punto, il dispositivo MT32 è stato configurato in modalità operativa Hólter, ed è pronto all'utilizzo.", timeStamp: 49000 }
            ]).play();
        } else if (demo === Demo.TERMINATE_HUB_MODE) {
            player.load([
                { speak: "Instruzioni per terminare la modalità operativa Hub, sul dispositivo MT32.", timeStamp: 2000 },
                { speak: "Clicca Centrale.", timeStamp: 8500 },
                { button: home.server, timeStamp: 10000},
                { speak: "Poi, clicca Termina modalità.", timeStamp: 11500 },
                { button: central.terminate_operating_mode, timeStamp: 12500 },
                { speak: "Clicca indietro per tornare all'home page.", timeStamp: 14000},
                { button: leftpanel.back, timeStamp: 17000 },
                { speak: "Potrai verificare che la modalità operativa non è piu presente sul dispositivo MT32.", timeStamp: 18500},
                { speak: "Applica la stessa procedura per terminare la modalità Hólter.", timeStamp: 24500}
            ]).play();
        } else if (demo === Demo.NEW_EXAM_HUB_MODE) {
            player.load([
                { speak: "Istruzioni per creare un nuovo esame in modalità operativa Hub.", timeStamp: 1000 },
                { speak: "Verifica che il dispositivo MT32 sia in modalità EGC12D Hub.", timeStamp: 6400 },
                { speak: "Poi, Clicca Nuovo Esame.", timeStamp: 12000 },
                { button: home.new_exam, timeStamp: 14000, borderColor: "white" },
                { speak: "Clicca ECG12D.", timeStamp: 15000, borderColor: "white" },
                { button: exams.ecg12d, timeStamp: 16500, borderColor: "white" },
                { speak: "Verifica i dati del paziente.", timeStamp: 18000 },
                { speak: "Poi, clicca Conferma.", timeStamp: 19500 },
                { button: check.confirm, timeStamp: 21000, borderColor: "white" },
                { speak: "Aspetta qualche secondo che il filtro sia a regime.", timeStamp: 23000 },
                { speak: "Poi, clicca rec per acquisire il segnale elettrocardiografico.", timeStamp: 29000 },
                { button: monitoring.rec, timeStamp: 30000, timeout: 1000, classed: "blink2", borderColor: "white" },
                { speak: "Al termine dell'acquisizione si passa automaticamente alla pagina Risultato.", timeStamp: 35800 },
                { speak: "Dove puoi scegliere se ripetere l'acquisizione. Vedere l'esito interpretativo dell'acquisizione. O inserire i dati fisiologici.", timeStamp: 40000 },
                { button: results.repeat, timeStamp: 41000, timeout: 1000, classed: "blink2", borderColor: "white", stutter: true },
                { button: results.interpretation, timeStamp: 42500, timeout: 1000, classed: "blink2", borderColor: "white", stutter: true },
                { button: results.physio, timeStamp: 45000, timeout: 1000, classed: "blink2", borderColor: "white", stutter: true }
            ]).play();
        } else if (demo === Demo.NEW_EXAM_HOLTER_MODE) {
            player.load([
                { speak: "Istruzioni per creare un nuovo esame in modalità operativa Hólter.", timeStamp: 1000 },
                { speak: "Verifica che il dispositivo MT32 sia in modalità Hólter.", timeStamp: 6400 },
                { speak: "Poi, Clicca Nuovo Esame.", timeStamp: 12000 },
                { button: home.new_exam, timeStamp: 14000, borderColor: "white" },
                { speak: "Clicca Hólter.", timeStamp: 15000, borderColor: "white" },
                { button: exams.holter, timeStamp: 16500, borderColor: "white" },
                { speak: "Verifica i dati del paziente.", timeStamp: 17500 },
                { speak: "Poi, clicca Conferma.", timeStamp: 19500 },
                { button: check.confirm, timeStamp: 21000, timeout: 2000, borderColor: "white" },
                { speak: "Aspetta qualche secondo che il filtro sia a regime.", timeStamp: 23000 },
                { speak: "Poi, clicca rec.", timeStamp: 28000 },
                { button: monitoring.rec, timeStamp: 30000, timeout: 1000, classed: "blink2", borderColor: "white" },
                { speak: "Comparirà una finestra di conferma.", timeStamp: 30000 },
                { speak: "Clicca conferma.", timeStamp: 31000 },
                { button: exams.confirm, timeStamp: 34000, timeout: 1000, borderColor: "white" },
                { speak: "La registrazione Hólter verrà effettuata per la durata impostata in fase di configurazione dell'esame.", timeStamp: 36000 }
            ]).play();
        } else if (demo === Demo.TEST_ELECTRODES_HUB) {
            setTimeout(function () {
                d3.select("#defective_electrode").style("display", "block");
            }, 36000);
            player.load([
                { speak: "Per ottenere ECG di buona qualità, è molto importante la corretta applicazione degli elettrodi.", timeStamp: 1000 },
                { speak: "Per verificare la corretta applicazione degli elettrodi, clicca Nuovo Esame.", timeStamp: 8000 },
                { button: home.new_exam, timeStamp: 12000, timeout: 1500, borderColor: "white" },
                { speak: "Poi, Clicca Test Elettrodi.", timeStamp: 13000 },
                { button: exams.test, timeStamp: 15500, timeout:1500, borderColor: "white" },
                { speak: "Nella pagina viene suggerito il posizionamento degli elettrodi e controllata la qualità di connessione.", timeStamp: 16000 },
                { speak: "Gli elettrodi sono identificati da pallini colorati.", timeStamp: 22000 },
                { speak: "Pallini stabili indicano una buona connessione.", timeStamp: 26000 },
                { speak: "Se un pallino è intermittente, c'è un elettrodo con una cattiva connessione che va controllato.", timeStamp: 30000 }
            ]).play();
        } else if (demo === Demo.VIEW_EXAMS_HUB) {
            player.load([
                { speak: "Instruzioni per vedere tutti gli esami svolti in un determinato periodo di tempo.", timeStamp: 1000 },
                { speak: "Clicca Monitoraggi nel Pannello di Navigazione della centrale CT64.", timeStamp: 7000 },
                { button: ct64.monitoring, timeStamp: 12000, timeout: 2000, borderColor: "black", classed: "blink" },
                { speak: "La tabella al centro della schermata contiene l'elenco degli esami effettuati.", timeStamp: 14000 },
                { button: ct64.select_exam_data_hub, timeStamp: 16000, timeout: 2000, borderColor: "black", classed: "blink2", stutter: true },
                { button: ct64.select_exam_data_holter, timeStamp: 16000, timeout: 2000, borderColor: "black", classed: "blink2", stutter: true },
                { speak: "Puoi selezionare le date di interesse attraverso i filtri disponibili nella parte alta della pagina.", timeStamp: 19000 },
                { button: ct64.date_time_filters, timeStamp: 22000, timeout: 2000, borderColor: "black", classed: "blink2", stutter: true }
            ]).play();
        } else if (demo === Demo.VIEW_INTERPRETATION_HUB) {
            player.load([
                { speak: "Instruzioni per visualizzare l'analisi di un esame ECG12D.", timeStamp: 1000 },
                { speak: "Clicca Monitoraggi nel Pannello di Navigazione della centrale CT64.", timeStamp: 6000 },
                { button: ct64.monitoring, timeStamp: 10000, timeout: 2000, borderColor: "black", classed: "blink" },
                { speak: "Clicca sull'esame ECG di interesse.", timeStamp: 14000 },
                { button: ct64.select_exam_data_hub, timeStamp: 16000, timeout: 2000, borderColor: "black", classed: "blink2" },
                { speak: "Apparirà la schermata di analisi esame ECG12D, dove puoi selezionare i parametri di interesse da visualizzare.", timeStamp: 19000 },
                { speak: "Cliccando su H E S, puoi visualizzare il risultato interpretativo.", timeStamp: 27000 },
                { button: ct64.HES, timeStamp: 28000, timeout: 2000, borderColor: "black", classed: "blink2" },
                { speak: "Cliccando su Dati Fisiologici, puoi vedere i dati fisiologici del paziente raccolti precedentemente.", timeStamp: 34000 },
                { button: ct64.view_physio, timeStamp: 36000, timeout: 2000, borderColor: "black", classed: "blink2" }
            ]).play();
        }


        function render(res) {
            hide_all_screens(res);
            render_ct64_widgets(res);
            if (res.ct64.mode === "WAITING_RESULTS") {
                start_tick(res);
            } else { stop_tick(res); }
            if (res.mt32.mode === "RECORDING" && res.mt32.mo === "HUB") {
                setTimeout(function () {
                    ButtonActionsQueue.getInstance().queueGUIAction("click_mt32_results_ready", onMessageReceived);
                }, 9000);
            }

            //-- mt32
            if (res.mt32.mode === "HOME") {
                viz("#homeScreen");
                home.new_exam.render();
                home.server.render();
                home.settings.render();
            } else if (res.mt32.mode === "EXAMS") {
                viz("#examsScreen");
                if (res.mt32.mo === "HUB") {
                    hide("#examsDISABLED");
                    viz("#examsHUB");
                    viz("#div_ecg12d");
                    hide("#examsHOLTER");
                    hide("#div_holter");
                    exams.ecg12d.render();
                    exams.test.render();
                } else if (res.mt32.mo === "HOLTER") {
                    hide("#examsDISABLED");
                    hide("#examsHUB");
                    hide("#div_ecg12d");
                    viz("#examsHOLTER");
                    viz("#div_holter");
                    exams.holter.render();
                    exams.test.render();
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
                central.download_updates.render();
                central.upload_results.render();
                central.terminate_operating_mode.render();
            } else if (res.mt32.mode === "SETTINGS") {
                viz("#settingsScreen");
                settings.connection_settings.render();
                settings.ecg_settings.render();
                settings.security_settings.render();
                settings.system_settings.render();
                settings.info.render();
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
                check.confirm.render();
            } else if (res.mt32.mode === "MONITORING" || res.mt32.mode === "RECORDING") {
                viz("#monitoringScreen");
                monitoring.quit.render();
                monitoring.rec.render();
                if (!streaming) {
                    update_tracing_display();
                    streaming = setInterval(update_tracing_display, duration);
                }
                if (res.mt32.mode === "RECORDING") {
                    monitoring.rec.select();
                } else {
                    monitoring.rec.deselect();
                }
            } else if (res.mt32.mode === "RESULTS") {
                viz("#resultsScreen");
                results.repeat.render();
                results.interpretation.render();
                results.physio.render();
            } else if (res.mt32.mode === "CONFIRM_REC") {
                viz("#confirmHolterScreen");
                exams.confirm.render();
            }

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
            } else {
                render_mt32_mode(res);
            }
            // left panel
            if (res.mt32.mode === "HOME" || res.mt32.mode === "EXAMS" || res.mt32.mode === "CENTRAL"
                    || res.mt32.mode === "SETTINGS" || res.mt32.mode === "TEST" || res.mt32.mode === "CHECK_PATIENT"
                    || res.mt32.mode === "RESULTS") {
                d3.select("#leftPanel").style("display", "block");
                leftpanel.umts.render();
                leftpanel.wireless.render();
                leftpanel.bluetooth.render();
                leftpanel.battery.render();
                // leftpanel.alerts.render();
                if (res.mt32.mode !== "HOME" && res.mt32.mode !== "RESULTS") {
                    leftpanel.back.render();
                }
            }

            //-- render ct64, based on selected demo mode
            // if (res.demo === "ACCESS_HOME_PAGE") {
                viz("#ct64AccessHomePage");
            // }
                if (res.ct64.mode === "google") {
                    // stop_tick();
                    viz("#ct64google", { fade: true });
                } else if (res.ct64.mode === "LOGIN") {
                    // stop_tick();
                    viz("#ct64LoginScreen", { fade: true });
                } else if (res.ct64.mode === "PATIENTS_SCREEN") {
                    // stop_tick();
                    viz("#ct64homePage", { fade: true });
                } else {
                    // stop_tick();
                }
            // else if (res.demo === "HUB_KNOWN_PT" || res.demo === "HOLTER" || res.demo === "HUB_NEW_PT") {
                d3.select("#ct64_address").attr("value", "http://www.medicaltech.it");
                if (res.ct64.mode === "PATIENTS_SCREEN") {
                    // stop_tick();
                    viz("#patientsScreen");
                    if (res.ct64.known_patient === "TRUE") {
                        d3.selectAll(".ptData").style("display", "block");
                    } else { d3.selectAll(".ptData").style("display", "none"); }
                } else if (res.ct64.mode === "PATIENT_MANAGEMENT") {
                    // stop_tick();
                    viz("#patientMGMScreen");
                } else if (res.ct64.mode === "MONITORING") {
                    stop_tick();
                    viz("#ct64-monitoringScreen");
                } else if (res.ct64.mode === "NEW_MONITORING_SESSION") {
                    // stop_tick();
                    viz("#newMonitoringSessionScreen", { flash: true });
                    if (res.ct64.known_patient === "TRUE") {
                       viz("#knownPT");
                    } else { viz("#newPT"); }
                    if (res.ct64.holter_mode === "TRUE") { viz("#holter_mode") }
                    if (res.ct64.hub_mode === "TRUE") { viz("#hub_mode") }
                    viz("#mariabianchi");
                    if (res.ct64.device_selected === "TRUE") {
                       ct64.select_device.select();
                    } else {
                       ct64.select_device.deselect();
                    }
                } else if (res.ct64.mode === "SHOW_MENU_VISITS") {
                    // stop_tick();
                    viz("#newMonSessionScreen");
                    viz("#visits_menu");
                    if (res.ct64.visit === "VISIT_ECG2D_NEW_PT") {
                        viz("#the_visit");
                    } else {
                        hide("#the_visit");
                    }
                } else if (res.ct64.mode === "NEW_MONITORING_SESSION_ECG2D_NEW_PT") {
                    // stop_tick();
                    viz("#newMonSessionScreen");
                    hide("#visits_menu");
                    if (res.ct64.visit === "VISIT_ECG2D_NEW_PT") {
                        viz("#the_visit");
                    } else {
                        hide("#the_visit");
                    }
                } else if (res.ct64.mode === "HOLTER_CONFIG") {
                    // stop_tick();
                    viz("#holterConfigScreen");
                } else if (res.ct64.mode === "SELECT_HOLTER_DEVICE") {
                    // stop_tick();
                    viz("#newMonitoringSessionScreen", { flash: true });
                    viz("#holterSession");
                    hide("#hubSession");
                    if (res.ct64.device_selected === "TRUE") {
                        ct64.select_device.select();
                    } else {
                        ct64.select_device.deselect();
                    }
                } else if (res.ct64.mode === "WAITING_RESULTS" || res.ct64.mode === "MT32_HOLTER_MODE" || res.ct64.mode === "MT32_HUB_MODE") {
                    viz("#waitingResultsScreen");
                    if (res.ct64.known_patient === "TRUE") {
                        viz("#knownPT");
                    } else { viz("#newPT"); }
                    if (res.ct64.holter_mode === "TRUE") { viz("#holter_mode") }
                    if (res.ct64.hub_mode === "TRUE") { viz("#hub_mode") }
                    viz("#mariabianchi");
                    if (res.ct64.mode === "WAITING_RESULTS") {
                        viz("#waiting_device");
                        // start_tick();
                    } else {
                        viz("#deviceID");
                        hide("#waiting_device");
                        // stop_tick();
                    }
                } else if (res.ct64.mode === "ECG_ANALYSIS_RESULTS") {
                    viz("#ecgAnalysisResultsScreen")
                } else if (res.ct64.mode === "ECG_RESULTS_INTERPRETATION") {
                    viz("#ecgResultsInterpretationScreen")
                } else if (res.ct64.mode === "ECG_PHYSIO") {
                    viz("#ecgResultsPhysioScreen")
                }
            // }
        }

        var hour = d3.select("#div_hour");
        var date = d3.select("#div_date");
        var hhmmss = d3.select("#div_hhmmss");
        function set_clock() {
            var d = new Date();
            var hh = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
            var mm = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
            var ss = (d.getSeconds() < 10) ? "0" + d.getSeconds() : d.getSeconds();
            hour.text(hh + ":" + mm);
            date.text(d.toLocaleDateString());
            hhmmss.text(hh + ":" + mm + ":" + ss);
        }
        set_clock();
        var clock = setInterval(set_clock, 1000);

        var streaming = null;
        var run_trace_width = 0;
        var max_trace_width = 340;
        var run_trace_cursor_position = 0;
        var trace = "#div_run_trace";
        var run_trace = d3.select(trace);
        var run_trace_cursor = d3.select("#div_run_trace_cursor");
        var step = 40;
        var duration = 1000;
        run_trace.style("width", "0px");
        function reset_tracing_display() {
            run_trace_width = run_trace_cursor_position = 0;
            clearInterval(streaming);
            streaming = null;
            run_trace_cursor.transition().duration(0).style("margin-left", "0px");
            run_trace.transition().duration(0).style("width", "0px");
        }
        function update_tracing_display() {
            if (run_trace_cursor_position < max_trace_width) {
                run_trace_cursor_position += step;
                run_trace_width += step;
                run_trace.transition().duration(duration/2).style("width", run_trace_width + "px");
            } else {
                run_trace_width = 0;
                run_trace.style("z-index", "0");
                run_trace.transition().duration(duration).style("opacity", 0.4);
                trace = (trace === "#div_run_trace") ? "#div_run_trace_alt" : "#div_run_trace";
                run_trace = d3.select(trace);
                run_trace.style("z-index", "1").style("opacity", 1).style("width", "0px");
                run_trace_cursor_position = 0;
            }
            run_trace_cursor.transition().duration(duration/2).style("margin-left", run_trace_cursor_position + "px");
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
                        console.log(current_value);
                        current_value = d3.select(id).attr("value");
                    }, elapse);
                    elapse += (c === "@")? 400 : (Math.random() * (150 - 200) + 100);
                });
            }
        }

        var demoFolder = "MT32-evo";

        function start_playback() {
            // var playlist = require("text!" + demoFolder + "/playback/ex1.json");
            var playlist = [
                { speak: "Istruzioni per creare un nuovo esame con MT-32.", timeStamp: 10 },
                { speak: "Clicca Nuovo Esame.", timeStamp: 4400 },
                { button: home.new_exam, timeStamp: 6000 },
                { speak: "Clicca ECG12D.", timeStamp: 6800 },
                { button: exams.ecg12d, timeStamp: 9000 },
                { speak: "Verifica i dati del paziente. Poi, clicca Conferma.", timeStamp: 9800 },
                { button: check.confirm, timeStamp: 14000 },
                { speak: "Aspetta qualche secondo che il filtro sia a regime.", timeStamp: 14800 },
                { speak: "Poi, clicca rec per registrare il segnale.", timeStamp: 21000 }
            ];
            var player = new Player({ lang: "it-IT", pitch: 1.04, rate: 1.03 });
            player.load(playlist);
            player.play();
        }

        //register event listener for websocket connection from the client
        client.addListener('WebSocketConnectionOpened', function (e) {
            console.log("web socket connected");
            //start pvs process
            client.getWebSocket()
                .startPVSProcess({name: "main.pvs", demoName: demoFolder + "/pvs"}, function (err, event) {
                    if (demo === Demo.ACCESS_HOME_PAGE) {
                        client.getWebSocket().sendGuiAction("init(ACCESS_HOME_PAGE);", onMessageReceived);
                    } else if (demo === Demo.HUB_NEW_PT) {
                        client.getWebSocket().sendGuiAction("init(HUB_NEW_PT);", onMessageReceived);
                    } else if (demo === Demo.HUB_KNOWN_PT) {
                        client.getWebSocket().sendGuiAction("init(HUB_KNOWN_PT);", onMessageReceived);
                    } else if (demo === Demo.HOLTER) {
                        client.getWebSocket().sendGuiAction("init(HOLTER);", onMessageReceived);
                    } else if (demo === Demo.TERMINATE_HUB_MODE) {
                        client.getWebSocket().sendGuiAction("init(TERMINATE_HUB_MODE);", onMessageReceived);
                    } else if (demo === Demo.TERMINATE_HOLTER_MODE) {
                        client.getWebSocket().sendGuiAction("init(TERMINATE_HOLTER_MODE);", onMessageReceived);
                    } else if (demo === Demo.NEW_EXAM_HUB_MODE) {
                        client.getWebSocket().sendGuiAction("init(NEW_EXAM_HUB_MODE);", onMessageReceived);
                    } else if (demo === Demo.NEW_EXAM_HOLTER_MODE) {
                        client.getWebSocket().sendGuiAction("init(NEW_EXAM_HOLTER_MODE);", onMessageReceived);
                    } else if (demo === Demo.TEST_ELECTRODES_HUB) {
                        client.getWebSocket().sendGuiAction("init(TEST_ELECTRODES_HUB);", onMessageReceived);
                    } else if (demo === Demo.VIEW_EXAMS_HUB) {
                        client.getWebSocket().sendGuiAction("init(VIEW_EXAMS_HUB);", onMessageReceived);
                    } else if (demo === Demo.VIEW_INTERPRETATION_HUB) {
                        client.getWebSocket().sendGuiAction("init(VIEW_INTERPRETATION_HUB);", onMessageReceived);
                    }
                    else {
                        client.getWebSocket().sendGuiAction("init(STD);", onMessageReceived);
                    }
                d3.select(".demo-splash").style("display", "none");
                d3.select(".content").style("display", "block");
                // start playback
                // start_playback();
            });
        }).addListener("WebSocketConnectionClosed", function (e) {
            console.log("web socket closed");
        }).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
            console.log(msg);
        });

        client.connectToServer();
    });
