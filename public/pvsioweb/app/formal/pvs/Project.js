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
        queue               = require("d3/queue");
    
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
    
    function ProjectFile(name, project) {
        this.dirty = property.call(this, false);
        this.type = property.call(this, "text");
        this.content = property.call(this);
        this.name = property.call(this, name);
        this.path = function () {
            return project.path() + "/" + this.name();
        };
        //-----
		this.toBeShown = true;
        return eventDispatcher(this);
    }
    
    function Project(name) {
        var _dirty = false;
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
            _dirty = true;
            this.fire({type: "ProjectNameChanged", previous: event.old, current: event.fresh});
        });
        
        this.mainPVSFile.addListener(propertyChangedEvent, function (event) {
            _dirty = true;
            this.fire({type: "ProjectMainSpecFileChanged", previous: event.old, current: event.fresh});
        });
        
        this.image.addListener(propertyChangedEvent, function (event) {
            _dirty = true;
            this.fire({type: "ProjectImageChanged", previous: event.old, current: event.fresh});
        });
        
        this.widgetDefinitions.addListener(propertyChangedEvent, function (event) {
            _dirty = true;
            this.fire({type: "WidgetDefinitionChanged", previous: event.old, current: event.fresh});
        });
        
        this.changeImage = function (imageName, imageData) {
            var newImage = new ProjectFile(imageName, this).type("image").content(imageData).dirty(true);
            this.image(newImage);
            return this;
        };
        
        this.addSpecFile = function (fileName, fileContent) {
            var newSpec = new ProjectFile(fileName).content(fileContent).dirty(true);
            this.pvsFiles().push(newSpec);
            return this;
        };
        
        this.removeFile = function (fileReference) {
            
	    var arrayFile = this.pvsFiles();
	    var index;
	    for( index in arrayFile )
	    {
	         if( arrayFile[index] === fileReference )
	         {   arrayFile.splice(index, 1); 
                     break;
                 }
                     
            }
        };
        
	this.stateMachine = function(stateMachineisLoaded) 
	{
	        var i = 0;
		var x ;
		for (x in stateMachineisLoaded[0] )  {
		
			console.log(x);
			console.log(stateMachineisLoaded[1][i]);
		
	    		this.addSpecFile(stateMachineisLoaded[0][x], stateMachineisLoaded[1][i]);
			i = i + 1;
	
	        }
	};
	
	
	/// Update lastClickedFile 	
	this.updateLastClickedFile = function(pvsFile)
	{
	     this.lastClickedFile = pvsFile;     	
	
	}
	
	/// User wants to rename lastClickedFile in newName
	this.rename_file = function(newName)
	{
             
	     this.lastClickedFile.name = property.call(this.lastClickedFile, newName);
	     
	
	}
	
	/// User wants to make all files visible 
	this.setAllfilesVisible = function()
	{
	     var listFiles = this.pvsFiles();
	     var index;
	
	     for( index in listFiles )
	     {
		  listFiles[index].toBeShown = true;
	     
	     }
	}
	
	/// User has choosen to not see last file clicked (it will be showed in file list box)
	this.notShowFile = function()
	{
	     this.lastClickedFile.toBeShown = false;
	}

        this.saveFile = function (file, cb) {
            if (!_.isArray(file)) {
                file = [file];
            }
            var _thisProject = this;
            saveSourceCode(file, this, function (err, res) {
                cb(err, _thisProject);
            });
            return this;
        };
        
        this.save = function (cb) {
            _dirty = false;
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
                    cb(err, _thisProject);
                });
            }
            return this;
        };
            
        this.saveNew = function (cb) {
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
        eventDispatcher(this);
    }
    
    function initFromJSON(obj) {
        var p = new Project(obj.name).path(obj.projectPath);
        if (obj.pvsFiles) {
            //create project files and assign the mainpvsfile appropriately
            var pvsProjectFiles = obj.pvsFiles.map(function (f) {
                var pf = new ProjectFile(f, p);
                if (f === obj.mainPVSFile) {
                    p.mainPVSFile(pf);
                }
                return pf;
            });
            p.pvsFiles(pvsProjectFiles);
        }
        if (obj.image && obj.imageData) {
            p.image(new ProjectFile(obj.image, p).type("image").content(obj.imageData));
        }
        p.widgetDefinitions(obj.widgetDefinition);
        return p;
    }
    
    function open(name, onOpen) {
        var ws = WSManager.getWebSocket();
        ws.send({type: "openProject", name: name}, function (err, res) {
            if (onOpen && !err) {
                res = res.project;
                var p = initFromJSON(res);
                onOpen(p);
            }
        });
    }
    
    Project.open = open;
    
    exports.Project = Project;
    
});
