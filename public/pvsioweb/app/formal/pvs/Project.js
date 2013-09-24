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
        widgetMaps              = require("pvsioweb/widgetMaps"),
       // FileReader          = require("util/WebPageFileReader"),
        queue               = require("d3/queue");
    
    var propertyChangedEvent = "PropertyChanged";
    
    function saveSourceCode(files, cb) {
        var ws = WSManager.getWebSocket();
		var q = queue();
        files.forEach(function (f) {
            q.defer(ws.writeFile, {fileName: f.path(), fileContent: f.content()});
        });
        q.awaitAll(cb);
	}
        
    
    
    function getRegionDefs() {
		var regionDefs = [];
		d3.selectAll("#prototypeMap area").each(function () {
			var a = d3.select(this),
                region = {"class": a.attr("class"), shape: a.attr("shape"),
                            coords: a.attr("coords"), href: a.attr("href")};
			regionDefs.push(region);
		});
		return regionDefs;
	}
    
    function saveWidgetDefinition(project, cb) {
		//save to the user's drive
        var ws = WSManager.getWebSocket();
        var wd = {widgetMaps: widgetMaps.toJSON(), regionDefs: getRegionDefs()};
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
        
        this.removeFile = function (fileName) {
            ///TODO implement file removal
        };
        
        this.saveFile = function (file, cb) {
            if (!_.isArray(file)) {
                file = [file];
            }
            saveSourceCode(file, cb);
            return this;
        };
        
        this.save = function (cb) {
            _dirty = false;
            //do save
            var imageName, pvsSpecName, fd;
            if (this.name() && this.name().trim().length > 0) {
                //porject has already been created so save the widgets and the sourcecode if it has changed
                var q = queue();
                q.defer(saveWidgetDefinition, this);
                if (this.pvsFiles()) {
                    q.defer(saveSourceCode, this.pvsFiles().filter(function (f) {
                        return f.dirty();
                    }));
                }
               
                if (this.image().dirty()) {
                    q.defer(saveImageFile, this);
                }
                q.awaitAll(cb);
            }
            return this;
        };
            
        this.saveNew = function (cb) {
            var wd = {widgetMaps: widgetMaps.toJSON(), regionDefs: getRegionDefs()};
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
            ws.send(token, cb);
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
    
    ///TODO revise this to handle list of pvsfiles
    
//    /**
//    * create a new project based on the data in the parameter
//    */
//    function create(data, cb) {
//        var imageFileReader = new FileReader();
//        imageFileReader.onload = function (event) {
//            var projectImage = event.target.result.replace(/^data:image\/(\w+);base64,/, "");
//            var imageExt = data.prototypeImage[0].name.split(".").slice(-1)[0];
//            //get the pvsFile(s)
//            var pvsFileReader = new FileReader();
//            pvsFileReader.onload = function (event) {
//                var pvsFileContent = event.target.result;
//                //send both files as well as the project name to the server to create new project
//                console.log(pvsFileContent);
//                console.log(projectImage);
//                var ws = WSManager.getWebSocket();
//                ws.send({type: "createProject", specFileName: data.pvsSpec.name, specFileContent: pvsFileContent,
//                        imageFileName: "image." + imageExt, imageData: projectImage, projectName: data.projectName},
//                    function (err, res) {
//                        var p;
//                        if (!err) {
//                            //initialise res to a new project and return
//                            p = initFromJSON(res);
//                        }
//                        cb(err, p);
//                    });
//            };
//            pvsFileReader.readAsText(data.pvsSpec);
//        };
//        imageFileReader.readAsDataURL(data.prototypeImage[0]);
//	}
//    
    
    Project.open = open;
//    Project.create = create;
    
    exports.Project = Project;
    
});