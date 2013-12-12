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
var curvyLines = true;
// force layout parameters
var distance = 300;
var strength = 0; // must be between 0 and 1
var charge = -50; // positive value = repulsion; negative value = attraction; for graphs, negative values should be used

var animatedLayout = false;

/**
 * highlightElements changes the colour of the nodes in array 'nodes' specified as parameter.
 * This function is used during simulations to put in evidence the state changes caused by a user action
 * Example of invocation: highlightElements(["Ready","click_POINT", "Process_DP"]);
 * 
 */
var highlightElements = function ( nodes ) {
	// highlight nodes
	svg.selectAll("g").selectAll("g").select("rect")
		.style("fill", function (d) {
				for(var i = 0; i < nodes.length; i++) {
					if(nodes[i] == d.name) {
						return "white";
					}
				}
				return "";
			})
		.style("stroke", function (d) {
			for(var i = 0; i < nodes.length; i++) {
				if(nodes[i] == d.name) {
					return "green";
				}
			}
			return "";})
		.style("stroke-width", 3);

	// find edges that connect the nodes
	var labels = [];
	for(var i = 1; i < nodes.length; i++) {
		var source = nodes[i-1];
		var target = nodes[i];
		// FIXME: for now we work under the assumption that at most one link exists between source and target, and source and target have unique names
		var link = graph.edges.values().filter(function(l) { return (l.source.name === source && l.target.name === target); })[0];
		if(link) { labels.push(link); }
	}

	svg.selectAll("path")		
		.style("stroke", function (d) {
			if(d) {
				for(var i = 0; i < labels.length; i++) {
					if(labels[i].name == d.name 
						&& labels[i].source.name == d.source.name
						&& labels[i].target.name == d.target.name) {
						return "green";
					}
				}
				return "grey";}
			})
}

var add_node = function (positionX, positionY, label, notWriter ) {
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
			weight: 0,
            warning : new Object()
	};

    node.warning.notPresentInSpec = false;
    node.warning.labelAlreadyUsed = false;
	// add node
	graph.nodes.set(node.id, node);
    
    if( notWriter ) { return node; }
	// update pvs theory accordingly
	pvsWriter.addState(node);
    return node;
}
var delete_node = function (id) {
    graph.nodes.remove(id);
}
var delete_all_nodes = function () {
    graph.nodes.forEach(function(key, value) { graph.nodes.remove(key); });
}
var update_node_size = function (id, width, height) {
	var theNode = graph.nodes.get(id);
	theNode.height = height;
	theNode.width = width;
	graph.nodes.set(id, theNode);
}


var edgeIDGenerator = 0;
var newEdgeID = function () { return edgeIDGenerator++; }
var add_edge = function (source, target, label, notWriter) {
	var _id = "T" + newEdgeID();
	var edge = {
		id: _id, // edge id must be unique
		source: source,
		target: target,
		name : (label === undefined)? "tick" : label,
	};
	// add edge
	graph.edges.set(edge.id, edge);
    
    if( notWriter ) { return; }

	// update pvs theory accordingly
	pvsWriter.addTransition(edge.name, edge.id);
	pvsWriter.addConditionInTransition(edge.name, source, target);
}
var delete_edge = function (id) {
	graph.edges.remove(id);
}
var delete_all_edges = function () {
    graph.edges.forEach(function(key, value) { graph.edges.remove(key); });
}

var MODE = { DEFAULT: 0, ADD_NODE: 1, ADD_TRANSITION: 2, ADD_SELF_TRANSITION: 3 };
var editor_mode = MODE.DEFAULT;

var selected_nodes = d3.map();
var selected_edges = d3.map();
var ws;

// creation of svg element to draw the graph
var width =  930;
var height = 800;
var svg = d3.select("#ContainerStateMachine").append("svg").attr("width", width).attr("height", height).attr("id", "canvas").style("background", "#fffcec");


var BLOCK_START = "%{\"_block\" : \"BlockStart\"";
var BLOCK_END   = "%{\"_block\" : \"BlockEnd\"";
var ID_FIELD    = "\"_id\"";
    
var tagStateNameStart = "  " + BLOCK_START + ", " + ID_FIELD + " : \"StateName\", \"_type\": \"Nodes\"}";    
var tagStateNameEnd   = "  " + BLOCK_END   + ", " + ID_FIELD + " : \"StateName\", \"_type\": \"Nodes\"}";

