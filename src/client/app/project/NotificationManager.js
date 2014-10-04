/**
 * Manages the display of notifications on projects
 * @author Patrick Oladimeji
 * @date 9/12/14 13:38:02 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, require, d3, window */
define(function (require, exports, module) {
	"use strict";
	var width = "376px";
	var notifications = [];
	
	function show(msg) {
		var date = new Date();
		notifications.push({time: date, message: msg});
		var notifyDiv = d3.select("#project-notifications");
		var alertDiv = notifyDiv.append("div").attr("class", "alert alert-info").attr("role", "alert");
		alertDiv.append("button").attr("type", "button")
			.attr("class", "close").attr("data-dismiss", "alert")
			.append("span").attr("aria-hidden", "true").html("&times;");
		alertDiv.append("p").html(msg);
		notifyDiv.style("width", 0).style("display", "block");
		notifyDiv.transition().duration(300).style("width", width);
	}
	
	function error(msg) {
		var date = new Date();
		notifications.push({time: date, message: msg});
		var notifyDiv = d3.select("#project-notifications");
		var alertDiv = notifyDiv.append("div").attr("class", "alert alert-danger").attr("role", "alert");
		alertDiv.append("button").attr("type", "button")
			.attr("class", "close").attr("data-dismiss", "alert")
			.append("span").attr("aria-hidden", "true").html("&times;");
		alertDiv.append("p").html(msg);
		notifyDiv.style("width", 0).style("display", "block");
		notifyDiv.transition().duration(300).style("width", width);
	}
	
	module.exports = {
		show: show,
		error: error
	};
});
