/**
 * @module Button
 * @desc Button Widget
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
        Recorder    = require("util/ActionRecorder");
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
	
	
	/**
	 Creates a new Button with the specified id.
	 @constructor
	 @param {string} id The id for the widget's html element
	 @this Button
	 */
    function Button(id) {
        Widget.call(this, id, "button");
		/** get or set the events this button listens to. Can be from the set ['click', 'press/release'] */
        this.events = property.call(this, []);
		this.recallRate = property.call(this);
		this.functionText = property.call(this);
		this.imageMap = property.call(this);
    }
    
    Button.prototype = Object.create(Widget.prototype);
    Button.prototype.constructor = Button;
    Button.prototype.parentClass = Widget.prototype;
	/**
		Gets a comma separated string representing the functions that will be called in the
		pvs spec when interating with this button.
		@returns {string}
		@memberof Button
	*/
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
	
	/**
		Returns a JSON object representation of this Button.
		@returns {object}
		@memberof Button
	*/
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
	 * Create and image map area for this button and bind functions in the button's events property with appropriate
	 * calls to function in the pvs specification. Whenever a response is returned from the pvs function call, the callback
	 * function is invoked.
	 * @param {!pvsWSClient} ws A websocket client to use for sending gui actions to the server process
	 * @param {function} callback A callback function to invoke when the pvs function call on the server process is returned
	 * @returns {d3.selection} The image map area created
	   @memberof Button
	 */
	Button.prototype.createImageMap = function (ws, callback) {
		var area = Button.prototype.parentClass.createImageMap.apply(this, arguments),
			widget = this,
			f,
			events;
        area.on("mousedown", function () {
			f = widget.functionText();
			events = widget.events();
			//perform the click event if there is one
			if (events && events.indexOf('click') > -1) {
//                console.log("button clicked");
				ws.sendGuiAction("click_" + f + "(" + ws.lastState().toString().replace(/,,/g, ",") + ");", callback);
                //record action 
                Recorder.addAction({id: widget.id(), functionText: widget.functionText(), action: "click", ts: new Date().getTime()});
			}
			
			timerTickFunction = function () {
//				console.log("button pressed");
				if (events && events.indexOf('press/release') > -1) {
					ws.sendGuiAction("press_" + f + "(" + ws.lastState().toString().replace(/,,/g, ',') + ");", callback);
                    //record action
                    Recorder.addAction({id: widget.id(), functionText: widget.functionText(), action: "press", ts: new Date().getTime()});
				}
			};
			btnTimer.interval(widget.recallRate()).start();
		}).on("mouseup", function () {
//            console.log("button released");
			if (btnTimer.getCurrentCount() > 0) {
				var f = widget.functionText();
				if (events && events.indexOf('press/release') > -1) {
					ws.sendGuiAction("release_" + f + "(" + ws.lastState().toString().replace(/,,/g, ',') + ");", callback);
                    Recorder.addAction({id: widget.id(), functionText: widget.functionText(), action: "release", ts: new Date().getTime()});
				}
			}
			mouseup(d3.event);
		}).on("mouseout", function () {
//            console.log("button released");
			if (btnTimer.getCurrentCount() > 0) {
				var f = widget.functionText();
				if (events && events.indexOf('press/release') > -1) {
					ws.sendGuiAction("release_" + f + "(" + ws.lastState().toString().replace(/,,/g, ',') + ");", callback);
                    //add action
                    Recorder.addAction({id: widget.id(), functionText: widget.functionText(), action: "release", ts: new Date().getTime()});
				}
			}
			mouseup(d3.event);
		});
		widget.imageMap(area);
		return area;
	};
	
	module.exports = Button;
});
