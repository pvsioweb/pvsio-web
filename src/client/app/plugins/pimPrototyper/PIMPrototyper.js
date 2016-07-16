/*global layoutjs */
define(function (require, exports, module) {
    "use strict";
    var PVSioWebClient = require("PVSioWebClient"),
        ScreenControlsView = require("./forms/ScreenControlsView"),
        ScreenCollection = require("./ScreenCollection"),
        template = require("text!./forms/templates/PIMPrototyperPanel.handlebars");

    var instance;

    var PIMPrototyper = function() {
    };

    PIMPrototyper.prototype._init = function () {
        this._container = PVSioWebClient.getInstance().createCollapsiblePanel({headerText: "PIM Prototyper", owner: this.getName()});
        this._container.html(Handlebars.compile(template)());

        this._screens = new ScreenCollection();
        this._screenControls = new ScreenControlsView({
            el: this._container.select(".panel-footer").node(),
            collection: this._screens
         });

         layoutjs({el: "#body"});
    };

    PIMPrototyper.prototype.getName = function() {
        return "PIM Prototyper";
    };

    PIMPrototyper.prototype.initialise = function () {
        this._init();
        return Promise.resolve(true);
    };

    PIMPrototyper.prototype.unload = function () {
        PVSioWebClient.getInstance().removeCollapsiblePanel(this._container);
        return Promise.resolve(true);
    };

    PIMPrototyper.prototype.getDependencies = function () {
        return [];
    };

    module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new PIMPrototyper();
            }
            return instance;
        }
    };
});
