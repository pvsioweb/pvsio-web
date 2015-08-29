/**
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _, Promise, document, FileReader*/

define(function (require, exports, module) {
	"use strict";

	function PIMs() { }

	PIMs.prototype.toPIM = function (emuchart, isImport) {
		if (emuchart) {
			var _this = this;

			if (isImport) {
				emuchart.nodes.map(_this.toPIMState);
				return;
			}

			console.log("Converted to PIM: Please ensure all transitions conform to the PIM specification.");
			emuchart.nodes.forEach(function (key) {
				var node = _this.toPIMState(emuchart.nodes.get(key));
				emuchart.edit_node(key, node);
			});
			return;
		}
	};

	PIMs.prototype.toPIMState = function (state) {
		if (!state) {
			return null;
		}
		state.widgets = state.widgets || [];
		state.components = state.components || [];
		state.pmr = state.pmr || [];
		return state;
	};

	PIMs.prototype.getStates = function (nodes) {
		if (!nodes) {
			return [];
		}
		var states = [];
		nodes.forEach(function (key) {
			var node = nodes.get(key);
			var state = {
				name: node.name,
				id: node.id,
				x: node.x,
				y: node.y,
				width : node.width,
				height: node.height,
				widgets : node.widgets || [],
				components : node.components || [],
				pmr : node.pmr || []
			};
			states.push(state);
		});
		return states;
	};

	PIMs.prototype.getTransition = function (trans) {
		if (!trans) {
			return null;
		}
		// Also include PIM values (for test gen).
		trans.start_state = trans.source.name;
		trans.end_state = trans.target.name;
		trans.I_behaviour = trans.name;
		return trans;
	};

	PIMs.prototype.getTransitions = function (edges) {
		if (!edges) {
			return [];
		}
		var transitions = [];
		edges.forEach(function (key) {
			var trans = edges.get(key);
			var newTrans = {
				name: trans.name,
				id: key,
				source: {
					name: trans.source.name,
					id: trans.source.id
				},
				target: {
					name: trans.target.name,
					id: trans.target.id
				},
				controlPoint: (trans.controlPoint) ? {
					x: trans.controlPoint.x,
					y: trans.controlPoint.y
				} : null,
				// PIM
				start_state : trans.source.name,
				end_state : trans.target.name,
				I_behaviour : trans.name
			};
			transitions.push(newTrans);
		});
		return transitions;
	};

	module.exports = PIMs;
});