/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5:true */
/*global define, d3, require, $, brackets, window, document, Promise */
define(function (require, exports, module) {
	"use strict";
	var displayEditState       = require("plugins/emulink/forms/pim/displayEditPIMState"),
		displayEditTransition  = require("plugins/emulink/forms/pim/displayEditPIMTransition");


	var emuchartsManager;

	function PIMEmulink(emuchartsManager) {
		this.emuchartsManager = emuchartsManager;
	}

	PIMEmulink.prototype.editState = function (s) {
		var _this = this;
		displayEditState.create({
			header: "Please enter new state...",
			textLabel: {
				newStateName: "State name",
				newStateWidgets: "State widgets",
			//	newStateComponents: "State components",
				newStatePMR: "State PMR"
			},
			placeholder: {
				newStateName: "Name, e.g., startInfusing",
				newStateWidgets: "Click to edit this states widgets",
			//	newStateComponents: "[Disabled]",
				newStatePMR: "[Disabled]"
			},
			value: {
				newStateName: s.name,
				widgets: s.widgets,
			//	newStateComponents: s.components,
				newStatePMR: s.pmr
			},
			buttons: ["Cancel", "Save state"]
		}).on("save_state", function (e, view) {
			// Get new values from template.
			var newStateName = e.data.labels.get("newStateName");
			var newStateWidgets = e.data.labels.get("newStateWidgets");
			//var newStateComponents = e.data.labels.get("newStateComponents");
			var newStatePMR = e.data.labels.get("newStatePMR");

			if (newStateName && newStateName.value !== "") {
				// Save over only the new values.
				s.name = newStateName;
				s.widgets = newStateWidgets;
				//s.components = newStateComponents;
				//s.pmr = newStatePMR;

				_this.emuchartsManager.edit_state(s.id, s);
				view.remove();
			}
		}).on("cancel", function (e, view) {
			// just remove window
			view.remove();
		});
	};

	// rename dialog window for transitions
	PIMEmulink.prototype.editTransition = function (t) {
		var _this = this;
		var behavs = [];

		t.source.widgets.forEach(function (w) {
			w.behaviours.forEach(function (b) {
				var type = b.substring(0, 2);
				// Only show interactive behaviours.
				if (type === 'I_') {
					behavs.push({value: b, text: b + " (w: " + w.name + ")"});
				}
			});
		});
		displayEditTransition.create({
			header: "Please select the transition behaviour (" + t.source.name + " --> " + t.target.name + ")...",
			textLabel: {
				i_behaviour: "I_Behaviour"
			},
			placeholder: {
				i_behaviour: "Select Interactive Behaviour"
			},
			value: {
				i_behaviours: behavs
			},
			buttons: ["Cancel", "Save"]
		}).on("save", function (e, view) {
			var transitionLabel = e.data.options.get("i_behaviour");
			if (transitionLabel) {
				// -1 as index 0 is a space saver.
				var name = behavs[transitionLabel - 1].value;
				_this.emuchartsManager.rename_transition(t.id, name);
				view.remove();
			}
		}).on("cancel", function (e, view) {
			// just remove rename window
			view.remove();
		});
	}

	module.exports = PIMEmulink;

});