var tagStateStart = "  " + BLOCK_START + ", " + ID_FIELD + " : \"State\", \"_type\": \"State\"}"; 
var tagStateEnd   = "  " + BLOCK_END   + ", " + ID_FIELD + " : \"State\", \"_type\": \"State\"}";

var tagFuncStart = "  " + BLOCK_START + ", " + ID_FIELD + " : \"*nameFunc*\", \"_type\": \"Function\"}";
var tagFuncEnd   = "  " + BLOCK_END   + ", " + ID_FIELD + " : \"*nameFunc*\", \"_type\": \"Function\"}";

var tagPerStart = "  " + BLOCK_START + ", " + ID_FIELD + " : \"*namePer*\", \"_type\": \"Permission\"}";
var tagPerEnd   = "  " + BLOCK_END   + ", " + ID_FIELD + " : \"*namePer*\", \"_type\": \"Permission\"}";

var tagEdgeStart = "  " + BLOCK_START + ", " + ID_FIELD + " : \"*nameEdge*\", \"_type\": \"Edge\"}";
var tagEdgeEnd   = "  " + BLOCK_END   + ", " + ID_FIELD + " : \"*nameEdge*\", \"_type\": \"Edge\"}";

var tagCondStart = "  " + BLOCK_START + ", " + ID_FIELD + " : \"*nameCond*\", \"_source\" : *SRC*, \"_target\" : *TRT*, \"_type\": \"Transition\"}";    
var tagCondEnd   = "  " + BLOCK_END   + ", " + ID_FIELD + " : \"*nameCond*\", \"_source\" : *SRC*, \"_target\" : *TRT*, \"_type\": \"Transition\"}";

var links;

// FIXME: this should be renamed into delete_graph
function clearSvg() {
	delete_all_nodes();
	delete_all_edges();    
}
    
function buildGraph()
{
    svg = d3.select("#ContainerStateMachine").append("svg").attr("width", width).attr("height", height)
			.attr("id", "canvas").style("background", "#fffcec");
    emulink();
}

function restoreGraph(graphToRestore, editor, ws, currentProject, pm)
{
    init(editor, ws, currentProject, pm, false);
    var nodesToRestore = graphToRestore.nodes;
    var edgesToRestore = graphToRestore.edges;
    var workAround = new Array();
    var comeOn = new Array();
    for( var id in nodesToRestore)
    {
         var currentNode = nodesToRestore[id];
         workAround.push(currentNode);
         comeOn.push(add_node(currentNode.x, currentNode.y, currentNode.name, true));
    }
    for( var id in edgesToRestore)
    {
         console.log(edgesToRestore[id]);
         var currentEdge = edgesToRestore[id];
         for( var i = 0; i < workAround.length; i++ )
         {
             if ( workAround[i].name == currentEdge.source.name )
                 currentEdge.source = comeOn[i];
             
             if( workAround[i].name == currentEdge.target.name )
                 currentEdge.target = comeOn[i];
         }
         add_edge(currentEdge.source, currentEdge.target, currentEdge.name, true);
    } 
    emulink();
}


function getGraphDefinition() { return JSON.stringify(graph); }

var clear_node_selection = function () {
	selected_nodes.forEach(function(key, value) { selected_nodes.remove(key); });
	svg.selectAll("g").selectAll("g").select("rect").style("stroke", "").style("stroke-width", "");
}

var clear_edge_selection = function () {
	selected_edges.forEach(function(key, value) { selected_edges.remove(key); });
	svg.selectAll("path").classed("selected", false);
}

var clear_selection = function () {
	clear_node_selection();
	clear_edge_selection();
}

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

