/**
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _, Promise, document, FileReader*/

define(function (require, exports, module) {
	"use strict";

	function PIMs(isPIM) {
		this.isPIM = isPIM || false;
	}

	PIMs.prototype.getIsPIM = function () {
		return this.isPIM || false;
	};

	PIMs.prototype.toPIM = function (toPIM) {
		toPIM =  toPIM === 'undefined' ? true : toPIM;
		if (toPIM && !this.isPIM) {
			this.isPIM = true;
			return true;
		}
		if (!toPIM && this.isPIM) {
			this.isPIM = false;
			return true;
		}
		return false;
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

	/**
	 *
	 * @param behaviour
	 * @returns {*} If no behaviour provided returns all PMR as a set,
	 * If behaviour could be found then returns the relation (behaviour, operation),
	 * else returns null.
	 */
	PIMs.prototype.getPMR = function (pmrs, behaviour) {
		if (!pmrs) { return {}; }
		if (behaviour) {
			return pmrs[behaviour] || null;
		}
		var _pmr = {};
		for (behaviour in pmrs) {
			if (pmrs.hasOwnProperty(behaviour)) {
				_pmr[behaviour] = pmrs[behaviour];
			}
		}
		return _pmr;
	};

	/**
	 * Add a PMR (overrides any existing PMR for the given behaviour).
	 * ({behaviour (string), operation (string)}).
	 * @param pmr
	 * @returns {boolean} true if successfully added.
	 */
	PIMs.prototype.addPMR = function (pmrs, behaviour, operation) {
		if (!pmrs || !behaviour || !operation) {
			return false;
		}
		pmrs[behaviour] = operation;
		return true;
	};

	/**
	 * Saves the new PMRs into the pool of all PMRs
	 * @param newPMRs
	 * @returns {boolean}
	 */
	PIMs.prototype.mergePMR = function (pmrs, newPMRs) {
		for (var behaviour in newPMRs) {
			if (newPMRs.hasOwnProperty(behaviour)) {
				pmrs[behaviour] = newPMRs[behaviour];
			}
		}
	};

	module.exports = PIMs;
});