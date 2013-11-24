/**
 * PVSio WebClient
 * @author Patrick Oladimeji
 * @date 4/19/13 17:23:31 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true*/
/*global define, d3, require, $, brackets, _, window, MouseEvent, FormData, document, setTimeout, clearInterval, FileReader */

define(function (require, exports, module) {
    "use strict";
    var pvsws                   = require("websockets/pvs/pvsWSClient"),
		eventDispatcher			= require("util/eventDispatcher"),
		d3						= require("d3/d3"),
		ws;
	
	function PVSioWeb() {
		eventDispatcher(this);
		var _pvsioweb = this;
		/**
		 * create pvs websocket connection
		 * add listeners for pvs process events
		 */
		var port = 8082;
		var url = window.location.origin.indexOf("file") === 0 ?
				("ws://localhost:" + port) : ("ws://" + window.location.hostname + ":" +  port);
		ws = pvsws()
			.serverUrl(url)
			.addListener('ConnectionOpened', function (e) {
				_pvsioweb.fire((e.type = "WebSocketConnectionOpened"));
			}).addListener("ConnectionClosed", function (e) {
				_pvsioweb.fire((e.type = "WebSocketConnectionClosed"));
			}).addListener("pvsoutput", function (e) {
				_pvsioweb.fire(e);
			}).addListener("processExited", function (e) {
				_pvsioweb.fire(e);
			});
	}
	
	PVSioWeb.prototype.connectToServer = function () {
		ws.logon();
		return this;
	};
	
	PVSioWeb.prototype.disconnectFromServer = function () {
		ws.close();
		return this;
	};
	
	PVSioWeb.prototype.getWebSocket = function () { return ws; };
	
	PVSioWeb.prototype.registerPlugin = function (plugin) {
		if (plugin && typeof plugin === "function") {
			return plugin(this);
		}
	};
	
	PVSioWeb.prototype.createCollapsiblePanel = function (headerText) {
		var div = d3.select("#content").append("div").attr("class", "collapsible-panel-parent");
		var header = div.append("div").classed("header", true);
		var content = div.append("div").attr("class", "collapsible-panel");
		
		header.append("span").attr("class", "toggle-collapse glyphicon glyphicon-minus-sign").on("click", function () {
			var d = d3.select(this);
			if (d.classed("glyphicon-minus-sign")) {
				content.style("display", "none");
				d3.select(this).classed("glyphicon-plus-sign", true).classed("glyphicon-minus-sign", false);
			} else {
				content.style("display", null);
				d3.select(this).classed("glyphicon-minus-sign", true).classed("glyphicon-plus-sign", false);
			}
		});
		
		if (headerText) {
			header.append("span").html(headerText).attr("class", "header");
		}
		return content;
	};
	
	module.exports = PVSioWeb;
});