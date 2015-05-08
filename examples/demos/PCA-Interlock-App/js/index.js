/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser:true*/
/*global require*/

require.config({
    baseUrl: '../../client/app',
    paths: {
        d3: '../lib/d3',
        stateParser: './util/PVSioStateParser'
    }
});
/**
 * Loading the module PVSioWebClient.
 */
require([
    'PVSioWebClient',
    'stateParser'
], function (PVSioWebClient, stateParser) {
    /*
     * Websocket used to communicate with SAPERE
     */
    var sapere_websocket;
    var supervisorID = "Supervisor_ID";
    var supervisorAdded = false;
    var client;
    var start_tick, stop_tick;
    var d3 = require("d3/d3");
    /*
     * It indicates the state of the socket (the one connecting to Sapere)
     */
    var tick = null;


    /**
     * @function logOnDiv
     * @description Utility function, sends messages to different div elements in the html page
     * @memberof module:Pacemaker-Simulink
     */
    function logOnDiv(msg, logger) {
        var newP = document.createElement("p");
        newP.innerHTML = msg;
        var node = document.getElementById(logger);
        node.appendChild(newP);
        //node.scrollTop = node.scrollHeight;
        $("#" + logger).animate({ scrollTop: $("#" + logger)[0].scrollHeight}, 500);
    }


    function addDevice(){
        if (!supervisorAdded){
            logOnDiv('Adding Supervisor', 'monitor');
            var SupervisorAction = {
                action: "add",
                deviceID: supervisorID,
                type: "Supervisor",
                description: "Supervisor description"
            };
            sapere_websocket.send(JSON.stringify(SupervisorAction));
        }
        else{
            logOnDiv('Supervisor already added!', 'monitor');

        }
//        start_tick();
    }

    function sendControlData(to, message){
        logOnDiv('Sending Message \n'+ message, 'monitor');
        var payload = {
            to: to,
            msg: message
        };
        var DeviceAction = {
            action: "orchestrate",
            deviceID: supervisorID,
            message: payload
        };
        sapere_websocket.send(JSON.stringify(DeviceAction));
    }


    /**
     * @function connectSapere
     * @description Called when clicking the button 'Connect' on the web page.
     * It connects to the Sapere middleware through a new WebSocket.
     * It takes the address from the corresponding field in the html page.
     * @memberof module:Pacemaker-Sapere
     */
    var connectSapere = function () {
        var url = "ws://localhost:8080/SapereEE/actions",
            sapere_log = "monitor";
        
        return new Promise(function (resolve, reject) {
            if (sapere_websocket && sapere_websocket.readyState === 1) {
                logOnDiv("ICE Supervisor already connected to ICE Network Controller.", sapere_log);
                resolve();
            } else {
                logOnDiv("Establishing connection with ICE Network Controller at " + url, sapere_log);
                sapere_websocket = new WebSocket(url);

                /*
                 * It starts the control process that send the information to Sapere
                 */
                sapere_websocket.onopen = function () {
                    var msg = "Connected to ICE Network Controller!";
                    logOnDiv(msg, sapere_log);
                    addDevice();
                    resolve();
                };
                /*
                 * Receive event
                 */
                sapere_websocket.onmessage = function (evt) {
                    onMessageReceivedSapere(evt);
                };
                /*
                 * Close event
                 */
                sapere_websocket.onclose = function () {
                    var msg = "Disconnected from ICE Network Controller (" + url + ")";
                    logOnDiv(msg, sapere_log);
                    sapere_websocket = null;
                    reject(msg);
                };
                /*
                 * Connection failed
                 */
                sapere_websocket.onerror = function () {
                    var msg = "Unable to connect to ICE Network Controller (" + url + ")";
                    logOnDiv(msg, sapere_log);
                    sapere_websocket = null;
                    reject(msg);
                };
            }
        });
    };

    /**
     * @function onMessageReceivedSapere
     * @description Callback function of sapere websocket <br>
     * Parse the data sent from Sapere and send it to PVS in order to process it
     * @memberof module:Pacemaker-Sapere
     */
    function onMessageReceivedSapere(event) {
        var text = event.data;

        // JSON FORMAT
        if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
                replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

            var device = JSON.parse(event.data);

            if (device.action === "add") {
                supervisorAdded = true;
                logOnDiv('Supervisor added', 'monitor');
            }
            if (device.action === "remove") {
                supervisorAdded = false;
                logOnDiv('Supervisor removed', 'monitor');
            }
            if (device.action === "toggle") {
                var node = document.getElementById(device.deviceID);
                var statusText = node.children[2];
                if (device.status === "ON") {
                    node.setAttribute("class", "animated pulse infinite device " + device.type);
                    statusText.innerHTML = "Status: " + device.status + " (<a href=\"#\" OnClick=toggleDevice(" + device.deviceID + ")>Turn OFF</a>)";
                } else if (device.status === "OFF") {
                    node.setAttribute("class", "animated flip device " + device.type);
                    statusText.innerHTML = "Status: " + device.status + " (<a href=\"#\" OnClick=toggleDevice(" + device.deviceID + ")>Turn ON</a>)";
                }
            }
            if (device.action === "update") {
                logOnDiv("FROM:    " + device.from +
                         "\nTYPE:    " + device.type +
                         "\nMESSAGE: \n" + device.message, "monitor");
                var res = stateParser.parse(device.message);
                client.getWebSocket()
                        .sendGuiAction("update_spo2(" + res.spo2 + ")" +
                                       "(" + client.getWebSocket().lastState() + ");",
                                       onMessageReceived);
            }
        } // NO JSON
        else{
            logOnDiv(text, "monitor");
        }
    }

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


    /**
     function to handle when an output has been received from the server after sending a guiAction
     if the first parameter is truthy, then an error occured in the process of evaluating the gui action sent
     */
    function onMessageReceived(err, event) {
        if (!err) {
            logOnDiv(event.data.toString(), "monitor");

            var res = stateParser.parse(event.data.toString());
            if (res.pump.input.cmd.trim() === "pause"){
                console.log("pause pump");
                sendControlData(supervisorID, "click_btn_pause");
            }
        } else { console.log(err); }
    }


    /*
     * Get client instance and the websocket it uses to communicate with the server
     */
    client = PVSioWebClient.getInstance();
    
    function startSapereEE() {
        var msg = "Starting ICE Network Controller...";
        console.log(msg);
        return new Promise(function (resolve, reject) {
            client.getWebSocket().send({ type: "startSapereEE" }, function(err) {
                if (!err) {
                    msg = "ICE Network Controller started successfully!";
                    console.log(msg);
                    resolve(msg);
                } else {
                    msg = "Error while starting ICE Network Controller (" + JSON.stringify(err) + ")";
                    console.log(msg);
                    reject(err);
                }
            });
        });
    }
    function stopSapereEE() {
        var msg = "Stopping ICE Network Controller...";
        console.log(msg);
        return new Promise(function (resolve, reject) {
            client.getWebSocket().send({ type: "startSapereEE" }, function(err) {
                if (!err) {
                    msg = "ICE Network Controller stopped.";
                    console.log(msg);
                    resolve(msg);
                } else {
                    msg = "Error while stopping ICE Network Controller (" + JSON.stringify(err) + ")";
                    console.log(msg);
                    reject(err);
                }
            });
        });
    }
    
    function init() {
        d3.select("#startICENetwork").on("click", startSapereEE);
        d3.select("#stopICENetwork").on("click", stopSapereEE);
    }

    /*
     * Register event listener for websocket connection to the server.
     */
    client.addListener('WebSocketConnectionOpened', function () {
        console.log('web socket connected');
        logOnDiv('PVSio Web Socket connected', 'monitor');
        /*
         * Start the PVS Process for the pacemaker
         */
        client.getWebSocket().startPVSProcess({
            name: 'main.pvs',
            demoName: 'PCA-Interlock-App/pvs'
        }, function (err) {
            if (!err) {
                logOnDiv('PVS Process started', 'monitor');
                
                // start ICE Network Controller (SapereEE) & connect ICE supervisor to it
                startSapereEE().then(function (res) {
                    connectSapere();
                }).catch(function (err) {
                    console.log(err);
                });    
                
                // initialise PVS model
                client.getWebSocket().sendGuiAction(client.getWebSocket().lastState() + ';', function () {});
            } else {
                console.log(err);
            }
        });
        init();
    }).addListener('WebSocketConnectionClosed', function () {
        logOnDiv('PVS Process closed', 'monitor');
        console.log('web socket closed');
    }).addListener('processExited', function () {
        var msg = 'Warning!!!\r\nServer process exited. See console for details.';
        console.log(msg);
    });
    /*
     * Initiate connection to the server
     */
    logOnDiv('Connecting to the PVSio server...', 'monitor');
    client.connectToServer();
});