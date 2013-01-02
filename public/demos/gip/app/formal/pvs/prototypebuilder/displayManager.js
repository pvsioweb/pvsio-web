/**
 * Module for managing display fields
 * @author Patrick Oladimeji
 * @date Dec 5, 2012 : 4:16:16 PM
 */

define(['./displayMappings', 'd3/d3'], function(mappings){
	var splitter = ":= ";
	var o = {};
	o.updateDisplay = function(stateString){
		var map = mappings.active;
		if(stateString){
			var key, regex, regexMatch, uiElement;
			for(key in map){
				//get the value of the display field in the output
				regex = new RegExp(map[key].regex);
				regexMatch = regex.exec(stateString);
				if(regexMatch && regexMatch.length > 1){
					regexMatch = eval(regexMatch[1].toString());
					//update the display ui element with the value
					uiElement = map[key].uiElement;
					if(uiElement){
						d3.select("#" + uiElement).html("")
							.append("span").attr("class","displayvalue").html(regexMatch);
					}
				}
					
				uiElement = undefined;
			}
		}//endif
	};
	
	o.clearDisplay = function(){
		var key, uiElement;
		for(key in mappings){
			uiElement = mappings[key].uiElement;
			if(uiElement){
				d3.select("#" + uiElement).html("");
			}
			uiElement = undefined;
		}
	};
	return o;
});