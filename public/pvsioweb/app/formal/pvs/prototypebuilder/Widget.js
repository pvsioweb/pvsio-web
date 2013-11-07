/**
 * Base widget implementation
 * @author Patrick Oladimeji
 * @date 10/30/13 22:59:02 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var property = require("util/property"),
		d3 = require("d3/d3");
	
	function getCoords(mark) {
        var x = +mark.attr("x"), y = +mark.attr("y"), w = +mark.attr("width"), h = +mark.attr("height");
		return x + "," + y +	"," + (x + w) + "," + (y + h);
	}
	
    function Widget(id, type) {
        this.id = property.call(this, id);
        this.type = property.call(this, type);
        this.element = property.call(this);
		this.imageMap = property.call(this);
    }
    
    Widget.prototype.remove = function () {
		d3.select(this.parentGroup()).remove();
    };
    
    Widget.prototype.parentGroup = function () {
        if (this.element()) {
            return this.element().node().parentNode;
        }
    };
    
	Widget.prototype.needsImageMap = function () {
		return !this.imageMap();
	};
	
	Widget.prototype.createImageMap = function (ws) {
		var coords = getCoords(this.element());
		var events, f, widget = this, href = this.type() === "button" ? "#" : null;
		var area = d3.select("map#prototypeMap").append("area");
		area.attr("class", this.id())
			.attr("shape", "rect")
			.attr("coords", coords)
			.attr("href", href);
			
		widget.imageMap(area);
		return area;
	};
	
    module.exports = Widget;
});
