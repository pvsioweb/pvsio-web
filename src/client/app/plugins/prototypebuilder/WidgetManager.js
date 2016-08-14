/**
 * @module WidgetManager
 * @desc WidgetManager deals with interacting with user interface widgets used for prototyping picture based uis.
 * @author Patrick Oladimeji
 * @date 10/30/13 21:42:56 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, _, Promise */
define(function (require, exports, module) {
    "use strict";
    var d3 = require("d3/d3"),
        uidGenerator    = require("util/uuidGenerator"),
        EditWidgetView  = require("pvsioweb/forms/editWidget"),
        BaseWidgetManager  = require("pvsioweb/BaseWidgetManager"),
        Button          = require("widgets/Button"),
        Display         = require("pvsioweb/Display"),
        Storyboard      = require("pvsioweb/Storyboard"),
        EmuTimer        = require("widgets/EmuTimer"),
        StateParser     = require("util/PVSioStateParser"),
        PreferenceKeys  = require("preferences/PreferenceKeys"),
        Preferences     = require("preferences/PreferenceStorage").getInstance();
    var wm;

   ///TODO this should be moved out of this file and promoted to a property, or a function parameter in createImageMap
    function renderResponse(err, res) {
        if (!err) {
            var stateString = res.data[0];
            var state = StateParser.parse(stateString);
            //render storyboard
            wm.getStoryboardWidgets().forEach(function (w) {
                w.render(state);
            });
            //render displays
            wm.getDisplayWidgets().forEach(function (w) {
                w.render(state);
            });
        } else {
            if (err.failedCommand && err.failedCommand.indexOf("tick(") === 0) {
                wm.stopTimers();
                console.log("wallclock paused (tick function not implemented in the selected prototype)");
            }
        }
    }
    function createImageMap(widget) {
        if (widget.needsImageMap()) {
            widget.createImageMap({
                callback: renderResponse
            });
        }
    }
    function handleTimerEdit(emuTimer, wm) {
        EditWidgetView.create(emuTimer)
            .on("ok", function (e, view) {
                view.remove();
                emuTimer.updateWithProperties(e.data);
                // fire event widget created
                var event = { action: "create", timer: emuTimer };
                wm.trigger("TimerModified", event);
            }).on("cancel", function (e, view) {
                view.remove();
            });
    }
    function installKeypressHandler(wm) {
        d3.select(document).on("keydown", function () {
            if (d3.select("#btnSimulatorView").classed("active")) {
                var eventKeyCode = d3.event.which;
                var widget = wm._keyCode2widget[eventKeyCode];
                if (widget && typeof widget.evts === "function" && widget.evts().indexOf('click') > -1) {
                    widget.click({ callback: renderResponse });
                    halo(widget.id());
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                } else if (widget && typeof widget.evts === "function" && widget.evts().indexOf("press/release") > -1) {
                    widget.pressAndHold({ callback: renderResponse });
                    halo(widget.id());
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                }
            }
        });
        d3.select(document).on("keyup", function () {
            if (d3.select("#btnSimulatorView").classed("active")) {
                var eventKeyCode = d3.event.which;
                var widget = wm._keyCode2widget[eventKeyCode];
                if (widget && typeof widget.evts === "function" && widget.evts().indexOf("press/release") > -1) {
                    widget.release({ callback: renderResponse });
                }
                haloOff();
            }
        });
    }
    function halo (buttonID) {
        var coords = d3.select("." + buttonID).attr("coords");
        coords = coords.split(",");
        var pos = {x1: +coords[0], y1: +coords[1], x2: +coords[2], y2: coords[3]};
        var w = pos.x2 - pos.x1, hrad = w / 2, h = pos.y2 - pos.y1, vrad = h / 2, brad = hrad + "px " + vrad + "px";
        var mark = d3.select(".animation-halo");
        if (mark.empty()) {
            mark = d3.select("#imageDiv").append("div").attr("class", "animation-halo");
        }
        mark.style("top", pos.y1 + "px").style("left", pos.x1 + "px")
            .style("width", (pos.x2 - pos.x1) + "px").style("height", (pos.y2 - pos.y1) + "px")
            .style("border-top-left-radius", brad).style("border-top-right-radius", brad)
            .style("border-bottom-left-radius", brad).style("border-bottom-right-radius", brad);
    }
    function haloOff (buttonID) {
        d3.select(".animation-halo").remove();
    }

    /**
        @class WidgetManager
        @classdesc WidgetManager deals with interacting with user interface widgets used for prototyping picture based uis.
    */
    /**
     * Instantiates a new WidgetManager
     * @private
     */
    function WidgetManager() {
        this._widgets = {};
        this._timers = {};
        this._keyCode2widget = {}; // this table stores information about the relation between keyCodes and widgets
        Preferences.addListener("preferenceChanged", function (e) {
            if (e.key === "WALL_CLOCK_INTERVAL" && wm._timers.tick) {
                var timerRate = Preferences.get(PreferenceKeys.WALL_CLOCK_INTERVAL) * 1000;
                wm._timers.tick.updateInterval(timerRate);
                console.log("tick timer interval updated to " + timerRate / 1000 + " secs");
            }
        });
    }

    WidgetManager.prototype = Object.create(BaseWidgetManager.prototype);

    /**
        Restores the widget definitions passed in the parameter.
        @param {Object} defs JSOn specification for the widget definitions to restore
        @memberof WidgetManager
     */
    WidgetManager.prototype.restoreWidgetDefinitions = function (defs) {
        var wm = this;
        if (defs) {
            wm._keyCode2widget = {};
            var widget;
            _.each(defs.widgetMaps, function (w, i) {
                w.type = w.type.toLowerCase();
                if (w.type === "button") {
                    if (defs.regionDefs && defs.regionDefs[i].coords) {
                        var coords = defs.regionDefs[i].coords;
                        var height = coords[3] - coords[1], width = coords[2] - coords[0], x = coords[0], y = coords[1];
                        widget = new Button(
                            w.id,
                            { top: y, left: x, width: width, height: height },
                            { callback: renderResponse, buttonReadback: w.buttonReadback }
                        );
                    } else {
                        widget = new Button(
                            w.id,
                            null,
                            { callback: renderResponse, buttonReadback: w.buttonReadback,
                              keyCode: w.keyCode, keyName: w.keyName }
                        );
                    }
                    if (w.keyCode) {
                        wm._keyCode2widget[w.keyCode] = widget;
                    }
                } else if (w.type === "display") {
                    widget = new Display(w.id);
                } else if (w.type === "storyboard") {
                    widget = new Storyboard(w.id);
                }
                if (w.hasOwnProperty("events")) {
                    w.evts = w.events;
                    delete w.events;
                }
                widget.updateWithProperties(w);
                wm.addWidget(widget);
            });

            //create div
            if (defs.regionDefs) {
                defs.regionDefs.forEach(function (d) {
                    widget = wm.getWidget(d["class"]);
                    var coords = d.coords.split(",").map(function (d) {
                        return parseFloat(d);
                    });
                    var h = coords[3] - coords[1], w = coords[2] - coords[0], x = coords[0], y = coords[1];
                    var coord = {x: x, y: y, width: w, height: h};
                    wm.trigger("WidgetRegionRestored", widget, coord);
                    createImageMap(widget);
                });
            }

            installKeypressHandler(this);
        }
    };

    WidgetManager.prototype.addWallClockTimer = function () {
        //pop up the timer edit dialog
        var id = "tick";
        var timerRate = Preferences.get(PreferenceKeys.WALL_CLOCK_INTERVAL) * 1000;
        var emuTimer = new EmuTimer(id, { timerEvent: id, timerRate: timerRate, callback: renderResponse });
        this._timers[emuTimer.id()] = emuTimer;
        // fire event widget created
        var event = { action: "create", timer: emuTimer };
        wm.trigger("TimerModified", event);

    };
    WidgetManager.prototype.editTimer = function (emuTimer) {
        handleTimerEdit(emuTimer, wm);
    };

    /**
        Edits the specified widget.
        @param {Widget} widget The widget to be edited.
        @memberof module:WidgetManager
     */
    WidgetManager.prototype.editWidget = function (widget, data) {
        widget.updateWithProperties(data);
        //create an interactive image area only if there isnt one already
        createImageMap(widget);
        if (data.keyCode) {
            wm._keyCode2widget[data.keyCode] = widget;
        }
        // fire event widget modified
        wm.trigger("WidgetModified");
    };
    WidgetManager.prototype.editTimer = function (emuTimer) {
        // the only timer type supported in the current implementation is EmuTimer
        handleTimerEdit(emuTimer, wm);
    };
    WidgetManager.prototype.startTimers = function () {
        _.each(this._timers, function (timer) {
            timer.start();
        });
    };
    WidgetManager.prototype.stopTimers = function () {
        _.each(this._timers, function (timer) {
            timer.stop();
        });
    };

    /**
     * Creates a new widget and adds it to the WidgetManager
     * @param {object} data Data object from a NewWidgetView callback
     * @param {object} coord Object with top, left, width, height properties specifying the widget position
     * @param {function} onCreate Called once the widget has been created, but before it is added to the manager
     * @return {Widget} The new widget
     */
    WidgetManager.prototype.addNewWidget = function (data, coord, onCreate) {
        var _this = this;
        var id = data.type + "_" + uidGenerator();
        var widget;
        if (data.type === "button") {
            widget = new Button(id, coord,
                { callback: renderResponse,
                  buttonReadback: data.buttonReadback });
            if (data.keyCode) {
                _this._keyCode2widget[data.keyCode] = widget;
            }
        } else {
            widget = new Display(id);
        }

        if (onCreate) {
            onCreate(widget, renderResponse);
        }

        if (data.hasOwnProperty("events")) {
            data.evts = data.events;
            delete data.events;
        }

        widget.updateWithProperties(data);
        this.addWidget(widget);
        this.trigger("WidgetModified", {action: "create", widget: widget});

        return widget;
    };

    /**
        Removes all the widgets on the interface
     */
    WidgetManager.prototype.clearWidgets = function () {
        _.each(this._widgets, function (value) {
            value.remove();//remove the widgets from the interface
        });
        this._widgets = {};
    };

    /**
        Gets a list of all the display widgets loaded on the page.
        @returns {Display[]}
        @memberof module:WidgetManager
     */
    WidgetManager.prototype.getDisplayWidgets = function () {
        return _.filter(this._widgets, function (w) {
            return w.type() === "display";
        });
    };
    /**
        Gets a list of all the button widgets loaded on the page.
        @returns {Button[]}
        @memberof WidgetManager
     */
    WidgetManager.prototype.getButtonWidgets = function () {
        return _.filter(this._widgets, function (w) {
            return w.type() === "button";
        });
    };
    /**
        Gets a list of storyboard widgets
        @returns {Storyboard}
        @memberof WidgetManager
     */
    WidgetManager.prototype.getStoryboardWidgets = function () {
        return _.filter(this._widgets, function (w) {
            return w.type() === "storyboard";
        });
    };

    /**
        Gets a list of all the widgets loaded on the page. The returned array contains all
        widget types
        @returns {Widget[]}
        @memberof WidgetManager
    */
    WidgetManager.prototype.getAllWidgets = function () {
        return this.getDisplayWidgets()
                    .concat(this.getButtonWidgets())
                    .concat(this.getStoryboardWidgets());
    };
    WidgetManager.prototype.getAllTimers = function () {
        return _.filter(this._widgets, function (w) {
            return w.type() === "timer";
        });
    };

    /**
     * Returns a JSON object representing widget definitions for the currently open project
       @memberof WidgetManager
     */
    WidgetManager.prototype.getWidgetDefinitions = function () {
        var scale = (d3.select("#imageDiv svg > g").node()) ?
                        +(d3.select("#imageDiv svg > g").attr("transform").replace("scale(", "").replace(")", "")) || 1 : 1;
        var widgets = [], regionDefs = [];
        _.each(this._widgets, function (widget) {
            widgets.push(widget.toJSON());
            var a = widget.imageMap();
            if (a) {
                var scaledCoords = a.attr("coords").split(",").map(function (c) {
                    return +c / scale;
                }).join(",");
                regionDefs.push({"class": a.attr("class"), shape: a.attr("shape"),
                            coords: scaledCoords, href: a.attr("href")});
            }
        });
        return {widgetMaps: widgets, regionDefs: regionDefs};
    };

    /**
     * @function addStoryboardImages
     * @memberof WidgetManager
     * @param descriptors {Array(Object)} Array of image descriptors. Each image descriptor has the following properties:
     *        <li> type: (String), defines the MIME type of the image. The string starts with "image/", e.g., "image/jpeg" </li>
     *        <li> imagePath: (String), defines the path of the image. The path is relative to the current project folder </li>
     * @returns {Promise(Array({image}))}
     */
    WidgetManager.prototype.addStoryboardImages = function (descriptors) {
        var _this = this;
        var storyboard = this.getStoryboardWidgets() || new Storyboard();
        return new Promise(function (resolve, reject) {
            storyboard.addImages(descriptors).then(function (images) {
                _this.addWidget(storyboard);
                _this.trigger("WidgetModified");
                resolve(images);
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    /**
     * @function displayEditStoryboardDialog
     * @memberof WidgetManager
     */
    WidgetManager.prototype.displayEditStoryboardDialog = function () {
        var _this = this;
        var w = this.getStoryboardWidgets() || [];
        if (w.length === 0) {
            w.push(new Storyboard());
            w[0].addListener("EditStoryboardComplete", function (data) {
                _this.addWidget(data.widget); // this overwrites the widget
                _this.trigger("WidgetModified"); // this marks the widget file as dirty
                _this.trigger("StoryboardWidgetModified", {widget: data.widget}); // this will trigger an event listener in Project that creates a directory with the storyboard image files
            });
        }
        w[0].displayEditStoryboardDialog();
    };

    module.exports = {
        /**
         * Returns a singleton instance of the WidgetManager
         */
        getWidgetManager: function () {
            if (!wm) {
                wm = new WidgetManager();
            }
            return wm;
        }
    };
});
