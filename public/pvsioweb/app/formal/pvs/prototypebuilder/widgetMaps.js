/**
 * object used to store a map of all widgets currently on the display
 * @author Patrick Oladimeji
 * @date Dec 9, 2012 : 10:46:49 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process, _*/
define([], function () {
	"use strict";
	var map = {};
	
	return {
		clear: function () {
			map = {};
			return this;
		},
		add: function (widget) {
			map[widget.id()] = widget;
			return this;
		},
		get: function (widgetid) {
			return map[widgetid];
		},
		toJSON: function () {
			var res = {}, k;
            _.each(map, function (value, key) {
                res[key] = value.toJSON();
            });
			return res;
		}
	};
	
});