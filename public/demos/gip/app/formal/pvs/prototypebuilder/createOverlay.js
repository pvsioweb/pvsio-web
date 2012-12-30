/**
 * module for creating the overlay and listening to mouse events to edit the overlay
 * 
 * @author Patrick Oladimeji
 * @date Dec 5, 2012 : 10:19:30 PM
 */

define(['./editOverlay', 'd3/d3'], function(editOverlay){
	
	return function(parent, formHandler, ws){
		var mx = d3.event.pageX , my = d3.event.pageY;
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
				//set the font-size of the mark to be 80% of the height
				mark.style('font-size', (0.8 * parseFloat(mark.style('height'))) + "px");
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
					var top = parseFloat(mark.style('top')), 
						left = parseFloat(mark.style('left')),
						h = parseFloat(mark.style('height')),
						w = parseFloat(mark.style('width'));
					var coords = left + "," + top +	"," + (left + w) + "," + (top + h);
					//update coords for the area
					if(!d3.select("area." + mark.attr("id")).empty()){
						d3.select("area." + mark.attr("id")).attr("coords", coords);
					}
				}
			}).on("dblclick", function(){
				editOverlay(formHandler, d3.select(this), ws);
			});
	};
});