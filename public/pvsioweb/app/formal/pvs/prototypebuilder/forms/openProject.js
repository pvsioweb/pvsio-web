/**
 * handles creating a form for opening a project
 * @author Patrick Oladimeji
 * @date Jan 5, 2013 : 6:42:35 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process*/
define(["./formBuilder"], function (formBuilder) {
    "use strict";
	return {
		create: function (options, labelFunc) {
			labelFunc = labelFunc || function (d) {
				return d.label;
			};
			
			var model = {
					legend: {value: "Open Project", classes: "header"},
					data: [{label: "Select Project", name: "projectName", element: "select",
						options: options, labelFunction: labelFunc, other: ['required']}]
                };
			return formBuilder.create(model);
		}
	};
});