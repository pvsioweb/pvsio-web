/**@module Project
 * Represents a pvsio web project
 * @author Patrick Oladimeji
 * @date 6/20/13 9:45:59 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, MouseEvent, _ , FileReader, Promise*/
define(function (require, exports, module) {
    "use strict";
    var property            = require("util/property"),
        eventDispatcher     = require("util/eventDispatcher"),
        WSManager           = require("websockets/pvs/WSManager"),
        WidgetManager       = require("pvsioweb/WidgetManager").getWidgetManager(),
        ScriptPlayer        = require("util/ScriptPlayer"),
		ProjectFile			= require("./ProjectFile");
    
    var propertyChangedEvent = "PropertyChanged";
    
    function saveSourceCode(files, project) {
        var ws = WSManager.getWebSocket();
        var promises =  files.map(function (f, i) {
            return new Promise(function (resolve, reject) {
                ws.writeFile({fileName: f.path(), fileContent: f.content()}, function (err, res) {
                    if (!err) {
                        resolve(res);
                    } else {
                        reject(err);
                    }
                });
            });
        });
       
        return new Promise(function (resolve, reject) {
            Promise.all(promises).then(function (res) {
                res.forEach(function (response, index) {
                    if (response.type === "fileSaved") {
                        files[index].dirty(false);
                    }
                });
                resolve(res);
            }, reject);
        });
	}

    function saveWidgetDefinition(project) {
		//save to the user's drive
        var ws = WSManager.getWebSocket();
        var wd = WidgetManager.getWidgetDefinitions();
		var wdStr = JSON.stringify(wd, null, " ");
		var data  = {"fileName": project.path() + "/widgetDefinition.json", fileContent: wdStr};
        return new Promise(function (resolve, reject) {
            ws.writeFile(data, function (err, res) {
                if (!err) {
                    project.widgetDefinitions(wd);
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
	}
    
    function saveInteractionScripts(project) {
        var ws = WSManager.getWebSocket();
        var scripts = JSON.stringify(project.scripts(), null, " ");
        var data = {fileName: project.path() + "/scripts.json", fileContent: scripts};
        return new Promise(function (resolve, reject) {
            ws.writeFile(data, function (err, res) {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }
    
    function saveImageFile(project) {
        if (project && project.image()) {
            var ws = WSManager.getWebSocket();
            var data = {"type" : "writeImage", "fileName": project.path() + "/" + project.image().name(),
                        fileContent: project.image().content(), encoding: "base64"};

            return new Promise(function (resolve, reject) {
                ws.send(data, function (err, res) {
                    if (!err) {
                        project.image().dirty(false);
                        resolve(res);
                    } else {
                        reject(err);
                    }
                });
            });
        }
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
			@type {ProjectFile {}}
		*/
        this.pvsFiles = property.call(this, {});
	
        this.scripts = property.call(this, []);
        
        var project = this;
        //add event listeners
        this.name.addListener(propertyChangedEvent, function (event) {
            project._dirty(true);
            project.fire({type: "ProjectNameChanged", previous: event.old, current: event.fresh});
        });
        
        this.mainPVSFile.addListener(propertyChangedEvent, function (event) {
            project._dirty(true);
            project.fire({type: "ProjectMainSpecFileChanged", previous: event.old, current: event.fresh});
        });
        
        this.image.addListener(propertyChangedEvent, function (event) {
			project._dirty(true);
            project.fire({type: "ProjectImageChanged", previous: event.old, current: event.fresh});
        });
        
        this.widgetDefinitions.addListener(propertyChangedEvent, function (event) {
            project._dirty(true);
            project.fire({type: "WidgetDefinitionChanged", previous: event.old, current: event.fresh});
        });
        
        eventDispatcher(this);
        //listen for widget manager event for widget modification
        WidgetManager.addListener("WidgetModified", function (e) {
            project._dirty(true);
        });
    }
    
    /**
	 * Updates the project image.
	 * @param {!String} imageName The fileName for the new image
	 * @param {!String} imageData The base64 string or url path for the image
	 * @memberof Project
	 */
	Project.prototype.changeImage = function (imagePath, imageData) {
		var newImage = new ProjectFile(imagePath, this).type("image").content(imageData).dirty(true);
		this.image(newImage);
		return this;
	};
       
	/**
	 * Adds a new specification file to the project
	 * @param {!String} filePath The path of the file to add
	 * @param {!String} fileContent The content of the file to add
     * @param {boolean} supressEvent Set true to supress the SpecFileAdded event or false otherwise
	 * @memberof Project
	 */
	Project.prototype.addSpecFile = function (filePath, fileContent, supressEvent) {
		var newSpec = new ProjectFile(filePath, this).content(fileContent);
		this.pvsFiles()[newSpec.path()] = newSpec;
        if (!supressEvent) {
            this.fire({type: "SpecFileAdded", file: newSpec});
        }
        var project = this;
        //register event for the newspec and bubble up the dirty flag changed event from project
        newSpec.addListener("DirtyFlagChanged", function (event) {
            project.fire({type: "SpecDirtyFlagChanged", file: newSpec});
        }).dirty(true);
		return newSpec;
	};
    
    /**
     * Gets the pvsSpec file with the specified Name
     * @param {!String} fileName path to the spec file
     * @returns {ProjectFile}
     * @memeberof Project
     */
    //FIXME: sometimes the key is fileName, sometimes is path --- the correct key should be path!
    Project.prototype.getSpecFile = function (fileName) {
        return this.pvsFiles()[fileName];
    };
    
	/**
	 * Removes the specified file from the list of specification (.pvs) files.
	 * @param {!ProjectFile} file The file to remove.
	 * @memberof Project
	 */
	Project.prototype.removeFile = function (file) {
		///FIXME this function might not trigger a propertyChanged event on pvsFiles
		//since the files are being modified without using the setter function pvsFiles(updatedList)
        var path = file.path();
        var deletedFile = this.pvsFiles()[path];
        if (deletedFile) {
            delete this.pvsFiles()[path];
            this.fire({event: "SpecFileDeleted", file: deletedFile, path: path});
            deletedFile.clearListeners();
        }
        return this;
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
        Sets the project name
        @param {string} newPath the new project name
        This function should always be used when setting a new project name as it ensures consistency between project name and path in the file names
    */
    Project.prototype.setProjectName = function (newName) {
        var oldName = this.name();
        this.name(newName);
        this.path(newName);
        if (this.pvsFiles()) {
            this.pvsFilesList().forEach(function (f) {
                f.path(f.path().replace(oldName, newName));
            });
        }
    };
    
    /**
        Changes the name of a folder in the project directory to a new given name
        @param {string} oldPath the old path of the folder
        @param {string} newPath the new path of the folder
        @param {function} cb a call back function to invoke when the server function has returned
        This function should ensure that only folders within the project can be changed
    */
    Project.prototype.renameFolder = function (oldPath, newPath, cb) {
        var p = this;
        var ws = WSManager.getWebSocket();
        ws.send({type: "renameFile", oldPath: oldPath, newPath: newPath}, function (err, res) {
            if (!err) {
                // check if we are renaming the project
                if (oldPath === p.path()) {
                    p.setProjectName(newPath);
                } else {
                    //no error so need to modify the paths for all the files affected by the renaming action
                    var pvsFiles = p.pvsFilesList().filter(function (f) {
                        return f.path().indexOf(oldPath) === 0;
                    });
                    pvsFiles.forEach(function (f) {
                        var newFilePath = f.path().replace(oldPath, newPath);
                        f.path(newFilePath);
                    });
                }
            } else { console.log(err); }
            if (cb && typeof cb === "function") { cb(err, res); }
        });
    };
	/**
	 * Rename a given file. Currently this sets the name property of the file parameter. Not clear about persistence.
	 * @param {!ProjectFile} file The file to rename
	 * @param {!string} newName The new name to give the file
	 * @memberof Project
	 */
	Project.prototype.renameFile = function (file, newName, cb) {
        var p = this;
        var ws = WSManager.getWebSocket();
        var baseDir = file.path().substring(0, file.path().lastIndexOf("/")),
            newPath = baseDir + "/" + newName,
            oldPath = file.path();
        ws.send({type: "renameFile", oldPath: oldPath,
                 newPath: newPath}, function (err, res) {
            if (!err) {
                file.path(newPath);
                p.pvsFiles()[newPath] = file;
                delete p.pvsFiles()[oldPath];
                p.fire({type: "SpecFileRenamed", file: file});
            } else {
                console.log(err);
            }
            if (cb && typeof cb === "function") {cb(err, res); }
        });
	};

	/**
	 * Saves the file to disk.
	 * @param {ProjectFile} file The file tosave.
	 * @param {Project~onProjectSaved} cb The callback function to invoke when file has been saved
	 * @memberof Project
	 */
	Project.prototype.saveFile = function (file, cb) {
		if (!Array.isArray(file)) {
			file = [file];
		}
		var _thisProject = this;
		saveSourceCode(file, this)
            .then(function (res) {
                if (cb && typeof cb === "function") {
                    cb(null, _thisProject);
                }
            }, function (err) {
                if (cb && typeof cb === "function") {
                    cb(err);
                }
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
            Promise.all([saveWidgetDefinition(this), saveInteractionScripts(this),
                         saveSourceCode(this.dirtyFiles(), this), saveImageFile(this)])
                .then(function (res) {
                    _thisProject._dirty(false);
                    _thisProject.fire({type: "ProjectSaved", project: _thisProject});
                    if (cb && typeof cb === "function") { cb(null, _thisProject); }
                }, function (err) {
                    if (cb && typeof cb === "function") { cb(err); }
                });
		}
		return this;
	};
    
    Project.prototype.pvsFilesList = function () {
        return Object.keys(this.pvsFiles()).map(function (path) {
            return this.pvsFiles()[path];
        }, this);
    };
    
    Project.prototype.dirtyFiles = function () {
        return this.pvsFilesList().filter(function (d) {
            return d.dirty();
        });
    };
    
	///FIXME this should be a private function called from project.save
	Project.prototype.saveNew = function (newName, cb) {
		var _thisProject = this;
		var wd = WidgetManager.getWidgetDefinitions();
		var wdStr = JSON.stringify(wd, null, " ");
		var ws = WSManager.getWebSocket();
        var specFiles = this.pvsFilesList().map(function (f, i) {
                return { fileName: f.path().replace(_thisProject.name(), newName), fileContent: f.content() };
            });
		var token = { type: "createProject",
                      projectName: newName,
                      specFiles: specFiles,
                      widgetDefinitions: wdStr,
                      overWrite: _thisProject.name()  === "defaultProject" };
        //FIXME: we are not saving empty folders -- do we want this behaviour?
		if (this.mainPVSFile()) {
			token.mainPVSFile = this.mainPVSFile().name();
		}
		if (this.image()) {
			token.imageFileName = this.image().name();
			token.imageData =  this.image().content();
		}
		ws.send(token, function (err, res) {
			if (!err) {
                if (_thisProject.image()) {
                    _thisProject.image().dirty(false);
                }
                _thisProject.path(res.projectPath);
                _thisProject.name(res.name);
			}
            if (cb && typeof cb === "function") {
                cb(err, _thisProject, res.folderStructure);
            }
		});
	};
    
    /**
        Adds a script to the project
    */
    Project.prototype.addScript = function (script) {
        this.scripts().push(script);
        ScriptPlayer.addScriptToView(script);
        this._dirty(true);
    };
    
    module.exports = Project;
    
	/**
	 * Generic callback function invoked when project is persisted.
	 * @callback Project~onProjectSaved
	 * @param {object} err
	 * @param {Project} project The saved project
	 */
});
