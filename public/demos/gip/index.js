/**
 * Interactive prototype builder for PVSio based on the html map attribute
 * @author Patrick Oladimeji
 * @date Dec 3, 2012 : 4:42:55 PM
 */
require.config({baseUrl:'app',
	paths:{
		"ace":"../lib/ace",
		"d3":"../lib/d3",
		"pvsioweb":"formal/pvs/prototypebuilder"
	}
});

require(['websockets/pvs/pvsiowebsocket','pvsioweb/displayManager',
         'pvsioweb/createOverlay',
         'pvsioweb/editOverlay','pvsioweb/gip', 
         'ace/ace','pvsioweb/widgetMaps', 'util/shuffle', 
         'pvsioweb/widgetEditor','pvsioweb/widgetEvents',
         'pvsioweb/buttonWidget','pvsioweb/displayWidget',
         'pvsioweb/displayMappings',"pvsioweb/forms/newProject",
         "pvsioweb/forms/events","pvsioweb/forms/openProject",'d3/d3'], 
	function(pvsws, displayManager, overlayCreator, editOverlay, gip,
			ace, widgetMaps, shuffle, widgetEditor, widgetEvents, 
			buttonWidget, displayWidget, displayMappings,newProjectForm, 
			formEvents, openProjectForm){
	var currentProject = {}, sourceCodeChanged = false;
	var editor = ace.edit("editor");
	editor.getSession().setMode('ace/mode/text');
	editor.gotoLine(1);
	
	//hide the main body
	d3.select("div#body").style("display", "none");
	/**
	 * utitlity function to pretty print pvsio output
	 */
	function prettyPrint(msg){
		return msg ? msg.toString().replace(/,,/g, ",") : msg;
	}
	/**
	 * create pvs websocket connection
	 * add listeners for pvs process events
	 */
	var ws = pvsws()
		.addListener('ConnectionOpened', function(e){
			log("connection to pvsio server established");
		}).addListener("ConnectionClosed", function(e){
			log("connection to pvsio server closed");
		}).addListener("ServerReady", function(e){
			log("pvsio process ready");
			//call get source code
			ws.getSourceCode();
		}).addListener("OutputUpdated", function(e){
			var response = prettyPrint(e.data), tmp;
			console.log(response);
			pvsio_response_log(response);
			displayManager.updateDisplay(response);
		}).addListener("InputUpdated", function(e){
			pvsio_commands_log(JSON.stringify(e.data));
		}).addListener("SourceCodeReceived", function(e){
			updateSourceCode(e.data);
		}).addListener("SourceCodeSaved", function(e){
			//need to restart the process with the correct filename
			this.startPVSProcess(e.data.fileName);
		}).addListener("ProcessExited", function(e){
			console.log("Server process exited -- server message was ...");
			console.log(e);
			log(JSON.stringify(e));
		}).logon();
	
	/**
	 * log the message
	 */
	function log(msg){
		console.log(msg);
		d3.select("#console").insert('p','p').html(msg);
	}

	/**
	 * add event listener for getting sourcecode
	 */
	d3.select("#btnGetSpecification").on("click", function(){
		ws.getSourceCode();
	});
	/**
	 * Add event listener for deleting a created mark
	 */
	d3.select("body").on("keydown", function(){
		if(d3.event.which === 46){
			d3.event.preventDefault();
			d3.selectAll(".mark.selected")
				.each(function(d){
					widgetMaps[d3.select(this).attr("id")].remove();
				});
		}
	});
	
	function saveSourceCode(){
		if(sourceCodeChanged){
			ws.saveSourceCode({filename:currentProject.spec, fileContent:editor.getValue()});
			sourceCodeChanged = false;
		}
	}
	/**
	 * Add event listener for toggling the prototyping layer and the interaction layer
	 */
	d3.select("#btnBuilderView").classed("selected", true).on("click", function(){
		d3.select("img").style("z-index", -2);
		d3.selectAll("#controlsContainer button").classed("selected", false);
		d3.select(this).classed('selected', true);
	});
	
	d3.select("#btnSimulatorView").on("click", function(){
		d3.select("img").style("z-index", 2);
		d3.selectAll("#controlsContainer button").classed("selected", false);
		d3.select(this).classed('selected', true);
	});
	
	d3.select("#saveProject").on("click", function(){
		saveWidgetDefinition();
		saveSourceCode();
	});
	
	d3.select("#openProject").on("click", function(){
		openProject();
	});
	
	d3.select("#newProject").on("click", function(){
		newProjectForm.create().addListener(formEvents.FormCancelled, function(e){
			console.log(e);
			e.form.remove();
		}).addListener(formEvents.FormSubmitted, function(e){
			console.log(e);
			e.form.remove();
			newProject(e.formData);
		})
	});
	
	d3.select("#btnTypeCheck").on("click", function(){
		var btn = d3.select(this).html("Typechecking ...").attr("disabled", true);
		if(currentProject && currentProject.projectPath){
			var fd = new FormData(), file = currentProject.specFullPath;
			fd.append("file", file);
			d3.xhr("/typecheck").post(fd, function(err, res){
				btn.html("Typecheck").attr("disabled", null);
				if(err){
					console.log(err);
				}else{
					res = JSON.parse(res.responseText);
					console.log(res);
					alert(res.stdout);
				}
			});
		}
	});
	
	//create mouse actions for draging areas on top of the image
	var img = d3.select("#imageDiv img");
	var image = d3.select("#prototypeImage");
	var rect, drawing = false, moved = false;
	image.on('mousedown', function(){
		d3.event.stopPropagation();
		d3.event.preventDefault();
		drawing = true;
		rect = overlayCreator.createDiv(image);
	}).on("mouseup", function(){
		//add the area for the drawn rectangle into the map element
		if(moved){
			handleWidgetEdit(rect);
			//add double click event listener to mark and 
			//set the font-size of the mark to be 80% of the height
			rect.on('dblclick', function(){
				handleWidgetEdit(d3.select(this));
			}).style('font-size', (0.8 * parseFloat(rect.style('height'))) + "px");
		}
		else
			rect.remove();
		//rect finished drawing
		drawing = moved = false;
	}).on('mousemove', function(){
		if(drawing){
			var pad = 10, x = d3.event.pageX - img.node().x, y = d3.event.pageY - img.node().y;
			moved = true;
			d3.event.preventDefault();
			var starty = parseFloat(rect.attr("starty")),
				startx = parseFloat(rect.attr("startx")),
				h = Math.abs(starty - y),
				w = Math.abs(startx - x);
			//if the current y is less than the start y, then top style should be height - current top style
			if(y < starty )
				rect.style('top', (starty - h) + "px");
			else 
				rect.style('top', starty + "px");
			//if the current x is less than the startx then left style should be width - current left style
			if(x < startx)
				rect.style("left", (startx - w) + "px");
			else
				rect.style("left", startx + "px");
			//update width and height of marker
			rect.style("height", (h - pad) + "px").style("width", (w - pad) + "px");
		}
	});
	
	function handleWidgetEdit(mark){
		widgetEditor.create(mark)
			.addListener(widgetEvents.WidgetSaved,  function(e){
				e.mark.attr("id", e.widget.id());
				e.formContainer.remove();
				console.log(e);
				overlayCreator.createInteractiveImageArea(e.mark, widgetMaps[e.widget.id()], ws);
		
				//update the regex for this mark if its a display widget and give it a display class
				if(e.widget.type() === "Display") {
					e.mark.classed("display",  true);
					displayMappings.active[e.widget.id()] = {regex:e.widget.regex(), uiElement:e.widget.id()};
				}
			}).addListener(widgetEvents.WidgetDeleted, function(e){
				if(e.widget.type() === "Display"){
					delete displayMappings.active[e.widget.id()];
				}
				e.mark.attr("id", e.widget.id());
				e.formContainer.remove();
				console.log(e);
				e.widget.remove();
				
			});
	}
	resizeImageDiv();
	
	function resizeImageDiv(){
		var img = d3.select('#imageDiv img');
		image.style("height", img.property("height") + "px")
			.style("width", img.property("width") + "px");
		d3.select("#imageDiv").style("width",  img.property("width"));
		d3.select("#console").style("left", img.property('width') + 20)
			.style("height", img.property('height') - 17).style("width", 1130 - img.property("width") - 55);
	}
		
	/***
	 * ##### dealing with logging input and output of pvs
	 */
	function console_log(msg){
		console.log(msg);
		var c = document.getElementById('console_log');
		c.innerHTML = msg + "<br>" + c.innerHTML;
	}

	function pvsio_commands_log(msg){
		console.log(msg);
		var c = document.getElementById('pvsio_commands_log');
		c.innerHTML = msg + "<br>" + c.innerHTML;
	}

	function pvsio_response_log(msg){
		console.log(msg);
		var c = document.getElementById('pvsio_response_log');
		c.innerHTML = msg + "<br>" + c.innerHTML;
	}

	function specification_log(msg){
		console.log(msg);
		var c = document.getElementById('specification_log');
		c.innerHTML = msg + "<br>" + c.innerHTML;
	}
	
	preparePageForImageUpload();
	
	function preparePageForImageUpload(){
		//add listener for  upload button
		d3.select("#btnUpload").on("click", function(){
			d3.select("#btnSelectPicture").node().click();
		});
		d3.select("#btnSelectPicture").on("change", function(){
			uploadFiles(d3.event.currentTarget.files);
		});
		
		var c = document.getElementById("imageDiv");
		c.ondragover = function(){
			d3.select(c).style("border", "3px dashed black");
			return false;
		};
		c.ondragend = function(e){
			d3.select(c).style("border", null);
			e.preventDefault();
			e.stopPropagation();
			return false;
		};
		c.ondrop =  function(e){
			d3.select(c).style("border", null);
			var files = e.dataTransfer.files;
			console.log(files);
			uploadFiles(files);
			e.preventDefault();
			e.stopPropagation();
			return false;
		};
		
		
		function uploadFiles(files){
			if(files.length > 0){
				var fd = new FormData();
				for(var i=0; i< files.length; i++){
					fd.append("file", files[i]);
				}
				var xhr = d3.xhr("/changeimage", 'application/json');
				xhr.post(fd)
					.on('progress', function(e){
						console.log(e);
					}).on('load', function( res){
						console.log(res);
						var imagepath = "../../uploads/" + JSON.parse(res.responseText).filename;
						updateImage(imagepath);
					});
			}
		}
	}
	
	function updateImage(imagepath){
		d3.select("#imageDiv img").attr("src", imagepath );
		d3.select("#prototypeImage")
			.style("background-image", "url(" + imagepath + ")");
		setTimeout(resizeImageDiv, 200)
	}
	
	function updateSourceCode(src){
		sourceCodeChanged = false;
		editor.setValue(src);
		editor.clearSelection();
		editor.gotoLine(1);
		editor.on("change", function(e){
			sourceCodeChanged = true;
		});
		editor.gotoLine(1);
	}
	
	function newProject(fd){
		fd = fd || new FormData();
		d3.xhr("/saveProject").post(fd).on("load", function(res){
			//update the picture adn the pvs source file and trigger a restart of the pvsioprocess
			res = JSON.parse(res.responseText);
			console.log(res);
			if(!res.error) {
				currentProject = res;
				d3.select("div#body").style("display", null);
				ws.startPVSProcess(res.spec.split(".pvs")[0], res.projectPath);
				var imagePath = "../../projects/" + res.name + "/" + res.image;
				updateImage(imagePath);
			}
		});
	}
	
	function saveWidgetDefinition(){
		var safe = {};
		safe.widgetMaps = widgetsToJSON(widgetMaps);
		safe.regionDefs = getRegionDefs();
		//save to the user's drive
		var safeStr = JSON.stringify(safe, null, " ");
		var fd = new FormData();
		fd.append("filename", currentProject.projectPath  + "/widgetDefinition.json");
		fd.append("filecontent", safeStr);
		
		d3.xhr("/saveWidgetDefinition").post(fd).on("load", function(res){
			res = JSON.parse(res.responseText);
			console.log(res);
		});
		
		function widgetsToJSON(map){
			var res = {}, k;
			for(k in map){
				res[k] = map[k].toJSON();
			}
			return res;
		}
	}
	
	function getRegionDefs(){
		var regionDefs = [];
		d3.selectAll("#prototypeMap area").each(function(){
			var region = {}, a = d3.select(this);
			region.class = a.attr("class");
			region.shape = a.attr("shape");
			region.coords = a.attr("coords");
			region.href = a.attr("href");
			regionDefs.push(region);
		});
		return regionDefs;
	}
	
	function openProject(){
		d3.xhr("/openProject").post(function(err, res){
			if(err)
				console.log(err);
			else{
				var selectedData;
				res = JSON.parse(res.responseText);
				console.log(res);
				res.unshift({name:"--None--"});
				openProjectForm.create(res, function(d){
					return d.name;
				}).addListener(formEvents.FormSubmitted, function(e){
					var project = "../../projects/" + currentProject.name + "/";
					console.log(e);
					console.log(currentProject);
					//only update the image and pvsfile if a real project was selected
					if(currentProject.name !== "--None--"){
						d3.select("div#body").style("display", null);
						updateImage(project + currentProject.image);
						ws.startPVSProcess(currentProject.spec.split(".")[0], currentProject.projectPath);
						loadWidgetDefinitions(currentProject.widgetDefinition);
					}
					
					e.form.remove();
				}).addListener(formEvents.FormCancelled, function(e){
					e.form.remove();
				}).addListener(formEvents.FormDataChanged, function(e){
					console.log(e);
					currentProject = e.data;
				});
			}
		});
	}
	
	function loadWidgetDefinitions(defs){
		console.log(defs);
		var key, w, widget;
		for(key in defs.widgetMaps){
			w = defs.widgetMaps[key];
			widget = w.type === "Button" ? buttonWidget() : displayWidget();
			widget.id(key);
			for(property in w)
				widget[property](w[property]);
			
			widgetMaps[key] = widget;
		}
		//create div
		defs.regionDefs.forEach(function(d){
			widget = widgetMaps[d.class];
			var coords = d.coords.split(",");
			var mark  = overlayCreator.createDiv(image, coords[0], coords[1])
				.style("height", coords[3] - coords[1]).style("width", coords[2] - coords[0]);
			overlayCreator.createInteractiveImageArea(mark, widget, ws);
			//set the font-size of the mark to be 80% of the height and the id of the mark
			mark.on("dblclick", function(){
				handleWidgetEdit(d3.select(this));
			}).style('font-size', (0.8 * parseFloat(mark.style('height'))) + "px")
			.attr("id", widget.id());
			
			if(widget.type() === "Display") {
				mark.classed("display",  true);
				displayMappings.active[widget.id()] = {regex:widget.regex(), uiElement:widget.id()};
			}
		});
	}
});