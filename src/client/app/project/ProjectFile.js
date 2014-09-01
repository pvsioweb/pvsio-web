/**
 * @module ProjectFile
 * @desc Module representing a file in  a project
 * @author Patrick Oladimeji
 * @date 11/15/13 10:19:27 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
	"use strict";
	var property = require("util/property"),
		eventDispatcher = require("util/eventDispatcher");
    var imageExtensions = [".jpg", ".jpeg", ".png"];
	/**
	 * @constructor
	 * @param {string} path The name of the file, i.e., the *relative path* from the project directory
     * @param {string} content the content of the file
	 * @this ProjectFile
	 */
    //FIXME: rename this module into something like pvsiowebFile (projectFile seems to suggest that it's a file specifying a project, rather than a file of a project
    function ProjectFile(path, content) {
        eventDispatcher(this);
        var pf = this;
		/** get or set the dirty flag on this file. A file is dirty if its content has been edited but not persisted 
			@type {boolean}
		*/
        this.dirty = property.call(this, false);
        //fire event whenever the dirty flag changes
        this.dirty.addListener("PropertyChanged", function (event) {
            pf.fire({type: "DirtyFlagChanged",  previous: event.old,
                       current: event.fresh, path: path});
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
        this.content = property.call(this, content);
		/**
         * get or set the encoding of the file (default "utf8"
         * @type {string}
         */
		this.encoding = property.call(this, "utf8");
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
        /** get the extenstion of the file
         * @returns {string}
         */
        this.extension = function () {
            var n = this.name();
            return n.indexOf(".") > -1 ? n.substr(n.lastIndexOf(".")) : "";
        };
        //-----
		/** get or set the visibility of this file in the project view
			@type {boolean}
            @deperecated
		*/
		this.visible = property.call(this, true);
        return pf;
    }
    
    ProjectFile.prototype.isImage = function () {
        return imageExtensions.indexOf(this.extension().toLowerCase()) > -1;
    };
    
    ProjectFile.prototype.isPVSFile = function () {
        return this.extension() === ".pvs";
    };
    /**
     * Overrides toString for ProjectFile
     * @returns {string} project file's path
     */
    ProjectFile.prototype.toString = function () {
        return this.path();
    };
	module.exports = ProjectFile;
});
