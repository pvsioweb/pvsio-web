/**
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
        WidgetManager       = require("pvsioweb/WidgetManager")(),
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
    
    function Project(name) {
        this._dirty = property.call(this, false);
        this.path = property.call(this);
        this.name = property.call(this, name);
        this.mainPVSFile = property.call(this);
        this.widgetDefinitions = property.call(this);
        this.image = property.call(this);
        this.pvsFiles = property.call(this, []);
	
		// State Variable about user input 
		this.lastClickedFile = undefined;
             
        //add event listeners
        this.name.addListener(propertyChangedEvent, function (event) {
            this._dirty(true);
            this.fire({type: "ProjectNameChanged", previous: event.old, current: event.fresh});
        });
        
        this.mainPVSFile.addListener(propertyChangedEvent, function (event) {
            this._dirty(true);
            this.fire({type: "ProjectMainSpecFileChanged", previous: event.old, current: event.fresh});
        });
        
        this.image.addListener(propertyChangedEvent, function (event) {
			this._dirty(true);
            this.fire({type: "ProjectImageChanged", previous: event.old, current: event.fresh});
        });
        
        this.widgetDefinitions.addListener(propertyChangedEvent, function (event) {
            this._dirty(true);
            this.fire({type: "WidgetDefinitionChanged", previous: event.old, current: event.fresh});
        });
        
        eventDispatcher(this);
    }
    
	Project.prototype.changeImage = function (imageName, imageData) {
		var newImage = new ProjectFile(imageName, this).type("image").content(imageData).dirty(true);
		this.image(newImage);
		return this;
	};
        
	Project.prototype.addSpecFile = function (fileName, fileContent) {
		var newSpec = new ProjectFile(fileName).content(fileContent).dirty(true);
		this.pvsFiles().push(newSpec);
		return this;
	};
        
	Project.prototype.removeFile = function (fileReference) {
		var fileIndex = this.pvsFiles().indexOf(fileReference);
		if (fileIndex > -1) {
			this.pvsFiles().splice(fileIndex, 1);
		}
	};
    
	///FIXME not sure what is going on here!!
	Project.prototype.stateMachine = function (stateMachineisLoaded) {
		var i = 0, x;
		for (x in stateMachineisLoaded[0] )  {
			console.log(x);
			console.log(stateMachineisLoaded[1][i]);
			this.addSpecFile(stateMachineisLoaded[0][x], stateMachineisLoaded[1][i]);
			i = i + 1;
	    }
	};
	
	/// User wants to rename lastClickedFile in newName
	Project.prototype.renameFile = function (file, newName) {
		file.name(newName);
	};
	
	/// User wants to make all files visible 
	Project.prototype.setAllfilesVisible = function () {
		this.pvsFiles().forEach(function (file) {
			file.visible(true);
		});
	};
	
	/// User has choosen to not see last file clicked (it will be showed in file list box)
	//@deprecated
	Project.prototype.hideFile = function (file) {
		file.visible(false);
	};

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
			}
			cb(err, _thisProject);
		});
	};

    
    exports.Project = Project;
    
});
