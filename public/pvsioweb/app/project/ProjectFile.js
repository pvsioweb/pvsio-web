/**
 * 
 * @author Patrick Oladimeji
 * @date 11/15/13 10:19:27 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
	"use strict";
	var property = require("util/property"),
		eventDispatcher = require("util/eventDispatcher");
	
    function ProjectFile(name, project) {
        this.dirty = property.call(this, false);
        this.type = property.call(this, "text");
        this.content = property.call(this);
        this.name = property.call(this, name);
        this.path = function () {
            return project.path() + "/" + this.name();
        };
        //-----
		this.visible = property.call(this, true);
        return eventDispatcher(this);
    }
    
	module.exports = ProjectFile;
});
