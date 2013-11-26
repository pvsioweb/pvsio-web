/**
 * Display widget
 * @author Patrick Oladimeji
 * @date 10/30/13 22:50:34 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var Widget = require("./Widget");
    var property = require("util/property");
	
    function Display(id) {
        Widget.call(this, id, "display");
		this.regex = property.call(this);
		this.predefinedRegex = property.call(this);
		this.prefix = property.call(this);
    }
    
    Display.prototype = Object.create(Widget.prototype);
    Display.prototype.constructor = Display;
    Display.prototype.parentClass = Widget.prototype;
    
    Display.prototype.parseState = function (stateString) {
		if (this.regex() && stateString) {
			var regexp = new RegExp(this.regex());
			var match = regexp.exec(stateString);
			if (match && match.length > 1) {
				///TODO: remember to sort out Patrick's concerns on this :) [was: remember to sort out Paolo's bugfix (@69992fda)]
				// return match[1].toString();
				if (regexp.toString().indexOf("[0-9/.]+") >= 0) {
					// it's a number
					match = eval(match[1].toString());
				} else {
					// don't evalutate the expression, and remove double quotes if needed
					match = match[1].toString().replace(new RegExp("\"", "g"), "");
				}
				return match;
			}
		}
		return;
    };
    
	Display.prototype.render = function (stateString) {
		var dispVal = this.parseState(stateString);
		var y = this.element().attr("y") + "px", x = this.element().attr("x") + "px",
			w = this.element().attr("width") + "px", h = this.element().attr("height") + "px";
		var text = d3.select("div." + this.id());
		if (text.empty()) {
			text = d3.select("#imageDiv").append("div").attr("class", this.id() + " displayWidget");
		}
		text.html(dispVal).style("left", x).style("top", y).style("position", "absolute")
				.style("width", w).style("height", h).style("color", "white")
			.style("font-size", (parseFloat(h) * 0.8) + "px");
    };
    
    Display.prototype.toJSON = function () {
		return {
			type: this.type(),
			id: this.id(),
			regex: this.regex(),
			predefinedRegex: this.predefinedRegex(),
			prefix: this.prefix()
		};
	};
	
	Display.prototype.remove = function () {
		Display.prototype.parentClass.remove.apply(this);
		d3.select("div." + this.id()).remove();
	};
	
	/**
		Updates the location of the display widget with the given position
	*/
	Display.prototype.updateLocationAndSize = function (pos) {
		Display.prototype.parentClass.updateLocationAndSize.apply(this, arguments);
		d3.select("div." + this.id()).style("left", pos.x + "px").style("y", pos.y + "px")
			.style("width", pos.width + "px").style("height", pos.height + "px");
	};
	
    module.exports = Display;
});
