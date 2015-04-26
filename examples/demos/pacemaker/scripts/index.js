/**
 * @module Pacemaker-Simulink
 * @version 1.0
 * @description
 * Pacemaker-Simulink is responsible for connecting PVSio to MathWork simulation of the heart.<br>
 * It uses two websockets:
 * <ul><li>simulink_websocket: to communicate with the heart model
 * <li>pvsio_websocket: for linking to the PVSio simulation environment (transmitting the data to be verified by pvs)</li></ul>
 * @author Paolo Masci, ?
 * @date ?
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, browser:true*/
/*global gip, cmd, require, connectSimulink, WebSocket*/
/**
 * Configuration object for Require.js, it specifies the baseURL where the paths will be evaluated from
 *  and the paths of of the javascript libraries we need.
 *  In this module we need only the d3 library for DOM manipulation.
 */
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
    'use strict';

    /*
     * Loading javascript libraries
     */
    var d3 = require('d3/d3');
    /*
     * Websocket used to communicate with Simulink
     */
    var simulink_websocket;
    /*
     * Contains the GPCAUI state that will be rendered in the log window
     */
    var pvsio_response;
    var timestamp = new Date();
    /*
     * Outputs of the heart model, sent by Simulink
     */
    var Aget;
    var Vget;
    /*
     * Inputs of the heart model, sent to Simulink
     */
    var AP;
    var VP;
    /*
     * It indicates the state of the socket (the one connecting to Simulink)
     */
    var socketClosed;
    /*
     * Control monitor variables
     */
    var ctrl_monitor = 0;
    var ctrl_monitor_active = 0;
    var ctrl_tick_interval = 2000; //ms

    var client;
    var pvsio_websocket;

    /**
     * @function prettyprintPVSioOutput
     * @description Utility function, used to have a uniform output for the gpcaui state
     * @memberof module:Pacemaker-Simulink
     * @return {String}
     */
    var prettyprintPVSioOutput = function (obj) {
        var ans = obj.toString().replace(new RegExp(',,', 'g'), ', ');
        return ans.toString().replace(new RegExp(',:=', 'g'), ' :=');
    };

    /**
     * @function prettyprintPVSioOutput
     * @description Utility function, used to have a uniform output for the messages from the controller
     * @memberof module:Pacemaker-Simulink
     * @return {String}
     */
    var prettyprintReceivedData = function (obj) {
        var ans = obj.toString().substring(obj.toString().indexOf('(#'), obj.toString().indexOf('#)') + 2);
        return ans;
    };

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
        node.scrollTop = node.scrollHeight;
        //$("#" + logger).animate({ scrollTop: $("#" + logger)[0].scrollHeight}, 500);
    }

    /**
     * @function send_sense_tick
     * @description Called every ctrl_tick_interval ms interval.<br>
     * Get the last state from PVS, parse it, and forward it to the Simulink websocket
     * @memberof module:Pacemaker-Simulink
     */
    function send_sense_tick() {
        console.log('[ ' + timestamp.toTimeString() + ' ] ');

        var output = '0'; // SENSING
        simulink_websocket.send(output);
        logOnDiv('                  SENT TO SIMULINK >>>>>>>>>>>>>>>>' + '<' + 'br>' + '[SENSING] ' + output, 'orchestrator');

    }

    /**
     * @function startSensingPacing
     * @description Calls send_sense_tick every ctrl_tick_interval ms
     * @memberof module:Pacemaker-Simulink
     */
    function startSensingPacing() {
        if (ctrl_monitor_active === 0) {
            /*
             * It returns an ID used by clearInterval to stop the periodic action
             */
            ctrl_monitor = setInterval(function () {
                send_sense_tick();
            }, ctrl_tick_interval);
            ctrl_monitor_active = 1;
        }
    }

    /**
     * @function stop_sensing_pacing
     * @description Stops the periodic action started by startSensingPacing
     * @memberof module:Pacemaker-Simulink
     */
    function stop_sensing_pacing() {
        console.log('Controller disconnected');
        clearInterval(ctrl_monitor);
        ctrl_monitor_active = 0;
    }

    /**
     * @function onMessageReceivedPVSio
     * @description Callback function of PVS. <br>
     * Parse the pacing information and send them back to Simulink immediately
     * @memberof module:Pacemaker-Simulink
     */
    function onMessageReceivedPVSio(err, event) {
        if (!err) {
            var res = event.data.toString();
            if (res.indexOf('(#') === 0) {
                pvsio_response = prettyprintPVSioOutput(event.data);
                console.log('Message received from PVSio: ' + pvsio_response);
                /*
                 * Information parsing
                 * parse -> returns a JSON object
                 * evaluate -> convert the string (representing the number also in a factorial form), in a number
                 */
                AP = stateParser.evaluate(stateParser.parse(res).AP);
                VP = stateParser.evaluate(stateParser.parse(res).VP);
                if (AP !== 0 || VP !== 0 || true) {
                    logOnDiv('<-RECEIVED<br>[ ' + timestamp.toTimeString() + ' ] <br>' + pvsio_response, 'pvsio_response_log');
                }
                var output = '(# AP := ' + AP + ', VP := ' + VP + ' #)'; // PACING
                simulink_websocket.send(output);
                logOnDiv('                  SENT TO SIMULINK >>>>>>>>>>>>>>>>' + '<' + 'br>' + '[PACING] ' + output, 'orchestrator');

            }
        } else {
            console.log(err);
        }
    }

    /**
     * @function onMessageReceivedSimulink
     * @description Callback function of simulink websocket <br>
     * Parse the data sent from Simulink and send it to PVS in order to process it
     * @memberof module:Pacemaker-Simulink
     */
    function onMessageReceivedSimulink(evt) {
        console.log('Message received from Simulink: ' + prettyprintReceivedData(evt.data));
        Aget = stateParser.evaluate(stateParser.parse(evt.data).Aget);
        Vget = stateParser.evaluate(stateParser.parse(evt.data).Vget);
        if (Aget !== 0 || Vget !== 0 || true) {
            logOnDiv('<-RECEIVED<br>' + prettyprintReceivedData(evt.data), 'simulink_response_log');
        }
        if (!socketClosed) {
            pvsio_websocket.sendGuiAction('pacemaker_tick(10)( ' + prettyprintReceivedData(evt.data) + ' )( ' + prettyprintPVSioOutput(pvsio_websocket.lastState()) + ' );', onMessageReceivedPVSio);
            logOnDiv('  <<<<<<<<<<<<<<<<    SENT TO PVSio                   ' + '<' + 'br>' + 'pacemaker_tick(10)( ' + prettyprintReceivedData(evt.data) + ' )( ' + prettyprintPVSioOutput(pvsio_websocket.lastState()) + ' );', 'orchestrator');
        }
    }

    /**
     * @function enable_button
     * @description Binding user interface buttons, in this case there is only the connect button.
     * @memberof module:Pacemaker-Simulink
     */
    function enable_button() {
        logOnDiv('Button enabled', 'orchestrator');
        d3.select('.btnConnect').on('click', function () {
            connectSimulink();
        });
        d3.select('.btnStop').on('click', function () {
            stop_sensing_pacing();
        });
    }

    /**
     * @function connectSimulink
     * @description Called when clicking the button 'Connect' on the web page.
     * It connects to the Simulink module through a new WebSocket.
     * It takes the address from the corresponding field in the html page.
     * @memberof module:Pacemaker-Simulink
     */
    var connectSimulink = function () {
        /*
         * If websocket is supported by the browser
         */
        if (window.hasOwnProperty('WebSocket')) {
            var location = document.getElementById('ControllerAddress').value + ':2317';
            logOnDiv('Trying to estrablish connection with controller at ' + location, 'orchestrator');
            simulink_websocket = new WebSocket('ws://' + location, 'pacemaker');
            /*
             * It starts the control process that send the information to Simulink
             */
            simulink_websocket.onopen = function () {
                socketClosed = false;
                logOnDiv('Controller connected', 'orchestrator');
                startSensingPacing();
            };
            /*
             * Receive event
             */
            simulink_websocket.onmessage = function (evt) {
                onMessageReceivedSimulink(evt);
            };
            /*
             * Close event
             */
            simulink_websocket.onclose = function () {
                socketClosed = true;
                logOnDiv('Controller disconnected', 'orchestrator');
                stop_sensing_pacing();
            };
        } else {
            /*
             * The browser doesn't support WebSocket
             */
            alert('WebSocket NOT supported by your Browser!');
        }
    };

    /*
     * Get client instance and the websocket it uses to communicate with the server
     */
    client = PVSioWebClient.getInstance();
    pvsio_websocket = client.getWebSocket();

    /*
     * Register event listener for websocket connection to the server.
     */
    client.addListener('WebSocketConnectionOpened', function () {
        console.log('web socket connected');
        logOnDiv('PVSio Web Socket connected', 'orchestrator');
        /*
         * Start the PVS Process for the pacemaker
         */
        pvsio_websocket.startPVSProcess({
            name: 'main.pvs',
            demoName: 'pacemaker/pvs'
        }, function (err) {
            if (!err) {
                logOnDiv('PVS Process started', 'orchestrator');
                pvsio_websocket.sendGuiAction(pvsio_websocket.lastState() + ';', enable_button);
            } else {
                console.log(err);
            }
        });
    }).addListener('WebSocketConnectionClosed', function () {
        logOnDiv('PVS Process closed', 'orchestrator');
        console.log('web socket closed');
    }).addListener('processExited', function () {
        var msg = 'Warning!!!\r\nServer process exited. See console for details.';
        console.log(msg);
    });
    /*
     * Initiate connection to the server
     */
    logOnDiv('Connecting to the PVSio server...', 'orchestrator');
    client.connectToServer();

});