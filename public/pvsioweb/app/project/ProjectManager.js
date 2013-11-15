/**
 * Project Manager
 * @author Patrick Oladimeji
 * @date 11/15/13 9:49:03 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _, document, FileReader*/
define(function (require, exports, module) {
	"use strict";
	var property = require("util/property"),
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
	 *  @param  currentProject - reference to the project whose files have to be showed 
	 *  @param  editor         - reference to editor 
	 *  @param  ws             - reference to webSocket 
	 *  @returns void 
	 *	      
	 */
	function showAllFiles(currentProject, editor, ws) {
		currentProject.setAllfilesVisible();
		pvsFilesListView.updateView();
	}
	
	function updateListView(event) {
		if (pvsFilesListView) {	pvsFilesListView.updateView(); }
	}

	function ProjectManager(project, editor) {
		this.project = property.call(this, project)
			.addListener("PropertyChanged", function (e) {
				updateListView();
				e.fresh.addListener("ProjectMainSpecFileChanged", updateListView);
				e.fresh.pvsFiles.clearListeners()
					.addListener("PropertyChanged", updateListView);
			});
		this.editor = property.call(this, editor);
	}
	
	ProjectManager.prototype.renderSourceFileList = function () {
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

		function rebindEditorChangeEvent(pvsFile) {
			//update editor changed listener so that the project filecontent is updated when the editor is changed
			editor.on("change", function () {
				//ideally one should use information from ace to set the dirty mark on the document
				//e.g editor.getSession().getUndoManager().hasUndo();
				pvsFile.content(editor.getValue()).dirty(true); //update the selected project file content
				updateSourceCodeToolbarButtons(pvsFile, currentProject);
				pvsFilesListView.updateView();
			});
		}

		pvsFilesListView.addListener("SelectedIndexChanged", function (event) {
			//fetch sourcecode for selected file and update editor
			var pvsFile = event.selectedItem;
			if (pvsFile.content()) {
				editor.removeAllListeners("change");
				editor.setValue(pvsFile.content());
				editor.clearSelection();
				editor.moveCursorTo(0, 0);
				rebindEditorChangeEvent(pvsFile);
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
						rebindEditorChangeEvent(pvsFile);
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

	ProjectManager.prototype.getSelectedFile = function () {
		return pvsFilesListView.getSelectedItem();
	};

	/** 
	 *  Prompt user to get a new name for the selected file
	 *  @param  file            - reference to the file to rename
	 *  @returns void
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
	 *
	 *  @param  currentProject            - reference to the project user is using
	 *  @param  editor                    - reference to editor
	 *  @param  ws                        - reference to webSocket
	 *
	 *  @returns void
	 *
	 */
	ProjectManager.prototype.closeFile = function (file) {
		if (file) {
			this.project().hideFile(file);
			pvsFilesListView.updateView();
			//renderSourceFileList(currentProject.pvsFiles(), currentProject, editor, ws);
	
			///If user has clicked on a file, its content is shown in the editor, but editor should be empty at this time 
	
			this.editor().setValue("");
			this.editor().clearSelection();
			this.editor().moveCursorTo(0, 0);
		}
	};

	/** 
	 *  Delete a file from a project
	 *
	 *  @param  currentProject - reference to the project where file to delete is
	 *  @param  editor         - reference to editor
	 *  @param  ws             - reference to webSocket
	 *
	 *  @returns void
	 *
	 */
	ProjectManager.prototype.deleteFile = function (file, cb) {
		if (file) {
			this.project().removeFile(file);
			pvsFilesListView.updateView();
			this.editor().setValue("");
			fs.deleteFile(file.path(), cb);
		}
	};

	/** 
	 * Create a new file and add it in the project passed as parameter.The New file will be shown in file list box.
	 *
	 *  @param  currentProject            - project reference where file will be added
	 *  @param  editor                    - reference to editor
	 *  @param  ws                        - reference to webSocket
	 *  @param  {string} [name]           - name of the file. If undefined a default name will be used
	 *  @param  {string} [content]        - textual content of the file. If undefined a default content will be used
	 *
	 *  @returns void
	 *
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
		pvsFilesListView.selectItem(_.last(this.project().pvsFiles())).updateView();
	};

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
							pm.updateProjectName(p.name());
							d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
							pvsFilesListView.selectItem(p.mainPVSFile() || p.pvsFiles()[0]);
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

	ProjectManager.prototype.openFiles = function (cb) {
		var project = this.project(), editor = this.editor();
		openFilesForm.create().on("cancel", function (e, view) {
			view.remove();
		}).on("ok", function (e, view) {
			var q = queue();
			e.data.pvsSpec.forEach(function (spec) {
				q.defer(fs.createFileLoadFunction(spec, function (content) {
					project.addSpecFile(spec.name, content);
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
	
	ProjectManager.prototype.updateProjectName = function (name) {
        document.title = "PVSio-Web -- " + name;
        d3.select("#header #txtProjectName").property("value", name);
		return this;
	};
	
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
	 
	/** data has .prototypeImage, .pvsSpec, .projectName
     */
	ProjectManager.prototype.newProject = function (data) {
		newProjectForm.create().on("cancel", function (e, formView) {
            console.log(e);
            formView.remove();
        }).on("ok", function (e, formView) {
			var data = e.data;
            console.log(e);
            formView.remove();
			WidgetManager.clearWidgetAreas();
			var pm = this;
			var project = pm.project();
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
	
			for (i = 0; i < data.pvsSpec.length; i++) {
				q.defer(fs.createFileLoadFunction(data.pvsSpec[i]));
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
						pm.updateProjectName(project.name());
						pm.renderSourceFileList();
					}
				});
			});
        });
		
       
    };
	
	ProjectManager.prototype.saveProject = function (project) {
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
                        updateSourceCodeToolbarButtons(pvsFilesListView.selectedItem());
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
                        pm.updateProjectName(project.name());
                        pm.updateSourceCodeToolbarButtons(pvsFilesListView.selectedItem());
                    }
                });
            }
        } else {
			_doSave();
		}
	};
	module.exports = ProjectManager;

});