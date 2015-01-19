/**
 * Binds user interface elements to events
 * @author Patrick Oladimeji
 * @date 11/15/13 16:29:55 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true*/
/*global define, d3, $, Backbone, Handlebars, Promise, layoutjs */
define(function (require, exports, module) {
	"use strict";
	var WSManager = require("websockets/pvs/WSManager"),
        ModelEditor = require("plugins/modelEditor/ModelEditor"),
        Emulink = require("plugins/emulink/Emulink"),
		SafetyTest = require("plugins/safetyTest/SafetyTest"),
        GraphBuilder = require("plugins/graphbuilder/GraphBuilder"),
        PrototypeBuilder = require("plugins/prototypebuilder/PrototypeBuilder"),
		Logger	= require("util/Logger"),
        SaveProjectChanges = require("project/forms/SaveProjectChanges"),
        Notification = require("pvsioweb/forms/displayNotification"),
        NotificationManager = require("project/NotificationManager"),
        Descriptor = require("project/Descriptor"),
        fs = require("util/fileHandler"),
        PluginManager = require("plugins/PluginManager"),
        PVSioWeb = require("PVSioWebClient").getInstance(),
        ProjectManager = require("project/ProjectManager"),
        displayQuestion = require("pvsioweb/forms/displayQuestion");
	
    var template = require("text!pvsioweb/forms/maincontent.handlebars");
    /**
     * @private
     * Shows a prompt to the user signalling that the connection to the server has broken.
     * Also starts a polling timer to check if the server is back up and running. The dialog
     * is automatically dismissed when the server is restarted.
     */
    function reconnectToServer() {
        var timerid,
            q,
            data = {
                header: "Reconnect to server",
                question: "Uh-oh  the server seems to be down :(. Restart it by running ./start.sh" +
                    " from the pvsio-web installation directory. Once you have restarted the server this message will go away",
                buttons: ["Dismiss", "Reconnect"]
            };
        
        function retry() {
            if (!PVSioWeb.isWebSocketConnected()) {
                ProjectManager.getInstance().reconnectToServer()
                    .then(function () {
                        q.remove();
                        clearTimeout(timerid);
                    }).catch(function () {
                        timerid = setTimeout(retry, 1000);
                    });
            } else {
                q.remove();
            }
        }
        //dont create a new question form if one already exists
        if (d3.select(".overlay").empty()) {
            q = displayQuestion.create(data).on("reconnect", function (e, view) {
                if (!PVSioWeb.isWebSocketConnected()) {
                    ProjectManager.getInstance().reconnectToServer()
                        .then(function () {
                            view.remove();
                            clearTimeout(timerid);
                        }).catch(function (err) {
                            view.remove();
                        });
                } else {
                    view.remove();
                }
            }).on("dismiss", function (e, view) {
                view.remove();
            });
            //create a timer to poll the connection to the server
            //this automatically dismisses the dialog after successful reconnection
            timerid = setTimeout(retry, 1000);
        }
    }
    
    /**
     * @private
     * Called when the pvs process has been disconnected. It sets the appropriate UI markers
     * that signifies that the process is disconnected.
     * @param {object|string} err The error message or object returned from the server signifying why the process disconnected
     */
    function pvsProcessDisconnected(err) {
        var pvsioStatus = d3.select("#lblPVSioStatus");
        pvsioStatus.select("span").remove();
        Logger.log(err);
        pvsioStatus.classed("disconnected", true)
            .append("span").attr("class", "glyphicon glyphicon-warning-sign");
        //style("background", "red");
        PVSioWeb.isPVSProcessConnected(false);
    }
    /**
     * @private
     * Called when the pvs process has been connected. It sets the appropriate UI markers
     * that signifies that the process is connected and ready.
     */
    function pvsProcessReady() {
        var pvsioStatus = d3.select("#lblPVSioStatus");
        pvsioStatus.select("span").remove();
        var msg = "PVSio process ready!";
        Logger.log(msg);
        pvsioStatus.append("span").attr("class", "glyphicon glyphicon-ok");
        PVSioWeb.isPVSProcessConnected(true);
    }
    /**
     * @private
     * Called when the websocket connection to the server has been established. It sets the appropriate UI markers
     * that signifies that the websocket connection is active.
     */
    function webSocketConnected() {
        var el = d3.select("#lblWebSocketStatus");
        Logger.log("connection to pvsio server established");
		d3.select("#btnCompile").attr("disabled", null);
        el.classed("disconnected", false)
            .select("span").attr("class", "glyphicon glyphicon-ok");//style("background", "rgb(8, 88, 154)");
        PVSioWeb.isWebSocketConnected(true);
    }
    /**
     * @private
     * Called when the websocket connection to the server has been disconnected. It sets the appropriate UI markers
     * that signifies that the connection is disconnected. It also triggers the disconnection of the pvs process since
     * connection to the pvs process  depends on connection to the server.
     */
    function webSocketDisconnected() {
        var el = d3.select("#lblWebSocketStatus");
        Logger.log("connection to pvsio server closed");
		d3.select("#btnCompile").attr("disabled", true);
        el.classed("disconnected", true)
            .select("span").attr("class", "glyphicon glyphicon-warning-sign");//.style("background", "red");
        PVSioWeb.isWebSocketConnected(false);
        pvsProcessDisconnected("Websocket connection closed");
    }

	
    var  MainView = Backbone.View.extend({
        initialize: function (data) {
			this.render(data);
		},
		render: function (data) {
			var t = Handlebars.compile(template);
			this.$el.html(t(data));
			$("body").append(this.el);
			layoutjs({el: "#content", useFullHeight: true});
			return this;
		},
		events: {
            "change input[type='checkbox']": "checkboxClicked",
            "click .plugin-box": "pluginClicked"
		},
        checkboxClicked: function (event) {
            this.trigger("pluginToggled", event);
        },
        pluginClicked: function (event) {
            if (event.target.tagName.toLowerCase() === "li") {
                d3.select(event.target).select("input[type='checkbox']").node().click();
            }
        },
		scriptClicked: function (event) {
            this.trigger("scriptClicked", $(event.target).attr("name"));
        }
    });
    
    function createHtmlElements(data) {
        return new MainView(data);
    }
    
    
	module.exports = {
		init: function (data) {
            data = data || {plugins: [PrototypeBuilder.getInstance(), ModelEditor.getInstance(),
                                      Emulink.getInstance(), GraphBuilder.getInstance(), SafetyTest.getInstance()].map(function (p) {
                return {label: p.constructor.name, plugin: p};
            })};
            PluginManager.getInstance().init();
            PluginManager.getInstance().addListener("PluginEnabled", function (event) {
                d3.select("#plugin_" + event.plugin.constructor.name).property("checked", true);
            }).addListener("PluginDisabled", function (event) {
                d3.select("#plugin_" + event.plugin.constructor.name).property("checked", false);
            });
            if (this._view) { this.unload(); }
            this._view = createHtmlElements(data);
            return this._view;
        },
        unload: function () {
            this._view.remove();
        },
        webSocketConnected: function () {
            webSocketConnected();
        },
        webSocketDisconnected: function () {
            webSocketDisconnected();
        },
        pvsProcessConnected: function () {
            pvsProcessReady();
        },
        pvsProcessDisconnected: function (reason) {
            pvsProcessDisconnected(reason);
        },
        reconnectToServer: function () {
            reconnectToServer();
        }
	};
});