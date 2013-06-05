/**
 * 
 * @author Patrick Oladimeji
 * @date Jan 10, 2013 : 11:47:37 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process*/
define(["./formBuilder"], function (formBuilder) {
    "use strict";
    
	var model = {
			legend: {value: "Save Project As", classes: "header"},
			data: [
                {label: "Project Name", name: "projectName", other: ['required']}
            ]
		};
	
	return {
		create: function () {
			return formBuilder.create(model);
		}
	};
});