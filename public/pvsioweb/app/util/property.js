/**
 * utility function for defining a property inside a function
 * @author hogfather
 * @date Apr 25, 2012
 * @project JSLib
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process*/
define(['util/eventDispatcher', 'util/events'], function (eventDispatcher, events) {
    "use strict";
	//defines property function
	return function (v) {
		var p = function (_) {
			if (!arguments.length) {
				return v;
            }
			//fire property changed event if _ (incoming) is not equal to v (old property)
			if (v !== _) {
				var event = {type: events.PropertyChanged, old: v, fresh: _};
				v = _;
				p.fire(event);
			}
			return this;
		};
		p = eventDispatcher(p);
		return p;
	};
});