/**
 * model for new project
 * @author Patrick Oladimeji
 * @date Jan 3, 2013 : 12:56:03 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process*/
define(["./formBuilder"], function (formBuilder) {
    "use strict";
    
	var model = {
			legend: {value: "New Project", classes: "header"},
			data: [
                {label: "Project Name", name: "projectName", other: ['required']},
                {label: "Prototype Image", name: "prototypeImage", inputType: "file", other: ['required']},
                {label: "PVS Spec", name: "pvsSpec", inputType: "file", other: ['required', "multiple"]}
            ]
		};
	
	return {
		create: function () {
			return formBuilder.create(model);
		}
	};
});