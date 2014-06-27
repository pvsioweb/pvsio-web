/** @module ProjectManager*/
/**
 * Project Manager is responsible for operations on the project e.g., creation, removal, loading and modifying projects. It also currently manages the view of the project
 * @author Patrick Oladimeji
 * @date 11/15/13 9:49:03 AM
 */
/*jshint undef: true, unused: true*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, window, Promise, document, Image*/
define(function (require, exports, module) {
	"use strict";
	var property = require("util/property"),
		eventDispatcher = require("util/eventDispatcher"),
		Project = require("./Project"),
        FileTreeView = require("pvsioweb/FileTreeView"),
		ProjectFile = require("./ProjectFile"),
		WSManager = require("websockets/pvs/WSManager"),
		fs	= require("util/fileHandler"),
        Logger = require("util/Logger"),
        ScriptPlayer = require("util/ScriptPlayer"),
        newProjectForm          = require("pvsioweb/forms/newProject"),
		openProjectForm         = require("pvsioweb/forms/openProject"),
		openFilesForm = require("pvsioweb/forms/openFiles"),
		WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager();

	///	Used to change name of default files (i.e: default_name + counter ) 
	var pvsFilesListView, _projectManager;
    var defaultTheoryName = "main";
    var defaultProjectName = "defaultProject";///FIXME export this variable to a module of constants
    var emptyTheoryContent = ": THEORY\n" +
                            " BEGIN\n " +
                            "  %-- Please type your PVS specification here!\n" +
                            " END "; // theory name needs to be included at the beginning and end
	
	function noop() {}
    
    function makeEmptyTheory(name) {
        return name + emptyTheoryContent + name;
    }
	
	/**
	 * Updates the name of the project on the document title
     * @private
	 */
	function projectNameChanged(event) {
		var name = event.current;
        document.title = "PVSio-Web -- " + name;
        d3.select("#header #txtProjectName").property("value", name);
	}

    function _editorChangedHandler(editor) {
        if (pvsFilesListView) {
            var pvsFile = _projectManager.project().getProjectFile(pvsFilesListView.getSelectedItem());
            if (pvsFile) {
                var dirty = pvsFile.content() !== editor.getValue();
                pvsFile.content(editor.getValue()).dirty(dirty); //update the selected project file content
                _projectManager.project()._dirty(dirty || _projectManager.project()._dirty());
            }
        }
    }
	
	/**
	 * Creates a new instance of the ProjectManager. It currently adds a listview for the files loaded into the
	 * project and keeps the list up to date whenever the project changes or the files within the project changes.
	 * @param {Project} project The project currently being managed
	 * @param {editor} editor The editor panel where the sped code is loaded
	 * @constructor
     * @this ProjectManager
	 */
	function ProjectManager(project, editor) {
		eventDispatcher(this);
		_projectManager = this;
		/**
            get or set the current {Project}
            @type {Project}
        */
		this.project = property.call(this, project)
			.addListener("ProjectNameChanged", projectNameChanged)
			.addListener("PropertyChanged", function (e) {
				e.fresh.addListener("ProjectMainSpecFileChanged", noop)
					.addListener("ProjectNameChanged", projectNameChanged);
				//update the project name
				projectNameChanged({current: e.fresh.name()});
			});
		this.editor = property.call(this, editor)
			.addListener("PropertyChanged", function (e) {
				e.fresh.on("change", _editorChangedHandler);
			});
		window.onbeforeunload =  function () {
            var p = _projectManager.project();
            if (p && p._dirty()) {
                return "Are you sure you want to exit? All unsaved changed will be lost.";
            }
        };
	}
	/**
	 * Renders the list of pvs files in the project
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.renderSourceFileList = function (folderStructure) {
		var pm = this;
		var project = this.project(), editor = this.editor();
		var ws = WSManager.getWebSocket();
		pvsFilesListView = new FileTreeView("#pvsFiles", folderStructure, project);
		
		pvsFilesListView.addListener("SelectedFileChanged", function (event) {
			//fetch sourcecode for selected file and update editor
            if (event.selectedItem && !event.selectedItem.isDirectory) {
                var pvsFile = project.getProjectFile(event.selectedItem.path);
                if (!pvsFile) {//load the pvsfile and add to the project 
                    //since we are not passing a file content it will get loaded over websocket when requested
                    //we supress the spec file added event because the file already exists in the file tree
                    var theoryName = event.selectedItem.name.substr(0, event.selectedItem.name.indexOf(".pvs"));
                    pvsFile = project.addProjectFile(event.selectedItem.path, makeEmptyTheory(theoryName), "utf8", true);
                }
                if (pvsFile.content() !== undefined && pvsFile.content() !== null) {
                    editor.off("change", _editorChangedHandler);
                    editor.setValue(pvsFile.content());
                    editor.markClean();
                    editor.focus();
                    editor.on("change", _editorChangedHandler);
                } else {
                    //fetch file contents from server and set the value
                    var f = pvsFile.path();
                    ws.getFile(f, function (err, res) {
                        if (!err) {
                            editor.off("change", _editorChangedHandler);
                            pvsFile.content(res.fileContent).dirty(false);
                            editor.setValue(pvsFile.content());
                            editor.markClean();
                            editor.focus();
                            editor.on("change", _editorChangedHandler);
                        } else {
                            Logger.log(err);
                        }
                    });
                }
            }
            //bubble the event
            event.type = "SelectedFileChanged";
            pm.fire(event);
		});
		
		return pvsFilesListView;
	};
	/**
	 * Gets the file selected in the source files list view.
	 * @returns {?ProjectFile} The project source file selected or null if no item was selected
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.getSelectedFile = function () {
		return this.project().getProjectFile(pvsFilesListView.getSelectedItem());
	};

	/**
	 * Returns the path of the selected item (file or directory) in the source files list view
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.getSelectedItem = function () {
		return pvsFilesListView.getSelectedItem();
	};

    /**
	 * Creats a new instance of a project from json data
	 * @param {{name: string,  projectFiles: string[]}} obj The json data from which the new project is instantiated
	 * @return {Project}
     * @private
	 */
	function initFromJSON(obj) {
		var p = new Project(obj.name), pf, mainFileName;
        if (obj.projectFiles) {
            ///FIXME handle scripts and widgetDefinitions (maybe we dont need to)
            obj.projectFiles.forEach(function (file) {
                if (file && file.filePath && file.fileContent) {
                    pf = p.addProjectFile(file.filePath, file.fileContent).encoding(file.encoding);
                    if (file.filePath.indexOf(".pvsioweb") > 0) {
                        mainFileName = JSON.parse(file.fileContent).mainPVSFile;
                    }
                }
            });
            //set the main pvs file
            if (mainFileName) {
                var file = p.getProjectFile(mainFileName);
                if (file) {
                    p.mainPVSFile(file);
                }
            }
        }
		
		return p._dirty(false);
	}
    /**
     * Displays a dialog for the user to select a project
     * @param {function} cb a callback to invoke with the selected project name
     * uses standard callback params where the first parameter is an error if one exists
     */
    ProjectManager.prototype.selectProject = function (cb) {
        cb = cb || noop;
        var ws = WSManager.getWebSocket();
        ws.send({type: "listProjects"}, function (err, res) {
            if (!err) {
                var projects = res.projects;
                projects.unshift("");
                openProjectForm.create(projects, function (d) {
                    return d;
                }).on("ok", function (e, view) {
                    view.remove();
                    cb(null, e.data.projectName);
                }).on("cancel", function (e, view) {
                    view.remove();
                    cb("User canceled project selection");
                });
            } else {
                cb(err);
            }
        });
    };
    /**
     Opens the project with the specified name.
     @param {function} cb a callback to invoke with the opened project once loading is complete on the server
    */
	ProjectManager.prototype.openProject = function (projectName, callback) {
		var pm = this;
		var ws = WSManager.getWebSocket();
        //open selected project
        ws.send({type: "openProject", name: projectName}, function (err, res) {
            if (!err) {
                ScriptPlayer.clearView();
                var p = initFromJSON(res.project),
                    image = p.getImage();
                WidgetManager.clearWidgetAreas();
                d3.select("div#body").style("display", null);
                pm.project(p);
                // always set mainPVSfile because ProjectChanged will trigger an invocation of pvsio with that file
                pm.project().mainPVSFile(pm.project().mainPVSFile() || pm.project().pvsFilesList()[0]);
                pm.project()._dirty(false);
                
                pm.fire({type: "ProjectChanged", current: p, previous: pm.project()});
                pm.editor().off("change", _editorChangedHandler);
                pm.editor().setValue("");
                //list all pvsfiles
                if (p.pvsFilesList()) {
                    pm.renderSourceFileList(res.project.folderStructure);
                    pvsFilesListView.selectItem(p.mainPVSFile() || p.pvsFilesList()[0]);
                    // clear dirty flags
                    p.pvsFilesList().forEach(function (f) { f.dirty(false); });
                }
                pm.editor().on("change", _editorChangedHandler);
                // update image -- note that we need to wait the callback as image loading may take a little while in some cases
                if (image) {
                    pm.updateImage(image, function (res) {
                        if (res.type !== "error") {
                            WidgetManager.updateMapCreator(function () {
                                try {
                                    var wd = JSON.parse(p.getWidgetDefinitionFile().content());
                                    WidgetManager.restoreWidgetDefinitions(wd);
                                } catch (err) {
                                    Logger.log(err);
                                }
                                
                            });
                            d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
                        } else {
                            Logger.log(res);
                            //show the image drag and drop div
                            d3.select("#imageDragAndDrop.dndcontainer").style("display", null);
                        }
                        if (callback && typeof callback === "function") { callback(p); }
                    });
                } else {
                    //show the image drag and drop div
                    d3.select("#imageDragAndDrop.dndcontainer").style("display", null);
                    if (callback && typeof callback === "function") { callback(p); }
                }
            }
        });
    };
	/**
	 * Opens a form that allows a user to select a list of files.
	 * Selected files are returned as a list parameter in the callback.
	 * @returns {Promise} a Promise that resolves  the files that have been selected and confirmed by user
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.openFiles = function () {
        return new Promise(function (resolve, reject) {
            openFilesForm.create().on("cancel", function (e, view) {
                view.remove();
                reject({ msg: "cancelled by user" });
            }).on("ok", function (e, view) {
                view.remove();
                resolve(e.data.projectFiles);
            });
        });
		
	};
	/**
	 * Updates the project image with in the prototype builder
	 * @param {ProjectFile} image the ProjectFile representing the project image
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.updateImage = function (image, cb) {
        var img = new Image();
        
        function imageLoadComplete(res) {
            d3.select("#imageDiv img").attr("src", img.src).attr("height", img.height).attr("width", img.width);
            d3.select("#imageDiv svg").attr("height", img.height).attr("width", img.width);
            //hide the draganddrop stuff
            d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
            // invoke callback, if any
            if (cb && typeof cb === "function") { cb(res); }
        }
        function imageLoadError(res) {
            alert("Failed to load picture " + img.name);
            if (cb && typeof cb === "function") { cb(res); }
        }
   
        img.onload = imageLoadComplete;
        img.onerror = imageLoadError;
        img.name = image.path();
        img.src = image.content();
    };
	/** 
	 * Creates a new Project.
     * @param data contains the following fields: projectName (string), 
     *                                            prototypeImage (vector of strings), 
     *                                            pvsSpec (vector of strings)
     * @memberof ProjectManager
     */
    ProjectManager.prototype.createProject = function (data, cb) {
        var pm = this;
        WidgetManager.clearWidgetAreas();
        ScriptPlayer.clearView();
        var project = new Project(data.projectName);
        var i, promises = [];
        
        // load image, if any is specified in data
        if (data.prototypeImage && data.prototypeImage[0]) {
            fs.readLocalFileAsDataURL(data.prototypeImage[0])
                .then(function (res) {
                    project.changeImage(project.name() + "/" + res.filePath, res.fileContent);
                });
        }
        
        //create promises for the pvs source files, if any is specified in data
        if (data.pvsSpec && data.pvsSpec.length > 0) {
            for (i = 0; i < data.pvsSpec.length; i++) {
                if (data.pvsSpec[i].name !== undefined && data.pvsSpec[i].content !== undefined) {
                    promises.push(data.pvsSpec[i].content);
                } else {
                    // FIXME: why are we trying to read pvsSpec if name is not specified?
                    promises.push(fs.readLocalFileAsText(data.pvsSpec[i]));
                }
            }
        } else {
            // create one file with the default content
            var emptySpec = {
                filePath: defaultTheoryName + ".pvs",
                fileContent: defaultTheoryName + emptyTheoryContent + defaultTheoryName
            };
            promises.push(emptySpec);
        }

        var previousProject = project || pm.project(), image;
        Promise.all(promises)
            .then(function (pvsFiles) {
                pvsFiles.forEach(function (spec) {
                    project.addProjectFile(project.name() + "/" + spec.filePath, spec.fileContent);
                });
            }).then(function () {
                project.saveNew(data.projectName, function (err, res, folderStructure) {
                    Logger.log({err: err, res: res});
                    if (!err) {
                        image = project.getImage();
                        project.getProjectFiles().forEach(function (f) {
                            f.dirty(false);
                        });
                        //set the main pvs file
                        project.mainPVSFile(project.pvsFilesList()[0]);
                        WidgetManager.updateMapCreator();
                        pm.project(project);
                        pm.renderSourceFileList(folderStructure);
                        pvsFilesListView.selectItem(project.mainPVSFile() ||
                                                    project.pvsFilesList()[0] ||
                                                    project.name());
                        if (image) {
                            pm.updateImage(image, function () {
                                //fire project changed event
                                pm.fire({type: "ProjectChanged", current: project, previous: previousProject});
                                //invoke callback
                                if (cb && typeof cb === "function") { cb(err, project); }
                            });
                        } else {
                            //fire project changed event
                            pm.fire({type: "ProjectChanged", current: project, previous: previousProject});
                            //invoke callback
                            if (cb && typeof cb === "function") { cb(err, project); }
                        }
                    } else {
                        if (err.code === "EEXIST") {
                            alert("Please choose a different name -- project "
                                        + data.projectName + " already exists.");
                        }
                        //invoke callback
                        if (cb && typeof cb === "function") { cb(err, project); }
                    }
                });
            });
    };
    
    
	/** 
	 * Creates a new Project -- interactive version: displays the new Project dialog and handles the response 
     * @memberof ProjectManager
     */
	ProjectManager.prototype.newProject = function () {
        var pm = this;
        newProjectForm.create().on("cancel", function (e, formView) {
            Logger.log(e);
            formView.remove();
        }).on("ok", function (e, formView) {
            var data = e.data;
            Logger.log(e);
            formView.remove();
            pm.createProject(data);
        });
    };
	
	/**
	 * Saves the specified project.
	 * @param {Project} project The project to save
	 * @param {ProjectManager~onProjectSaved} cb The callback to invoke when the project save has returned
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.saveProject = function (project, cb) {
		var pm = this;
		project = project || pm.project();
		/**
            saves a project including image, widget definitions and pvsfiles
        */
        var name;
        function _doSave() {
            // update widgets
            var newWidgetDef = JSON.stringify(WidgetManager.getWidgetDefinitions(), null, " ");
            var widgetFile = project.getWidgetDefinitionFile();
            widgetFile.content(newWidgetDef);
            
            // save files
            project.save(function (err, p) {
                if (!err) {
                    project = p;
                    //repaint the list and sourcecode toolbar
                    project.pvsFilesList().forEach(function (f) { f.dirty(false); });
                    project._dirty(false);
                    pm.fire({type: "ProjectSaved", project: project});
                    var notification = "Project " + project.name() + " saved successfully!";
                    d3.select("#project-notification-area").insert("p", "p").html(notification);
                    Logger.log(notification);
                    if (typeof cb === "function") { cb(); }
                }
            });
        }
        ///FIXME change this to a proper form dialog using html templates
        if (project.name() === defaultProjectName) {
            name = prompt("Your project has default name, please enter a new project name");
            
            if (name && name !== defaultProjectName && name.trim().length > 0) {
                project.saveNew(name, function (err, res) {
                    if (!err) {
                        project = res;
                        project.setProjectName(name);
						project.pvsFilesList().forEach(function (f) { f.dirty(false); });
						project._dirty(false);
                        projectNameChanged({current: name});
                        pvsFilesListView.renameProject(name);
                        pm.fire({type: "ProjectSaved", project: project});
                        var notification = "Project " + project.name() + " saved successfully!";
                        d3.select("#project-notification-area").insert("p", "p").html(notification);
                        Logger.log(notification);
                        if (typeof cb === "function") { cb(); }
                    } else {
                        if (err.code === "EEXIST") {
                            alert("Error: project not saved (project name \"" + name + "\" already exists, please use a different name.)");
                        }
                        if (typeof cb === "function") { cb(); }
                    }
                });
            } else {
                if (name) {
                    alert("Error: project not saved (project name \"" + name + "\" is not a valid name.)");
                }
                if (typeof cb === "function") { cb(); }
            }
        } else { _doSave(); }
	};
	
	/**
	 * Saves pvs files to disk, interactive version, asks to set project name if current project has default name
	 * @param {ProjectFile} pvsFiles The spec files to save.
	 * @param {Project~onProjectSaved} cb The callback function to invoke when file has been saved
	 * @memberof Project
	 */
	ProjectManager.prototype.saveFiles = function (pvsFiles, cb) {
        if (pvsFiles) {
            var project = this.project();
            project.saveFile(pvsFiles, function (err, res) {
                if (!err) {
                    Logger.log(pvsFiles.map(function (f) {return f.path(); }).toString() + " saved.");
                } else { Logger.log(err); }
                if (typeof cb === "function") { cb(err, res); }
            });
        }
    };
    
    /**
     * selects the file (of type projectFile) specified as argument
     */
    ProjectManager.prototype.selectFile = function (pf) {
        // select item in filetree
        pvsFilesListView.selectItem(pf.path());
    };
    
    	
    /**
     * checks if file pf already exists in the project
     * returns true if pf exists, otherwise returns false
     */
    ProjectManager.prototype.fileExists = function (pf) {
        return pvsFilesListView.fileExists(pf.path());
    };

    /**
		Restarts the pvsio web process with the current project. The callback is invoked once the process is ready
		@param {ProjectManager~pvsProcessReady} callback The function to call when the process is ready
	*/
	ProjectManager.prototype.restartPVSioWeb = function (callback) {
		callback = callback || noop;
		var project = this.project(), ws = WSManager.getWebSocket();
		if (project && project.mainPVSFile()) {
			ws.lastState("init(0)");
			ws.startPVSProcess({
                fileName: project.mainPVSFile().name(),
                projectName: project.name()
            }, callback);
		}
		return this;
	};
    
	/** 
	 * Creates a new default Project.
     * @memberof ProjectManager
     */
    ProjectManager.prototype.createDefaultProject = function (cb) {
        var pm = this;
        var defaultFileName = defaultTheoryName + ".pvs";
        var defaultFilePath = defaultProjectName + "/" + defaultFileName;
        var data = { projectName: defaultProjectName,
                     pvsSpec: [ defaultFilePath ],
                     prototypeImage: [] };
        
        WidgetManager.clearWidgetAreas();
        ScriptPlayer.clearView();
        var project = new Project(data.projectName);
        project.addProjectFile(data.pvsSpec[0], makeEmptyTheory(defaultTheoryName));

        project.saveNew(data.projectName, function (err, res, folderStructure) {
            if (!err) {
                //set the main pvs file
                project.mainPVSFile(new ProjectFile(defaultFilePath));
                project._dirty(false);
                WidgetManager.updateMapCreator();
                pm.project(project);
                pm.renderSourceFileList(folderStructure);
                pvsFilesListView.selectItem(project.mainPVSFile() || project.pvsFilesList()[0]);
                //fire project changed event
                pm.fire({type: "ProjectChanged", current: project});
            }
            if (cb && typeof cb === "function") {
                cb(err, res);
            }
        });
    };
     
    /** 
	 * Creates a new file in the current project.
     * @memberof ProjectManager
     */
	ProjectManager.prototype.createProjectFile = function (fileName, fileContent) {
        var file = new ProjectFile(this.project().name() + "/" + fileName, fileContent);
        return file;
    };
    
    
    ProjectManager.prototype.preparePageForImageUpload = function () {
        // FIXME: dont rely on extensions, use a "type" field in ProjectFile to specify whether the file is an image or a text file
        var imageExts = ["png", "jpg", "jpeg"], pm = this;

        //add listener for  upload button
        d3.selectAll("#btnLoadPicture").on("click", function () {
            d3.select("#btnSelectPicture").node().click();
        });

        function _updateImage(file) {
            fs.readLocalFileAsDataURL(file)
                .then(function (res) {
                    var p = pm.project();
                    p.changeImage(p.name() + "/" + res.filePath, res.fileContent);
                    pm.updateImage(p.getImage());
                }, function (err) {
                    Logger.log(err);
                });
        }

        d3.select("#btnSelectPicture").on("change", function () {
            var file = d3.event.currentTarget.files[0];
            if (file && imageExts.indexOf(file.name.split(".").slice(-1).join("").toLowerCase()) > -1) {
                _updateImage(file);
            }
        });

        var c = document.getElementById("imageDiv");
        c.ondragover = function () {
            d3.select(c).style("border", "5px dashed black");
            return false;
        };
        c.ondragend = function (e) {
            d3.select(c).style("border", null);
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
        c.ondrop =  function (e) {
            d3.select(c).style("border", null);
            var file = e.dataTransfer.files[0];
            _updateImage(file);
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
    };
    
	module.exports = ProjectManager;
/**
 * @callback ProjectManager~onProjectSaved
 * @param {object} err This value is set if any error occurs during the save operation.
 * @param {Project} project The project saved.
 */
/**
 * @callback ProjectManager~onFileDeleted
 * @param {object} err
 * @param {string} success
 */
/**
 * @callback ProjectManager~pvsProcessReady
 * @param {object} err This value is set if there is an error on the server (e.g. process failed to start)
 * @param {object} data This contains the console output when a pvsprocess starts
 */
});
