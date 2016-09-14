/**
 * @module LED
 * @version 2.0
 * @description Renders LED light bulbs.
 *              The look and feel of LEDs can be customised, e.g., color, size, shape.
 * @author Paolo Masci
 * @date Apr 2, 2015
 *
 * @example <caption>Typical use of LED APIs within a PVSio-web plugin module.</caption>
 * // Example module that uses LED.
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
    var Widget = require("widgets/Widget"),
        StateParser = require("util/PVSioStateParser"),
        property = require("util/property");


    /**
     * @function <a name="LED">LED</a>
     * @description Constructor.
     * @param id {String} The ID of the HTML element where the display will be rendered.
     * @param coords {Object} The four coordinates (x1,y1,x2,y2) of the display, specifying
     *        the left, top, right, bottom corner of the rectangle (for shape="rect")
     * @param opt {Object}
     * @memberof module:LED
     * @instance
     */
    function LED(id, coords, opt) {
        opt = opt || {};
        this.id = id;
        this.parent = (opt.parent) ? ("#" + opt.parent) : "body";
        this.top = coords.top || 0;
        this.left = coords.left || 0;
        this.width = coords.width || 12;
        this.height = coords.height || 12;
        this.radius = opt.radius || (this.height / 4);
        this.color = opt.color || "#00FF66"; // default is bright   green
        this.blinking = opt.blinking || false;
        this.cursor = opt.cursor || "default";
        this.div = d3.select(this.parent)
                        .append("div").style("position", "absolute")
                        .style("top", this.top + "px").style("left", this.left + "px")
                        .style("width", this.width + "px").style("height", this.height + "px")
                        .style("margin", 0).style("padding", 0)
                        .style("display", "block").attr("id", id).attr("class", id);
        this.div.append("canvas").attr("id", id + "_canvas").attr("class", id + "_canvas")
                        .attr("width", this.width).attr("height", this.height)
                        .style("margin", 0).style("padding", 0)
                        .style("vertical-align", "top");
        this.div.style("cursor", this.cursor);
        this.isOn = false;
        Widget.call(this, id, "led");
        opt.ledKey = opt.ledKey || id;
        opt.ledON = opt.ledON || ""; // empty string means always on
        this.ledKey = property.call(this, opt.ledKey);
        this.ledON = property.call(this, opt.ledON);
        this.ledColor = property.call(this, this.color);
        this.example = opt.example || ""; // this is used in the prototype builder to demonstrate the font style of the display
        return this;
    }
    LED.prototype = Object.create(Widget.prototype);
    LED.prototype.constructor = LED;
    LED.prototype.parentClass = Widget.prototype;
    /**
     * Returns a JSON object representation of this Widget.
     * @returns {object}
     * @memberof module:LED
    */
    LED.prototype.toJSON = function () {
        return {
            type: this.type(),
            id: this.id(),
            ledON: this.ledON(),
            ledKey: this.ledKey(),
            ledColor: this.ledColor()
        };
    };
    /**
     * Updates the location and size of the widget according to the given position and size
     */
    LED.prototype.updateLocationAndSize = function (pos) {
        LED.prototype.parentClass.updateLocationAndSize.apply(this, arguments);
        this.top = pos.y || 0;
        this.left = pos.x || 0;
        this.width = pos.width || 200;
        this.height = pos.height || 80;
        this.radius = this.height / 4;
        d3.select("div." + this.id()).style("left", this.left + "px").style("top", this.top + "px")
            .style("width", this.width + "px").style("height", this.height + "px");
        d3.select("div." + this.id()).select("canvas").attr("width", this.width + "px").attr("height", this.height + "px");
        return this.render(this.example);
    };
    LED.prototype.updateWithProperties = function (props) {
        LED.prototype.parentClass.updateWithProperties.apply(this, arguments);
        this.ledColor(props.ledColor);
        return this.render(this.example);
    };
    /**
     * Removes the widget's div
     */
    LED.prototype.remove = function () {
        LED.prototype.parentClass.remove.apply(this);
        d3.select("div." + this.id()).remove();
    };

    LED.prototype.render = function (txt, opt) {
        opt = opt || {};
        txt = txt || "";
        var _this = this;
        function doRender() {
            var context = document.getElementById(_this.id() + "_canvas").getContext("2d");
            context.beginPath();
            context.globalAlpha = 0.9;
            context.arc(_this.width / 2, _this.height / 2, _this.radius, 0, 2 * Math.PI, false);
            context.fillStyle = opt.color || _this.ledColor();
            context.fill();
            if (!opt.noborder) { context.stroke(); }
            var elemClass = _this.div.node().getAttribute("class");
            if (opt.blinking || _this.blinking) {
                elemClass += " blink";
            } else {
                elemClass = elemClass.replace(" blink", "");
            }
            _this.div.node().setAttribute("class", elemClass);
            return _this.reveal();
        }
        if ((_this.ledKey() !== "" && _this.ledON() === "") || (typeof txt === "string" && txt === "")) {
            return doRender();
        } else if (typeof txt === "object") {
            // txt in this case is a PVS state that needs to be parsed
            var expr = StateParser.simpleExpressionParser(_this.ledON());
            if (expr && expr.res) {
                var str = StateParser.resolve(txt, expr.res.attr);
                if (str) {
                    str = StateParser.evaluate(str);
                    if (expr.res.binop === "=" && str === expr.res.constant ||
                            expr.res.binop === "!=" && str !== expr.res.constant) {
                        return doRender();
                    }
                }
            }
        }
        return _this.hide();
    };

    LED.prototype.toggle = function (opt) {
        if (this.isOn === true) {
            this.hide();
        } else {
            this.reveal();
        }
        return this;
    };

    LED.prototype.on = function (opt) {
        this.isOn = true;
        this.render("", opt);
        return this;
    };

    LED.prototype.off = function () {
        this.isOn = false;
        this.hide();
        return this;
    };

    LED.prototype.hide = function () {
        this.div.style("display", "none");
        return this;
    };

    LED.prototype.reveal = function () {
        this.div.style("display", "block");
        return this;
    };

    module.exports = LED;
});
