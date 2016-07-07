/**
 * View that provides the main image display region of a prototype editor
 * @author Nathaniel Watson
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Handlebars, Backbone */
define(function (require, exports, module) {
    "use strict";
    var template = require("text!./templates/prototypeImageArea.handlebars");
    var imageMapper     = require("imagemapper");

    var PrototypeImageView = Backbone.View.extend({
        events: {
            "click button.btn-primary": "onClickLoad",
            "dragover .dndcontainer": "onDragOver",
            "dragenter .dndcontainer": "onDragEnter",
            "dragexit .dndcontainer": "onDragExit",
            "drop .dndcontainer": "onDrop"
        },

        /**
         * @function initialize
         * @description Creates a new image view area and renders it to the provided element
         * @param {Object} options Options for the view.
         * @param {WidgetManager} options.widgetManager Widget Manager to be used by the view
         */
        initialize: function (options) {
            this.d3El = d3.select(this.el);
            this._widgetManager = options.widgetManager;
			this.template = Handlebars.compile(template);

            this.render();
            this._innerContainer = this.d3El.select("div"); // TODO: nwatson: select based on class
            this.updateMapCreator();
            
            var _this = this;
            this.listenTo(this._widgetManager, "WidgetRegionRestored", function(widget, coord) {
                var mark = _this._mapCreator.restoreRectRegion(coord);
                mark.attr("id", widget.id()).classed(widget.type(), true);
                widget.element(mark);

                mark.on("dblclick", function () {
                    _this.trigger("WidgetEditRequested", mark.attr("id"));
                });
            });
        },

        /**
         * @function render
         * @description Updates and redraws the view.
         * @return {PrototypeImageView} The view
         */
        render: function () {
            this.$el.html(this.template());
            return this;
        },

        onClickLoad: function () {
            this.trigger('loadImageClicked');
        },

        onDragEnter: function (ev) {
            d3.select(ev.currentTarget).style("border", "5px dashed black");
            return false;
        },

        onDragOver: function (ev) {
            // Needed so that the drop event is received
            ev.preventDefault();
        },

        onDragExit: function (ev) {
            d3.select(ev.currentTarget).style("border", null);
            ev.preventDefault();
            ev.stopPropagation();
            return false;
        },

        onDrop: function (ev) {
            this.onDragExit(ev);
            this.trigger('imageDropped', ev.originalEvent.dataTransfer.files[0]);
            return false;
        },
        
        /**
         * Displays the region for the given widget as selected
         * @param {Widget} widget Widget to display as selected
         * @param {boolean} add True if any existing selection is being added to
         */
        selectWidget: function (widget, add) {
            this._mapCreator.selectRegion(widget.element(), add);
        },
        
        /**
         * Removes a widget regions from the display
         */
        clearWidgetAreas: function () {
            this._mapCreator.clear();
        },

        /**
         * @function setImage
         * @description Updates the image displayed within the prototype editor
         * @param image {Descriptor} Descriptor of the prototype picture.
         * @returns {Promise(real)} A Promise that resolves to a real value that specifies the scale of the rendered image
         */
        setImage: function (image) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                function imageLoadComplete(res) {
                    //if the image width is more than the the containing element scale it down a little
                    var scale = 1;
                    function resize() {
                        if (_this.img) {
                            var pbox = _this.d3El.node().getBoundingClientRect(),
                                adjustedWidth = _this.img.width,
                                adjustedHeight = _this.img.height;
                            scale = 1;

                            if (_this.img.width > pbox.width && pbox.width > 0 && pbox.height > 0) {
                                adjustedWidth = pbox.width;
                                scale = adjustedWidth / _this.img.width;
                                adjustedHeight = scale * _this.img.height;
                            }

                            _this._innerContainer.style("width", adjustedWidth + "px").style("height", adjustedHeight + "px");
                            _this.d3El.select("img").attr("src", _this.img.src).attr("height", adjustedHeight).attr("width", adjustedWidth);
                            _this.d3El.select("svg").attr("height", adjustedHeight).attr("width", adjustedWidth);
                            _this.d3El.select("svg > g").attr("transform", "scale(" + scale + ")");
                            //hide the draganddrop stuff
                            _this.d3El.select("#imageDragAndDrop.dndcontainer").style("display", "none");

                            //update widgets maps after resizing
                            d3.select("#builder-controls").style("height", (50 + adjustedHeight) + "px");
                            _this._widgetManager.scaleAreaMaps(scale);
                        }
                    }

                    resize();
                    _this.d3El.node().addEventListener("resize", resize); // TODO: nwwatson: resizing the editor currently has no effect

                    resolve(scale);
                }

                _this.img = new Image();
                _this.img.onload = imageLoadComplete;
                _this.img.onerror = function (res) {
                    //show the image drag and drop div
                    _this.d3El.select("#imageDragAndDrop.dndcontainer").style("display", null);
                    alert("Failed to load picture " + image.name);
                    reject(res);
                };
                _this.img.name = image.path;
                _this.img.src = image.content;
            });
        },
        
        /**
         * Removes the image displayed within the prototype builder image view
         */
        clearImage: function() {
            this._innerContainer.attr("style", null);
            this.d3El.select("img").attr("src", "").attr("height", "430").attr("width", "1128");
            this.d3El.select("svg").attr("height", "0").attr("width", "0");
            this.d3El.attr("style", "");
            this.d3El.select("#body").attr("style", "height: 480px"); // 430 + 44 + 6
            //show the image drag and drop div
            this.d3El.select("#imageDragAndDrop.dndcontainer").style("display", null);
        },

        /**
         * @function hasImage
         * @description Returns whether or not the view is currently displaying an image
         * @returns {Boolean} true if an image is currently displayed, false otherwise.
         */
        hasImage: function() {
            return this.img && this.img.src && this.img.src !== "";
        },
        
        updateMapCreator: function(scale, cb) {
            scale = scale || 1;
            var wm = this._widgetManager, event = {};
            var _this = this;
            
            var round = function(v) {
                return Math.round(v * 10) / 10;
            };
            
            imageMapper({scale: scale, element: _this.d3El.select("img").node(), parent: _this.el, onReady: function (mc) {
                _this._mapCreator = mc.on("create", function (e) {
                    var region = e.region;
                    region.on("dblclick", function () {
                        _this.trigger("WidgetEditRequested", region.attr("id"));
                    });
                    
                    //pop up the widget edit dialog
                    var coord = {
                        top: round(e.pos.y),
                        left: round(e.pos.x),
                        width: round(e.pos.width),
                        height: round(e.pos.height)
                    };
                    
                    _this.trigger("WidgetRegionDrawn", coord, region);
                }).on("resize", function (e) {
                    wm.updateLocationAndSize(e.region.attr("id"), e.pos, e.scale);
                    event.action = "resize";
                    event.widget = wm.getWidget(e.region.attr("id"));
                    wm.trigger("WidgetModified", event);
                }).on("move", function (e) {
                    wm.updateLocationAndSize(e.region.attr("id"), e.pos, e.scale);
                    event.action = "move";
                    event.widget = wm.getWidget(e.region.attr("id"));
                    wm.trigger("WidgetModified", event);
                }).on("remove", function (e) {
                    event.widget = wm.getWidget(e.regions.node().id);
                    e.regions.each(function () {
                        var w = wm.getWidget(d3.select(this).attr("id"));
                        if (w) {
                            wm.removeWidget(w);
                            w.remove();
                        } else {
                            d3.select(this.parentNode).remove();
                        }
                    });
                    event.action = "remove";
                    wm.trigger("WidgetModified", event);
                }).on("select", function (e) {
                    _this.trigger("WidgetSelected", wm.getWidget(e.region.attr("id")), e.event.shiftKey);
                }).on("clearselection", function (e) {
                    var widgets = [];
                    e.regions.each(function () {
                        widgets.push(wm.getWidget(d3.select(this).attr("id")));
                    });
                    wm.trigger("WidgetSelectionCleared", {widgets: widgets, event: e.event});
                });
                if (cb) { cb(); }
            }});
        }

    });

    return PrototypeImageView;
});
