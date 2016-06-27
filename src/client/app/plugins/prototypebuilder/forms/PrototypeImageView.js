/**
 * View that provides the main image display region of a prototype editor
 * @author Nathaniel Watson
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Handlebars, Backbone */
define(function (require, exports, module) {
    "use strict";
    var template = require("text!./templates/prototypeEditor.handlebars");
    var WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager();

    var PrototypeImageView = Backbone.View.extend({
        // TODO: nwatson: add some sort of clean-up function that removes listener callbacks when the view is removed (this will depend on how the widgetmanager is implemented)

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
         * @param {Object} options Options for the view. Only default/standard Backbone options are used.
         */
        initialize: function (options) {
            this.d3El = d3.select(this.el);
			this.template = Handlebars.compile(template);

            this.render();
            this._innerContainer = this.d3El.select("div"); // TODO: nwatson: select based on class
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
                            WidgetManager.scaleAreaMaps(scale);
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
         * @function hasImage
         * @description Returns whether or not the view is currently displaying an image
         * @returns {Boolean} true if an image is currently displayed, false otherwise.
         */
        hasImage: function() {
            return this.img && this.img.src && this.img.src !== "";
        }

    });

    return PrototypeImageView;
});
