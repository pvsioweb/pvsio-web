/**
 * Manages the display of notifications on projects
 * @author Patrick Oladimeji
 * @date 9/12/14 13:38:02 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, require, d3, window */
define(function (require, exports, module) {
	"use strict";
	var notifications = [], fadeDuration = 5000;
	function _showSelfDestructingNotification() {
        var notifyDiv = d3.select("#project-notifications"),
            alertDiv = notifyDiv.select("div.alert");
        var height = notifyDiv.node().getBoundingClientRect().height;
		notifyDiv.style("margin-top", (-1 * height) + "px").style("display", "block");
		notifyDiv.transition().duration(200).style("margin-top", "0px")
            .each("end", function () {
                notifyDiv.transition().delay(fadeDuration).duration(200).style("margin-top", (-1 * height) + "px")
                    .each("start", function () {
                        if (notifyDiv.node().getBoundingClientRect().height < 1) {
                            notifyDiv.interrupt().transition();
                        }
                    })
                    .each("end", function () {
                        notifyDiv.style("display", "none");
                        alertDiv.remove();
                        notifyDiv.html("");
                    });
            });
    }
    
	function show(msg) {
		var date = new Date();
		notifications.push({time: date, message: msg});
		var notifyDiv = d3.select("#project-notifications").style("display", "block");
		var alertDiv = notifyDiv.append("div").attr("class", "alert alert-info").attr("role", "alert");
		alertDiv.append("button").attr("type", "button")
			.attr("class", "close").attr("data-dismiss", "alert")
			.append("span").attr("aria-hidden", "true").html("&times;");
		alertDiv.append("p").html(msg);
        _showSelfDestructingNotification();
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
		_showSelfDestructingNotification();
	}
	
	module.exports = {
		show: show,
		error: error
	};
});
