/**
 * Creates a mapping between a section of text in output and a display item
 * Does this by creating regular expressions to use to extract the appropriate field from the output
 * @author Patrick Oladimeji
 * @date Dec 5, 2012 : 4:17:11 PM
 */

define([], function(){
	var mappings = {};
	mappings.preset ={};
	mappings.active = {};
	
	mappings.preset.string = {value:"\\w+", label:"String"};
	mappings.preset.numeric = {value:"[0-9\/.]+", label:"Numeric"};
	
	return mappings;
});