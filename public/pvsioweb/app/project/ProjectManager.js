/** @module ProjectManager*/
/**
 * Project Manager is responsible for operations on the project e.g., creation, removal, loading and modifying projects. It also currently manages the view of the project
 * @author Patrick Oladimeji
 * @date 11/15/13 9:49:03 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _, Promise, document, FileReader*/
define(function (require, exports, module) {
	"use strict";
	var property = require("util/property"),
		eventDispatcher = require("util/eventDispatcher"),
		Project = require("./Project"),
        FileTreeView = require("pvsioweb/FileTreeView"),
		ProjectFile = require("./ProjectFile"),
		WSManager = require("websockets/pvs/WSManager"),
		fs	= require("util/fileHandler"),
		queue = require("d3/queue"),
        ScriptPlayer = require("util/ScriptPlayer"),
        newProjectForm          = require("pvsioweb/forms/newProject"),
		openProjectForm         = require("pvsioweb/forms/openProject"),
		openFilesForm = require("pvsioweb/forms/openFiles"),
        saveProjectChanges = require("project/forms/SaveProjectChanges"),
		WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager();

	///	Used to change name of default files (i.e: default_name + counter ) 
	var counter = 0;
	var pvsFilesListView;
    var defaultTheoryName = "main";
    var defaultProjectName = "defaultProject";///FIXME export this variable to a module of constants
    var emptyTheoryContent = ": THEORY\n"
                            + " BEGIN\n "
                            + "  %-- Please type your PVS specification here!\n"
                            + " END "; // theory name needs to be included at the beginning and end
	
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
	

	
	function editorChangedListener(editor, pm, pvsFilesListView) {
		return function () {
			//ideally one should use information from ace to set the dirty mark on the document
			//e.g editor.getSession().getUndoManager().hasUndo();
            if (!pvsFilesListView) {
                pvsFilesListView = pm.renderSourceFileList();
            }
			if (pvsFilesListView) {
                var project = pm.project();
				var pvsFile = project.getSpecFile(pvsFilesListView.getSelectedItem());
				if (pvsFile) {
					var dirty = pvsFile.content() !== editor.getValue();
					pvsFile.content(editor.getValue()).dirty(dirty); //update the selected project file content
                    pm.project()._dirty(true);
				}
			}
		};
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
		var pm = this;
		/**
            get or set the current {Project}
            @type {Project}
        */
		this.project = property.call(this, project)
			.addListener("ProjectNameChanged", projectNameChanged)
			.addListener("PropertyChanged", function (e) {
				e.fresh.addListener("ProjectMainSpecFileChanged", noop)
					.addListener("ProjectNameChanged", projectNameChanged);
				e.fresh.pvsFiles.clearListeners()
					.addListener("PropertyChanged", noop);
				//update the project name
				projectNameChanged({current: e.fresh.name()});
			});
		this.editor = property.call(this, editor)
			.addListener("PropertyChanged", function (e) {
				e.fresh.on("change", editorChangedListener(e.fresh, pm, pvsFilesListView));
			});
		window.onbeforeunload =  function (event) {
            var p = pm.project();
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
                var pvsFile = project.getSpecFile(event.selectedItem.path);
                if (!pvsFile) {//load the pvsfile and add to the project 
                    //since we are not passing a file content it will get loaded over websocket when requested
                    //we supress the spec file added event because the file already exists in the file tree
                    var theoryName = event.selectedItem.name.substr(0, event.selectedItem.name.indexOf(".pvs"));
                    pvsFile = project.addSpecFile(event.selectedItem.path, makeEmptyTheory(theoryName), true);
                }
                if (pvsFile.content() !== undefined && pvsFile.content() !== null) {
                    editor.removeAllListeners("change");
                    editor.setValue(pvsFile.content());
                    editor.clearSelection();
                    editor.moveCursorTo(0, 0);
                    editor.on("change", editorChangedListener(editor, pm, pvsFilesListView));
                } else {
                    //fetch file contents from server and set the value
                    var f = pvsFile.path();
                    ws.getFile(f, function (err, res) {
                        if (!err) {
                            editor.removeAllListeners("change");
                            pvsFile.content(res.fileContent).dirty(false);
                            editor.setValue(pvsFile.content());
                            editor.clearSelection();
                            editor.moveCursorTo(0, 0);
                            editor.on("change", editorChangedListener(editor, pm, pvsFilesListView));
                        } else {
                            ///TODO show error loading file
                            console.log(JSON.stringify(err));
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
		return this.project().getSpecFile(pvsFilesListView.getSelectedItem());
	};

	/** 
	 *  Change the name of the specified file
	 *  @param  file            - reference to the file to rename
     *  @param {string} newName the new name to give the file
	 *  @memberof ProjectManager
     *  @deprecated
	 */
	ProjectManager.prototype.renameFile = function (file, newName) {
		if (file && newName && file.name() !== newName) {
            this.project().renameFile(file, newName.trim());
		}
	};

//	/** 
//	 *  Delete a file from a project
//	 *  @param  {ProjectFile} file The file to delete from the project
//	 *  @param  {ProjectManager~onFileDeleted}  cb Callback function to invoke once file has been deleted
//	 * @memberof ProjectManager
//	 */
//	ProjectManager.prototype.deleteFile = function (file, cb) {
//	///FIXME this function should prompt user for confirmation through a dialog
//		if (file) {
//			this.project().removeFile(file);
//			this.editor().setValue("");
//			fs.deleteFile(file.path(), cb);
//		}
//	};

    

	/**
	 * Creats a new instance of a project from json data
	 * @param {{name: string, projectPath: string, pvsFiles: string[], mainPVSFile: ?string,
		image: ?string, imageData: ?string, widgetDefinition: ?string}} obj The json data from which the new project is instantiated
	 * @return {Project}
     * @private
	 */
	function initFromJSON(obj) {
		var p = new Project(obj.name).path(obj.projectPath), pf;
		if (obj.pvsFiles) {
			//create project files and assign the mainpvsfile appropriately
			obj.pvsFiles.forEach(function (file) {
				if (file.path === obj.mainPVSFile.path) {
                    pf = new ProjectFile(file.path, p).content(file.fileContent);
                    
					p.mainPVSFile(pf);
				}
                p.addSpecFile(file.path, file.fileContent);
//                var currentFile =  obj.folderStructure.children.filter(function (f) { return f.path === file.path; });
//                if (currentFile && currentFile.length > 0) {
//                    //this means files having the same path exist in the children list!!
//                    //log debug and pick the first item in currentFile
//                    if (currentFile.length > 1) {
//                        console.log("dbg: warning, unexpected aliasing for file " + file.path);
//                    }
//                    p.addSpecFile(currentFile[0].path, currentFile[0].fileContent);
//                } else {
//                    console.log("dbg: warning, unable to render content of " + file.path);
//                }
			});
		}
        if (obj.scripts) {
            obj.scripts.forEach(function (s) {
                p.addScript(s);
            });
        }
		if (obj.imagePath && obj.imageData) {
			p.image(new ProjectFile(obj.imagePath, p).type("image").content(obj.imageData));
		}
		p.widgetDefinitions(obj.widgetDefinition)._dirty(false);
        
		return p;
	}
    
	ProjectManager.prototype.openProject = function (callback) {
		var pm = this;
		var ws = WSManager.getWebSocket();
        ws.send({type: "listProjects"}, function (err, res) {
            if (!err) {
                var projects = res.projects;
                projects.unshift("");
                openProjectForm.create(projects, function (d) {
                    return d;
                }).on("ok", function (e, view) {
                    //open selected project
					ws.send({type: "openProject", name: e.data.projectName}, function (err, res) {
						if (!err) {
                            ScriptPlayer.clearView();
							var p = initFromJSON(res.project);
							WidgetManager.clearWidgetAreas();
							d3.select("div#body").style("display", null);
							pm.project(p);
                            // always set mainPVSfile because ProjectChanged will trigger an invocation of pvsio with that file
                            pm.project().mainPVSFile(pm.project().mainPVSFile() || pm.project().pvsFilesList()[0]);
                            pm.fire({type: "ProjectChanged", current: p, previous: pm.project()});
							pm.editor().removeAllListeners("change");
							pm.editor().setValue("");
							//list all files
							if (p.pvsFiles()) {
								pm.renderSourceFileList(res.project.folderStructure);
                                pvsFilesListView.selectItem(p.mainPVSFile() || p.pvsFilesList()[0]);
                                // clear dirty flags
                                p.pvsFilesList().forEach(function (f) { f.dirty(false); });
							}
							pm.editor().on("change", editorChangedListener(pm.editor(), pm, pvsFilesListView));
							// update image -- note that we need to wait the callback as image loading may take a little while in some cases
							if (p.image()) {
								pm.updateImage(p.image(), function (res) {
                                    if (res.type !== "error") {
                                        WidgetManager.updateMapCreator(function () {
                                            WidgetManager.restoreWidgetDefinitions(p.widgetDefinitions());
                                        });
                                        d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
                                    } else {
                                        console.log(res);
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
					//remove the dialog
					view.remove();
                }).on("cancel", function (e, view) {
                    view.remove();
                });
            }
        });
    };
	/**
	 * Opens a form that allows a user to select specification files to add to the project.
	 * Selected files are added to the project, but changes are not persisted until project.save is invoked.
	 * @param {callback} [cb = function () {}] function to invoke after files have been loaded into the project
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.openFiles = function (cb) {
        var pm = this;
        var project = this.project(),
            editor = this.editor(),
            err,
            res;
		openFilesForm.create().on("cancel", function (e, view) {
			view.remove();
            err = { msg: "cancelled by user" };
            if (cb && typeof cb === "function") { cb(err, res); }
		}).on("ok", function (e, view) {
            var i = 0, promises = [], data = e.data, currLength = project.pvsFilesList().length;
            //create promises for the pvs source files, if any is specified in data
            if (data.pvsSpec) {
                for (i = 0; i < data.pvsSpec.length; i++) {
                    promises.push(fs.readLocalFileAsText(data.pvsSpec[i]));
                }
            }

            Promise.all(promises)
                .then(function (pvsFiles) {
                    pvsFiles.forEach(function (specContent, index) {
                        project.addSpecFile(data.pvsSpec[index].name, specContent);
                    });
                }).then(function () {
                    // select the first of the opened files and fire project changed event
                    if (data.pvsSpec[0]) {
                        pvsFilesListView.selectItem(
                            project.pvsFiles()[data.pvsSpec[0].name]
                        );
                        // fire project changed event
                        pm.fire({
                            type: "ProjectChanged",
                            current: project,
                            previous: project
                        });
                    }
                    view.remove();
                    var msg = (project.pvsFilesList().length - currLength)
                                + " added to the project";
                    res = { msg: msg };
                    if (cb && typeof cb === "function") { cb(err, res); }
                });
		});
	};
	/**
	 * Updates the project image with in the prototype builder
	 * @param {String} imageData The url or base64 encoded string to put in the src attribute of the img element
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.updateImage = function (image, cb) {
        var img = new Image();
        
        function imageLoadComplete(res) {
            d3.select("#imageDiv img").attr("src", img.src).attr("height", img.height).attr("width", img.width);
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
	
	ProjectManager.prototype.preparePageForImageUpload = function () {
        var imageExts = ["png", "jpg", "jpeg"], pm = this;
		
        //add listener for  upload button
        d3.selectAll("#btnLoadPicture").on("click", function () {
            d3.select("#btnSelectPicture").node().click();
        });

        function _updateImage(file, cb) {
            var fr = new FileReader(), ext = file.name.split(".").slice(-1).join("");
            fr.onload = function (event) {
                var image = { name   : function () { return file.name; },
                              path   : function () { return file.name; },
                              content: function () { return event.target.result; } };
//                var imageData = event.target.result;
                pm.updateImage(image, function (res) {
                    if (res.type !== "error") {
                        pm.project().changeImage("image." + ext, image.content());
                        // resize svg area and restore widget definitions, if any
                        WidgetManager.updateMapCreator(function () {
                            WidgetManager.restoreWidgetDefinitions(pm.project().widgetDefinitions());
                        });
                        d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
                    } else {
                        console.log(res);
                        //show the image drag and drop div
                        d3.select("#imageDragAndDrop.dndcontainer").style("display", null);
                    }
                    if (cb && typeof cb === "function") { cb(res); }
                });
            };
            fr.readAsDataURL(file);
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
            _updateImage(file, function (res) {
                console.log(res);
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        };
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
                    project.changeImage(data.prototypeImage[0].name, res);
                });
        }
        
        //create promises for the pvs source files, if any is specified in data
        if (data.pvsSpec) {
            for (i = 0; i < data.pvsSpec.length; i++) {
                if (data.pvsSpec[i].name !== undefined && data.pvsSpec[i].content !== undefined) {
                    promises.push(data.pvsSpec[i].content);
                } else {
                    promises.push(fs.readLocalFileAsText(data.pvsSpec[i]));
                }
            }
        }

        var previousProject = project || pm.project();
        Promise.all(promises)
            .then(function (pvsFiles) {
                pvsFiles.forEach(function (specContent, index) {
                    project.addSpecFile(data.pvsSpec[index].name, specContent);
                });
            }).then(function () {
                project.saveNew(data.projectName, function (err, res, folderStructure) {
                    console.log({err: err, res: res});
                    if (!err) {
                        project.pvsFilesList().forEach(function (f) {
                            f.dirty(false);
                        });
                        //set the main pvs file
                        project.mainPVSFile(project.pvsFilesList()[0]);
                        WidgetManager.updateMapCreator();
                        pm.project(project);
                        pm.renderSourceFileList(folderStructure);
                        pvsFilesListView.selectItem(project.mainPVSFile()
                                                        || project.pvsFilesList()[0]
                                                        || project.path());
                        if (project.image()) {
                            pm.updateImage(project.image(), function (res) {
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
                        alert(err.toString());
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
	ProjectManager.prototype.newProject = function (projectName, pvsSpec) {
        var pm = this;
        newProjectForm.create().on("cancel", function (e, formView) {
            console.log(e);
            formView.remove();
        }).on("ok", function (e, formView) {
            var data = e.data;
            console.log(e);
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
            project.save(function (err, p) {
                if (!err) {
                    console.log("project saved");
                    project = p;
                    //repaint the list and sourcecode toolbar
                    project.pvsFilesList().forEach(function (f) { f.dirty(false); });
                    project._dirty(false);
                    pm.fire({type: "ProjectSaved", project: project});
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
	 * @param {ProjectFile} file The file to save.
	 * @param {Project~onProjectSaved} cb The callback function to invoke when file has been saved
	 * @memberof Project
	 */
	ProjectManager.prototype.saveFiles = function (pvsFiles, cb) {
        if (pvsFiles) {
            var pm = this;
            var project = this.project();
            if (project.name() === defaultProjectName) {
                this.saveProject(project, cb);
            } else {
                // save all files, the project has already a valid name
                project.saveFile(pvsFiles, function (err, res) {
                    if (!err) {
                        project.pvsFilesList().forEach(function (f) { f.dirty(false); });
                        project._dirty(false);
                    } else { console.log(err); }
                    if (typeof cb === "function") { cb(err, res); }
                });
            }
        }
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
        var ws = WSManager.getWebSocket();
        var defaultFileName = defaultTheoryName + ".pvs";
        var defaultFilePath = defaultProjectName + "/" + defaultFileName;
        var data = { projectName: defaultProjectName,
                     pvsSpec: [ defaultFilePath ],
                     prototypeImage: [] };
        
        WidgetManager.clearWidgetAreas();
        ScriptPlayer.clearView();
        var project = new Project(data.projectName);
        project.addSpecFile(data.pvsSpec[0], makeEmptyTheory(defaultTheoryName));

        project.saveNew(data.projectName, function (err, res, folderStructure) {
            console.log({err: err, res: res});
            if (!err) {
                //set the main pvs file
                project.mainPVSFile(new ProjectFile(defaultFilePath, defaultFileName));
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
	ProjectManager.prototype.createFile = function (filename, content) {
        this.project().addSpecFile(filename, content);
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