function changeTextArea(node, path) {
    
	if( selected_nodes.keys().length == 0 && selected_edges.keys().length == 0 ) {        
	    document.getElementById('infoBox').value = " ";
        document.getElementById('infoBoxModifiable').value= " ";
	}

	var textArea = document.getElementById("infoBoxModifiable");
	var content = textArea.value;
	var name = content.split(';')[0];
	var realName = name.substring(name.indexOf(':') + 2);
    var newOperation = realName.substring(realName.indexOf('{') + 1, realName.indexOf('}') );
    		
	if( selected_nodes.keys().length == 1 ) {    
	    /// Change name in the canvas 
	    var object = selected_nodes.get(selected_nodes.keys());
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
        
        return;
	}
    if( selected_edges.keys().length == 1)
    {
        var object = selected_edges.get(selected_edges.keys());
        var sourceName = object.source.name;
        var targetName = object.target.name;
        var oldId = object.id;
		var oldName = object.name.indexOf('{') == -1 ? object.name : object.name.substring(0,object.name.indexOf('{'));
        var counter = 0;
        var newName = realName;
        
        path.selectAll("text").text(function(d) { 
            
            var tmp = d.name.indexOf('{') == -1 ? d.name : d.name.substring(0,d.name.indexOf('{'));            
            if(tmp == oldName ) { counter ++; }
			if( d.id == oldId) { 
                if( ! newOperation)
                    return realName;
                
                realName = realName.substring(0, realName.indexOf('{'));
       
                var newName = tmp +'{' + newOperation + '}';
                return newName;
            }
			return d.name;
		});
		var newNode = graph.edges.get(oldId);
        
		newNode.name = newName;
		graph.edges.set(oldId, newNode);
        
        /// Change name in the PVS specification
        pvsWriter.changeFunName(oldName, realName, sourceName, targetName, counter);   
        if( newOperation ) { 
			pvsWriter.addOperationInCondition(realName, sourceName, targetName, newOperation); 
		}
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

function getNodesInDiagram() { return graph.nodes.values(); }
function getEdgesInDiagram() { return graph.edges.values(); }   

/// Function init is the entry point of the Emulink graphical editor
function init(_editor, wsocket, currentProject, pm, startWriter) {

    // After last modifications (Emulink commented) I need to create here SVG 
    svg = d3.select("#ContainerStateMachine").append("svg").attr("width", width).attr("height", height)
			.attr("id", "canvas").style("background", "#fffcec");

    ws = wsocket;

    document.getElementById('infoBox').value = "TIP: Click on any element to see its properties";
	document.getElementById('infoBoxModifiable').value= "TIP: After clicking on an element, editable properties will be showed here";
	
	/// creating new specification (just scheleton )
	editor = _editor;
    
    pvsWriter.init(editor, ws, currentProject, pm);
    
    pvsWriter.setTagsName(tagStateNameStart, tagStateNameEnd);
    pvsWriter.setTagsState(tagStateStart, tagStateEnd);
    pvsWriter.setTagsFunc(tagFuncStart, tagFuncEnd);
    pvsWriter.setTagsPer(tagPerStart, tagPerEnd);
    pvsWriter.setTagsEdge(tagEdgeStart, tagEdgeEnd);
    pvsWriter.setTagsCond(tagCondStart, tagCondEnd);
    
    // Start Emulink
	emulink();
    
    if( ! startWriter) { return; }
	pvsWriter.newSpecification("myTheory"); 
}

var emulink = function() {

    console.log("emulink is called");
	var colors = d3.scale.category10();

	// init D3 force layout
	var force = d3.layout.force()
		.nodes(graph.nodes.values())
		.links(graph.edges.values())
		.size([width, height])
		.linkDistance(distance)
		.linkStrength(strength)
		.charge(charge)
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
			if(animatedLayout) { force.resume(); }
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
	var mouseup_link   = null;

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
					var sourcePaddingX = d.source.width  * 0.6; //boxWidth * 0.4;
					var sourcePaddingY = d.source.height * 0.6;//boxHeight * 0.4;
					var targetPaddingX = d.target.width  * 0.8; //boxWidth * 0.6;
					var targetPaddingY = d.target.height * 0.8;//boxHeight * 0.6;
					var sourceX = d.source.x + (sourcePaddingX * normX);
					var sourceY = d.source.y + (sourcePaddingY * normY);
					var targetX = d.target.x - (targetPaddingX * normX);
					var targetY = d.target.y - (targetPaddingY * normY);
					if(curvyLines && deltaX >= 0){
						if(deltaY > 40) {
							targetPaddingX = d.target.width * 0.2; //boxWidth * 0.6;
							targetPaddingY = d.target.height * 0.6;//boxHeight * 0.6;
							targetX = d.target.x + targetPaddingX;
							targetY = d.target.y - targetPaddingY;
						}
						else {
							targetPaddingX = d.target.width * 0.6; //boxWidth * 0.6;
							targetPaddingY = d.target.height * 0.2;//boxHeight * 0.6;
							targetX = d.target.x - targetPaddingX;
							targetY = d.target.y - targetPaddingY;
						}
						return "m" + sourceX + ',' + sourceY + "A" + dist + "," + dist + " 0 0,1 " + targetX + "," + targetY; 
					}
					return "m" + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY; // this draws a straight line
				}
			}).classed("selected", function(d) {
				return selected_edges.has(d.id);
			});
		path.selectAll("text")
			.attr("dy", "-5")
			.style("fill","blue")
			.attr("x", function(d) {
				if(d.target.id == d.source.id) {
					// self-edge
					return d.source.x + 32;
				}
				// else do nothing -- textpath will take care of placing the text
			})
			.attr("y", function(d) { 
				if(d.target.id == d.source.id) {
					// self-edge
					return d.source.y - 40;
				}
				// else do nothing -- textpath will take care of placing the text
			});
		// move nodes if they are dragged
		node.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
		});
	}

	// update graph (called when needed)
	function restart() {
		force = d3.layout.force()
					.nodes(graph.nodes.values())
					.links(graph.edges.values())
					.size([width, height])
					.linkDistance(distance)
					.linkStrength(strength)
					.charge(charge)
					.on('tick', tick);

		//--- paths -----------------------------------------------------------------------------------------------
		path = path.data(graph.edges.values());
		// add new links
		var pathCanvas = path.enter().append('svg:g');
		pathCanvas
			.append('svg:path')
			.attr("id", function(d) { return d.id; })
			.attr('class', 'link')
			.style('marker-start', function(d) { return d.left ? 'url(#start-arrow)' : ''; })
			.style('marker-end', 'url(#end-arrow)')
			.style("cursor", "pointer") // change cursor shape
			.style("stroke-width", "3")
			.on('mousedown', function(d) {
				if(d3.event.ctrlKey) {
					//TODO: use the ctrl key to allow the selection of multiple nodes
				}
				else {
					showInformationInTextArea(d);
					pvsWriter.focusOnFun(d, true);
					clear_selection();
					selected_edges.set(d.id, d);
				}
			});
		pathCanvas
			.append("svg:text")
			.attr("class", "label")
			.attr("id", function(d) { return "text:" + d.id; })
			.text(function(d) {
				if(d.target.id == d.source.id) {
					// text for self edges is rendered as standard text field
					return d.name;
				}
				// text for other edges is rendered as textpath
				return "";
			})
			.style("cursor", "pointer") // change cursor shape
			.on('mousedown', function(d) { // FIXME: THIS HANDLER IS NEVER TRIGGERED
				if(d3.event.ctrlKey) {
					//TODO: use the ctrl key to allow the selection of multiple nodes
				}
				else {
					showInformationInTextArea(d);
					pvsWriter.focusOnFun(d);
					clear_selection();
					selected_edges.set(d.id, d);
				}
			});
		pathCanvas
			.append("svg:text")
			.append("textPath")
			.classed("selected", true)
			.attr("class", "label")
			.attr("id", function(d) { return "textPath:" + d.id; })
			.attr("xlink:href", function(d) { return "#" + d.id; })
			.attr("startOffset", "50%")
			.style("text-anchor", "middle")
			.text(function(d) { 
				if(d.target.id == d.source.id) {
					// text for self edges is rendered as standard text field
					return "";
				}
				// text for other edges is rendered here
				return d.name;
			})
			.style("cursor", "pointer") // change cursor shape
			// FIXME: THIS HANDLER IS NEVER TRIGGERED -- cant understand why!
			.on('mousedown', function(d) { 
				if(d3.event.ctrlKey) {
					//TODO: use the ctrl key to allow the selection of multiple nodes
				}
				else {
					showInformationInTextArea(d);
					pvsWriter.focusOnFun(d);
					clear_selection();
					selected_edges.set(d.id, d);
				}
			});

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
			.classed('reflexive', true)
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
				// update mousedown_node
				mousedown_node = d;
				// create an arrow when the editor is in mode add_transition
				if(editor_mode == MODE.ADD_TRANSITION) {
					svg.classed('ctrl', true);		  
					// select node
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
						clear_node_selection();
						selected_nodes.set(d.id, d);
        
                        //START WriterModification: I need to select the node to be able to delete it when user types 'canc'
                        //selected_node = d;
                        //END 
                                                
						// highlight only selected nodes
						node.selectAll("rect")
							.style("stroke", function(d) {
								if(selected_nodes.has(d.id)) { return "black"; }
								return ""; 	})
							.style("stroke-width", function(d) {
								if(selected_nodes.has(d.id)) { return 2; }
								return 0;});
                        // showing toolbar node and hidding toolbar edge
                        // update information in the text area
						showInformationInTextArea(d);
						// highlight code in the pvs theory
						pvsWriter.focusOn(d);
						// and drag nodes if needed
						node.call(node_drag);
					}
					// do not propagate event to parents, otherwhise the selection will be cleared
//					event.stopPropagation();
				}
				// finally, highlight selected node
				d3.select(this).style("stroke", "black").style("stroke-width", "2");
			})
			.on('mouseup', function(d) {
				// update mouseup_node
				mouseup_node = d;
				if(editor_mode == MODE.ADD_TRANSITION) {
					if(mousedown_node) {
						if(mouseup_node != mousedown_node) {
							// add link to graph (update if exists)
							var source = mousedown_node;
							var target = mouseup_node;
							var direction = 'right';
							if(graph && graph.edges) {
								var link = graph.edges.values().filter(function(l) { return (l.source === source && l.target === target); })[0];
								if(link) { link[direction] = true; } 
								else { 
									add_edge(source, target);
									link = graph.edges.values().filter(function(l) { return (l.source === source && l.target === target); })[0];
								}

								// automatically select created link, if any has been created
								if(link) {
									clear_selection();
									selected_edges.set(link.id, link);
								}
							}
						}
						// redraw svg
						restart();
					}
				}
				else if(editor_mode == MODE.ADD_SELF_TRANSITION) {
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
		.style('fill', function(d) { return (d === selected_node) ? d3.rgb(colors(d.id)).brighter().toString() : colors(d.id); });
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

	function mousemove() {
		if(!mousedown_node) return;
		// update drag line
		drag_line.attr('d', 'M' + mousedown_node.x 
								+ ',' + mousedown_node.y 
								+ 'L' + d3.mouse(this)[0] 
								+ ',' + d3.mouse(this)[1]);
		restart();
	}

	function mousedown() {
		// if editor is in ADD_NODE mode, then create a new node and select the created node
		// FIXME: to select the created node we need to modify add_node so that it returns the created node
        if(editor_mode == MODE.ADD_NODE) {
			// insert new node at point
			var point = d3.mouse(this);
			add_node(point[0], point[1]);
			restart();
		}
	}

	function mouseup() {
		// click on the svg canvas, deselect all nodes
		if(mouseup_node != mousedown_node) {
			resetMouseVars();
			clear_node_selection(); 
		}
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
                pvsWriter.removeState(selected_node, graph.nodes.keys().length);

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
		changeTextArea(node, path);
		restart();
	  });
    
    d3.select("#changeNameNode")
      .on("click", function () {
			if(selected_nodes.keys().length == 1) {
				var object = selected_nodes.get(selected_nodes.keys());
				var newName = prompt("Please enter new node label",object.name);
				if( newName && newName.length ) {
					/// Change name in the canvas 
					var oldId = object.id;
					var oldName = object.name;

					node.selectAll("text").text(function(d) { 
					if(d.id == oldId) { return newName; }
					return d.name;
					});
					var newNode = graph.nodes.get(oldId);
					newNode.name = newName;
					graph.nodes.set(oldId, newNode);

					/// Change name in the PVS specification
					pvsWriter.changeStateName(oldName, newName);

					restart();
				}
			}
      });
    
	d3.select("#changeNameEdge")
      .on("click", function () {
			if(selected_edges.keys().length == 1) {
				var object = selected_edges.get(selected_edges.keys());
				var newName = prompt("Please enter new edge label", object.name);
				if( newName && newName.length > 0 ) {
					var sourceName = object.source.name;
					var targetName = object.target.name;
					var id = object.id;
					var originalName = object.name;
					var counter = 0;

					var edges = graph.edges.values();
					for(var i = 0; i < edges.length; i++) {
						if(edges[i].name == originalName) {
							counter++;
						}
					}

					// self-edges store the label as text
					var textID = "text:" + id;
					if(object.source.id == object.target.id) {
						path.selectAll("text.label").text( function(d) {
							if(d.id == id) { return newName; }
							return d.name;
						});
					}
					else {
						// other edges store the label as textPath
						/* this works in Firefox but not in Chrome -- could be a bug in Chrome's Javascript implementation
						 * as a workaround, we directly manipulate DOM
						path.selectAll("textPath").text( function(d) {
							if(d.name == originalName ) { counter++; }
							if(d.id == id) { return newName; }
							return d.name;
						});*/

						// here's the workaround for the bug with textPath in Chrome
						var textPathID = "textPath:" + id;
						if(path.selectAll("text")) {
							for(var i = 0; i < path.selectAll("text").length; i++) {
								if(path.selectAll("text")[i] && path.selectAll("text")[i][1] && path.selectAll("text")[i][1].childNodes[0]) {
									if(path.selectAll("text")[i][1].childNodes[0].id == textPathID) {
										// remove the textpath child
										var textPath = path.selectAll("text")[i][1].removeChild(path.selectAll("text")[i][1].childNodes[0]);
										// replace the text in textPath with the new label
										textPath.removeChild(textPath.childNodes[0]);
										textPath.appendChild(document.createTextNode(newName));
										// append the textPath back
										path.selectAll("text")[i][1].appendChild(textPath);
									}
								}
							}					
						}
					}
					var newNode = graph.edges.get(id);

					newNode.name = newName;
					graph.edges.set(id, newNode);

					/// Change name in the PVS specification
					pvsWriter.changeFunName(originalName, newName, sourceName, targetName, counter);             
					restart();
				}
			}
      });
    
    d3.select("#addOperation")
	  .on("click", function () {
			if(selected_edges.keys().length == 1) {
				var object = selected_edges.get(selected_edges.keys());        
				var fieldState = prompt("State field to change");
				if( fieldState.length == 0 ) { return; }
				var value = prompt("Value for " + fieldState);
				if( value.length == 0 ) { return; }

				var operation = fieldState + ":= " + value;
				pvsWriter.addOperationInCondition(object.name, object.source.name, object.target.name, operation); 
			}
    });
    

    
    d3.select("#addFieldState")
      .on("click", function () {
          restart();
          var newField = prompt("Please enter name and type of the field separated by comma", "current_output, int");
          
          if( !newField)
              return;
          
          newField = newField.split(',');
          if( newField.length != 2 )
          {
              alert("Error in adding field");
              return;
          }
          pvsWriter.addFieldInState(newField[0], newField[1]);
          console.log(newField);
      });
	// app starts here
	svg.on('mousedown', mousedown).on('mousemove', mousemove).on('mouseup', mouseup);
	d3.select(window).on('keydown', keydown).on('keyup', keyup);
	restart();  
}
     


module.exports = {
	init: function (editor, wsocket, currentProject, pm, start) { return init(editor, wsocket, currentProject, pm, start); },
	changeTextArea : changeTextArea,
	add_node_mode: function(){ if( d3.select("#ContainerStateMachine").selectAll("svg")[0].length )
                               return toggle_editor_mode(MODE.ADD_NODE);
                               document.getElementById("emulinkInfo").value = "Emulink Status: NOT ACTIVE;\nClick on New Diagram to Activate Emulink";
                             },
	add_transition_mode: function() { return toggle_editor_mode(MODE.ADD_TRANSITION); },
	add_self_transition_mode: function() { return toggle_editor_mode(MODE.ADD_SELF_TRANSITION); },
    getNodesInDiagram : getNodesInDiagram,
    getEdgesInDiagram : getEdgesInDiagram,
    getGraphDefinition : getGraphDefinition,
    restoreGraph : restoreGraph,
    buildGraph : buildGraph,
    add_node : function(x,y,label,writer) { var ret = add_node(x,y,label,writer);  return ret; },
    add_edge : function(source, target, lab, notWr) {add_edge(source, target, lab, notWr);  },
    emulink: emulink,
    clearSvg : clearSvg,
	highlightElements: highlightElements
};



});
