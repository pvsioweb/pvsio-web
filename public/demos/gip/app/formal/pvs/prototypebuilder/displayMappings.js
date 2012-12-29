/**
 * Creates a mapping between a section of text in output and a display item
 * Does this by creating regular expressions to use to extract the appropriate field from the output
 * @author Patrick Oladimeji
 * @date Dec 5, 2012 : 4:17:11 PM
 */

define([], function(){
	var mappings = {};
	mappings.disp_field = {regex: new RegExp("display := [0-9\/.]+"), label:"Display:"};
	mappings.unit_field = {regex: new RegExp("unit := [0-9A-Za-z]+")};
	mappings.vtbi_field = {regex: new RegExp("vtbi := [0-9\/.]+"), label:"VTBI:"};
	mappings.infusing_field = {regex:new RegExp("is_infusing := [0-9\/.]+")};
	
	return mappings;
});