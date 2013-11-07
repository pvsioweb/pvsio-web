/**
 * Interactive prototype builder for PVSio based on the html map attribute
 * @author Patrick Oladimeji
 * @date Dec 3, 2012 : 4:42:55 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require,module, WebSocket*/
require.config({
	baseUrl: 'pvsioweb/app',
	paths: {
		"ace": "../lib/ace",
		"d3": "../lib/d3",
		"pvsioweb": "formal/pvs/prototypebuilder",
		"imagemapper": "../lib/imagemapper",
		"text": "../lib/text"
	}
});

require(["main"], function (main) {
	"use strict";
});