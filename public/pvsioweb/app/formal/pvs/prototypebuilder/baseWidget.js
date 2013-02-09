/**
 * 
 * @author Patrick Oladimeji
 * @date Dec 29, 2012 : 1:25:16 PM
 */

define(['util/property', './widgetType', "d3/d3"], function(property, widgetType){
	return function(type){
		var tsId = new Date().getTime();
		var o = {};
		o.type = property.call(o, type || widgetType.Button);
		
		o.id = property.call(o, o.type() + tsId);
		
		o.remove = function(){
			d3.select("#" + o.id()).remove();
			d3.select("area." + o.id()).remove();
			return o;
		};
		return o;
	};
});