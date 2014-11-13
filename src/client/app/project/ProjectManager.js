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
		displayPrompt = require("pvsioweb/forms/displayPrompt"),
        newProjectForm          = require("pvsioweb/forms/newProject"),
		openProjectForm         = require("pvsioweb/forms/openProject"),
		openFilesForm = require("pvsioweb/forms/openFiles"),
		WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager(),
		NotificationManager = require("project/NotificationManager");

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
        d3.select("#header #txtProjectName").html(name);
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
        Event listener for file system updates
    */
    function onFSUpdate(event) {
        var f, project = _projectManager.project();
        if (event.event === "delete") {
            f = project.getProjectFile(event.filePath);
            if (f) {
                project.removeFile(f);
            } else {
                pvsFilesListView.getTreeList().removeItem(event.filePath);
            }
        } else if (event.event === "rename" && event.old) {
            if (event.isDirectory) {
                project.updateFolderName(event.old.filePath, event.filePath);
            } else {
                f = project.getProjectFile(event.old.filePath);
                if (f) {
                    f.path(event.filePath);
                }
            }
            if (pvsFilesListView) {
                var node = pvsFilesListView.getTreeList().findNode(function (d) {
                    return d.path === event.old.filePath;
                });
                if (node) {
                    pvsFilesListView.getTreeList().renameItem(node, event.fileName);   
                }
            }
        } else if (event.event === "rename") { //file or folder added
            if (event.isDirectory) {
                var parentFolderName = event.filePath.replace("/" + event.fileName, "");
                var parent = pvsFilesListView.getTreeList().findNode(function (d) {
                    return d.path === parentFolderName;
                });
                var newFolder = {name: event.fileName, path: event.filePath, children: [], isDirectory: true};
                pvsFilesListView.getTreeList().addItem(newFolder, parent);
            } else if (!_projectManager.fileExists(event.filePath)) {
                f = _projectManager.createProjectFile(event.filePath.replace(project.name() + "/", ""), null);
                project.addProjectFile(f);
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
        project = project || new Project("");
            
        function registerFSUpdateEvents() {
            WSManager.getWebSocket().removeListener("FileSystemUpdate", onFSUpdate);
            WSManager.getWebSocket().addListener("FileSystemUpdate", onFSUpdate);
        }
        
		/**
            get or set the current {Project}
            @type {Project}
        */
		this.project = property.call(this, project)
            .addListener("PropertyChanged", function (e) {
                registerFSUpdateEvents(e.fresh);
            })
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
        registerFSUpdateEvents(project);
	}
	/**
		Returns a new project file with the specified theory name
		@param {string} theoryName the name of the theory
		@param {string} path the path to the file relative to the project root folder
		@returns {ProjectFile} the newly created projectfile
	*/
	ProjectManager.prototype.newTheoryFile = function (theoryName, path) {
		var content = makeEmptyTheory(theoryName);
		return new ProjectFile(path, content).encoding("utf-8");
	};
	/**
	 * Renders the list of pvs files in the project
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.renderSourceFileList = function () {
		var pm = this;
		var project = this.project(), editor = this.editor();
        var folderStructure = project.getFolderStructure();
        
		var ws = WSManager.getWebSocket();
		pvsFilesListView = new FileTreeView("#pvsFiles", folderStructure, pm);
		
		pvsFilesListView.addListener("SelectedItemChanged", function (event) {
			//fetch sourcecode for selected file and update editor
            if (event.selectedItem) {
                if (event.selectedItem.isDirectory) {
					editor.off("change", _editorChangedHandler);
					editor.setOption("mode", "txt");
					editor.setValue("<< Please select a file to view/edit its content within the model editor. >>");
					editor.setOption("readOnly", true);
					editor.markClean();
					editor.focus();
                    editor.on("change", _editorChangedHandler);       
                } else {
                    //fetch sourcecode for selected file and update editor
                    var pvsFile = project.getProjectFile(event.selectedItem.path);
//                    if (!pvsFile) {//load the pvsfile and add to the project 
//                        //since we are not passing a file content it will get loaded over websocket when requested
//                        //we supress the spec file added event because the file already exists in the file tree
//                        var theoryName = event.selectedItem.name.substr(0, event.selectedItem.name.indexOf(".pvs"));
//                        pvsFile = project.addProjectFile(event.selectedItem.path, makeEmptyTheory(theoryName), "utf8", true);
//                    }
                    if (pvsFile && pvsFile.content() !== undefined && pvsFile.content() !== null) {
                        editor.off("change", _editorChangedHandler);
                        editor.setOption("mode", "txt");
                        editor.setValue(pvsFile.content());
                        editor.setOption("readOnly", false);
                        editor.markClean();
                        if (pvsFile.isPVSFile()) {
                            editor.setOption("mode", "pvs");
                        }
                        editor.focus();
                        editor.on("change", _editorChangedHandler);
                    } else {
                        //fetch file contents from server and set the value
                        var f = pvsFile.path();
                        ws.getFile(f, function (err, res) {
                            if (!err) {
                                editor.off("change", _editorChangedHandler);
                                editor.setOption("mode", "txt");
                                pvsFile.content(res.fileContent).dirty(false);
                                editor.setValue(pvsFile.content());
                                editor.markClean();
                                if (pvsFile.isPVSFile()) {
                                    editor.setOption("mode", "pvs");
                                }
                                editor.focus();
                                editor.on("change", _editorChangedHandler);
                            } else {
                                Logger.log(err);
                            }
                        });
                    }
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
                if (file && file.filePath) {
                    pf = p.addProjectFile(file.filePath, file.fileContent).encoding(file.encoding);
                    if (file.filePath.indexOf("pvsioweb.json") > 0) {
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
        callback = callback || noop;
        //open selected project
        ws.send({type: "openProject", name: projectName}, function (err, res) {
            if (!err) {
                ScriptPlayer.clearView();
                var p = initFromJSON(res.project);
               
                pm.project(p);
                // always set mainPVSfile because ProjectChanged will trigger an invocation of pvsio with that file
                pm.project().mainPVSFile(pm.project().mainPVSFile() || pm.project().pvsFilesList()[0]);
                pm.project()._dirty(false);
                
                pm.fire({type: "ProjectChanged", current: p, previous: pm.project()});
 
                if (p.pvsFilesList()) {
                    // clear dirty flags
                    p.pvsFilesList().forEach(function (f) { f.dirty(false); });
                }
                callback(p);
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
    var img;
	ProjectManager.prototype.updateImage = function (image, cb) {
        img = new Image();
        
        function imageLoadComplete(res) {
			//if the image width is more than the the containing element scale it down a little
			var parent = d3.select("#prototype-builder-container"),
				scale = 1;
			function resize() {
                if (img) {
                    var pbox = parent.node().getBoundingClientRect(),
                        adjustedWidth = img.width,
                        adjustedHeight = img.height;
                    scale = 1;

                    if (img.width > pbox.width) {
                        adjustedWidth = pbox.width;
                        scale = adjustedWidth / img.width;
                        adjustedHeight = scale * img.height;
                    }

                    d3.select("#imageDiv").style("width", adjustedWidth + "px").style("height", adjustedHeight + "px");
                    d3.select("#imageDiv img").attr("src", img.src).attr("height", adjustedHeight).attr("width", adjustedWidth);
                    d3.select("#imageDiv svg").attr("height", adjustedHeight).attr("width", adjustedWidth);
                    d3.select("#imageDiv svg > g").attr("transform", "scale(" + scale + ")");
                    //hide the draganddrop stuff
                    d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");

                    //update widgets maps after resizing
                    d3.select("#builder-controls").style("height", (50 + adjustedHeight) + "px");
                    WidgetManager.scaleAreaMaps(scale);
                }
			}
			resize();
            // invoke callback, if any
            if (cb && typeof cb === "function") { cb(res, scale); }
			parent.node().addEventListener("resize", resize);
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
		Change the image in the current project to the one specified in the parameter
		@param {string} imagePath
		@param {string} imageData base64 encoded data
		@returns {Promise} a promise that resolves when the image change process has completed
	*/
	ProjectManager.prototype.changeImage = function (imagePath, imageData) {
		var pm = this, project = this.project();
		var oldImage = project.getImage(),
			newImage = new ProjectFile(imagePath, imageData).encoding("base64");
		
		if (oldImage) {
			return pm.removeFile(oldImage)
				.then(function () {
					return pm.addFile(newImage);
				});
		} else {
			return pm.addFile(newImage);
		}
	};
	/**
		Removes the specified file from the list of project files and deletes the file from disk
		@param {ProjectFile|string} f the file to remove or the path to the file to remove
		@returns {Promise} a promise that resolves with the deleted file or an error
	*/
	ProjectManager.prototype.removeFile = function (f) {
		var ws = WSManager.getWebSocket(), notification;
		var project = this.project();
        f = typeof f === "string" ? project.getProjectFile(f) : project.getProjectFile(f.path());
        if (!f) {
            return Promise.reject("File with the specified path '" + f.path() + "' does not exist");   
        }
		return new Promise(function (resolve, reject) {
			ws.send({type: "deleteFile", filePath: f.path()}, function (err) {
				if (!err) {
					project.removeFile(f);
					notification = "File " + f.path() + " removed from project.";
					Logger.log(notification);
					NotificationManager.show(notification);
					resolve(f);
					f.clearListeners();
				} else {
					//show error
					reject(err);
					Logger.error(err);
				}
			});
		});
	};
    /**
        Removes the file with the specified path from the list of project files and deletes the file from disk
        @param {!String} path the path to the file to remove
        @returns {Promise} a promise that resolves with the deleted file or an error
    */
    ProjectManager.prototype.removeFileWithPath = function (path) {
        var file = this.project().getProjectFile(path);
        if (file) {
            return this.removeFile(file);
        } else {
            return Promise.reject("File with the specified path '" + path + "' does not exist in the project");   
        }
    };
    
	/**
		Adds the specified file to the list of project files
		@param {ProjectFile} file the file to add
		@param {bool} suppressEvent the parameter to flag whether or not to suppress the new file event
		@returns {Promise} a promise that resolves with the file added
	*/
	ProjectManager.prototype.addFile = function (file, suppressEvent) {
		var ws = WSManager.getWebSocket();
		var project = this.project();
		return new Promise(function (resolve, reject) {
			ws.writeFile({filePath: file.path(), fileContent: file.content(), encoding: file.encoding()}, function (err) {
				if (!err) {
					//add the spec file to the project and supress the event so we dont create multiple files
					var notification = "File " + file.path() + " added to project.";
					Logger.log(notification);
					NotificationManager.show(notification);
					project.addProjectFile(file, suppressEvent);
					resolve(file);
				} else {
					reject(err);
                    Logger.error(err);
				}
			});
		});
	};
	
	/**
		Adds a folder to the project directory at the specified path
		@param {string} path the path of the new folders
		@return {Promise} a promise that resolves when the directory has been successfully written to disk
	*/
	ProjectManager.prototype.addFolder = function (path) {
		var ws = WSManager.getWebSocket();
		return new Promise(function (resolve, reject) {
			ws.writeDirectory(path, function (err, res) {
				if (!err) {
					resolve(res);
				} else {//there was an error so revert the name
					reject(err);
				}
			});
		});
	};
	
	/**
		Removes the specified directory from the project directory
		@param {string} path The path to the folder to remove
		@return {Promise} a promise that resolves with the removed path
	*/
	ProjectManager.prototype.removeFolder = function (path) {
		var ws = WSManager.getWebSocket(), notification;
		return new Promise(function (resolve, reject) {
			ws.send({type: "deleteFile", filePath: path}, function (err) {
				if (!err) {
					notification = "Folder " + path + " removed from project.";
					Logger.log(notification);
					NotificationManager.show(notification);
					resolve(path);
				} else {
					//show error
					reject(err);
					Logger.error(err);
				}
			});
		});
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
        var i, promises = [], imageLoadPromise;
        
        function finalise(previousProject, err) {
            var image = project.getImage();
            project.getProjectFiles().forEach(function (f) {
                f.dirty(false);
            });
            //set the main pvs file
            project.mainPVSFile(project.pvsFilesList()[0]);
            pm.project(project);
           
            if (image) {
                pm.updateImage(image, function (res, scale) {
					WidgetManager.updateMapCreator(scale);
                    //fire project changed event
                    pm.fire({type: "ProjectChanged", current: project, previous: previousProject});
                    //invoke callback
                    if (cb && typeof cb === "function") { cb(err, project); }
                });
            } else {
                // remove previous image, if any
                img = null;
                d3.select("#imageDiv img").attr("src", "").attr("height", "430").attr("width", "1128");
                //fire project changed event
                pm.fire({type: "ProjectChanged", current: project, previous: previousProject});
                //invoke callback
                if (cb && typeof cb === "function") { cb(err, project); }
            }
        }
        
        // load image, if any is specified in data
        if (data.prototypeImage && data.prototypeImage[0]) {
            imageLoadPromise = fs.readLocalFileAsDataURL(data.prototypeImage[0])
                .then(function (res) {
                    project.changeImage(project.name() + "/" + res.filePath, res.fileContent);
                });
        } else {
            d3.select("#imageDiv img").attr("src", "").attr("height", "0").attr("width", "0");
            d3.select("#imageDiv svg").attr("height", "0").attr("width", "0");
            d3.select("#imageDiv").attr("style", "");
            d3.select("#body").attr("style", "height: 480px"); // 430 + 44 + 6
            // show the draganddrop stuff
            d3.select("#imageDragAndDrop.dndcontainer").style("display", "block").style("height", "430px");
			imageLoadPromise = Promise.resolve("no image");
        }
        
        //create promises for the pvs source files, if any is specified in data
        if (data.pvsSpec && data.pvsSpec.length > 0) {
            for (i = 0; i < data.pvsSpec.length; i++) {
                if (data.pvsSpec[i].name !== undefined) {
					promises.push(fs.readLocalFileAsText(data.pvsSpec[i]));
                }
            }
        } else {
            // create one file with the default content
            var emptySpec = {
                fileName: defaultTheoryName + ".pvs",
                fileContent: defaultTheoryName + emptyTheoryContent + defaultTheoryName
            };
            promises.push(Promise.resolve(emptySpec));
        }

        var previousProject = project || pm.project();
		imageLoadPromise.then(function () {
			Promise.all(promises)
				.then(function (pvsFiles) {
					pvsFiles.forEach(function (spec) {
						project.addProjectFile(project.name() + "/" + spec.fileName, spec.fileContent);
					});
				}).then(function () {
					project.saveNew({ projectName: data.projectName,
									  overWrite  : false }, function (err, res) {
						Logger.log({err: err, res: res});
						if (err) {
                            if (err.code === "EEXIST") {
                                if (confirm("Project " + data.projectName + " already exists. Overwrite the project?")) {
                                    project.saveNew({ projectName: data.projectName,
                                                     overWrite  : true }, function (err) {
                                        if (!err) {
                                            finalise(previousProject, err);
                                        } else {
                                            if (err) {
                                                alert("Error while creating the project "
                                                      + data.projectName + " (Error code " + err.code + ")");
                                            }
                                            //invoke callback
                                            if (cb && typeof cb === "function") { cb(err, project); }
                                        }
                                    });
                                } // else, do nothing
                            } else {
                                alert(err.code);
                            }
						} else {
							finalise(previousProject, err);
							//invoke callback
							if (cb && typeof cb === "function") { cb(err, project); }
						}
					});
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
        var name = project.name(), notification;
        if (name && name !== defaultProjectName && name.trim().length > 0) {
			project.save(function (err, res) {
				if (!err) {
                    project = res;
                    pm.fire({type: "ProjectSaved", project: project});
                    notification = "Project " + project.name() + " saved successfully!";
					NotificationManager.show(notification);
                    Logger.log(notification);
                } else {
					notification = "There was an error saving the project: " + JSON.stringify(err);
					NotificationManager.error(notification);
					Logger.error(notification);
                }
				if (typeof cb === "function") { cb(); }
			});
        } else if (name === defaultProjectName) {
			displayPrompt.create({header: "Please change the name from " + name + " before saving",
								  buttons: ["Cancel", "Save"]})
				.on("save", function (event, view) {
					var newProjectName = event.data.prompt.trim();
					project.name(newProjectName);
					project.updateFolderName(name, newProjectName);
					
					project.saveNew({projectName: newProjectName, overWrite: false}, function (err) {
						if (err) {
							notification = "There was an error saving the project: " + JSON.stringify(err);
							NotificationManager.error(notification);
							Logger.error(notification);
						} else {
							notification = "Project " + project.name() + " saved successfully!";
							NotificationManager.show(notification);
							pm.renderSourceFileList();
							pvsFilesListView.selectItem(project.mainPVSFile() ||
                                        project.pvsFilesList()[0] ||
                                        project.name());
						}
						if (typeof cb === "function") { cb(); }
					});
					view.remove();
				}).on("cancel", function (event, view) {
					notification = "Project save was cancelled.";
					NotificationManager.error(notification);
					view.remove();
					if (typeof cb === "function") { cb(); }
				});
		} else {
            notification = "Error: project not saved (project name \"" + name + "\" is not a valid name.)";
			NotificationManager.error(notification);
            if (typeof cb === "function") { cb(); }
        }
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
     * checks if a file with the same path as pf already exists in the project
     * @param {ProjectFile|String} pf the path to a projectfile or the projectfile to check for existence
     * returns true if pf exists, otherwise returns false
     */
    ProjectManager.prototype.fileExists = function (pf) {
        var path = typeof pf === "string" ? pf : pf.path();
        return this.project().fileExists(path);
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
        var mainFile = project.addProjectFile(data.pvsSpec[0], makeEmptyTheory(defaultTheoryName));
		//set the main pvs file
        project.mainPVSFile(mainFile);
       
		project.saveNew({ projectName: data.projectName,
                          overWrite: true }, function (err, res) {
            if (!err) {
                project._dirty(false);
                WidgetManager.updateMapCreator();
                pm.project(project);
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
                    pm.changeImage(p.name() + "/" + res.filePath, res.fileContent)
					    .then(function () {
                            pm.updateImage(p.getImage());
                        });
                }).catch(function (err) {
                    Logger.log(err);
                });
        }

        d3.select("#btnSelectPicture").on("change", function () {
            var file = d3.event.currentTarget.files[0];
            if (file && imageExts.indexOf(file.name.split(".").slice(-1).join("").toLowerCase()) > -1) {
                _updateImage(file);
                if (d3.select("#imageDiv svg").node() === null) {
                    // we need to create the svg layer, as it's not there
                    // this happens when a new project is created without selecting an image
                    WidgetManager.updateMapCreator();
                }
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
    
	module.exports = {
        getInstance: function () {
            return _projectManager || new ProjectManager();
        }
    };
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
