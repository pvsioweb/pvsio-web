/**
 * Main entry point for pvsioweb module
 * @author Patrick Oladimeji
 * @date 4/19/13 17:23:31 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, $, brackets, _, window, MouseEvent, FormData, document, setTimeout, clearInterval */
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
        WebPageFileReader       = require("util/WebPageFileReader");
    
    var currentProject = {}, sourceCodeChanged = false, ws;
	var tempImageName, tempSpecName, specFileName, specNameRegex = /(\w+)\s*:\s*THEORY\s+BEGIN/i;
	var editor = ace.edit("editor");
	editor.getSession().setMode('ace/mode/text');
	
	editor.on("change", function (e) {
		sourceCodeChanged = true;
		var toplines = editor.getSession().getLines(0, Math.min(4, editor.getSession().getLength())).join("");
		var matches = toplines.match(specNameRegex);
		if (matches && matches.length > 1) {
			specFileName = matches[1];
			d3.select("#txtSpecFileName").property("value", specFileName);
		}
	});
    
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
    
    function updateSourceCode(src) {
		sourceCodeChanged = false;
		editor.setValue(src);
		editor.clearSelection();
		editor.gotoLine(1);
		editor.moveCursorTo(0, 0);
		editor.scrollToLine(0, false, false, function () {});
	}
	
	 
    function pvsProcessReady(err, e) {
        if (!err) {
            console.log("pvsio process ready");
            //call get source code for the main pvs file and list all the other files in a side bar
            var mainPVSFile = currentProject.projectPath + "/" + currentProject.mainPVSFile;
            ws.getFile(mainPVSFile, function (err, res) {
                if (!err) {
                    updateSourceCode(res.fileContent);
                }
            });
            ///TODO: 
            //list all other files
            
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
    
    function getRegionDefs() {
		var regionDefs = [];
		d3.selectAll("#prototypeMap area").each(function () {
			var region = {}, a = d3.select(this);
			region.class = a.attr("class");
			region.shape = a.attr("shape");
			region.coords = a.attr("coords");
			region.href = a.attr("href");
			regionDefs.push(region);
		});
		return regionDefs;
	}
    
	function saveWidgetDefinition(project) {
		var safe = {widgetMaps: widgetMaps.toJSON(), regionDefs: getRegionDefs()};
		//save to the user's drive
		var safeStr = JSON.stringify(safe, null, " ");
		var data  = {"fileName": project.projectPath + "/widgetDefinition.json", fileContent: safeStr};
		ws.writeFile(data, function (res) {
            if (res.type === "fileSaved") {
                console.log(res);
            } else {
                //handle error  
                console.log(res);
            }
        });
	}
	
	function updateImage(imagepath) {
		d3.select("#imageDiv img").attr("src", imagepath);
		d3.select("#prototypeImage")
			.style("background-image", "url(" + imagepath + ")");
		setTimeout(resizeImageDiv, 500);
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
                projects.unshift({name: ""});
                openProjectForm.create(projects, function (d) {
                    return d.name;
                }).addListener(formEvents.FormSubmitted, function (e) {
                    var project = "../../projects/" + currentProject.name + "/";
                    console.log(e);
                    console.log(currentProject);
                    //only update the image and pvsfile if a real project was selected
                    if (currentProject.name !== "") {
                        d3.select("div#body").style("display", null);
                        updateImage(project + currentProject.image);
                        ws.lastState("init(0)");
                        ws.startPVSProcess(currentProject.mainPVSFile, currentProject.name,
                                          pvsProcessReady);
                        loadWidgetDefinitions(currentProject.widgetDefinition);
                        updateProjectName(currentProject.name);
                        d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
                    }
                    e.form.remove();
                }).addListener(formEvents.FormCancelled, function (e) {
                    e.form.remove();
                }).addListener(formEvents.FormDataChanged, function (e) {
                    console.log(e);
                    currentProject = e.data;
                    document.title = "PVSio-Web -- " + currentProject.name;
                });
            }
        });
	}
	
    function uploadFile(file, cb) {
        if (file) {
            var fd = new FormData();
            fd.append("file", file);
            var xhr = d3.xhr("/upload");
            xhr.post(fd)
                .on('progress', function (e) {
                    console.log(e);
                }).on('load', cb);
        }
    }
    
	function preparePageForImageUpload() {
		var imageExts = ["png", "jpg", "jpeg"];
        
		//add listener for  upload button
		d3.selectAll("#btnLoadPicture").on("click", function () {
			d3.select("#btnSelectPicture").node().click();
		});
        
        function onInterfaceImageUploaded(res) {
            res = JSON.parse(res.responseText);
            tempImageName =  res.fileName;
            var imagepath = "../../uploads/" + res.fileName;
            updateImage(imagepath);
            //hide the draganddrop stuff
            d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
        }
		
        d3.select("#btnSelectPicture").on("change", function () {
			var file = d3.event.currentTarget.files[0];
			if (file && imageExts.indexOf(file.name.split(".").slice(-1).join("").toLowerCase()) > -1) {
				uploadFile(file, onInterfaceImageUploaded);
			}
		});
		
		d3.select("#btnLoadSpec").on("click", function () {
			d3.select("#btnSelectSpec").node().click();
		});
		
		d3.select("#btnSelectSpec").on("change", function () {
			//check if file is valid pvs file
			var file = d3.event.currentTarget.files[0];
            
			if (file && file.name.split(".").slice(-1).join("").toLowerCase() === "pvs") {
                var fr = WebPageFileReader.FileReader()
                    .onLoad(function (e) {
                        updateSourceCode(e.target.result);
                        tempSpecName = file.name;
                    }).readAsText(file);
                
				uploadFile(file, function (res) {
					res = JSON.parse(res.responseText);
					tempSpecName =  res.fileName;
					//load spec into workspace via json xhr req
					d3.text("../../uploads/" + res.fileName, function (err, res) {
						console.log(res);
						//hide drag and drop stuff
						d3.select("#specDragAndDrop.dndcontainer").style("display", "none");
					});
				});
			} else {
				console.log("only files with .pvs extension are allowed");
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
			console.log(file);
			uploadFile(file, onInterfaceImageUploaded);
			e.preventDefault();
			e.stopPropagation();
			return false;
		};
	}
	
    /**
     * spec has .prototypeImage, .pvsSpec, .projectName
     */
	function newProject(spec) {
        //first upload the files for pictures and pvs source
        uploadFile(spec.prototypeImage, function (res) {
            var uploadedImageFile = JSON.parse(res.responseText).fileName;
            uploadFile(spec.pvsSpec, function (res) {
                var uploadedSpecFile = JSON.parse(res.responseText).fileName;
                //call websocket to create new project
                ws.send({
                    type: "createProject",
                    uploadedSpecFileName: uploadedSpecFile,
                    clientSpecFileName: spec.pvsSpec.name,
                    projectName: spec.projectName,
                    uploadedImageFileName: uploadedImageFile,
                    clientImageFileName: spec.prototypeImage.name
                }, function (err, res) {
                    if (!err) {
                        currentProject = res;
                        d3.select("div#body").style("display", null);
                        ws.startPVSProcess(res.spec.split(".pvs")[0], currentProject.name,
                                          pvsProcessReady);
                        var imagePath = "../../projects/" + currentProject.name + "/" +
                            currentProject.image;
                        updateImage(imagePath);
                        updateProjectName(currentProject.name);
                        d3.select("#imageDragAndDrop.dndcontainer").style("display", "none");
                    }
                });
            });
        });
	}
    
    function handleSourceCodeSaved(err, e) {
        //if we are having multiple files then need to think about when a restart is needed
        //maybe not even need to restart at all -- but leave the option to user to manually restart process...
        console.log(err || e);
    }
    
    function saveSourceCode(project) {
		if (sourceCodeChanged) {
			ws.writeFile({fileName: project.projectPath + "/" + project.spec, fileContent: editor.getValue()},
                        handleSourceCodeSaved);
			sourceCodeChanged = false;
		}
	}
        
	function saveProject(project) {
		var imageName, pvsSpecName, fd;
		if (project.name && project.name.trim().length > 0) {
			//porject has already been created so save the widgets and the sourcecode if it has changed
			saveWidgetDefinition(project);
			saveSourceCode(project);
		} else {
			//prompt for a project name (this means they have not yet created a project)
			project.name = prompt("Enter a project name");
			if (project.name && project.name.trim().length > 0) {
				//save the picture
				imageName = "image." + tempImageName.split(".").slice(-1);
                fd = {"type": "saveTempFile", "oldFileName": tempImageName, "newFileName": imageName};
                ws.send(fd, function (err, res) {
                    if (!err) {
                        pvsSpecName = d3.select("#txtSpecFileName").property("value") + ".pvs";
                        delete fd.oldFileName;
                        fd.newFileName = pvsSpecName;
                        fd.fileContent = editor.getValue();
                        ws.send(fd, function (err, res) {
                            if (!err) {
                                fd = { "type": "createProject",  "projectName": project.name, "pvsSpecName": pvsSpecName};
                                ws.send(fd, function (err, res) {
                                    if (!err) {
                                        //save the widgets defined if any
                                        saveWidgetDefinition(project);
                                        ///TODO maybe do a callback for changes to current project (res object should be current project)
                                        project.image = imageName;
                                        project.spec = pvsSpecName;
                                        updateProjectName(project.name);
                                        //start the pvsio process
                                        ws.startPVSProcess(project.spec.split(".pvs")[0], project.name,
                                                                      pvsProcessReady);
                                    }
                                });
                            }
                        });
                    }
                });
			}
		}
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
    
    
    
	updateSourceCode("ui_th: THEORY BEGIN \r\n \r\nEND ui_th");
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
		saveProject(currentProject);
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
		var btn = d3.select(this).html("Typechecking ...").attr("disabled", true);
		if (currentProject && currentProject.specFullPath) {
            ws.send({type: "typeCheck", filePath: currentProject.specFullPath}, function (res) {
                btn.html("Typecheck").attr("disabled", null);
                console.log(res);
                alert(res.stdout);
            });
		}
	});
    
	resizeImageDiv();
	preparePageForImageUpload();
});
