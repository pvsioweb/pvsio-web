/**
 * PropertyTemplates plugin.
 * @author Paolo Masci
 * @date Oct 4, 2016
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Promise, Handlebars */
define(function (require, exports, module) {
    "use strict";
    var	//consistencyTemplate	= require("plugins/propertytemplates/consistency/consistencyTemplate"),
        PVSioWebClient      = require("PVSioWebClient"),
        frontend            = require("text!plugins/propertytemplates/frontend.handlebars");
    var panel, instance;

    function PropertyTemplates() {

    }

    PropertyTemplates.prototype.initialise = function () {
        var _this = this;
        panel = PVSioWebClient.getInstance().createCollapsiblePanel({
            headerText: "Property Templates",
            owner: _this.getName()
        });
        var data = {};
        var html = Handlebars.compile(frontend)(data);
        panel.html(html);
        return Promise.resolve(true);
    };

    PropertyTemplates.prototype.getName = function () {
        return "Property Templates";
    };

    PropertyTemplates.prototype.unload = function () {
        PVSioWebClient.getInstance().removeCollapsiblePanel(panel);
        return Promise.resolve(true);
    };

    PropertyTemplates.prototype.getDependencies = function () {
        return [];
    };

    module.exports = {
        getInstance: function () {
            instance = instance || new PropertyTemplates();
            return instance;
        }
    };
});
