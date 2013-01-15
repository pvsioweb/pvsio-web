/**
 * object used to store a map of all widgets currently on the display
 * @author Patrick Oladimeji
 * @date Dec 9, 2012 : 10:46:49 PM
 */

define([], function(){
	
	var map = {};
	
	return {
		clear:function(){
			map = {};
			return this;
		},
		add:function(widget){
			map[widget.id()] = widget;
			return this;
		},
		get:function(widgetid){
			return map[widgetid];
		},
		toJSON:function(){
			var res = {}, k;
			for(k in map){
				res[k] = map[k].toJSON();
			}
			return res;
		}
	};
	
});