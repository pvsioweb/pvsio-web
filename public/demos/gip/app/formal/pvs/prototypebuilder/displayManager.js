/**
 * Module for managing display fields
 * @author Patrick Oladimeji
 * @date Dec 5, 2012 : 4:16:16 PM
 */

define(['./displayMappings', 'd3/d3'], function(mappings){
	var splitter = ":= ";
	var o = {};
	o.updateDisplay = function(stateString){
		if(stateString){
			var key, dispVal,regex, regexMatch, uiElement;
			for(key in mappings){
				//get the value of the display field in the output
				regex = mappings[key].regex;
				regexMatch = regex.exec(stateString);
				if(regexMatch){
					regexMatch = regexMatch.toString();
					dispVal = (regexMatch.substring(regexMatch.indexOf(splitter) + 3));
					//update the display ui element with the value
					uiElement = mappings[key].uiElement;
					if(uiElement){
						d3.select("#" + uiElement).html("")
							.append("span").attr("class", "displaylabel")
							.html(mappings[key].label);
						d3.select("#" + uiElement)
							.append("span").attr("class","displayvalue").html(dispVal);
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