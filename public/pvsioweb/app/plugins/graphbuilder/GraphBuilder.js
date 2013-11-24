/**
 * 
 * @author Patrick Oladimeji
 * @date 11/22/13 9:03:14 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
	"use strict";
	var d3 = require("d3/d3"),
		eventDispatcher = require("util/eventDispatcher");
	
	function GraphBuilder(pvsioWebClient) {
		var canvas = pvsioWebClient.createCollapsiblePanel("Visualisation of State Transition Diagram")
			.attr("class", "graph-container");
		
		var ws = pvsioWebClient.getWebSocket(),
			nodesHash = {},
			edgesHash = {},
			w = 1130,
			h = 300,
			radius = 6,
			force,
			onGraphUpdate;
		function init() {
			var svg = canvas.append("svg").attr("width", w).attr("height", h).append("g");
			var tooltip = canvas.append("div").attr("id", "tooltip");
			force = d3.layout.force().size([w, h]).linkDistance(30).nodes([]).links([]).charge(-150)
				.on("tick", function () {
					svg.selectAll("line.edge").attr("x1", function (d) { return d.source.x; })
						.attr("y1", function (d) { return d.source.y; })
						.attr("y2", function (d) {return d.target.y; })
						.attr("x2", function (d) {return d.target.x; });
					
					svg.selectAll("circle.node").attr("cx", function (d) {return d.x; })
						.attr("cy", function (d) {return d.y; });
				});
			
			function updateGraph(nodes, edges, currentEdge) {
				var edgeEls = svg.selectAll("line.edge").data(edges).enter()
					.insert("line", "circle.node").attr("class", "edge")
					.attr("x1", function (d) { return d.source.x; })
					.attr("y1", function (d) { return d.source.y; })
					.attr("y2", function (d) {return d.target.y; })
					.attr("y1", function (d) {return d.target.x; });
				var nodeEls = svg.selectAll("circle.node").data(nodes);
				nodeEls.enter()
					.append("circle")
					.attr("cx", function (d) {return d.x; })
					.attr("cy", function (d) {return d.y; })
					.attr("r", radius)
					.attr("class", function (d, i) {
						var c = i === 0 ? "root" : "";
						return "node " + c;
					})
					.on("mouseover", function (d, i) {
						d3.event.preventDefault();
						d3.event.stopPropagation();
						tooltip.html(d.name).style("top", (d3.event.layerY + 10) + "px")
							.style("left", (d3.event.layerX + 10) + "px").style("display", null);
					}).on("mouseout", function (d, i) {
						tooltip.style("display", "none");
					});
				nodeEls.classed("selected", function (d, i) {
					return currentEdge.target === i;
				});
				force.start();
			}
			
			onGraphUpdate = function (event) {
				var transition = event.transition,
					source = event.source,
					target = event.target,
					edge,
					edgeString,
					nodes = force.nodes(),
					edges = force.links();
				if (nodesHash[source] === undefined) {
					nodesHash[source] = nodes.push({name: source}) - 1;
				}
				if (nodesHash[target] === undefined) {
					nodesHash[target] = nodes.push({name: target}) - 1;
				}
				edge = {source: nodesHash[source], target: nodesHash[target], transition: transition};
				edgeString = JSON.stringify(edge);
				if (!edgesHash[edgeString]) {
					edgesHash[edgeString] = edges.push(edge) - 1;
				}
				
				updateGraph(nodes, edges, edge);
			};
			
			ws.addListener("GraphUpdate", onGraphUpdate);
		}
		
		function clear() {
			canvas.html("");
			ws.removeListener("GraphUpdate", onGraphUpdate);
			nodesHash = {};
			edgesHash = {};
		}
		
		init();
		
		return {
			init: init,
			clear: clear
		};
	}
	
	
	module.exports = GraphBuilder;
});
