/**
 * A collection of PIM Prototypinh screens that together make up a sinlge PIM prototype.
 * attributes.
 */

define(function (require, exports, module) {
    var ScreenCollection = Backbone.Collection.extend({

        initialize: function () {
            this.on("remove", this._onScreenRemoved);
        },

        /**
         * Set the given screen as the selected/active screen
         * @param {Screen} screen Screen to set as active
         */
        setSelected: function (screen) {
            var oldSelected = this._selected;
            this._selected = screen;

            if (oldSelected !== this._selected) {
                this.trigger("selectionChanged", oldSelected, this._selected);
            }
        },

        /**
         * Gets the screen that is currently active/selected within the UI
         * @return {[type]} [description]
         */
        getSelected: function () {
            return this._selected;
        },

        _onScreenRemoved: function (screen) {
            if (screen === this.getSelected()) {
                this.setSelected(this.at(0));
            }
        }
    });

    return ScreenCollection;
});
