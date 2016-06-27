/**
 * View that lists all widgets within a prototype
 * @author Nathaniel Watson
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Backbone */
define(function (require, exports, module) {
    "use strict";
    var WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager();

    var WidgetsListView = Backbone.View.extend({
        // TODO: nwatson: add some sort of clean-up function that removes listener callbacks when the view is removed (this will depend on how the widgetmanager is implemented)

        /**
         * @function initialize
         * @description Creates a new widget list view and renders it to the provided element
         * @param {Object} options Options for the view.
         * @param {Object} [options.widgets] Array of widgets to display within the view.
         */
        initialize: function (data) {
            this.$el.addClass("widgetsList noselect");
            var list = document.createElement("ul");
            this.$el.append(list);
            this.d3ListElement = d3.select(list);
            this.widgets = data.widgets || [];

            var _this = this;

            WidgetManager.addListener("WidgetModified", function (event) {
                switch (event.action) {
                case "create":
                    _this.widgets.push(event.widget);
                    break;
                case "remove":
                    var index = _this.widgets.indexOf(event.widget);
                    if (index > -1) {
                        _this.widgets.splice(index, 1);
                    }
                    break;
                default:
                    break;
                }
                _this.update();
            }).addListener("WidgetSelected", function (event) {
                _this.selectWidget(event.widget, event.event.shiftKey);
            }).addListener("WidgetSelectionCleared", function (event) {
                _this.d3ListElement.selectAll("li").classed("selected", false);
            });

            this.render();
        },

        /**
         * @function render
         * @description Updates and redraws the view.
         * @return {PrototypeImageView} The view
         */
        render: function () {
            this.update();
            return this;
        },

        /**
         * @function selectWidget
         * @description Displays the given widget as selected within the view
         * @param {Widget} widget Widget to select
         * @param {boolean} add True if the widget should be added to the current selection, false if only it should
         * be selected.
         */
        selectWidget: function(widget, add) {
            var element = this.listItems.filter(function (d) { return d.id === widget.id; });

            if (!add) {
                this.listItems.classed("selected", false);
            }

            element.classed("selected", true);
        },

        labelFunction: function (widget) {
            var label = widget.type() + ": ";
            if (widget.type() === "display") {
                label += widget.displayKey();
            } else {
                label += widget.functionText();
            }
            return label;
        },

        /**
        * @function update
        * @description Updates the data that the view displays (and updates the UI with any new/changed data)
         */
        update: function () {
            var _this = this;

            this.listItems = this.d3ListElement.selectAll("li.list-group-item").data(this.widgets, function (widget) {
                return widget.id();
            });
            var enteredItems = this.listItems.enter();
            var exitedItems = this.listItems.exit();
            enteredItems.append("li").attr("class", "list-group-item")
                .attr("widget-id", function (w) {
                    _this.d3ListElement.selectAll("ul li").classed("selected", false);
                    return w.id();
                }).classed("selected", false)
                .text(this.labelFunction)
                .on("click", function (w) {
                    var event = d3.event;
                    WidgetManager.fire({type: "WidgetSelected", widget: w, event: event});
                    event.preventDefault();
                    event.stopPropagation();
                }).on("dblclick", function (w) {
                    var event = d3.event;
                    var dblclick = new Event("dblclick");
                    w.element().node().dispatchEvent(dblclick);
                    event.preventDefault();
                    event.stopPropagation();
                });
            this.listItems.text(this.labelFunction);
            exitedItems.transition().duration(220).style("opacity", 0).remove();
        },

        /**
         * @function setWidgets
         * @description Sets the widgets that the view displays and updates the view accordingly
         * @param {Array} widgets Array of widget objects that the view should represent
         */
        setWidgets: function(widgets) {
            this.widgets = widgets || [];
            this.update();
        }
    });

    return WidgetsListView;
});
