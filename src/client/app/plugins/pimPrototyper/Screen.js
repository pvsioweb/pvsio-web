/**
 * Represents a screen with the PIM Prototyping mode. Responsible for managing the screen's widgets and overall
 * attributes.
 */

 /*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
 /*global _, define, Backbone */
define(function (require, exports, module) {
	"use strict";
    var BaseWidgetManager  = require("pvsioweb/BaseWidgetManager");

    var Screen = Backbone.Model.extend({
        
    });
    
    _.extend(Screen.prototype, BaseWidgetManager.prototype);
    
    return Screen;
});
