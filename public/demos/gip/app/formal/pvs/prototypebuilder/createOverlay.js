/**
 * module for creating the overlay and listening to mouse events to edit the overlay
 * 
 * @author Patrick Oladimeji
 * @date Dec 5, 2012 : 10:19:30 PM
 */

define(['./widgetEditor', './widgetEvents',"./widgetType", "./widgetMaps", "util/Timer", 'd3/d3'], 
function(widgetEditor, widgetEvents, widgetType, widgetMaps, Timer){

	//define timer for sensing hold down actions on buttons
	var btnTimer = Timer(250), numTicks = 0, timerTickFunction = null;
	//add event listener for timer's tick 
	btnTimer.addListener('TimerTicked', function(){
		if(timerTickFunction){
			timerTickFunction();
		}
	});
	function mouseup(e){
		numTicks = btnTimer.getCurrentCount();
		btnTimer.reset();
	}
	
	return {
		createDiv:function(parent){
			return createDiv(parent);
		},
		createInteractiveImageArea:function(mark, widget, ws){
			return createInteractiveImageArea(mark, widget, ws);
		},
		getCoords:function(mark){
			return getCoords(mark);
		}
	};
	
	function xpos(){
		var offsetEl = d3.select("#imageDiv img");
		return d3.event.pageX - offsetEl.node().x;
	}
	
	function ypos(){
		var offsetEl = d3.select("#imageDiv img");
		return d3.event.pageY - offsetEl.node().y;
	}
	
	function createDiv(parent){
		var mx = xpos() , my = ypos();
		var moving = false, startMouseX, startMouseY, startTop, startLeft;
		//if there are any active selections, remove them from the selection class
		if(!d3.selectAll(".mark.selected").empty())
			d3.selectAll(".mark.selected").classed("selected", false);
		//create and return the new mark. marks are essentially divs
		return parent.append("div")
			.style("left", mx + "px")
			.style("top", my + "px")
			.attr("startx", mx)
			.attr("starty",  my)
			.attr("class", "mark selected")
			.on("mousedown", function(){
				d3.event.preventDefault();
				d3.event.stopPropagation();
				startMouseX = d3.event.pageX;
				startMouseY = d3.event.pageY;
				startTop = parseFloat(d3.select(this).style("top"));
				startLeft = parseFloat(d3.select(this).style("left"));
				//mark this element as selected
				d3.selectAll(".mark.selected").classed("selected", false);
				d3.select(this).classed('selected', true);
				moving = true;
			}).on("mouseup", function(){
				var mark = d3.select(this);
				startMouseX = startMouseY = undefined;
				d3.event.preventDefault();
				if(moving)
					d3.event.stopPropagation();
				moving  = false;
			}).on("mousemove", function(){
				if(moving){
					var mark = d3.select(this);
					d3.event.preventDefault();
					d3.event.stopPropagation();
					mark.style("top", function(){
						return (startTop + d3.event.pageY - startMouseY) + 'px';
					}).style("left", function(){
						return (startLeft + d3.event.pageX - startMouseX) + 'px';
					});
					var coords = getCoords(mark);
					//update coords for the area
					if(!d3.select("area." + mark.attr("id")).empty()){
						d3.select("area." + mark.attr("id")).attr("coords", coords);
					}
				}
			});
	}
	
	function getCoords(mark){
		var top = parseFloat(mark.style('top')),
			left = parseFloat(mark.style('left')),
			h = parseFloat(mark.style('height')),
			w = parseFloat(mark.style('width'));
		return left + "," + top +	"," + (left + w) + "," + (top + h);
	}
	
	function createInteractiveImageArea(mark, widget, ws){
		if(widget.type() === widgetType.Button)

		var coords = getCoords(mark);
		var events, f;
		d3.select("#prototypeMap")
			.append("area")
				.attr("class", widget.id())
				.attr("shape", "rect")
				.attr("coords", coords)
				.attr("href", widget.type() === widgetType.Button ? "#" : null)//only make buttons clickable
			.on('click', function(){
				//using the map version of this so 
				f = widgetMaps[widget.id()]['functionText']();
				events = widgetMaps[widget.id()]['events']();
				if(numTicks === 0){
					console.log(f);
					if( events && events.indexOf('click') > -1)
						ws.sendGuiAction("click_" + f + "(" + ws.lastState().toString().replace(/,,/g, ",") + ");");
				}
			}).on("mousedown", function(){
				f = widgetMaps[widget.id()]['functionText']();
				events = widgetMaps[widget.id()]['events']();

				timerTickFunction = function(){
					console.log("button pressed");
					if(events && events.indexOf('press/release') > -1)
						ws.sendGuiAction("press_" + f + "(" + ws.lastState().toString().replace(/,,/g,',') + ");");
				};
				btnTimer.start();
			}).on("mouseup", function(){
				var f = widgetMaps[widget.id()]['functionText']();
				if(numTicks > 0){
					console.log("button released");	
					if( events && events.indexOf('press/release') > -1)
						ws.sendGuiAction("release_" + f + "(" + ws.lastState().toString().replace(/,,/g,',') + ");");
				}
				mouseup(d3.event);
			});
	}
});