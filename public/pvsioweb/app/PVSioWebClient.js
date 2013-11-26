/**
 * PVSio WebClient is the core component of pvsioweb. It creates a websocket connection to a nodejs server running
 * on localhost on port 8082
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
		property				= require("util/property"),
		ws,
		_port = 8082,
		url = window.location.origin.indexOf("file") === 0 ?
				("ws://localhost") : ("ws://" + window.location.hostname);
	
	/**
	 * Creates a new PVSioWeb client object. This object is an event emitter and emits the following events:
	 *
	 */
	function PVSioWeb() {
		eventDispatcher(this);
		var _pvsioweb = this;
		/**
		 * create pvs websocket connection
		 * add listeners for pvs process events
		 */
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
	PVSioWeb.prototype.port = property.call(PVSioWeb.prototype, _port);
	
	PVSioWeb.prototype.serverUrl = property.call(PVSioWeb.prototype, url);
	
	PVSioWeb.prototype.connectToServer = function () {
		ws.serverUrl(this.serverUrl()).port(this.port()).logon();
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
    /**
        Adds a stylesheet with the specified url to the page
     */
    PVSioWeb.prototype.addStyleSheet = function (url, cb) {
        cb = cb || function () {};
        var link = d3.select("html head").append("link").attr("type", "text/css").attr("rel", "stylesheet").attr("href", url);
        link.on("load", function () {
            cb(null, link);
        }).on("error", function () {
            cb("error");
        });
    };
	
	module.exports = PVSioWeb;
});