/**
 * 
 * @author Patrick Oladimeji
 * @date Dec 29, 2012 : 1:25:16 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process*/
define(function (require, exports, module) {
    "use strict";
    var property                    = require("util/property"),
        widgetType                  = require('./widgetType');
    
    module.exports = function (type) {
		var tsId = new Date().getTime();
		var o = {};
		o.type = property.call(o, type || widgetType.Button);
		
		o.id = property.call(o, o.type() + tsId);
		
		o.remove = function () {
			d3.select("#" + o.id()).remove();
			d3.select("area." + o.id()).remove();
			return o;
		};
		return o;
	};
});