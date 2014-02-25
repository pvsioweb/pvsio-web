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
	var CursoredDisplay = require("widgets/CursoredDisplay");
    var Speaker  = require("widgets/TextSpeaker");
	
    function Display(id) {
        Widget.call(this, id, "display");
		this.regex = property.call(this);
		this.predefinedRegex = property.call(this);
		this.prefix = property.call(this);
		this.cursorName = property.call(this);
        this.auditoryFeedback = property.call(this);
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
				if (regexp.toString().replace(/\\/g, "").indexOf("[0-9/.]+") >= 0) {
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
    
    /**
        parse the raw state string from pvsio process into key value pairs
    */
    Display.prototype.parseStateRaw = function (str) {
        var args = str[0].split(","), res = {};
        args.forEach(function (d) {
            var t = d.split(":=");
            res[t[0].replace("(#", "").trim()] = t[1].trim();
        });
        return res;
    };

	Display.prototype.render = function (stateString) {
		var dispVal = this.parseState(stateString);
		var y = this.element().attr("y"),
			x = this.element().attr("x"),
			w = this.element().attr("width"),
			h = this.element().attr("height");
		var text = d3.select("div." + this.id());
		if (!text.empty()) {
			text.remove();
		}
		text = d3.select("#imageDiv").append("div").attr("class", this.id() + " displayWidget");
		var cursoredDisplay = (this.cursorName()) ? true : false;
		if (!cursoredDisplay) {
			text.html(dispVal).style("left", x + "px").style("top", y + "px").style("position", "absolute")
							  .style("width", w + "px").style("height", h + "px").style("color", "white")
							  .style("font-size", (parseFloat(h) * 0.8) + "px");
		} else {
//			h = h*1.5;
			text.style("left", x + "px").style("top", y + "px").style("position", "absolute")
				.style("width", w + "px").style("height", h + "px").style("color", "white")
				.append("canvas").attr("width", w).attr("height", h).attr("id", "display");
			var disp = new CursoredDisplay("display", w, h);
			// parse cursor position
			var res = this.parseStateRaw(stateString);
			//FIXME: this assumes that the cursor name is "c" -- we need to use the actual cursor name used in the spec!
			disp.renderNumber(dispVal.toString(), +res.c);
		}
        //read out the display if audio is enabled for this display widget
        if (this.auditoryFeedback()) {
            Speaker.speak(dispVal.toString());
        }
    };
    
    Display.prototype.toJSON = function () {
		return {
			type: this.type(),
			id: this.id(),
			regex: this.regex(),
			predefinedRegex: this.predefinedRegex(),
			prefix: this.prefix(),
			cursorName: this.cursorName(),
            auditoryFeedback: this.auditoryFeedback()
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
