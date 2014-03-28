/**
 * @module ProjectFile
 * @desc Module representing a Spec or image file in  a project
 * @author Patrick Oladimeji
 * @date 11/15/13 10:19:27 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent */
define(function (require, exports, module) {
	"use strict";
	var property = require("util/property"),
		eventDispatcher = require("util/eventDispatcher");

	/**
	 * @constructor
	 * @param {string} name The name of the file
	 * @param {Project} project The project to which this file belongs
	 * @this ProjectFile
	 */
    function ProjectFile(path, project) {
        eventDispatcher(this);
        var pf = this;
		/** get or set the dirty flag on this file. A file is dirty if its content has been edited but not persisted 
			@type {boolean}
		*/
        this.dirty = property.call(this, false);
        //fire event whenever the dirty flag changes
        this.dirty.addListener("PropertyChanged", function (event) {
            pf.fire({type: "DirtyFlagChanged",  previous: event.old,
                       current: event.fresh, path: path, projectPath: project.path()});
        });
		/** 
			get or set the type of this file. Files can currently be image or text
			@type {string}
		*/
        this.type = property.call(this, "text");
		/** 
			get or set the content of the file
			@type {string}
		*/
        this.content = property.call(this);
		
		
		/**
		 * get the full path of the file
		 * @returns {string}
		 */
        this.path = property.call(this, path);
		
        /** get or set the name of the file
			@type {string}
		*/
        this.name = function () {
            return this.path().substr(this.path().lastIndexOf("/") + 1);
        };
        
        //-----
		/** get or set the visibility of this file in the project view
			@type {boolean}
            @deperecated
		*/
		this.visible = property.call(this, true);
        return pf;
    }
    
	module.exports = ProjectFile;
});
