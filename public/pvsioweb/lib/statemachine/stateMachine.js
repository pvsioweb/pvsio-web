/**
 * Emulink: a graphical editor similar to Simulink/Statecharts
 * @author Enrico D'Urso <e.durso7@gmail.com> 
 * @author Paolo Masci <paolo.masci@eecs.qmul.ac.uk> 
 * @comment Part of the code is derived from http://bl.ocks.org/rkirsling/5001347
 * @date 9/19/13 10:30:29 AM
 */

/**
 * @fileOverview This file contains Emulink, a graphical editor similar to Simulink/Statecharts.
 * @version 0.1
 */

 
/**
 * @module StateMachine
 */

define(function (require, exports, module) {
"use strict";

var d3    = require("d3/d3");
var ace   = require("ace/ace");
var editor;
var modifiedUser = 0;
var pvsWriter = require("../statemachine/stateToPvsSpecificationWriter");
var graph = { nodes: d3.map(), edges: d3.map() };
var nodeIDGenerator = 0;
var newNodeID = function () { return nodeIDGenerator++; }
var minBoxWidth  = 60; 
var minBoxHeight = 60;
var curvyLines = false;
var add_node = function (positionX, positionY, label) {
	var _id = "X" + newNodeID();
	var node = { 
			fixed: true,
			reflexive: false,
			id   : _id, // node id must be unique
			name : (label === undefined)? _id : label,
			x    : positionX,
			y    : positionY,
			px   : positionX,
			py   : positionY,
			height: minBoxHeight,
			width : minBoxWidth,
			weight: 0
	};
	// add node
	graph.nodes.set(node.id, node);
	// update pvs theory accordingly
	pvsWriter.addState(node);
}
var update_node_size = function (id, width, height) {
	var theNode = graph.nodes.get(id);
	theNode.height = height;
	theNode.width = width;
	graph.nodes.set(id, theNode);
}


var edgeIDGenerator = 0;
var newEdgeID = function () { return edgeIDGenerator++; }
var add_edge = function (source, target, label) {
	var _id = "T" + newEdgeID();
	var edge = {
		id: _id, // edge id must be unique
		source: source,
		target: target,
		name : (label === undefined)? "tick" : label,
	};
	// add edge
	graph.edges.set(edge.id, edge);
	// update pvs theory accordingly
	pvsWriter.addTransition(edge.name, edge.id);
	pvsWriter.addConditionInTransition(edge.name, source, target);
	
}


var MODE = { DEFAULT: 0, ADD_NODE: 1, ADD_TRANSITION: 2, ADD_SELF_TRANSITION: 3 };
var editor_mode = MODE.DEFAULT;

var selected_nodes = [];
var selected_edges = [];

// creation of svg element to draw the graph
var width =  930;
var height = 800;
var svg = d3.select("#ContainerStateMachine").append("svg").attr("width", width).attr("height", height).attr("id", "canvas").style("background", "#fffcec");


var links;

function showInformationInTextArea(element) {
	var textArea = document.getElementById("infoBox");
	var type = "TYPE:   " ;
	if( element.source ) {   
	    type += "EDGE\n"
	            + "CONNECTING:\n" + element.source.name 
				+ " -- " + element.target.name + "\n";
	}
	else { type = type + "NODE\n"; }
	var name = "NAME: " + element.name  + ";";
	textArea.value = type;
	textArea = document.getElementById("infoBoxModifiable");
	textArea.value = name;
}

function changeTextArea(node) {
	if( selected_nodes.length == 0 && selected_edges.length == 0 ) {
	    document.getElementById('infoBox').value = " ";
        document.getElementById('infoBoxModifiable').value= " ";
	}

	var textArea = document.getElementById("infoBoxModifiable");
	var content = textArea.value;
	var name = content.split(';')[0];
	var realName = name.substring(name.indexOf(':') + 2);
		
	if( selected_nodes.length ) {    
	    /// Change name in the canvas 
	    var object = selected_nodes[ selected_nodes.length -1];
	    var oldId = object.id;
		var oldName = object.name;

		node.selectAll("text").text(function(d) { 
			if(d.id == oldId) { return realName; }
			return d.name;
		});

		var newNode = graph.nodes.get(oldId);
		newNode.name = realName;
		graph.nodes.set(oldId, newNode);

	    /// Change name in the PVS specification
	    pvsWriter.changeStateName(oldName, realName );
	}
}

function set_editor_mode(m) {
	// reset borders
	document.getElementById("button_self_transition").style.border = "";
	document.getElementById("button_transition").style.border = "";
	document.getElementById("button_state").style.border = "";
	// set new editor mode
	editor_mode = m;
	if(editor_mode == MODE.ADD_TRANSITION) {
		document.getElementById("button_transition").style.border = "3px solid #AD235E";
	}
	else if(editor_mode == MODE.ADD_SELF_TRANSITION) {
		document.getElementById("button_self_transition").style.border = "3px solid #AD235E";
	}
	else if(editor_mode == MODE.ADD_NODE) {
		document.getElementById("button_state").style.border = "3px solid #AD235E";
	}
}

function toggle_editor_mode(m) {
	if(editor_mode != m) { return set_editor_mode(m); }
	return set_editor_mode(MODE.DEFAULT);
}


/// Function init is the entry point of the Emulink graphical editor
function init(_editor) {
	// Start Emulink
	emulink();

	document.getElementById('infoBox').value = "TIP: Click on an Element to see  its property";
	document.getElementById('infoBoxModifiable').value= "TIP: After clicking on an element, editable properties will be showed here";
	
	/// creating new specification (just scheleton )
	editor = _editor;
	pvsWriter.newPVSSpecification("myTheory", editor); 
}

var emulink = function() {

	var colors = d3.scale.category10();

	// init D3 force layout
	var force = d3.layout.force()
		.nodes(graph.nodes.values())
		.links(graph.edges.values())
		.size([width, height])
		.linkDistance(150)
		.on('tick', tick);

	var resize = d3.behavior.drag().origin(function() {
			var current = d3.select(this).select("rect.node");
			return {x: current.attr("x"), y: current.attr("y") };
		}).on("drag", resizeChart);

	var node_drag = d3.behavior.drag()
					   .on("dragstart", dragstart)
					   .on("drag", dragmove)
					   .on("dragend", dragend);

    function dragstart(d, i) {
        force.stop() // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
		// enable dragging nodes only if the editor is in default mode; 
		// this is needed to avoid conflicts with the drag action used to create new edges between nodes
		if(editor_mode == MODE.DEFAULT) {
		    d.px += d3.event.dx;
		    d.py += d3.event.dy;
		    d.x += d3.event.dx;
		    d.y += d3.event.dy; 
		    tick();
		}
    }

    function dragend(d, i) {
		if(editor_mode == MODE.DEFAULT) {
		    tick();
		    force.resume();
		}
    }

	// define arrow markers for graph links
	svg.append('svg:defs').append('svg:marker')
		.attr('id', 'end-arrow')
		.attr('viewBox', '0 -5 10 10')
		.attr('refX', 6)
		.attr('markerWidth', 3)
		.attr('markerHeight', 3)
		.attr('orient', 'auto')
		.append('svg:path')
		.attr('d', 'M0,-5L10,0L0,5')
		.attr('fill', '#000');

	svg.append('svg:defs').append('svg:marker')
		.attr('id', 'start-arrow')
		.attr('viewBox', '0 -5 10 10')
		.attr('refX', 4)
		.attr('markerWidth', 3)
		.attr('markerHeight', 3)
		.attr('orient', 'auto')
		.append('svg:path')
		.attr('d', 'M10,-5L0,0L10,5')
		.attr('fill', '#000');

	// line displayed when dragging new nodes
	var drag_line = svg.append('svg:path')
		.attr('class', 'link dragline hidden')
		.attr('d', 'M0,0L0,0');

	// handles to link and node element groups
	var path   = svg.append('svg:g').selectAll('path');
	var node   = svg.append('svg:g').selectAll('node');

	// mouse event vars
	var selected_node  = null;
	var selected_link  = null;
	var mousedown_link = null;
	var mousedown_node = null;
	var mouseup_node   = null;

	function resetMouseVars() { mouseup_node = null; mousedown_link = null; }

	var boxWidth  = minBoxWidth; //FIXME: Remove these 2 global variables 
	var boxHeight = minBoxHeight;

	// update force layout (called automatically each iteration)
	function tick() {
		// draw directed edges with proper padding from node centers
		path.select("path")
			.attr('d', function(d) {
				if(d.target.x == d.source.x && d.target.y == d.source.y) {
					// self-edge
					return "M" + (d.source.x + 16) + ',' + (d.source.y - 32) + "q 64 -16 16 16";
				}
				else {
					var deltaX = d.target.x - d.source.x;
					var deltaY = d.target.y - d.source.y;
					var dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
					var normX = deltaX / dist;
					var normY = deltaY / dist;
					var sourcePaddingX = boxWidth * 0.4;
					var sourcePaddingY = boxHeight * 0.4;
					var targetPaddingX = boxWidth * 0.6;
					var targetPaddingY = boxHeight * 0.6;
					var sourceX = d.source.x + (sourcePaddingX * normX);
					var sourceY = d.source.y + (sourcePaddingY * normY);
					var targetX = d.target.x - (targetPaddingX * normX);
					var targetY = d.target.y - (targetPaddingY * normY);
					if(curvyLines) { 
						return "m" + sourceX + ',' + sourceY + "A" + dist + "," + dist + " 0 0,1 " + targetX + "," + targetY; 
					}
					return "m" + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY; // this draws a straight line
				}
			});
		// move edge label accordingly
		path.select("text")
			.attr("x", function(d) {
				if(d.target.x == d.source.x && d.target.y == d.source.y) {
					// self-edge
					return d.source.x + 64;
				}
				else {
					var deltaX = d.target.x - d.source.x;
					return d.source.x + (deltaX * 0.4);
				}
			})
			.attr("y", function(d) { 
				if(d.target.x == d.source.x && d.target.y == d.source.y) {
					// self-edge
					return d.source.y - 40;
				}
				else {
					var deltaY = d.target.y - d.source.y;
					var labelOffset = 8; // TODO: relate this value to the font size
					return d.source.y + (deltaY * 0.4) - labelOffset; 
				}
			});

		// move nodes if they are dragged
		node.attr('transform', function(d) {
			return 'translate(' + d.x + ',' + d.y + ')';
		});
	}

	// update graph (called when needed)
	function restart() {
		force = d3.layout.force()
					.nodes(graph.nodes.values())
					.links(graph.edges.values())
					.size([width, height])
					.linkDistance(150)
					.charge(-500)
					.on('tick', tick);


		//--- paths -----------------------------------------------------------------------------------------------
		path = path.data(graph.edges.values());
		// add new links
		var pathCanvas = path.enter().append('svg:g');
		pathCanvas
			.append('svg:path')
			.attr('class', 'link')
			.classed('selected', function(d) { return d === selected_link; })
			.style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
			.style('marker-end', 'url(#end-arrow)')
			.style("cursor", "pointer") // change cursor shape
			.on('mousedown', function(d) {
				if(d3.event.ctrlKey) {
					//TODO: use the ctrl key to allow the selection of multiple nodes
				}
				else {
					showInformationInTextArea(d);
					pvsWriter.focusOnFun(d);
					selected_edges.push(d);
				}
			});
		pathCanvas
			.append('svg:text')
			.attr('class', 'id')
			.text(function(d) { return d.name; })
			.style("cursor", "pointer") // change cursor shape
			.on('mousedown', function(d) { // FIXME: THIS HANDLER IS NEVER TRIGGERED
				if(d3.event.ctrlKey) {
					//TODO: use the ctrl key to allow the selection of multiple nodes
				}
				else {
					showInformationInTextArea(d);
					pvsWriter.focusOnFun(d);
					selected_edges.push(d);
				}
			});
		// update existing links
		path.classed('selected', function(d) { return d === selected_link; })
			.style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
			.style('marker-end', 'url(#end-arrow)');
		// remove old links
		path.exit().remove();

		//--- nodes -----------------------------------------------------------------------------------------------
		node = node.data(graph.nodes.values());
		// add new nodes; the svg:g element creates a canvas that allows us to group three shapes together: box, label, resize tool
		var nodeCanvas = node.enter().append('svg:g');
		nodeCanvas
			.append('svg:rect')
			.attr('class', 'node')
			.attr("x", function(d) { return -boxWidth/2; }) // translate x,y so they correspond to the center of the box (rather than the top-left corner)
			.attr("y", function(d) { return -boxHeight/2; })
			.attr("rx", boxWidth/10).attr("ry", boxHeight/10) // rouded edges
			.attr("width", boxWidth).attr("height", boxHeight)
			.attr("id", function(d) {return d.id; })
			.style("cursor", "pointer") // change cursor shape
			.attr("opacity", "0.9")
			.style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
			.style('stroke', function(d) { return d3.rgb(colors(d.id)).darker().toString(); })
			.classed('reflexive', function(d) { return d.reflexive; })
			.on('mouseover', function(d) {
				d3.select(this).attr('transform', 'scale(1.1)');
				if(!mousedown_node || d === mousedown_node) return;
				// enlarge target node
				d3.select(this).attr('transform', 'scale(1.1)');
			})
			.on('mouseout', function(d) {
				d3.select(this).attr('transform', 'scale(1)');
				if(!mousedown_node || d === mousedown_node) return;
			})
			.on('mousedown', function(d) {
				d3.select(this).attr('transform', 'scale(1)');
				// create an arrow when the editor is in mode add_transition
				if(editor_mode == MODE.ADD_TRANSITION) {
					svg.classed('ctrl', true);		  
					// select node
					mousedown_node = d;
					if(mousedown_node === selected_node) { selected_node = null; }
					else { selected_node = mousedown_node; }
					selected_link = null;
					// reposition drag line
					drag_line
						.style('marker-end', 'url(#end-arrow)')
						.classed('hidden', false)
						.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y);
				}
				else if(editor_mode == MODE.ADD_SELF_TRANSITION) {
					// select node
					mousedown_node = d;
					selected_node = mousedown_node;
					selected_link = null;
					// reposition drag line
					drag_line
						.style('marker-end', 'url(#end-arrow)')
						.classed('hidden', false)
						.attr('d', function(d) {
							var ans = 'M' + (mousedown_node.x + 16) + ',' + (mousedown_node.y - 32) + "q 64 -16 16 16";
							return ans;
						});
				}
				else {
					if(d3.event.ctrlKey) {
						//TODO: use the ctrl key to allow the selection of multiple nodes
					}
					else {
						// if the ctrl key is not pressed, reset selection first, and then select the node
						selected_nodes.splice(0,selected_nodes.length);
						selected_nodes.push(d);
						// update borders of nodes
						node.selectAll("rect").style("stroke", "").style("stroke-width", "");
						d3.select(this).style("stroke", "black").style("stroke-width", "3");
						// update information in the text area
						showInformationInTextArea(d);
						// highlight code in the pvs theory
						pvsWriter.focusOn(d);
						// and drag nodes if needed
						node.call(node_drag);
					}
				}
			})
			.on('mouseup', function(d) {
				d3.select(this).attr('transform', 'scale(1.1)');
				if(editor_mode == MODE.ADD_TRANSITION) {
					if(mousedown_node) {
						// update mouseup_node
						mouseup_node = d;

						// TODO: allow self-loops
						if(mouseup_node === mousedown_node) { resetMouseVars(); return; }

						// add link to graph (update if exists)
						var source = mousedown_node;
						var target = mouseup_node;
						var direction = 'right';
						links = graph.edges.values();
						var link = links.filter(function(l) { return (l.source === source && l.target === target); })[0];
						if(link) { link[direction] = true; } 
						else { add_edge(source, target); }

						// select new link
						selected_link = link;
						selected_node = null;

						// restore target node size
						d3.select(this).attr('transform', 'scale(1)');

						// redraw svg
						restart();
					}
				}
				else if(editor_mode == MODE.ADD_SELF_TRANSITION) {
					// update mouseup_node
					mouseup_node = d;
					// create the self-loops only if the mouse is still on the same source node
					if(mouseup_node == mousedown_node) { 
						resetMouseVars();
						// add self-edge
						add_edge(d,d);
						// redraw svg
						restart();
					}
				}
				else {
					showInformationInTextArea(d);
					pvsWriter.focusOn(d);
				}
			});
		// update existing nodes (reflexive & selected visual states)
		node.selectAll('node')
		.style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); })
		.classed('reflexive', function(d) { return d.reflexive; });
		// render resize tool for nodes
		nodeCanvas.append("rect").classed("resizeTool", true)
			.attr("width", 20).attr("height", 20)
			.attr("x", function(d) { return boxWidth/2 - 18; })
			.attr("y", function(d) { return boxHeight/2 - 18; }) // place the resize box at the lower right corner of the node
			.attr("rx", 2).attr("ry", 2) // rouded edges
			.attr("stroke", "gray").attr("stroke-width", "2").style("fill", "white") // set colours
			.style("cursor", "se-resize") // change cursor shape
			.attr("opacity", "0.4")
			.on("mousedown", function(d) { 
				node.call(resize);
				});
		// show node IDs
		nodeCanvas.append('svg:text')
			.attr('x', 0)
			.attr('y', 4)
			.attr('class', 'id')
			.text(function(d) { return d.name; });
		// remove old nodes
		node.exit().remove();
		// set the graph in motion
		force.start();
	}


	function resizeChart(d) {
		if(editor_mode == MODE.DEFAULT) {
			var chart = d3.select(this);
			var node = chart.select("rect.node");
			var nodeID = d.id;
			var boxWidth = parseFloat(node.attr("width"));
			var boxHeight = parseFloat(node.attr("height"));
			var resizeTool = chart.select("rect.resizeTool");
			var resizeToolX = parseFloat(resizeTool.attr("x"));
			var resizeToolY = parseFloat(resizeTool.attr("y"));
			// update svg
			var newBoxWidth = d3.event.dx + boxWidth;
			if(d3.event.dx + boxWidth > minBoxWidth) {
				node.attr("width", function(d) { return newBoxWidth; });
				resizeTool.attr("x", function(d) { return d3.event.dx + resizeToolX; })
			}
			var newBoxHeight = d3.event.dy + boxHeight;
			if(d3.event.dy + boxHeight > minBoxHeight) {
				node.attr("height", function(d) { return newBoxHeight; });
				resizeTool.attr("y", function(d) { return d3.event.dy + resizeToolY; });
			}
			// update info in graph
			update_node_size(nodeID,boxWidth,boxHeight);
		}
	}

	function mousedown() {
		if(editor_mode == MODE.ADD_NODE) {
			// insert new node at point
			var point = d3.mouse(this);
			add_node(point[0], point[1]);
			restart();
		}
		if(selected_nodes.length == 0) {
			// click on the svg canvas, deselect all nodes
			node.selectAll("rect").style("stroke", "").style("stroke-width", "");
		}
	}

	function mousemove() {
		if(!mousedown_node) return;
		// update drag line
		drag_line.attr('d', 'M' + mousedown_node.x 
								+ ',' + mousedown_node.y 
								+ 'L' + d3.mouse(this)[0] 
								+ ',' + d3.mouse(this)[1]);
		restart();
	}

	function mouseup() {
		if(mousedown_node) {
			// hide drag line
			drag_line.classed('hidden', true).style('marker-end', '');
		}

		// because :active only works in WebKit?
		svg.classed('active', false);

		// clear mouse event vars
		resetMouseVars();
	}

	function spliceLinksForNode(node) {
		if( ! links) return;
		var toSplice = links.filter(function(l) { return (l.source === node || l.target === node); });
		toSplice.map(function(l) { links.splice(links.indexOf(l), 1); });
	}

	// only respond once per keydown
	var lastKeyDown = -1;

	function keydown() {
		///Disabled, otherwise editor doesn't work 
		//d3.event.preventDefault();

		if(lastKeyDown !== -1) return;
		lastKeyDown = d3.event.keyCode;

		/*  // ctrl
		if(d3.event.keyCode === 17) {
		node.call(force.drag);
		svg.classed('ctrl', true);
		}
		*/
		if(!selected_node && !selected_link) return;

		switch(d3.event.keyCode) {
			case 8: // backspace
			case 46: // delete
				if(selected_node) {
				//LASTMOD
				graph.nodes.remove(selected_node.id);
				spliceLinksForNode(selected_node);

				} else if(selected_link) {
				//links.splice(links.indexOf(selected_link), 1);
				graph.edges.remove(selected_link.id);
				}
				selected_link = null;
				selected_node = null;
				restart();
				break;
			case 66: // B
				if(selected_link) {
				// set link direction to both left and right
				selected_link.left = true;
				selected_link.right = true;
				}
				restart();
				break;
			case 76: // L
				if(selected_link) {
				// set link direction to left only
				selected_link.left = true;
				selected_link.right = false;
				}
				restart();
				break;
			case 82: // R
				if(selected_node) {
					// toggle node reflexivity
					selected_node.reflexive = !selected_node.reflexive;
				} 
				else if(selected_link) {
					// set link direction to right only
					selected_link.left = false;
					selected_link.right = true;
				}
				restart();
				break;
		}
	}

	function keyup() {
		lastKeyDown = -1;
		// ctrl
		if(d3.event.keyCode === 17) {
			node.on('mousedown.drag', null).on('touchstart.drag', null);
			svg.classed('ctrl', false);
		}
	}


	d3.select("#infoBoxModifiable")
	  .on("change", function () {
		changeTextArea(node);
		restart();
		console.log(graph.nodes.values());
	  });


	// app starts here
	svg.on('mousedown', mousedown).on('mousemove', mousemove).on('mouseup', mouseup);
	d3.select(window).on('keydown', keydown).on('keyup', keyup);
	restart();  
}


module.exports = {
	init: function (editor) { return init(editor); },
	changeTextArea : changeTextArea,
	add_node_mode: function(){ return toggle_editor_mode(MODE.ADD_NODE); },
	add_transition_mode: function() { return toggle_editor_mode(MODE.ADD_TRANSITION); },
	add_self_transition_mode: function() { return toggle_editor_mode(MODE.ADD_SELF_TRANSITION); }
};



});
