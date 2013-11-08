/**
 * Module for managing display fields
 * @author Patrick Oladimeji
 * @date Dec 5, 2012 : 4:16:16 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process, _*/
define(['./displayMappings', 'd3/d3'], function (mappings) {
    "use strict";
	var splitter = ":= ";
	var o = {};
	o.updateDisplay = function (stateString) {
		var map = mappings.active;
		if (stateString) {
			var key, regex, regexMatch, uiElement;
            _.each(map, function (value, key) {
                //get the value of the display field in the output
				regex = new RegExp(value.regex);
				regexMatch = regex.exec(stateString);
				if (regexMatch && regexMatch.length > 1) {
					if(regex.toString().indexOf("[0-9/.]+") >= 0) {
						// it's a number
						regexMatch = eval(regexMatch[1].toString());
					}
					else {
						// it's a string, remove the double quotes and don't evalutate the expression
						regexMatch = regexMatch[1].toString().replace(new RegExp("\"","g"),"")
					}
					//update the display ui element with the value
					uiElement = value.uiElement;
					if (uiElement) {
						d3.select("#" + uiElement).html("")
							.append("span").attr("class", "displayvalue").html(regexMatch);
					}
				}
					
				uiElement = undefined;
            });
		}//endif
	};
	
	o.clearDisplay = function () {
		var key, uiElement;
        _.each(mappings, function (value, key) {
            uiElement = value.uiElement;
			if (uiElement) {
				d3.select("#" + uiElement).html("");
			}
			uiElement = undefined;
        });
	};
	return o;
});
