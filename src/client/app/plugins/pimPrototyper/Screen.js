/**
 * Represents a screen with the PIM Prototyping mode. Responsible for managing the screen's widgets and overall
 * attributes.
 */

/*global define, Backbone, _ */
define(function (require, exports, module) {
    "use strict";

    var Screen = Backbone.Model.extend({
        defaults: {
            name: "New screen",
            isInitial: false
        },

        initialize: function () {
            this.set("widgets", {});
        },

        toJSON: function () {
            // Copy the attributes from the Backbone model
            var json = _.clone(this.attributes);
            if (json.image != null) {
                // Replace the image object with its file name
                json.image = json.image.name;
            }

            var flatWidgets = [];

            // Replace each widget object with its JSON representation
            _.forEach(json.widgets, function (w) {
                flatWidgets.push(w.toJSON());
            });

            json.widgets = flatWidgets;

            return json;
        }
    });

    return Screen;
});
