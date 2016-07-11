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
        Screen = require("../Screen");

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
            var d3El = d3.select(this.el);
            this._dropdown = d3El.select(".screen-dropdown");
            this._updateScreenList();
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
                });
        },
        
        showEditScreen: function () {
            var screen = new Screen(); // TODO: nwatson: use the selected screen
            
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
            // TODO: nwatson: implement deleting screens
        },
        
        _updateScreenList: function () {
            var _this = this;
            
            var selection = this._dropdown.selectAll("li")
                .data(this.collection.models);
            
            selection.enter()
                .append("li")
                .on("click", function(d) {
                    _this.collection.selectScreen(d);
                });
                
            selection.text(function(d) {
                return d;
            });
            
            selection.exit().remove();
        }
    });

    return ScreenControlsView;
});
