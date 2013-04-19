/**
 * 
 * shuffles an array into a random order
 * @author hogfather
 * @date May 2, 2012
 * @project JSLib
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process*/
define([], function () {
    "use strict";
	return function (array) {
		return array.map(function (d) {
			return d;
		}).sort(function (a, b) {
			return Math.random() - Math.random();
		});
	};
});