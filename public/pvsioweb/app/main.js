/**
 * Main entry point for pvsioweb module
 * @author Patrick Oladimeji
 * @date 4/19/13 17:23:31 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, $, brackets, _, window, MouseEvent, FormData, document, setTimeout, clearInterval, FileReader */
define(function (require, exports, module) {
    "use strict";

    var pvsws                   = require("websockets/pvs/pvsWSClient"),
        ace                     = require("ace/ace"),
		Button		            = require("pvsioweb/Button"),
		Display				    = require("pvsioweb/Display"),
        newProjectForm          = require("pvsioweb/forms/newProject"),
        openProjectForm         = require("pvsioweb/forms/openProject"),
        ListView                = require("pvsioweb/ListView"),
        Project                 = require("formal/pvs/Project").Project,
        d3                      = require("d3/d3"),
        queue                   = require("d3/queue"),
        imageMapper             = require("imagemapper"),
		NewWidgetView			= require("pvsioweb/forms/newWidget"),
		EditWidgetView			= require("pvsioweb/forms/editWidget"),
		WidgetManager			= require("pvsioweb/WidgetManager")(),
		uidGenerator			= require("util/uuidGenerator"),
		stateMachine            = require("../lib/statemachine/stateMachine"),
        handlerFile             = require("../lib/fileHandler/fileHandler"),
        pvsWriter               = require("../lib/statemachine/stateToPvsSpecificationWriter"),
		pvsLanguage				= require("../lib/statemachine/pvsLanguage");


    var currentProject = new Project(""), ws, pvsFilesListBox, fileContents = {};
    var tempImageName, tempSpecName, mapCreator;
    var editor = ace.edit("editor");
	editor.getSession().setMode('ace/mode/pvsLanguage');


    var default_project_name = "default_pvsProject";
    /* Setting a default name of the project      */ 
    currentProject.name(default_project_name);


	function _updateWidgetWithProperties(widget, properties) {
		_.each(properties, function (val, key) {
			widget[key](val);
		});
		return widget;
	}
	
	function createImageMap(widget) {
		if (widget.needsImageMap()) { widget.createImageMap(ws); }
	}
	
    function handleWidgetEdit(mark) {
		var widget = WidgetManager.getWidget(mark.attr("id"));
		if (widget) {
			var wEd = EditWidgetView.create(widget);
			wEd.on("ok", function (e, view) {
                view.remove();
				widget = _updateWidgetWithProperties(widget, e.data);
                //create an interactive image area only if there isnt one already
                createImageMap(widget);
			}).on("cancel", function (e, view) {
				view.remove();
			});
		}
    }

    /***
     * ##### dealing with logging input and output of pvs
     */
    function console_log(msg) {
        console.log(msg);
        var c = document.getElementById('console_log');
        c.innerHTML = msg + "<br>" + c.innerHTML;
    }

    function pvsio_commands_log(msg) {
        console.log(msg);
        var c = document.getElementById('pvsio_commands_log');
        c.innerHTML = msg + "<br>" + c.innerHTML;
    }

    function pvsio_response_log(msg) {
        console.log(msg);
        var c = document.getElementById('pvsio_response_log');
        c.innerHTML = msg + "<br>" + c.innerHTML;
    }

    function specification_log(msg) {
        console.log(msg);
        var c = document.getElementById('specification_log');
        c.innerHTML = msg + "<br>" + c.innerHTML;
    }

    /**
     * utitlity function to pretty print pvsio output
     */
    function prettyPrint(msg) {
        return msg ? msg.toString().replace(/,,/g, ",") : msg;
    }

     /**
     * parses pvs output into a json object map
     */
    function parseState(state) {
        var st = state[0].substr(2, state[0].length - 4);
        var props = st.split(",");
        var res = {};
        props.forEach(function (p) {
            var args = p.split(":=");
            res[args[0].trim()] = args[1] ? args[1].trim() : args[1];
        });
        return res;
    }

    /**
     * log the message
     */
    function log(msg) {
        console.log(msg);
        d3.select("#console").insert('p', 'p').html(msg);
    }

    function updateSourceCodeToolbarButtons(pvsFile) {
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

    function renderSourceFileList(files) {
        var listLabelFunction = function (d) {return d.name(); },
            classFunc = function (d) {
                var c = "fileListItem";
                if (d.dirty()) {
                    c = c.concat(" dirty");
                }
                if (currentProject.mainPVSFile() && d.name() === currentProject.mainPVSFile().name()) {
                    c = c.concat(" main-file");
                }
                return c;
            };
        pvsFilesListBox = ListView.ListView("#pvsFiles", files, listLabelFunction, classFunc);
        var pvsFile;

        function rebindEditorChangeEvent(pvsFile) {
            //update editor changed listener so that the project filecontent is updated when the editor is changed
            editor.on("change", function () {
                //ideally one should use information from ace to set the dirty mark on the document
                //e.g editor.getSession().getUndoManager().hasUndo();
                pvsFile.content(editor.getValue()).dirty(true);//update the selected project file content
                updateSourceCodeToolbarButtons(pvsFile);
                pvsFilesListBox.updateView();
            });
        }

        pvsFilesListBox.addListener("SelectedIndexChanged", function (event) {
            //fetch sourcecode for selected file and update editor
            pvsFile = event.selectedItem;
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
			// User has clicked on a file, so we have to update updateLastClickedFile variable in Project 
			// currentProject.updateLastClickedFile(pvsFile);
            updateSourceCodeToolbarButtons(pvsFile);			
        });
    }

    function pvsProcessReady(err, e) {
        var pvsioStatus = d3.select("#lblPVSioStatus");
        pvsioStatus.select("span").remove();
        if (!err) {
            var msg = ("pvsio process ready");
            log(msg);
            pvsioStatus.append("span").attr("class", "glyphicon glyphicon-ok");

        } else {
            console.log(err);
            pvsioStatus.append("span").attr("class", "glyphicon glyphicon-warning-sign");
        }
    }

    function updateProjectName(name) {
        document.title = "PVSio-Web -- " + name;
        d3.select("#header #txtProjectName").property("value", name);
    }

    function updateMapCreator(cb) {
        imageMapper({element: "#imageDiv img", parent: "#imageDiv", onReady: function (mc) {
            mapCreator = mc.on("create", function (e) {
                var region = e.region;
                region.on("dblclick", function () {
                    handleWidgetEdit(region);
                });
                //pop up the widget edit dialog
				NewWidgetView.create()
					.on("ok", function (e, view) {
						view.remove();
						var id = e.data.type + "_" + uidGenerator();
						var widget = e.data.type === "button" ? new Button(id) : new Display(id);
						region.classed(widget.type(), true)
							.attr("id", id);
						widget = _updateWidgetWithProperties(widget, e.data);
						widget.element(region);
						widget.createImageMap(ws);
						WidgetManager.addWidget(widget);
					}).on("cancel", function (e, view) {
						view.remove();
						d3.select(region.node().parentNode).remove();
					});
            }).on("resize", function (e) {
				WidgetManager.updateLocation(e.region.attr("id"), e.pos);
            }).on("move", function (e) {
				WidgetManager.updateLocation(e.region.attr("id"), e.pos);
            }).on("remove", function (e) {
                e.regions.each(function () {
                    var w = WidgetManager.getWidget(d3.select(this).attr("id"));
					if (w) {
						w.remove();
					} else {
						d3.select(this.parentNode).remove();
					}
                });
            });
            if (cb) { cb(); }
        }});
    }

    function updateImage(imageData) {
        d3.select("#imageDiv img").attr("src", imageData);
        //hide the draganddrop stuff
        d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
    }
	
	function clearWidgetAreas() {
		//clear old widhget maps and area def
        if (mapCreator) {
            mapCreator.clear();
        }
        WidgetManager.clearWidgets();
	}

    function loadWidgetDefinitions(defs) {
        if (defs) {
            console.log(defs);
            var key, w, widget, property;
            _.each(defs.widgetMaps, function (w, key) {
				w.type = w.type.toLowerCase();
                widget = w.type === "button" ? new Button(key) : new Display(key);
				widget = _updateWidgetWithProperties(widget, w);
                WidgetManager.addWidget(widget);
            });

            //create div
            defs.regionDefs.forEach(function (d) {
                widget = WidgetManager.getWidget(d.class);
                var coords = d.coords.split(",").map(function (d) {
                    return parseFloat(d);
                });
                var h = coords[3] - coords[1], w = coords[2] - coords[0], x = coords[0], y = coords[1];
                var mark = mapCreator.restoreRectRegion({x: x, y: y, width: w, height: h});
				mark.attr("id", widget.id()).classed(widget.type(), true);
				widget.element(mark);
				createImageMap(widget);
                //set the font-size of the mark to be 80% of the height and the id of the mark
                mark.on("dblclick", function () {
                    handleWidgetEdit(mark);
                });
            });
        }
    }

	function switchToBuilderView() {
		d3.select(".image-map-layer").style("opacity", 1).style("z-index", 190);
        d3.selectAll("#controlsContainer button, div.display").classed("selected", false);
        d3.select("#btnBuilderView").classed('selected', true);
        d3.select("div.display,#controlsContainer button").classed("builder", true);
        d3.select("div.display,#controlsContainer button").classed("simulator", false);
	}
	
	function switchToSimulatorView() {
		d3.select(".image-map-layer").style("opacity", 0.1).style("z-index", -2);
        d3.selectAll("#controlsContainer button, div.display").classed("selected", false);
        d3.select("#btnSimulatorView").classed('selected', true);
        d3.select("div.display,#controlsContainer button").classed("simulator", true);
        d3.select("div.display,#controlsContainer button").classed("builder", false);
	}
	
    function openProject() {
        ws.send({type: "listProjects"}, function (err, res) {
            if (!err) {
                var projects = res.projects;
                projects.unshift("");
                openProjectForm.create(projects, function (d) {
                    return d;
                }).on("ok", function (e, view) {
                    //open selected project
                    Project.open(e.data.projectName, function (project) {
                        currentProject = project;
                        console.log(currentProject);
                        //only update the image and pvsfile if a real project was selected
                        if (currentProject.name() !== "") {
                            clearWidgetAreas();
                            d3.select("div#body").style("display", null);
                            editor.removeAllListeners("change");
                            editor.setValue("");
                            if (currentProject.image()) {
                                updateImage(currentProject.image().content());
                                updateMapCreator(function () {
                                    loadWidgetDefinitions(currentProject.widgetDefinitions());
                                });
                            }
                            //list all other files
                            if (currentProject.pvsFiles()) {
                                renderSourceFileList(currentProject.pvsFiles());
                            }
                            updateProjectName(currentProject.name());
                            d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");

                            //try to start process on server
                            ws.lastState("init(0)");
                            ws.startPVSProcess(currentProject.mainPVSFile().name(), currentProject.name(),
                                              pvsProcessReady);
							//ensure view is in the build view
							switchToBuilderView();

							ListView.showContentFileInEditor(currentProject, editor, ws);
                        }
                        //remove the dialog
                        view.remove();
                    });
                }).on("cancel", function (e, view) {
                    view.remove();
                });
            }
        });
    }

    function preparePageForImageUpload() {
        var imageExts = ["png", "jpg", "jpeg"];

        //add listener for  upload button
        d3.selectAll("#btnLoadPicture").on("click", function () {
            d3.select("#btnSelectPicture").node().click();
        });

        function _updateImage(file) {
            var fr = new FileReader(), ext = file.name.split(".").slice(-1).join("");
            fr.onload = function (event) {
                var imageData = event.target.result;
                updateImage(imageData);
                currentProject.changeImage("image." + ext, imageData);
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
    }

    function prepareListBoxForFileDrag() {
        function updateProjectWithFiles(files) {
            function createFileLoadFunction(file, fileIndex) {
                return function (event) {
                    currentProject.addSpecFile(file.name, event.target.result);
                    if (fileIndex === files.length - 1) {
                        //render file list view
                        renderSourceFileList(currentProject.pvsFiles());
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
    }

        function createFileLoadFunction(file) {
            return function (cb) {
                var fr = new FileReader();
                fr.onload = function (event) {
		    var a = event.target.result;
                    currentProject.addSpecFile(file.name, event.target.result);
                    cb();
                };
                fr.readAsText(file);
            };
        }

    /**
     * data has .prototypeImage, .pvsSpec, .projectName
     */
    function newProject(data) {
		clearWidgetAreas();
        //update the current project with info from data and saveNew
        currentProject.name(data.projectName);
		console.log("NEW PROJECT " );
        var q = queue(), i;
        q.defer(function (cb) {
            var fr = new FileReader();
            fr.onload = function (event) {
                currentProject.changeImage(data.prototypeImage[0].name, event.target.result);
                cb();
            };
            fr.readAsDataURL(data.prototypeImage[0]);
        });
        
                
        for (i = 0; i < data.pvsSpec.length; i++) {
            q.defer(createFileLoadFunction(data.pvsSpec[i]));
        }

        q.awaitAll(function (err, res) {
            currentProject.saveNew(function (err, res) {
                console.log({err: err, res: res});
                if (!err) {
                    if (currentProject.image()) {
                        updateImage(currentProject.image().content());
                    }
                    currentProject.pvsFiles().forEach(function (f) {
                        f.dirty(false);
                    });
                    updateProjectName(currentProject.name());
                    renderSourceFileList(currentProject.pvsFiles());
                }
            });
        });
    }

    /**
     * create pvs websocket connection
     * add listeners for pvs process events
     */
    var port = 8082;
    var url = window.location.origin.indexOf("file") === 0 ?
            ("ws://localhost:" + port) : ("ws://" + window.location.hostname + ":" +  port);
    ws = pvsws()
        .serverUrl(url)
        .addListener('ConnectionOpened', function (e) {
            log("connection to pvsio server established");
            d3.select("#btnRestartPVSioWeb").attr("disabled", null);
            d3.select("#lblWebSocketStatus").select("span").attr("class", "glyphicon glyphicon-ok");
        }).addListener("ConnectionClosed", function (e) {
            log("connection to pvsio server closed");
            d3.select("#btnRestartPVSioWeb").attr("disabled", true);
            d3.select("#lblWebSocketStatus").select("span").attr("class", "glyphicon glyphicon-warning-sign");
        }).addListener("pvsoutput", function (e) {
            console.log(e);
            var response = prettyPrint(e.data), tmp;
            ws.lastState(e.data);
            ws.value(parseState(e.data).display);
            console.log(response);
            pvsio_response_log(response);
        }).addListener("InputUpdated", function (e) {
            pvsio_commands_log(JSON.stringify(e.data));
        }).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
            console.log("Server process exited -- server message was ...");
            console.log(e);
            log(JSON.stringify(e));
            d3.select("#lblPVSioStatus").select("span").attr("class", "glyphicon glyphicon-warning-sign");
        }).logon();

    d3.select("#header #txtProjectName").property("value", "");

    /**
     * Add event listener for toggling the prototyping layer and the interaction layer
     */
    d3.select("#btnBuilderView").classed("selected", true).on("click", function () {
        switchToBuilderView();
    });

    d3.select("#btnSimulatorView").on("click", function () {
		switchToSimulatorView();
    });

    d3.select("#saveProject").on("click", function () {
        /**
            saves a project including image, widget definitions and pvsfiles
        */
        function _doSave() {
            currentProject.save(function (err, project) {
				if (!err) {
					console.log("project saved");
					currentProject = project;
					//repaint the list and sourcecode toolbar
					if (currentProject.pvsFiles()) {
						pvsFilesListBox.updateView();
						updateSourceCodeToolbarButtons(pvsFilesListBox.selectedItem());
					}
				}
            });
        }

	if (currentProject.name() == default_project_name ) {
            var name = prompt("Your project has default name, you can change it now (if not, please click on cancel)");
            if (name && name.trim().length > 0) {
	

                currentProject.name(name);
                currentProject.saveNew(function (err, project) {
                    if (!err) {
                        currentProject = project;
                        //pvsFilesListBox.updateView();
                        updateProjectName(currentProject.name());
                        //updateSourceCodeToolbarButtons(pvsFilesListBox.selectedItem());
                    }
                });
            } 
        }

        //prompt for a name if there is no name
        ///TODO this section could use a better prompt for requesting project name
	
        if (currentProject.name().length === 0) {
            var name = prompt("Please enter a name for the project");
            if (name && name.trim().length > 0) {
	

		var stateMachineisLoaded;
	        stateMachineisLoaded = _stateMachine_isLoaded();
                currentProject.name(name);
		if( stateMachineisLoaded != "" )  {
			currentProject.stateMachine(stateMachineisLoaded);

		        if( pvsFilesListBox === undefined )
			  	renderSourceFileList(currentProject.pvsFiles())
	
		}

                currentProject.saveNew(function (err, project) {
                    if (!err) {
                        currentProject = project;
                        pvsFilesListBox.updateView();
                        updateProjectName(currentProject.name());
                        updateSourceCodeToolbarButtons(pvsFilesListBox.selectedItem());
						console.log("project saved");
                    }
                });
            } else {
                console.log("no name was given for project --");
            }
        } else {
            _doSave();
        }
    });

    d3.select("#openProject").on("click", function () {
        openProject();
    });

    d3.select("#newProject").on("click", function () {
        newProjectForm.create().on("cancel", function (e, formView) {
            console.log(e);
            formView.remove();
        }).on("ok", function (e, formView) {
            console.log(e);
            formView.remove();
            newProject(e.data);
        });
    });
    //handle typecheck event
    //this function should be edited to only act on the selected file when multiple files are in use
    d3.select("#btnTypeCheck").on("click", function () {
        if (pvsFilesListBox && pvsFilesListBox.selectedIndex() > -1) {
            var pvsFile = pvsFilesListBox.selectedItem();
            var btn = d3.select(this).html("Typechecking ...").attr("disabled", true);
            ws.send({type: "typeCheck", filePath: currentProject.path() + "/" + pvsFile.name()}, function (err, res) {
                btn.html("Typecheck").attr("disabled", null);
                if (err) {
                    alert(JSON.stringify(err));
                } else {
                    console.log(res);
                    ///TODO: show nicer alert and visualisation for type checking info
                    alert(res.stdout);
                }
            });
        }
    });

    d3.select("#btnSetMainFile").on("click", function () {
        if (pvsFilesListBox && pvsFilesListBox.selectedItem()) {
            var pvsFile = pvsFilesListBox.selectedItem();
            ws.send({type: "setMainFile", projectName: currentProject.name(), fileName: pvsFile.name()}, function (err, res) {
                //if there was no error update the main file else alert user
                currentProject.mainPVSFile(pvsFile);
                pvsFilesListBox.updateView();
		///FIXME 
		
            });
        }
    });

    d3.select("#btnSaveFile").on("click", function () {
        if (pvsFilesListBox && pvsFilesListBox.selectedItem()) {
            var pvsFile = pvsFilesListBox.selectedItem();
            currentProject.saveFile(pvsFile, function (err, res) {
                if (!err) {
                    pvsFile.dirty(false);
                    pvsFilesListBox.updateView();
                    updateSourceCodeToolbarButtons(pvsFile);
                } else {
                    console.log(err);
                }
            });
        }
    });

    d3.select("#btnRestartPVSioWeb").on("click", function () {
        //try to start process on server
        if (currentProject.mainPVSFile()) {
            ws.lastState("init(0)");
            ws.startPVSProcess(currentProject.mainPVSFile().name(), currentProject.name(),
                          pvsProcessReady);
        }
    });

    /** NEW: StateChart **************************************************************************/   
    d3.select("#state_machine").on("click", function () { stateMachine.init(editor); });
    d3.select("#button_state").on("click", function () { stateMachine.add_node_mode(); });
    d3.select("#button_transition").on("click", function () { stateMachine.add_transition_mode(); });
    d3.select("#button_self_transition").on("click", function () { stateMachine.add_self_transition_mode(); });
   	var modifiedUser = 0;
    var myState = new Array();
    myState[0] = { 
			name : "S1",
                        id   : 0

	};
    myState[1] = {
		        name : "S2",
	                id   : 0
	};
    /// When User clicks on New File button #new_file a pvs file is created and showed in file list box
    d3.select("#new_file").on("click", function ( ) {	

	ListView.new_file(currentProject, editor, ws);
    ListView.showContentFileInEditor(currentProject, editor);
	   

      /******MYTEST*****/
	editor.on("change", function (e) {
                //ideally one should use information from ace to set the dirty mark on the document
                //e.g editor.getSession().getUndoManager().hasUndo();
		if( modifiedUser)
		{
		    return;
		}
		pvsWriter.userModification(e, editor);
            });
       modifiedUser = 1;
       pvsWriter.newPVSSpecification("myTheory",editor);
       /*pvsWriter.addState(myState[0],editor);
       pvsWriter.addTransition("E_RequestToStart", 1, editor);
       pvsWriter.addConditionInTransition(1, myState[0], myState[1],editor); 
       pvsWriter.addConditionInTransition(1, myState[0], myState[1],editor); 
       pvsWriter.addEntryCondition(1, "current_state = Checking",editor);
       pvsWriter.addEntryCondition(1, "current_state = s1", editor, "OR");
       pvsWriter.setInitialState("S1", editor);*/
       //pvsWriter.addTransition("E_RequestToStart", 1, editor);
       modifiedUser = 0;
	
    });

    
    /// When user clicks on open_file button #open_file, a form is showed 
    d3.select("#open_file").on("click", function () {
	
	ListView.open_file_form(currentProject, editor, ws); //Define in: /public/pvsioweb/app/formal/pvs/prototypebuilder/ListView.js
        ListView.showContentFileInEditor(currentProject, editor);
    });
	
    /// User wants to rename a file 
    d3.select("#rename_file").on("click", function () {
        ListView.renameFileProject(currentProject, editor, ws);
    });
   
   /// User wants to split the screen 
    d3.select("#splitView").on("click", function () {
	
        document.getElementById("sourcecode-editor-wrapper").style.visibility = 'visible';
	document.getElementById("editor").style.top = "900px";	
	document.getElementById("specification_log_Container").style.visibility = 'hidden';
        document.getElementById("ContainerStateMachine").style.weight = '400px';
	
    });

    /// User wants to close a file (it will be not shown in file list box on the right ) 
    d3.select("#close_file").on("click", function () {
	
        ListView.closeFile(currentProject, editor, ws );
	
    });

    /// User wants to see all files of the project 
    d3.select("#show_all_files").on("click", function () {
	
        ListView.showAllFiles(currentProject, editor, ws );
	
    });

    /// User wants to delete a file from the project  
    d3.select("#delete_file").on("click", function () {
	
        ListView.deleteFile(currentProject, editor, ws );
        
	
    });
	
   /* d3.select("#infoBoxModifiable").on("change", function () {
	
	stateMachine.changeTextArea();
	 
    });*/

    document.getElementById("startEmulink").disabled = false;
    /// User wants to start emulink 
    d3.select("#startEmulink").on("click", function () {
	
	  stateMachine.init(editor);
//	  this.style.visibility = 'hidden';  	
//          document.getElementById('state_machine_toolbar_menu').style.top = '600px';
    });    
	
    
    /*********************************************************************************************/
	preparePageForImageUpload();
    prepareListBoxForFileDrag(); 
    updateProjectName(default_project_name);
});
