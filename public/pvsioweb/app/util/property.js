/**
 * utility function for defining a property inside a function
 * @author hogfather
 * @date Apr 25, 2012
 * @project JSLib
 */

define(['util/eventDispatcher', 'util/events'], function(eventDispatcher, events){
	//defines property function
	return function (v){
		var p = function(_){
			if(!arguments.length)
				return v;
			//fire property changed event if _ (incoming) is not equal to v (old property)
			if(v !== _){
				var event = {type:events.PropertyChanged, old:v, fresh:_};
				v = _;
				p.fire(event);
			}
			return this;
		};
		p = eventDispatcher(p);
		return p;
	};
});