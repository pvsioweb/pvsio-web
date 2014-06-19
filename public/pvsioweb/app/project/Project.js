/**@module Project
 * Represents a pvsio web project
 * @author Patrick Oladimeji
 * @date 6/20/13 9:45:59 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, Promise*/
define(function (require, exports, module) {
    "use strict";
    var property            = require("util/property"),
        eventDispatcher     = require("util/eventDispatcher"),
        WSManager           = require("websockets/pvs/WSManager"),
        WidgetManager       = require("pvsioweb/WidgetManager").getWidgetManager(),
        ScriptPlayer        = require("util/ScriptPlayer"),
		ProjectFile			= require("./ProjectFile"),
        Logger              = require("util/Logger");
    
    var _projectFiles;
    
    var propertyChangedEvent = "PropertyChanged";
    
    function saveFiles(files) {
        var ws = WSManager.getWebSocket();
        var promises =  files.map(function (f) {
            var token = {filePath: f.path(), fileContent: f.content(), encoding: f.encoding() || "utf8"};
            return new Promise(function (resolve, reject) {
                ws.writeFile(token, function (err, res) {
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
                    if (!response.err) {
                        files[index].dirty(false);
                    }
                });
                resolve(res);
            }, reject);
        });
    }

	/**
	 * Creates a new project
	 * @constructor
	 * @param {string} name The name of the project
	 * @this Project
	 */
    function Project(name) {
        _projectFiles = [];
		/**
		 * get or set if the project is dirty
		 * @private
		 * @type {bolean}
		 */
        this._dirty = property.call(this, false);
		
		/** get or set the name of the project
			@type {String}
		*/
        this.name = property.call(this, name);
		/** 
			get or set the main PVS file for the project
			@type {ProjectFile}
		*/
        this.mainPVSFile = property.call(this);
        
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
        
        eventDispatcher(this);
        
        //listen for widget manager event for widget modification
        WidgetManager.clearListeners()
            .addListener("WidgetModified", function () {
                project._dirty(true);
                var newWDStr = JSON.stringify(WidgetManager.getWidgetDefinitions(), null, " ");
                //get the widget definitions and update the widgetDefinition file
                project.getWidgetDefinitionFile().content(newWDStr).dirty(true);
            });
    }
    /**
     * Gets the image file for the project
     * @returns {ProjectFile} a project file representing the image
     */
    Project.prototype.getImage = function () {
        return _projectFiles.filter(function (f) {
            return f.isImage();
        })[0];
    };
    /**
     * Gets the file in the project files list whose content is the definitions of widgets on the display
     * @returns {ProjectFile} the project file that represents the widget definitions on the project image
     */
    Project.prototype.getWidgetDefinitionFile = function () {
        var wdpath = this.name() + "/widgetDefinition.json";
        var res = this.getProjectFile(wdpath);
        if (!res) {
            res = this.addProjectFile(wdpath, "").type("widgetDefinition");
        }
        return res;
    };
    /**
     * Gets the project file that represents the sequence of play scripts created for this project
     * @return {ProjectFile} the project file representing a sequence of recording user actions
     */
    Project.prototype.getRecordedScripts = function () {
        var scriptsPath = this.name() + "/scripts.json";
        var res = this.getProjectFile(scriptsPath);
        if (!res) {
            res = this.addProjectFile(scriptsPath, "").type("scripts");
        }
        return res;
    };
    /**
     * Gets the list of all the files attributed to the project
     * @returns {array<ProjectFile>} a list of project files in the project
     */
    Project.prototype.getProjectFiles = function () {
        return _projectFiles;
    };
    
    /**
     * Gets the project file with the specified Name
     * @param {!String} filePath path to the spec file
     * @returns {ProjectFile}
     * @memeberof Project
     */
    Project.prototype.getProjectFile = function (filePath) {
        return _projectFiles.filter(function (f) {
            return f.path() === filePath;
        })[0];
    };
    
    
    /**
	 * Updates the project image. At the moment only one image is allowed in a project so we remove the old image
     * before adding the new one.
	 * @param {!String} imageName The fileName for the new image
	 * @param {!String} imageData The base64 string or url path for the image
	 * @memberof Project
	 */
	Project.prototype.changeImage = function (imagePath, imageData) {
        var oldImage = this.getImage();
        if (oldImage) {
            this.removeFile(oldImage);
        }
        this.addProjectFile(imagePath, imageData, "base64");
		return this;
	};
       
    /**
	 * Adds a new generic project file to the project
	 * @param {!String} filePath The path of the file to add
	 * @param {!String} fileContent The content of the file to add
     * @param {!string} encoding The encoding of the file to add
     * @param {boolean} supressEvent Set true to supress the SpecFileAdded event or false otherwise
	 * @memberof Project
	 */
    ///FIXME this function should throw an error if the filepath already exists?
    ///FIXME this function should take a projectFile as argument!
    ///FIXME why are we changing the event type from DirtyFlagChanged to SpecDirtyFlagChanged?
    Project.prototype.addProjectFile = function (filePath, fileContent, encoding, suppressEvent) {
        encoding = encoding || "utf8";
        var p  = this, newFile = new ProjectFile(filePath)
            .content(fileContent)
            .encoding(encoding);
        _projectFiles.push(newFile);
        if (!suppressEvent) {
            if (newFile.isPVSFile()) {
                p.fire({type: "SpecFileAdded", file: newFile});
                //register event for the newspec and bubble up the dirty flag changed event from project
                newFile.addListener("DirtyFlagChanged", function () {
                    p.fire({type: "SpecDirtyFlagChanged", file: newFile});
                });
            } else {
                p.fire({type: "ProjectFileAdded", file: newFile});
            }
        }
        return newFile;
    };

	/**
	 * Removes the specified file from the list of project files.
	 * @param {!ProjectFile} file The file to remove.
	 * @memberof Project
	 */
	Project.prototype.removeFile = function (file) {
        var fileIndex = _projectFiles.indexOf(file);
        
        var deletedFile = _projectFiles.splice(fileIndex, 1);
        if (deletedFile && deletedFile[0]) {
            var f = deletedFile[0];
            if (f.extension() === ".pvs") {
                this.fire({ type: "SpecFileRemoved", file: f });
            } else { this.fire({ type: "ProjectFileRemoved", file: f }); }
            f.clearListeners();
            f = null;
        }
        return this;
	};
    
    /**
        Sets the project name
        @param {string} newPath the new project name
    */
    Project.prototype.setProjectName = function (newName) {
        this.name(newName);
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
                if (oldPath === p.name()) {
                    p.setProjectName(newPath);
                } else {
                    //no error so need to modify the paths for all the files affected by the renaming action
                    var affectedFiles = p.getProjectFiles().filter(function (f) {
                        return f.path().indexOf(oldPath) === 0;
                    });
                    affectedFiles.forEach(function (f) {
                        var newFilePath = f.path().replace(oldPath, newPath);
                        f.path(newFilePath);
                    });
                }
            } else { console.log(err); }
            if (cb && typeof cb === "function") { cb(err, res); }
        });
    };
	/**
	 * Rename a given file and saves it on disk
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
                p.fire({type: "SpecFileRenamed", file: file});
                Logger.log("File " + oldPath + " has been renamed to " + newPath);
            } else {
                Logger.log(err);
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
        
        // here we make sure that the file names are relative to this project
        file.forEach(function (file) {
            var p = file.path();
            var prefix = _thisProject.name() + "/";
            if (p.indexOf(prefix) !== 0) {
                file.path(prefix + p);
            }
        });
        
		saveFiles(file, this)
            .then(function () {
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
		if (this.name() && this.name().trim().length > 0) {
			//project has already been created so save the widgets and the sourcecode if it has changed
            saveFiles(this.getProjectFiles().filter(function (f) { return f.dirty(); }))
                .then(function () {
                    _thisProject.dirty(false);
                    _thisProject.fire({type: "ProjectSaved", project: _thisProject});
                    if (cb && typeof cb === "function") { cb(null, _thisProject); }
                }, function (err) {
                    if (cb && typeof cb === "function") { cb(err); }
                });
		}
		return this;
	};
    
    /**
    * Returns a list of project files that are pvs files
    */
    Project.prototype.pvsFilesList = function () {
        return _projectFiles.filter(function (f) {
            return f.isPVSFile();
        });
    };
    
	///FIXME this should be a private function called from project.save
	Project.prototype.saveNew = function (newName, cb) {
		var _thisProject = this;
		var ws = WSManager.getWebSocket();
        
        var files = this.getProjectFiles().map(function (f) {
            return {filePath: f.path().replace(_thisProject.name(), newName), fileContent: f.content(), encoding: f.encoding()};
        });
		var token = { type: "createProject",
                      projectName: newName,
                      projectFiles: files,
                      overWrite: newName  === "defaultProject" };
        //FIXME: we are not saving empty folders -- do we want this behaviour?
		if (this.mainPVSFile()) {
			token.mainPVSFile = this.mainPVSFile().name();
		}

		ws.send(token, function (err, res) {
			if (!err) {
                _thisProject.getProjectFiles().forEach(function (f) {
                    f.dirty(false);
                });
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
        var scriptFile = this.getRecordedScripts(), scriptJson;
        if (!scriptFile.content() || scriptFile.content().trim().length === 0) {
            scriptJson = [];
        } else {
            scriptJson = JSON.parse(scriptFile.content());
        }
        scriptJson.push(script);
        ScriptPlayer.addScriptToView(script);
        scriptFile.content(JSON.stringify(scriptJson, null, " "));
        this._dirty(true);
    };
    /**
     * Overrides toString() method for Project
     * @returns {string} project name
     */
    Project.prototype.toString = function () {
        return this.name();
    };
    
    module.exports = Project;
    
	/**
	 * Generic callback function invoked when project is persisted.
	 * @callback Project~onProjectSaved
	 * @param {object} err
	 * @param {Project} project The saved project
	 */
});
