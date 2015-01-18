/**
 * Binds user interface elements to events
 * @author Patrick Oladimeji
 * @date 11/15/13 16:29:55 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
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
        PluginManager = require("plugins/PluginManager");
	
    var template = require("text!pvsioweb/forms/maincontent.handlebars");
	
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
        }
	};
});