/**
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _, Promise, document, FileReader*/

define(function (require, exports, module) {
	"use strict";

	function PIMs() { }

	PIMs.prototype.toPIM = function (emuchart, isImport) {
		if (!emuchart) { return false; }
		if (isImport && isImport === true) {
			emuchart.nodes.map(this.getState);
			return true;
		}
		var _this = this;
		console.log("Converted to PIM: Please ensure all transitions conform to the PIM specification.");
		emuchart.nodes.forEach(function (key) {
			var node = _this.cloneAsPIMState(emuchart.nodes.get(key));
			emuchart.edit_node(key, node);
		});
		return true;
	};

	PIMs.prototype.clonePIMWidget = function (widget) {
		if (!widget) { return null; }
		return {
			name : widget.name,
			category : widget.category,
			// If behaviours becomes an anon object this clone needs to be updated.
			behaviours : widget.behaviours.slice()
		};
	};

	PIMs.prototype.getWidget = function (widget) {
		if (!widget) { return null; }
		return this.clonePIMWidget(widget);
	};

	PIMs.prototype.getWidgets = function (widgets) {
		if (!widgets) { return []; }
		var clonedWidgets = [], _this = this;
		widgets.forEach(function (w) {
			// If widgets become stored in a map, this will need to be updated to:
			// clonedWidgets.push(_this.getWidget(widgets.get(w)));
			clonedWidgets.push(_this.getWidget(w));
		});
		return clonedWidgets;
	}

	PIMs.prototype.cloneAsPIMState = function (node) {
		if (!node) { return null; }
		return {
			name: node.name,
			id: node.id,
			x: node.x,
			y: node.y,
			width : node.width,
			height: node.height,
			widgets : this.getWidgets(node.widgets),
			components : this.getStates(node.components),
			pmr : node.pmr || []
		};
	};

	PIMs.prototype.getState = function (node) {
		if (!node) { return null; }
		return this.cloneAsPIMState(node);
	};

	PIMs.prototype.getStates = function (nodes) {
		if (!nodes) { return []; }
		var states = [], _this = this;
		nodes.forEach(function (key) {
			states.push(_this.getState(nodes.get(key)));
		});
		return states;
	};

	PIMs.prototype.cloneAsPIMTransition = function (trans) {
		if (!trans) { return null; }
		return {
			name: trans.name,
			id: trans.id,
			source: this.cloneAsPIMState(trans.source),
			target: this.cloneAsPIMState(trans.target),
			controlPoint: (trans.controlPoint) ? {
				x: trans.controlPoint.x,
				y: trans.controlPoint.y
			} : null,
			// PIM
			start_state : trans.source.name,
			end_state : trans.target.name,
			I_behaviour : trans.name
		};
	};

	PIMs.prototype.getTransition = function (trans) {
		if (!trans) { return null; }
		return this.cloneAsPIMTransition(trans);
	};

	PIMs.prototype.getTransitions = function (edges) {
		if (!edges) { return []; }
		var transitions = [], _this = this;
		edges.forEach(function (key) {
			transitions.push(_this.getTransition(edges.get(key)));
		});
		return transitions;
	};

	module.exports = PIMs;
});