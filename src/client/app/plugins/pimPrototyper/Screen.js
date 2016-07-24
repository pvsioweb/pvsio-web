/**
 * Represents a screen with the PIM Prototyping mode. Responsible for managing the screen's widgets and overall
 * attributes.
 */

/*global define, Backbone */
define(function (require, exports, module) {
    "use strict";

    var Screen = Backbone.Model.extend({
        defaults: {
            name: "New screen",
            isInitial: false
        },

        initialize: function () {
            this.set("widgets", {});
        }
    });

    return Screen;
});
