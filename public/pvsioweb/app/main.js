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
        displayManager          = require("pvsioweb/displayManager"),
        overlayCreator          = require("pvsioweb/createOverlay"),
        ace                     = require("ace/ace"),
        widgetMaps              = require("pvsioweb/widgetMaps"),
        shuffle                 = require("util/shuffle"),
        widgetEditor            = require("pvsioweb/widgetEditor"),
        widgetEvents            = require("pvsioweb/widgetEvents"),
        buttonWidget            = require("pvsioweb/buttonWidget"),
        displayWidget           = require("pvsioweb/displayWidget"),
        displayMappings         = require("pvsioweb/displayMappings"),
        newProjectForm          = require("pvsioweb/forms/newProject"),
        formEvents              = require("pvsioweb/forms/events"),
        openProjectForm         = require("pvsioweb/forms/openProject"),
        saveProjectAs           = require("pvsioweb/forms/saveProjectAs"),
        ListView                = require("pvsioweb/ListView"),
        Project                 = require("formal/pvs/Project").Project,
        d3                      = require("d3/d3"),
        queue                   = require("d3/queue");
    
    var currentProject = new Project(""), ws, pvsFilesListBox, fileContents = {};
	var tempImageName, tempSpecName;
	var editor = ace.edit("editor");
	editor.getSession().setMode('ace/mode/text');
    
    function handleWidgetEdit(mark) {
		widgetEditor.create(mark)
			.addListener(widgetEvents.WidgetSaved,  function (e) {
				e.mark.attr("id", e.widget.id());
				e.formContainer.remove();
				console.log(e);
				overlayCreator.createInteractiveImageArea(e.mark, widgetMaps.get(e.widget.id()), ws);
				//update the regex for this mark if its a display widget and give it a display class
				if (e.widget.type() === "Display") {
					e.mark.classed("display",  true);
					displayMappings.active[e.widget.id()] = {regex: e.widget.regex(), uiElement: e.widget.id()};
				}
			}).addListener(widgetEvents.WidgetDeleted, function (e) {
				if (e.widget.type() === "Display") {
					delete displayMappings.active[e.widget.id()];
				}
				e.mark.attr("id", e.widget.id());
				e.formContainer.remove();
				console.log(e);
				e.widget.remove();
				
			});
	}
    
    //create mouse actions for draging areas on top of the image
	var img = d3.select("#imageDiv img");
	var image = d3.select("#prototypeImage");
	var rect, drawing = false, moved = false;
	image.on('mousedown', function () {
		d3.event.stopPropagation();
		d3.event.preventDefault();
		drawing = true;
		rect = overlayCreator.createDiv(image);
	}).on("mouseup", function () {
		//add the area for the drawn rectangle into the map element
		if (moved) {
			handleWidgetEdit(rect);
			//add double click event listener to mark and 
			//set the font-size of the mark to be 80% of the height
			rect.on('dblclick', function () {
				handleWidgetEdit(d3.select(this));
			}).style('font-size', (0.8 * parseFloat(rect.style('height'))) + "px");
		} else {
            rect.remove();
        }
		//rect finished drawing
		drawing = moved = false;
	}).on('mousemove', function () {
		if (drawing) {
			var bound = this.getBoundingClientRect();
			var pad = 10, x = d3.event.clientX - bound.left - this.clientLeft + this.scrollLeft,
                y = d3.event.clientY - bound.top - this.clientTop - this.scrollTop;
			moved = true;
			d3.event.preventDefault();
			var starty = parseFloat(rect.attr("starty")),
				startx = parseFloat(rect.attr("startx")),
				h = Math.abs(starty - y),
				w = Math.abs(startx - x);
			//if the current y is less than the start y, then top style should be height - current top style
			if (y < starty) {
                rect.style('top', (starty - h) + "px");
            } else {
                rect.style('top', starty + "px");
            }
				
			//if the current x is less than the startx then left style should be width - current left style
			if (x < startx) {
                rect.style("left", (startx - w) + "px");
            } else {
				rect.style("left", startx + "px");
            }
			//update width and height of marker
			rect.style("height", (h - pad) + "px").style("width", (w - pad) + "px");
            console.log({x: x, y: y});
		}
	});
	
	
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
        pvsFilesListBox = new ListView("#pvsFiles", files, listLabelFunction, classFunc);
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
            updateSourceCodeToolbarButtons(pvsFile);
        });
    }
	 
    function pvsProcessReady(err, e) {
        if (!err) {
            console.log("pvsio process ready");
            
        } else {
            console.log(err);
        }
    }
    
	function updateProjectName(name) {
		document.title = "PVSio-Web -- " + name;
		d3.select("#header #txtProjectName").property("value", name);
	}
	
    function resizeImageDiv() {
		var img = d3.select('#imageDiv img');
		image.style("height", img.property("height") + "px")
			.style("width", img.property("width") + "px");
		d3.select("#imageDiv").style("width",  img.property("width"));
		d3.select("#console").style("left", img.property('width') + 20)
			.style("height", img.property('height') - 17).style("width", 1130 - img.property("width") - 55);
	}
    
	function updateImage(imageData) {
		d3.select("#imageDiv img").attr("src", imageData);
		setTimeout(resizeImageDiv, 500);
        //hide the draganddrop stuff
        d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
	}
	
    function loadWidgetDefinitions(defs) {
		//clear old widhget maps and area def
		widgetMaps.clear();
		d3.selectAll("#prototypeImage .mark, #prototypeMap area").remove();
		
		if (defs) {
			console.log(defs);
			var key, w, widget, property;
            _.each(defs.widgetMaps, function (w, key) {
                widget = w.type === "Button" ? buttonWidget() : displayWidget();
				widget.id(key);
                _.each(w, function (value, property) {
                    widget[property](w[property]);
                });
				widgetMaps.add(widget);
            });
			
			//create div
			defs.regionDefs.forEach(function (d) {
				widget = widgetMaps.get(d.class);
				var coords = d.coords.split(",").map(function (d) {
					return parseFloat(d);
				});
				var h = coords[3] - coords[1], w = coords[2] - coords[0];
				var mark  = overlayCreator.createDiv(image, coords[0], coords[1])
					.style("height", h + "px").style("width", w + "px");
				overlayCreator.createInteractiveImageArea(mark, widget, ws);
				//set the font-size of the mark to be 80% of the height and the id of the mark
				mark.on("dblclick", function () {
					handleWidgetEdit(d3.select(this));
				}).style('font-size', (0.8 * parseFloat(mark.style('height'))) + "px")
				    .attr("id", widget.id());
				
				if (widget.type() === "Display") {
					mark.classed("display",  true);
					displayMappings.active[widget.id()] = {regex: widget.regex(), uiElement: widget.id()};
				}
			});
		}
	}
    
	function openProject() {
        ws.send({type: "listProjects"}, function (err, res) {
            if (!err) {
                var projects = res.projects;
                projects.unshift("");
                openProjectForm.create(projects, function (d) {
                    return d;
                }).addListener(formEvents.FormSubmitted, function (e) {
                    //open selected project
                    Project.open(e.formJSON.projectName, function (project) {
                        currentProject = project;
                        console.log(currentProject);
                        //only update the image and pvsfile if a real project was selected
                        if (currentProject.name() !== "") {
                            d3.select("div#body").style("display", null);
                            editor.removeAllListeners("change");
                            editor.setValue("");
                            if (currentProject.image()) {
                                updateImage(currentProject.image().content());
                            }
                            //list all other files
                            if (currentProject.pvsFiles()) {
                                renderSourceFileList(currentProject.pvsFiles());
                            }
                            loadWidgetDefinitions(currentProject.widgetDefinitions());
                            updateProjectName(currentProject.name());
                            d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
                            
                            //try to start process on server
                            ws.lastState("init(0)");
                            ws.startPVSProcess(currentProject.mainPVSFile().name(), currentProject.name(),
                                              pvsProcessReady);
                        }
                        //remove the dialog
                        e.form.remove();
                    });
                }).addListener(formEvents.FormCancelled, function (e) {
                    e.form.remove();
                }).addListener(formEvents.FormDataChanged, function (e) {
                    console.log(e);
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
    /**
     * data has .prototypeImage, .pvsSpec, .projectName
     */
	function newProject(data) {
        //update the current project with info from data and saveNew
        currentProject.name(data.projectName);
        var q = queue(), i;
        q.defer(function (cb) {
            var fr = new FileReader();
            fr.onload = function (event) {
                currentProject.changeImage(data.prototypeImage[0].name, event.target.result);
                cb();
            };
            fr.readAsDataURL(data.prototypeImage[0]);
        });
        
        function createFileLoadFunction(file) {
            return function (cb) {
                var fr = new FileReader();
                fr.onload = function (event) {
                    currentProject.addSpecFile(file.name, event.target.result);
                    cb();
                };
                fr.readAsText(file);
            };
        }
                
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
		}).addListener("ConnectionClosed", function (e) {
			log("connection to pvsio server closed");
		}).addListener("pvsoutput", function (e) {
            console.log(e);
			var response = prettyPrint(e.data), tmp;
            ws.lastState(e.data);
            ws.value(parseState(e.data).display);
			console.log(response);
			pvsio_response_log(response);
			displayManager.updateDisplay(response);
		}).addListener("InputUpdated", function (e) {
			pvsio_commands_log(JSON.stringify(e.data));
		}).addListener("processExited", function (e) {
            var msg = "Warning!!!\r\nServer process exited. See console for details.";
			console.log("Server process exited -- server message was ...");
			console.log(e);
			log(JSON.stringify(e));
		}).logon();
    
    
    
	//updateSourceCode("ui_th: THEORY BEGIN \r\n \r\nEND ui_th");
	d3.select("#header #txtProjectName").property("value", "");
	
	/**
	 * Add event listener for deleting a created mark
	 */
	d3.select("body").on("keydown", function () {
		if (d3.event.which === 46) {
			d3.event.preventDefault();
			d3.selectAll(".mark.selected")
				.each(function (d) {
					widgetMaps.get(d3.select(this).attr("id")).remove();
				});
		}
	});
	
	/**
	 * Add event listener for toggling the prototyping layer and the interaction layer
	 */
	d3.select("#btnBuilderView").classed("selected", true).on("click", function () {
		d3.select("img").style("z-index", -2);
		d3.selectAll("#controlsContainer button, div.display").classed("selected", false);
		d3.select(this).classed('selected', true);
        d3.select("div.display,#controlsContainer button").classed("builder", true);
        d3.select("div.display,#controlsContainer button").classed("simulator", false);
	});
	
	d3.select("#btnSimulatorView").on("click", function () {
		d3.select("img").style("z-index", 2);
		d3.selectAll("#controlsContainer button, div.display").classed("selected", false);
		d3.select(this).classed('selected', true);
        d3.select("div.display,#controlsContainer button").classed("simulator", true);
        d3.select("div.display,#controlsContainer button").classed("builder", false);
	});
	
	d3.select("#saveProject").on("click", function () {
        /**
            saves a project including image, widget definitions and pvsfiles
        */
        function _doSave() {
            currentProject.save(function (err, res) {
                console.log({err: err, res: res});
                //update status of the pvsfiles -- first select the spec files still dirty-- and match those with the 
                //response from the call to saveProject
                if (currentProject.pvsFiles()) {
                    var pvsFiles = currentProject.pvsFiles().filter(function (f) {
                        return f.dirty();
                    });
                    res[1].forEach(function (response, index) {
                        if (response.type === "fileSaved") {
                            pvsFiles[index].dirty(false);
                        }
                    });
                    pvsFilesListBox.updateView();
                    updateSourceCodeToolbarButtons(pvsFilesListBox.selectedItem());
                }
            });
        }
        //prompt for a name if there is no name
        ///TODO this section could use a better prompt for requesting project name
        if (currentProject.name().length === 0) {
            var name = prompt("Please enter a name for the project");
            if (name && name.trim().length > 0) {
                currentProject.name(name);
                currentProject.saveNew(function (err, res) {
                    console.log({err: err, res: res});
                    if (!err) {
                        currentProject.pvsFiles().each(function (f) {
                            f.dirty(false);
                            pvsFilesListBox.updateView();
                            updateProjectName(currentProject.name());
                            updateSourceCodeToolbarButtons(pvsFilesListBox.selectedItem());
                        });
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
		newProjectForm.create().addListener(formEvents.FormCancelled, function (e) {
			console.log(e);
			e.form.remove();
		}).addListener(formEvents.FormSubmitted, function (e) {
			console.log(e);
			e.form.remove();
			newProject(e.formJSON);
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
    resizeImageDiv();
	preparePageForImageUpload();
    prepareListBoxForFileDrag();
});
