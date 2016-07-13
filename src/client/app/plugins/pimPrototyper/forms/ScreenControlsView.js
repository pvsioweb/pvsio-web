/**
 * View that provides controls for managing a PIM prototype's screens
 * @author Nathaniel Watson
 */
/*global define, Backbone */
define(function (require, exports, module) {
    "use strict";

    var d3 = require("d3/d3"),
        template = require("text!./templates/ScreenControlsView.handlebars"),
        NewScreenView = require("./NewScreenView"),
        EditScreenView = require("./EditScreenView"),
        Screen = require("../Screen"),
        DisplayQuestion = require("pvsioweb/forms/displayQuestion");

    var ScreenControlsView = Backbone.View.extend({

        events: {
            "click .btn-screen-add": "showAddScreen",
            "click .btn-screen-options": "showEditScreen",
            "click .btn-screen-delete": "showDeleteConfirmation"
        },

        /**
         * @function initialize
         * @description Creates a new screen controls view and renders it to the provided element
         * @param {Object} options Options for the view.
         * @param {ScreenCollection} options.collection Required. Collection of screens to use
         */
        initialize: function (options) {
            this.listenTo(this.collection, "add remove change:name", this._updateScreenList); // TODO: don't re-render the list when a single item changes
            this.listenTo(this.collection, "selectionChanged", this._updateSelection);
            this._template = Handlebars.compile(template);
            this.render();

            return this;
        },

        /**
         * @function render
         * @description Updates and redraws the view.
         * @return {ScreenControlsView} The view
         */
        render: function () {
            this.$el.html(this._template());
            this.d3El = d3.select(this.el);
            this._dropdown = this.d3El.select(".screen-dropdown");
            this._screenButtons = [
                this.d3El.select(".btn-screen-options"),
                this.d3El.select(".btn-screen-image"),
                this.d3El.select(".btn-screen-delete")
            ];

            this._updateScreenList();
            this._setButtonStates(false); // disable buttons by default
            return this;
        },

        showAddScreen: function () {
            var _this = this;

            new NewScreenView()
                .on("cancel", function(data, view) {
                    view.remove();
                })
                .on("ok", function(data, view) {
                    view.remove();
                    var screen = new Screen({ name: data.data.screenName });
                    _this.collection.add(screen);
                    _this.collection.setSelected(screen);
                });
        },

        showEditScreen: function () {
            var screen = this.collection.getSelected();

            new EditScreenView({ model: screen })
                .on("cancel", function(data, view) {
                    view.remove();
                })
                .on("ok", function(data, view) {
                    screen.set({
                        name: data.data.screenName,
                        isInitial: (!!data.data.isInitial)
                    });
                    view.remove();
                });
        },

        showDeleteConfirmation: function () {
            var _this = this;

            var data = {header: "Confirm Delete",
                        question: "Are you sure you want to delete the current screen? This cannot be undone.",
                        buttons: ["Cancel", "Delete"],
                        primaryLevel: "danger"};
            DisplayQuestion.create(data)
                .on("delete", function (e, view) {
                    _this.collection.remove(_this.collection.getSelected());
                    view.remove();
                }).on("cancel", function (e, view) {
                    view.remove();
                });
        },

        _updateScreenList: function () {
            var _this = this;

            var selected = this.collection.getSelected();
            this.d3El.select(".btn-screen-dropdown_label").text(selected ? selected.get("name") : "No screens");

            var selection = this._dropdown.selectAll("li")
                .data(this.collection.models);

            var listItemsEnter = selection.enter().append("li");

            listItemsEnter.append("a")
                .on("click", function(d) {
                    _this.collection.setSelected(d);
                });

            selection.select("a").text(function(d) {
                return d.get("name");
            });

            selection.exit().remove();
        },

        _updateSelection: function (oldSelection, newSelection) {
            if (newSelection == null) {
                this._setButtonStates(false);
            } else if (oldSelection == null) {
                this._setButtonStates(true);
            }

            this._updateScreenList();
        },

        _setButtonStates: function (enabled) {
            for (var index in this._screenButtons) {
                this._screenButtons[index].attr("disabled", enabled ? null : "true");
            }
        }
    });

    return ScreenControlsView;
});
