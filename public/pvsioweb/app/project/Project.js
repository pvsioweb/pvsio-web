/**@module Project
 * Represents a pvsio web project
 * @author Patrick Oladimeji
 * @date 6/20/13 9:45:59 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent, _ , FileReader*/
define(function (require, exports, module) {
    "use strict";
    var property            = require("util/property"),
        eventDispatcher     = require("util/eventDispatcher"),
        WSManager           = require("websockets/pvs/WSManager"),
        WidgetManager       = require("pvsioweb/WidgetManager").getWidgetManager(),
        queue               = require("d3/queue"),
		ProjectFile			= require("./ProjectFile");
    
    var propertyChangedEvent = "PropertyChanged";
    
    function saveSourceCode(files, project, cb) {
        var ws = WSManager.getWebSocket();
		var q = queue();
        files.forEach(function (f) {
            q.defer(ws.writeFile, {fileName: f.path(), fileContent: f.content()});
        });
        q.awaitAll(function (err, res) {
            var pvsFiles = project.pvsFiles().filter(function (p) { return p.dirty(); });
            //update status of files successfully saved
            res.forEach(function (response, index) {
                if (response.type === "fileSaved") {
                    pvsFiles[index].dirty(false);
                }
            });
            cb(err, res);
        });
	}

    function saveWidgetDefinition(project, cb) {
		//save to the user's drive
        var ws = WSManager.getWebSocket();
        var wd = WidgetManager.getWidgetDefinitions();
		var wdStr = JSON.stringify(wd, null, " ");
		var data  = {"fileName": project.path() + "/widgetDefinition.json", fileContent: wdStr};
		ws.writeFile(data, function (err, res) {
            if (!err) {
                project.widgetDefinitions(wd);
            }
            cb(err, res);
        });
	}
    
    function saveImageFile(project, cb) {
        var ws = WSManager.getWebSocket();
        var data = {"fileName": project.path() + "/" + project.image().name(), fileContent: project.image().content(), encoding: "base64"};
        ws.writeFile(data, function (err, res) {
            if (!err) {
                project.image().dirty(false);
            }
            cb(err, res);
        });
    }
    
	/**
	 * Creates a new project
	 * @constructor
	 * @param {string} name The name of the project
	 * @this Project
	 */
    function Project(name) {
		/**
		 * get or set if the project is dirty
		 * @private
		 * @type {bolean}
		 */
        this._dirty = property.call(this, false);
		/** get or set the path of the project
			@type {string}
		*/
        this.path = property.call(this);
		/** get or set the name of the project
			@type {String}
		*/
        this.name = property.call(this, name);
		/** 
			get or set the main PVS file for the project
			@type {ProjectFile}
		*/
        this.mainPVSFile = property.call(this);
		/** 
			get or set the widget definitios for the project
			@type {String}
		*/
        this.widgetDefinitions = property.call(this);
		/** 
			get or set the image for the project
			@type {ProjectFile}
		*/
        this.image = property.call(this);
		/** 
			get or set the pvsFiles in a project
			@type {ProjectFile[]}
		*/
        this.pvsFiles = property.call(this, []);
	
        var project = this;
        //add event listeners
        this.name.addListener(propertyChangedEvent, function (event) {
            project._dirty(true);
            this.fire({type: "ProjectNameChanged", previous: event.old, current: event.fresh});
        });
        
        this.mainPVSFile.addListener(propertyChangedEvent, function (event) {
            project._dirty(true);
            this.fire({type: "ProjectMainSpecFileChanged", previous: event.old, current: event.fresh});
        });
        
        this.image.addListener(propertyChangedEvent, function (event) {
			project._dirty(true);
            this.fire({type: "ProjectImageChanged", previous: event.old, current: event.fresh});
        });
        
        this.widgetDefinitions.addListener(propertyChangedEvent, function (event) {
            project._dirty(true);
            this.fire({type: "WidgetDefinitionChanged", previous: event.old, current: event.fresh});
        });
        
        eventDispatcher(this);
    }
    /**
	 * Updates the project image.
	 * @param {!String} imageName The fileName for the new image
	 * @param {!String} imageData The base64 string or url path for the image
	 * @memberof Project
	 */
	Project.prototype.changeImage = function (imageName, imageData) {
		var newImage = new ProjectFile(imageName, this).type("image").content(imageData).dirty(true);
		this.image(newImage);
		return this;
	};
       
	/**
	 * Adds a new specification file to the project
	 * @param {!String} fileName The name of the file to add
	 * @param {!String} fileContent The content of the file to add
	 * @memberof Project
	 */
	Project.prototype.addSpecFile = function (fileName, fileContent) {
		var newSpec = new ProjectFile(fileName).content(fileContent).dirty(true);
		this.pvsFiles().push(newSpec);
		return this;
	};
     
	/**
	 * Removes the specified file from the list of specification (.pvs) files.
	 * @param {!ProjectFile} file The file to remove.
	 * @memberof Project
	 */
	Project.prototype.removeFile = function (file) {
		///FIXME this function might not trigger a propertyChanged event on pvsFiles
		//since the files are being modified without using the setter function pvsFiles(updatedList)
		var fileIndex = this.pvsFiles().indexOf(file);
		if (fileIndex > -1) {
			this.pvsFiles().splice(fileIndex, 1);
		}
	};
    
	/** A function about state machines */
	///FIXME not sure what is going on here!!
	Project.prototype.stateMachine = function (stateMachineisLoaded) {
		var i = 0, x;
		for (x in stateMachineisLoaded[0] )  {
			if (stateMachineisLoaded[0].hasOwnProperty(x)) {
				console.log(x);
				console.log(stateMachineisLoaded[1][i]);
				this.addSpecFile(stateMachineisLoaded[0][x], stateMachineisLoaded[1][i]);
				i = i + 1;
			}
	    }
	};
	
	/**
	 * Rename a given file. Currently this sets the name property of the file parameter. Not clear about persistence.
	 * @param {!ProjectFile} file The file to rename
	 * @param {!string} newName The new name to give the file
	 * @memberof Project
	 */
	Project.prototype.renameFile = function (file, newName) {
		file.name(newName);
	};
	
	/** User wants to make all files visible */
	Project.prototype.setAllfilesVisible = function () {
		this.pvsFiles().forEach(function (file) {
			file.visible(true);
		});
	};
	
	/// User has choosen to not see last file clicked (it will be showed in file list box)
	//@deprecated set projectFile.visible({boolean}) instead
	Project.prototype.hideFile = function (file) {
		file.visible(false);
	};

	/**
	 * Saves the file to disk.
	 * @param {ProjectFile} file The file tosave.
	 * @param {Project~onProjectSaved} cb The callback function to invoke when file has been saved
	 * @memberof Project
	 */
	Project.prototype.saveFile = function (file, cb) {
		if (!_.isArray(file)) {
			file = [file];
		}
		var _thisProject = this;
		saveSourceCode(file, this, function (err, res) {
			cb(err, _thisProject);
		});
		return this;
	};
    /**
	 * Saves all the changes made to the project to disk
	 * @param {Project~onProjectSaved} cb The function to invoke when project has been saved.
	 * @memberof Project
	 */
	Project.prototype.save = function (cb) {
		var _thisProject = this;
		//do save
		var imageName, pvsSpecName, fd;
		if (this.name() && this.name().trim().length > 0) {
			//project has already been created so save the widgets and the sourcecode if it has changed
			var q = queue();
			q.defer(saveWidgetDefinition, this);
			if (this.pvsFiles()) {
				q.defer(saveSourceCode, this.pvsFiles().filter(function (f) {
					return f.dirty();
				}), this);
			}
		   
			if (this.image() &&  this.image().dirty()) {
				q.defer(saveImageFile, this);
			}
			q.awaitAll(function (err, res) {
				if (!err) { _thisProject._dirty(false); }
				cb(err, _thisProject);
			});
		}
		return this;
	};
    
	///FIXME this should be a private function called from project.save
	Project.prototype.saveNew = function (cb) {
		var _thisProject = this;
		var wd = WidgetManager.getWidgetDefinitions();
		var wdStr = JSON.stringify(wd, null, " ");
		var ws = WSManager.getWebSocket(), specFiles = this.pvsFiles().map(function (f, i) {
			return {fileName: f.name(), fileContent: f.content()};
		});
		var token = {type: "createProject", projectName: this.name(), specFiles: specFiles, widgetDefinitions: wdStr};
		if (this.mainPVSFile()) {
			token.mainPVSFile = this.mainPVSFile().name();
		}
		if (this.image()) {
			token.imageFileName = this.image().name();
			token.imageData =  this.image().content();
		}
		ws.send(token, function (err, res) {
			if (!err) {
				_thisProject.pvsFiles().forEach(function (f) {
					f.dirty(false);
				});
                if (_thisProject.image()) {
                    _thisProject.image().dirty(false);
                }
                _thisProject.path(res.projectPath);
			}
			cb(err, _thisProject);
		});
	};

    
    module.exports = Project;
    
	/**
	 * Generic callback function invoked when project is persisted.
	 * @callback Project~onProjectSaved
	 * @param {object} err
	 * @param {Project} project The saved project
	 */
});
