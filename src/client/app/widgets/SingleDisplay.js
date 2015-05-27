/**
 * @module SingleDisplay
 * @version 2.0
 * @description Renders a basic digital display.
 *              This module provide APIs for rendering multi-line menus, and to change the look and feel of
 *              the rendered text, including: cursors, background color, font, size, alignment.
 * @author Paolo Masci, Patrick Oladimeji
 * @date Apr 1, 2015
 *
 * @example <caption>Typical use of SingleDisplay APIs within a PVSio-web plugin module.</caption>
 * // Example module that uses SingleDisplay.
 * define(function (require, exports, module) {
 *     "use strict";
 *
 * });
 *
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, document */

define(function (require, exports, module) {
    "use strict";

    var d3 = require("d3/d3");
    var black, white;

    /**
     * @function <a name="SingleDisplay">SingleDisplay</a>
     * @description Constructor.
     * @param id {String} The ID of the HTML element where the display will be rendered.
     * @param coords {Object} The four coordinates (x1,y1,x2,y2) of the display, specifying
     *        the left, top, right, bottom corner of the rectangle (for shape="rect")
     * @param opt {Object}
     * @memberof module:SingleDisplay
     * @instance
     */
    function SingleDisplay(id, coords, opt) {
        opt = opt || {};
        this.id = id;
        this.parent = opt.parent || "body";
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 200;
        this.height = coords.height || 80;
        this.font = [this.height, "px ", (opt.font || "sans-serif")];
        this.smallFont = (this.height * 0.8) + "px " + (opt.font || "sans-serif");
        this.align = opt.align || "center";
        if (opt.backgroundColor) {
            black = opt.backgroundColor;
        } else { black = (opt.inverted) ? '#fff' : "#000"; }
        if (opt.fontColor) {
            white = opt.fontColor;
        } else { white = (opt.inverted) ? "#000" : '#fff'; }
        this.textBaseline = "middle";
        this.div = d3.select("#" + this.parent)
                        .append("div").style("position", "absolute")
                        .style("top", this.top + "px").style("left", this.left + "px")
                        .style("width", this.width + "px").style("height", this.height + "px")
                        .style("margin", 0).style("padding", 0)
                        .style("display", "block").attr("id", id).attr("class", id);
        this.div.append("span").attr("id", id + "_span").attr("class", id + "_span")
                        .attr("width", this.width).attr("height", this.height)
                        .style("margin", 0).style("padding", 0)
                        .style("vertical-align", "top");
        this.div.append("canvas").attr("id", id + "_canvas").attr("class", id + "_canvas")
                        .attr("width", this.width).attr("height", this.height)
                        .style("margin", 0).style("padding", 0)
                        .style("vertical-align", "top");
        return this;
    }

    SingleDisplay.prototype.render = function (txt, opt) {
        function clearContext(context, width, height) {
            context.save();
            context.fillStyle = black;
            context.fillRect(0, 0, width, height);
            context.restore();
        }
        function renderln(data, opt) {
            opt = opt || {};
            data.context.fillStyle = opt.backgroundColor || (opt.inverted) ? white : black;
            data.context.fillRect(0, 0, data.width, data.height);
            data.context.fillStyle = opt.fontColor || (opt.inverted) ? black : white;
            if (data.align === "left") {
                data.context.textAlign = "start";
                data.context.fillText(data.txt, 0, data.height / 2);
            } else if (data.align === "right") {
                data.context.textAlign = "end";
                data.context.fillText(data.txt, data.width, data.height / 2);
            } else {
                data.context.textAlign = "center";
                data.context.fillText(data.txt, data.width / 2, data.height / 2);
            }
        }
        opt = opt || {};
        var context = document.getElementById(this.id + "_canvas").getContext("2d");
        clearContext(context, this.width, this.height);
        context.textBaseline = this.textBaseline;
        var align = opt.align || this.align;
        context.font = this.font.join("");
        renderln({ txt: txt, context: context, align: align, height: this.height, width: this.width }, opt);
        this.reveal();
        return this;
    };
    
    SingleDisplay.prototype.renderGlyphicon = function (icon, opt) {
        opt = opt || {};
        var span = document.getElementById(this.id + "_span");
        span.setAttribute("class", "glyphicon " + icon);
        span.style.color = opt.fontColor || this.fontColor || white;
        this.reveal();
        return this;
    };
    
    SingleDisplay.prototype.renderMultiline = function (txt, opt) {
        function clearContext(context, width, height) {
            context.save();
            context.fillStyle = black;
            context.fillRect(0, 0, width, height);
            context.restore();
        }
        function renderln(data, opt) {
            opt = opt || {};
            data.context.fillStyle = (opt.inverted) ? white : black;
            data.context.fillRect(0, data.y, data.width, data.height);
            data.context.fillStyle = (opt.inverted) ? black : white;
            var y_offset = data.y || 0;
            if (data.align === "left") {
                data.context.textAlign = "start";
                data.context.fillText(data.txt, 0, data.height / 2 + y_offset);
            } else if (data.align === "right") {
                data.context.textAlign = "end";
                data.context.fillText(data.txt, data.width, data.height / 2 + y_offset);
            } else {
                data.context.textAlign = "center";
                data.context.fillText(data.txt, data.width / 2, data.height / 2 + y_offset);
            }
        }
        opt = opt || {};
        var context = document.getElementById(this.id + "_canvas").getContext("2d");
        clearContext(context, this.width, this.height);
        context.textBaseline = this.textBaseline;
        var align = opt.align || this.align;
        if (typeof txt === "object" && txt.length) {
            var fontsize = opt.menuFontSize || (this.height / txt.length);
            var newFont = [ fontsize ].concat(this.font.slice(1));
            context.font = newFont.join("");
            var i = 0;
            for (i = 0; i < txt.length; i++) {
                var offset = (opt.direction === "inverted") ? txt.length - i - 1 : i;
                renderln({
                    txt:  txt[i],
                    context: context,
                    align: align,
                    width: this.width,
                    height: (this.height / txt.length),
                    x: 0,
                    y: (offset * (this.height / txt.length))
                }, { inverted: (+opt.selected === i) ? true : false });
            }
        }
        this.reveal();
        return this;
    };

    SingleDisplay.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    SingleDisplay.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

//    SingleDisplay.prototype.move = function (data) {
//        data = data || {};
//        if (data.top) {
//            this.top = data.top;
//            this.div.style("top", this.top + "px");
//        }
//        if (data.left) {
//            this.left = data.left;
//            this.div.style("left", this.left + "px");
//        }
//        return this;
//    };

//    SingleDisplay.prototype.setWidth = function (w) {
//        width = w || width;
//        return this;
//    };
//
//    SingleDisplay.prototype.setHeight = function (h) {
//        height = h || height;
//        return this;
//    };
//
//    SingleDisplay.prototype.setFont = function (f) {
//        if (f) {
//            this.font = f;
//        }
//        return this;
//    };
//
//    SingleDisplay.prototype.setSmallfont = function (f) {
//        if (f) {
//            this.smallFont = f;
//        }
//        return this;
//    };

    module.exports = SingleDisplay;
});
