/**
 * Creates a mapping between a section of text in output and a display item
 * Does this by creating regular expressions to use to extract the appropriate field from the output
 * @author Patrick Oladimeji
 * @date Dec 5, 2012 : 4:17:11 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process*/
define([], function () {
    "use strict";
	var mappings = {};
	mappings.preset = {};
	mappings.active = {};
	
	mappings.preset.string = {value: "\"[\\w\\s.]+\"", label: "String"};
	mappings.preset.numeric = {value: "[0-9\/.]+", label: "Numeric"};
	
	return mappings;
});
