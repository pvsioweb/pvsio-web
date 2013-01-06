/**
 * 
 * @author Patrick Oladimeji
 * @date Dec 29, 2012 : 1:24:55 PM
 */
define(['./baseWidget', './widgetType', 'util/property','./displayMappings'], 
	function(baseWidget, widgetType, property, displayMappings){
	var widgetTypes = [{value:widgetType.Button, label:widgetType.Button},{value:widgetType.Display, label:widgetType.Display}];

	function predefinedRegexes(){
		var res = [];
		for(var key in displayMappings.preset){
			res.push(displayMappings.preset[key]);
		}	
		return res;
	}
	
	return function(regex, label){
		var o = baseWidget(widgetType.Display);
		o.regex = property.call(o, regex || '');
		//o.label = property.call(o, label || '');
		o.predefinedRegex = property.call(o, "");
		o.prefix = property.call(o, "");	
		o.toJSON = function(){
			return {
				predefinedRegex:o.predefinedRegex(),
				regex:o.regex(),
				prefix:o.prefix(),
				type:o.type()
			};
		};
		
		o.getRenderData = function(){
			var res = [];
			res.push({label:"Widget Type", element:"select", value:o.type(), data:widgetTypes, name:'type'});
			res.push({label:"Capture", element:"select", value:o.predefinedRegex(), data:predefinedRegexes(), name:"predefinedRegex"});
			res.push({label:"Prefix", element: "input", inputType:"text", value:o.prefix(), name:"prefix"});
			res.push({label:"Regex", element:"input", inputType:"text", value:o.regex(), name:'regex'});
			//res.push({label:"Label", element:"input", inputType:"text", value:o.label(), name:"label"});
			return res;
		};
		return o;
	};	
	
});