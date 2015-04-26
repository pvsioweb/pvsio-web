/**
 * Main entry point for pvsioweb module
 * @author Patrick Oladimeji
 * @date 4/19/13 17:23:31 PM
 */
/*jshint unused: false*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, d3, layoutjs, Promise*/
define(function (require, exports, module) {
    "use strict";
    var PVSioWebClient = require("PVSioWebClient"),
        Logger         = require("util/Logger"),
        ui             = require("plugins/prototypebuilder/interface"),
        PrototypeBuilder = require("plugins/prototypebuilder/PrototypeBuilder"),
        ProjectManager = require("project/ProjectManager"),
        ModelEditor    = require("plugins/modelEditor/ModelEditor"),
        Emulink        = require("plugins/emulink/Emulink"),
        SafetyTest     = require("plugins/safetyTest/SafetyTest"),
        GraphBuilder   = require("plugins/graphbuilder/GraphBuilder"),
        ProjectAutoSaver = require("plugins/autoSaver/ProjectAutoSaver"),
        PluginManager  = require("plugins/PluginManager"),
        Constants      = require("util/Constants"),
        displayQuestion = require("pvsioweb/forms/displayQuestion");

    var client = PVSioWebClient.getInstance(),
        pluginManager = PluginManager.getInstance(),
        splashTimeout = null,
        reconnectOptions = (window.location.origin.indexOf("pvsioweb.herokuapp.com") >= 0 ||
                   window.location.origin.indexOf("pvsioweb.org") >= 0) ? { silentMode: true} : null;

    //register event listeners
    client.addListener('WebSocketConnectionOpened', function (e) {
        ui.webSocketConnected();
    }).addListener("WebSocketConnectionClosed", function (e) {
        ui.webSocketDisconnected();
        ui.reconnectToServer(reconnectOptions);
    }).addListener("processExited", function (e) {
        ui.pvsProcessDisconnected();
    });
    ProjectManager.getInstance().addListener("PVSProcessReady", function (event) {
        ui.pvsProcessConnected();
    }).addListener("PVSProcessDisconnected", function (event) {
        ui.pvsProcessDisconnected();
    });


    function enablePlugin(plugin) {
        return function () {
            return pluginManager.enablePlugin(plugin);
        };
    }

    function createDefaultProject() {
        return function () {
            return ProjectManager.getInstance().createDefaultProject();
        };
    }

    function showInterface(opt) {
        return function (res) {
            return new Promise(function (resolve, reject) {
                layoutjs({el: "#model-editor-container"});
                //hide pvsio-web loading screen and make the tool visible
                if (opt && opt.noSplash) {
                    d3.select("#PVSio-web-logo").style("display", "none");
                    d3.select("#content").classed("offscreen", false);
                    resolve(res);
                } else {
                    splashTimeout = setTimeout(function () {
                        d3.select("#PVSio-web-logo").style("display", "none");
                        d3.select("#content").classed("offscreen", false);
                        resolve(res);
                    }, 2400);
                }
            });
        };
    }

    function registerPluginEvents() {
        return function (ws) {
            ui.init()
                .on("pluginToggled", function (event) {
                    var plugin;
                    switch (event.target.getAttribute("name")) {
                    case "EmuCharts Editor":
                        plugin = Emulink.getInstance();
                        break;
                    case "Graph Builder":
                        plugin = GraphBuilder.getInstance();
                        break;
                    case "Safety Test":
                        plugin = SafetyTest.getInstance();
                        break;
                    case "Model Editor":
                        plugin = ModelEditor.getInstance();
                        break;
                    case "Prototype Builder":
                        plugin = PrototypeBuilder.getInstance();
                        break;
                    }
                    if (event.target.checked) {
                        pluginManager.enablePlugin(plugin);
                    } else {
                        pluginManager.disablePlugin(plugin);
                    }
                });
            return Promise.resolve(true);
        };
    }

    module.exports = {
        start: function (opt) {
            clearTimeout(splashTimeout);
            return new Promise(function (resolve, reject) {
                client.connectToServer()
                    .then(registerPluginEvents())
                    .then(enablePlugin(ProjectAutoSaver.getInstance()))
                    .then(enablePlugin(PrototypeBuilder.getInstance()))
                    .then(createDefaultProject())
                    .then(showInterface(opt))
                    .then(function (res) {
                        resolve(res);
                    }).catch(function (err) {
                        console.log(err);
                        reject(err);
                    });
            });
        },
        reset: function () {///This function is not tested
            //client.disconnectFromServer();
            if (pluginManager.isLoaded(PrototypeBuilder.getInstance())) {
                pluginManager.disablePlugin(PrototypeBuilder.getInstance());
                ui.unload();
            }
        }
    };
});
