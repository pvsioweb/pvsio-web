/**
 * module for creating the overlay and listening to mouse events to edit the overlay
 * 
 * @author Patrick Oladimeji
 * @date Dec 5, 2012 : 10:19:30 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process*/
define(function (require, exports, module) {
    "use strict";
    
    var widgetEditor                    = require("./widgetEditor"),
        widgetEvents                    = require("./widgetEvents"),
        widgetType                      = require("./widgetType"),
        widgetMaps                      = require("./widgetMaps"),
        Timer                           = require("util/Timer");
    
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
	
	
	function xpos() {
		var bound = this.getBoundingClientRect();
		return d3.event.clientX - bound.left - this.clientLeft + this.scrollLeft;
	}
	
	function ypos() {
		var bound = this.getBoundingClientRect();
		return d3.event.clientY - bound.top - this.clientTop - this.scrollTop;
	}
	
    
	function getCoords(mark) {
		var top = parseFloat(mark.style('top')),
			left = parseFloat(mark.style('left')),
			h = parseFloat(mark.style('height')),
			w = parseFloat(mark.style('width'));
		return left + "," + top +	"," + (left + w) + "," + (top + h);
	}
	
	function createInteractiveImageArea(mark, widget, ws) {
		var coords = getCoords(mark);
		var events, f;
		d3.select("#prototypeMap")
			.append("area")
				.attr("class", widget.id())
				.attr("shape", "rect")
				.attr("coords", coords)
				.attr("href", widget.type() === widgetType.Button ? "#" : null)//only make buttons clickable
			.on("mousedown", function () {
                f = widget.functionText();
				events = widget.events();
				//perform the click event if there is one
				if (events && events.indexOf('click') > -1) {
					ws.sendGuiAction("click_" + f + "(" + ws.lastState().toString().replace(/,,/g, ",") + ");");
                }
				
				timerTickFunction = function () {
					console.log("button pressed");
					if (events && events.indexOf('press/release') > -1) {
						ws.sendGuiAction("press_" + f + "(" + ws.lastState().toString().replace(/,,/g, ',') + ");");
                    }
				};
				btnTimer.interval(widget.recallRate()).start();
			}).on("mouseup", function () {
				if (btnTimer.getCurrentCount() > 0) {
					var f = widget.functionText();
					console.log("button released");
					if (events && events.indexOf('press/release') > -1) {
				        ws.sendGuiAction("release_" + f + "(" + ws.lastState().toString().replace(/,,/g, ',') + ");");
                    }
				}
				mouseup(d3.event);
			}).on("mouseout", function () {
				if (btnTimer.getCurrentCount() > 0) {
					var f = widget.functionText();
					console.log("button released");
					if (events && events.indexOf('press/release') > -1) {
						ws.sendGuiAction("release_" + f + "(" + ws.lastState().toString().replace(/,,/g, ',') + ");");
                    }
				}
				mouseup(d3.event);
			});
	}
    
	function createDiv(parent, mx, my) {
		var moving = false, startMouseX, startMouseY, startTop, startLeft;
        function mouseUp() {
            var mark = d3.select(this);
            startMouseX = startMouseY = undefined;
            d3.event.preventDefault();
            if (moving) {
                d3.event.stopPropagation();
            }
            moving  = false;
        }
		//if there are any active selections, remove them from the selection class
		if (!d3.selectAll(".mark.selected").empty()) {
			d3.selectAll(".mark.selected").classed("selected", false);
        }
		//create and return the new mark. marks are essentially divs
		return parent.append("div")
			.style("left", function () {
				var val = mx !== undefined ? mx : xpos.call(this);
				return val + "px";
			})
			.style("top", function () {
				var val = my !== undefined ? my : ypos.call(this);
				return val + "px";
			})
			.attr("startx", function () {
				return mx !== undefined ? mx : xpos.call(this);
			})
			.attr("starty",  function () {
				return my !== undefined ? my : ypos.call(this);
			})
			.attr("class", "mark selected")
			.on("mousedown", function () {
                if (d3.select(this).classed("builder")) {
                    d3.event.preventDefault();
                    d3.event.stopPropagation();
                    startMouseX = d3.event.clientX;
                    startMouseY = d3.event.clientY;
                    startTop = parseFloat(d3.select(this).style('top'));
                    startLeft = parseFloat(d3.select(this).style("left"));
                    //mark this element as selected
                    d3.selectAll(".mark.selected").classed("selected", false);
                    d3.select(this).classed('selected', true);
                    moving = true;
                }
				
			}).on("mouseup", mouseUp)
            .on("mouseout", mouseUp)
            .on("mousemove", function () {
				if (moving) {
					var mark = d3.select(this);
					d3.event.preventDefault();
					d3.event.stopPropagation();
					mark.style("top", function () {
						return (startTop + d3.event.clientY - startMouseY) + 'px';
					}).style("left", function () {
						return (startLeft + d3.event.clientX - startMouseX) + 'px';
					});
					var coords = getCoords(mark);
					//update coords for the area
					if (!d3.select("area." + mark.attr("id")).empty()) {
						d3.select("area." + mark.attr("id")).attr("coords", coords);
					}
				}
			});
	}
	
    
    module.exports = {
		createDiv: function (parent, mx, my) {
			return createDiv(parent, mx, my);
		},
		createInteractiveImageArea: function (mark, widget, ws) {
			return createInteractiveImageArea(mark, widget, ws);
		},
		getCoords: function (mark) {
			return getCoords(mark);
		}
	};
	
});