/**
 * View that provides controls for managing a PIM prototype's screens
 * @author Nathaniel Watson
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone */
define(function (require, exports, module) {
    "use strict";

    var pimScreenControlsView = Backbone.View.extend({
        /**
         * @function initialize
         * @description Creates a new screen controls view and renders it to the provided element
         * @param {Object} options Options for the view.
         */
        initialize: function (options) {
            this.$el.append("<div class='dropdown'></div");
            this.render();
        },

        /**
         * @function render
         * @description Updates and redraws the view.
         * @return {PrototypeImageView} The view
         */
        render: function () {
            return this;
        }
    });

    return pimScreenControlsView;
});
