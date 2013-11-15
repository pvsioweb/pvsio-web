/**
 * Button Widget
 * @author Patrick Oladimeji
 * @date 10/31/13 11:26:16 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
    "use strict";
    var Widget = require("./Widget"),
		property = require("util/property"),
		Timer	= require("util/Timer"),
		WidgetManager			= require("pvsioweb/WidgetManager")();
	//define timer for sensing hold down actions on buttons
	var btnTimer = new Timer(250), timerTickFunction = null;
	//add event listener for timer's tick 
	btnTimer.addListener('TimerTicked', function () {
		if (timerTickFunction) {
			timerTickFunction();
		}
	});
	
	function mouseup(e) {
		btnTimer.reset();
	}
	
    function Button(id) {
        Widget.call(this, id, "button");
        this.events = property.call(this, []);
		this.recallRate = property.call(this);
		this.functionText = property.call(this);
		this.imageMap = property.call(this);
    }
	
	///TODO this should be moved out of this file and promoted to a property, or a function parameter in createImageMap
	function renderResponse(err, res) {
		//render displays
		WidgetManager.getDisplayWidgets().forEach(function (w) {
			w.render(res.data);
		});
	}
    
    Button.prototype = Object.create(Widget.prototype);
    Button.prototype.constructor = Button;
    Button.prototype.parentClass = Widget.prototype;
	
	Button.prototype.boundFunctions = function () {
		var o = this;
		var res = o.events().map(function (d) {
			if (d.indexOf("/") > -1) {
				return d.split("/").map(function (a) {
					return a + "_" + o.functionText();
				}).join(", ");
				
			} else {
				return d + "_" + o.functionText();
			}
		}).join(", ");
		return res;
	};
	
	
	Button.prototype.toJSON = function () {
		return {
			events: this.events(),
			id: this.id(),
			type: this.type(),
			recallRate: this.recallRate(),
			functionText: this.functionText(),
			boundFunctions: this.boundFunctions()
		};
	};
	
	/**
	 * @override
	 * @param {!pvsWSClient} ws A websocket client to use for sending gui actions to the server process
	 */
	Button.prototype.createImageMap = function (ws) {
		var area = Button.prototype.parentClass.createImageMap.apply(this, arguments),
			widget = this,
			f,
			events;
		area.on("mousedown", function () {
			f = widget.functionText();
			events = widget.events();
			//perform the click event if there is one
			if (events && events.indexOf('click') > -1) {
				ws.sendGuiAction("click_" + f + "(" + ws.lastState().toString().replace(/,,/g, ",") + ");", renderResponse);
			}
			
			timerTickFunction = function () {
				console.log("button pressed");
				if (events && events.indexOf('press/release') > -1) {
					ws.sendGuiAction("press_" + f + "(" + ws.lastState().toString().replace(/,,/g, ',') + ");", renderResponse);
				}
			};
			btnTimer.interval(widget.recallRate()).start();
		}).on("mouseup", function () {
			if (btnTimer.getCurrentCount() > 0) {
				var f = widget.functionText();
				if (events && events.indexOf('press/release') > -1) {
					ws.sendGuiAction("release_" + f + "(" + ws.lastState().toString().replace(/,,/g, ',') + ");", renderResponse);
				}
			}
			mouseup(d3.event);
		}).on("mouseout", function () {
			if (btnTimer.getCurrentCount() > 0) {
				var f = widget.functionText();
				if (events && events.indexOf('press/release') > -1) {
					ws.sendGuiAction("release_" + f + "(" + ws.lastState().toString().replace(/,,/g, ',') + ");", renderResponse);
				}
			}
			mouseup(d3.event);
		});
		widget.imageMap(area);
		return area;
	};
	
	module.exports = Button;
});
