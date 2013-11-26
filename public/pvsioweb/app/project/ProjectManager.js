/** @module ProjectManager*/
/**
 * Project Manager is responsible for operations on the project e.g., creation, removal, loading and modifying projects. It also currently manages the view of the project
 * @author Patrick Oladimeji
 * @date 11/15/13 9:49:03 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _, document, FileReader*/
define(function (require, exports, module) {
	"use strict";
	var property = require("util/property"),
		eventDispatcher = require("util/eventDispatcher"),
		Project = require("./Project"),
		ListView = require("pvsioweb/ListView"),
		ProjectFile = require("./ProjectFile"),
		WSManager = require("websockets/pvs/WSManager"),
		fs	= require("lib/fileHandler/fileHandler"),
		queue = require("d3/queue"),
        newProjectForm          = require("pvsioweb/forms/newProject"),
		openProjectForm         = require("pvsioweb/forms/openProject"),
		openFilesForm = require("pvsioweb/forms/openFiles"),
		WidgetManager = require("pvsioweb/WidgetManager").getWidgetManager();

	///	Used to change name of default files (i.e: default_name + counter ) 
	var counter = 0;
	var pvsFilesListView;
    var default_project_name = "default_pvsProject";
	
	function noop() {}
	
	/**
	 * Updates the name of the project on the document title
	 */
	function projectNameChanged(event) {
		var name = event.current;
        document.title = "PVSio-Web -- " + name;
        d3.select("#header #txtProjectName").property("value", name);
	}
	
	function updateSourceCodeToolbarButtons(pvsFile, currentProject) {
		//update status of the set main file button based on the selected file
		if (pvsFile) {
			if (currentProject.mainPVSFile() && currentProject.mainPVSFile().name() === pvsFile.name()) {
				d3.select("#btnSetMainFile").attr("disabled", true);
			} else {
				d3.select("#btnSetMainFile").attr("disabled", null);
			}

			//update status of file save button based on the selected file
			if (pvsFile.dirty()) {
				d3.select("#btnSaveFile").attr("disabled", null);
			} else {
				d3.select("#btnSaveFile").attr("disabled", true);
			}
		}
	}
	
	/** 
	 *  Shows all files in the project in file list view box 
	 *  @param  {Project} currentProject - reference to the project whose files have to be showed 
	 *  @param  {ace} editor         - reference to editor 
	 *  @returns void 
	 */
	function showAllFiles(currentProject, editor) {
		currentProject.setAllfilesVisible();
		pvsFilesListView.updateView();
	}
	
	function updateListView(event) {
		if (pvsFilesListView) {	pvsFilesListView.updateView(); }
	}

	function editorChangedListener(editor, pm, pvsFileListView) {
		return function () {
			//ideally one should use information from ace to set the dirty mark on the document
			//e.g editor.getSession().getUndoManager().hasUndo();
			var pvsFile = pvsFilesListView.selectedItem();
			if (pvsFile) {
				var dirty = pvsFile.content() !== editor.getValue();
				pvsFile.content(editor.getValue()).dirty(dirty); //update the selected project file content
				updateSourceCodeToolbarButtons(pvsFile, pm.project());
				pvsFilesListView.updateView();
			}
		};
	}
	/**
	 * Creates a new instance of the ProjectManager. It currently adds a listview for the files loaded into the
	 * project and keeps the list up to date whenever the project changes or the files within the project changes.
	 * @param {Project} project The project currently being managed
	 * @param {editor} editor The editor panel where the sped code is loaded
	 * @constructor ProjectManager
	 */
	function ProjectManager(project, editor) {
		eventDispatcher(this);
		var pm = this;
		
		this.project = property.call(this, project)
			.addListener("ProjectNameChanged", projectNameChanged)
			.addListener("PropertyChanged", function (e) {
				updateListView();
				e.fresh.addListener("ProjectMainSpecFileChanged", updateListView)
					.addListener("ProjectNameChanged", projectNameChanged);
				e.fresh.pvsFiles.clearListeners()
					.addListener("PropertyChanged", updateListView);
				//update the project name
				projectNameChanged({current: e.fresh.name()});
			});
		this.editor = property.call(this, editor)
			.addListener("PropertyChanged", function (e) {
				e.fresh.on("change", editorChangedListener(e.fresh, pm, pvsFilesListView));
			});
		
	}
	/**
	 * Shows all the files in the project including closed files.
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.showAllFiles = function () {
		showAllFiles(this.project(), this.editor());
	};
	
	/**
	 * Renders the list of pvs files in the project
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.renderSourceFileList = function () {
		var pm = this;
		var currentProject = this.project(), files = currentProject.pvsFiles(), editor = this.editor();
		var ws = WSManager.getWebSocket();
		var listLabelFunction = function (d) {
			return d.name();
		}, classFunc = function (d) {
			var c = "fileListItem ";
			if (!d.visible()) {
				c = c.concat(" hide");
			}
			if (d.dirty()) {
				c = c.concat(" dirty");
			}
			if (currentProject.mainPVSFile() && d.name() === currentProject.mainPVSFile().name()) {
				c = c.concat(" main-file");
			}
			return c;
		};
		pvsFilesListView = new ListView("#pvsFiles", files, listLabelFunction, classFunc);
		
		pvsFilesListView.addListener("SelectedIndexChanged", function (event) {
			//fetch sourcecode for selected file and update editor
			var pvsFile = event.selectedItem;
			if (pvsFile.content()) {
				editor.setValue(pvsFile.content());
				editor.clearSelection();
				editor.moveCursorTo(0, 0);
			} else {
				//fetch file contents from server and set the value
				var f = currentProject.path() + "/" + pvsFile.name();
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
			updateSourceCodeToolbarButtons(pvsFile, currentProject);
		});
		
		return pvsFilesListView;
	};
	/**
	 * Gets the file selected in the source files list view.
	 * @returns {?ProjectFile} The project source file selected or null if no item was selected
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.getSelectedFile = function () {
		return pvsFilesListView.selectedItem();
	};

	/** 
	 *  Prompt user to get a new name for the selected file
	 *  @param  file            - reference to the file to rename
	 * ///FIXME change the prompt to a form dialog
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.renameFile = function (file) {
		if (file) {
			var newName = prompt("Enter a new file name ", file.name());
			if (newName && newName.trim().length) {
				this.project.renameFile(file, newName);
				pvsFilesListView.updateView();
			}
		}
	};

	/** 
	 *  Remove user's selected file from file list box (not from the project itself)
	 *  @param  {!ProjectFile} file   The file to close from the list view
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.closeFile = function (file) {
		if (file) {
			this.project().hideFile(file);
			pvsFilesListView.updateView();
			if (file === pvsFilesListView.selectedItem()) {
				pvsFilesListView.selectedItem(undefined).selectedIndex(-1);
			}
			this.editor().setValue("");
			this.editor().clearSelection();
			this.editor().moveCursorTo(0, 0);
		}
	};

	/** 
	 *  Delete a file from a project
	 *  @param  {ProjectFile} file The file to delete from the project
	 *  @param  {ProjectManager~onFileDeleted}  cb Callback function to invoke once file has been deleted
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.deleteFile = function (file, cb) {
	///FIXME this function should prompt user for confirmation through a dialog
		if (file) {
			this.project().removeFile(file);
			pvsFilesListView.updateView();
			this.editor().setValue("");
			fs.deleteFile(file.path(), cb);
		}
	};

	/** 
	 * Create a new file and add it to the current Project. The New file will be shown in file list box.
	 *  @param  {?string} name           - name of the file. If undefined a default name will be used
	 *  @param  {?string} content       - textual content of the file. If undefined a default content will be used
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.newFile = function (name, content) {
		var default_name = "MyTheory", default_content = " THEORY BEGIN \nEND ";
		var init_content;
		if (!name) {
			init_content = default_name + counter;
			name = init_content + ".pvs";
			counter = counter + 1;
		}
		if (!content) {
			content = init_content + default_content + init_content;
		}

		this.project().addSpecFile(name, content);
		pvsFilesListView.updateView()
			.selectItem(_.last(this.project().pvsFiles()));
	};

	/**
	 * Creats a new instance of a project from json data
	 * @param {{name: string, projectPath: string, pvsFiles: string[], mainPVSFile: ?string,
		image: ?string, imageData: ?string, widgetDefinition: ?string}} obj The json data from which the new project is instantiated
	 * @return {Project}
	 */
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
							var p = initFromJSON(res.project);
							WidgetManager.clearWidgetAreas();
							d3.select("div#body").style("display", null);
							pm.fire({type: "ProjectChanged", current: p, previous: pm.project()});
							pm.project(p);
							pm.editor().removeAllListeners("change");
							pm.editor().setValue("");
							if (p.image()) {
								pm.updateImage(p.image().content());
								WidgetManager.updateMapCreator(function () {
									WidgetManager.restoreWidgetDefinitions(p.widgetDefinitions());
								});
							}
							//list all other files
							if (p.pvsFiles()) {
								pm.renderSourceFileList(p.pvsFiles());
							}
							d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
							pvsFilesListView.selectItem(p.mainPVSFile() || p.pvsFiles()[0]);
							pm.editor().on("change", editorChangedListener(pm.editor(), pm, pvsFilesListView));
							if (callback) { callback(p); }
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
		var project = this.project(), editor = this.editor();
		cb = cb || noop;
		openFilesForm.create().on("cancel", function (e, view) {
			view.remove();
		}).on("ok", function (e, view) {
			var q = queue();
			e.data.pvsSpec.forEach(function (spec) {
				q.defer(fs.createFileLoadFunction(spec, function (name, content) {
					project.addSpecFile(name, content);
				}));
			});
			q.awaitAll(function (err, res) {
				if (!err) {//done opening files and we have added them to the project
					pvsFilesListView.updateView();
					cb();
				} else {
					console.log("error opening files");
				}
			});
			view.remove();
		});
	};
	/**
	 * Updates the project image with in the prototype builder
	 * @param {String} imageData The url or base64 encoded string to put in the src attribute of the img element
	 * @memberof ProjectManager
	 */
	ProjectManager.prototype.updateImage = function (imageData) {
        d3.select("#imageDiv img").attr("src", imageData);
        //hide the draganddrop stuff
        d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
    };
	
	ProjectManager.prototype.preparePageForImageUpload = function () {
        var imageExts = ["png", "jpg", "jpeg"], pm = this;
		
        //add listener for  upload button
        d3.selectAll("#btnLoadPicture").on("click", function () {
            d3.select("#btnSelectPicture").node().click();
        });

        function _updateImage(file) {
            var fr = new FileReader(), ext = file.name.split(".").slice(-1).join("");
            fr.onload = function (event) {
                var imageData = event.target.result;
                pm.updateImage(imageData);
                pm.project().changeImage("image." + ext, imageData);
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
            _updateImage(file);
            e.preventDefault();
            e.stopPropagation();
            return false;
        };
    };
	
	ProjectManager.prototype.prepareListBoxForFileDrag = function () {
		var project = this.project(), pm = this;
        function updateProjectWithFiles(files) {
            function createFileLoadFunction(file, fileIndex) {
                return function (event) {
                    project.addSpecFile(file.name, event.target.result);
                    if (fileIndex === files.length - 1) {
                        //render file list view
                        pm.renderSourceFileList(project.pvsFiles());
                    }
                };
            }
            var i, f;
            for (i = 0; i < files.length; i++) {
                f = files[i];
                var fr = new FileReader();
                fr.onload = createFileLoadFunction(f, i);
                fr.readAsText(f);
            }
        }

        var allowedExtensions = ["pvs"];
        var lstBox = d3.select("#pvsFiles").node();
        lstBox.ondragover = function () {
            d3.select("#pvsFiles").classed("drag-over", true);
            return false;
        };
        lstBox.ondragend = function (event) {
            d3.select("#pvsFiles").classed("drag-over", false);
            event.preventDefault();
            event.stopPropagation();
            return false;
        };

        lstBox.ondrop = function (event) {
            d3.select("#pvsFiles").classed("drag-over", false);
            var files = event.dataTransfer.files;
            updateProjectWithFiles(files);
            event.preventDefault();
            event.stopPropagation();
            return false;
        };
    };
	 
	/** 
	 * Creates a new Project. Displays the new Project dialog and handles the response 
     * @memberof ProjectManager
     */
	ProjectManager.prototype.newProject = function () {
		var pm = this;
		newProjectForm.create().on("cancel", function (e, formView) {
            console.log(e);
            formView.remove();
        }).on("ok", function (e, formView) {
			var data = e.data;
            console.log(e);
            formView.remove();
			WidgetManager.clearWidgetAreas();
		
			var project = new Project();// pm.project();
			//update the current project with info from data and saveNew
			project.name(data.projectName);
			console.log("NEW PROJECT ");
			var q = queue(), i;
			q.defer(function (cb) {
				var fr = new FileReader();
				fr.onload = function (event) {
					project.changeImage(data.prototypeImage[0].name, event.target.result);
					cb();
				};
				fr.readAsDataURL(data.prototypeImage[0]);
			});
	
			function onSpecFileLoaded(name, content) {
				project.addSpecFile(name, content);
			}
			
			for (i = 0; i < data.pvsSpec.length; i++) {
				q.defer(fs.createFileLoadFunction(data.pvsSpec[i], onSpecFileLoaded));
			}
			q.awaitAll(function (err, res) {
				project.saveNew(function (err, res) {
					console.log({err: err, res: res});
					if (!err) {
						if (project.image()) {
							pm.updateImage(project.image().content());
						}
						project.pvsFiles().forEach(function (f) {
							f.dirty(false);
						});
						WidgetManager.updateMapCreator();
						pm.renderSourceFileList();
						pvsFilesListView.selectedItem(project.mainPVSFile() || project.pvsFiles()[0]);
						//fire project changed event
						pm.fire({type: "ProjectChanged", current: project, previous: pm.project()});
						pm.project(project);
					}
				});
			});
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
                    if (project.pvsFiles()) {
                        pvsFilesListView.updateView();
                        updateSourceCodeToolbarButtons(pvsFilesListView.selectedItem(), project);
                    }
                }
            });
        }

        if (project.name() === default_project_name) {
            name = prompt("Your project has default name, you can change it now (if not, please click on cancel)");
            if (name && name.trim().length > 0) {
                project.name(name);
                project.saveNew(function (err, res) {
                    if (!err) {
                        project = res;
                        pvsFilesListView.updateView();
                        pm.updateSourceCodeToolbarButtons(pvsFilesListView.selectedItem(), project);
                    }
                });
            }
        } else {
			_doSave();
		}
	};
	
	
	ProjectManager.prototype.updateSourceCodeToolbarButtons = updateSourceCodeToolbarButtons;
	
	/**
		Restarts the pvsio web process with the current project. The callback is invoked once the process is ready
		@param {ProjectManager~pvsProcessReady} callback The function to call when the process is ready
	*/
	ProjectManager.prototype.restartPVSioWeb = function (callback) {
		callback = callback || noop;
		var project = this.project(), ws = WSManager.getWebSocket();
		if (project && project.mainPVSFile()) {
			ws.lastState("init(0)");
			ws.startPVSProcess({fileName: project.mainPVSFile().name(), projectName: project.name()},
						  callback);
		}
		return this;
	};
	
	ProjectManager.prototype.updateListView = function () {
		pvsFilesListView.updateView();
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