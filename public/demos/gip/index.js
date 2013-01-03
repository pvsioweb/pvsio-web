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
         'pvsioweb/displayMappings','d3/d3'], 
	function(pvsws, displayManager, overlayCreator, editOverlay, gip,
			ace, widgetMaps, shuffle, widgetEditor, widgetEvents, 
			buttonWidget, displayWidget, displayMappings){
	var alphabet = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(",");
	var editor = ace.edit("editor");
	editor.getSession().setMode('ace/mode/text');
	
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
			this.startPVSProcess('pvscode/' + d3.select("#txtFileName").property("value"));
			//gip.connect();
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
			editor.setValue(e.data);
			editor.clearSelection();
			editor.gotoLine(1);
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
	
	d3.select("#btnSave").on('click', function(){
		ws.saveSourceCode({fileName:'pvscode/' + d3.select("#txtFileName").property('value'), fileContent:editor.getValue()});
	});
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
	d3.select(window).on('resize', function(){
		//adjust the mark position
		d3.selectAll("div.mark").each(function(){
			
		});
	});
	
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
	
	d3.select("#saveWidgetDefinitions").on("click", function(){
		saveWidgetDefinition();
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
			//add double click event listener to mark
			rect.on('dblclick', function(){
				handleWidgetEdit(d3.select(this));
			});
			//set the font-size of the mark to be 80% of the height
			rect.style('font-size', (0.8 * parseFloat(rect.style('height'))) + "px");
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
			if(y < starty ){
				rect.style('top', (starty - h) + "px");
			}else {
				rect.style('top', starty + "px");
			}
			//if the current x is less than the startx then left style should be width - current left style
			if(x < startx){
				rect.style("left", (startx - w) + "px");
			}else{
				rect.style("left", startx + "px");
			}
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
	/**
	 * function called when the details of an overlay has been edited in a form
	 */
	function handleFormDetails(type, name, functionDetails, displayLabel, events){
		widgetMaps[name] = {name:name, type:type, functionText: functionDetails, events:events};
		if(type === "Display")
			widgetMaps[name].displayLabel = displayLabel;
		console.log("Type:%1$s, Name:%2$s, Function: %3$s", type, name, functionDetails);
	}
	
	preparePageForImageUpload();
	
	function preparePageForImageUpload(){
		//add listener for  upload button
		d3.select("#btnUpload").on("click", function(){
			d3.select("#btnSelectPicture").node().click();
		});
		d3.select("#btnSelectPicture").on("change", function(){
			console.log(d3.event.currentTarget.files);
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
						var imagepath = "../../images/" + JSON.parse(res.responseText).filename;
						d3.select("#imageDiv img").attr("src", imagepath );
						d3.select("#prototypeImage")
							.style("background-image", "url(" + imagepath + ")");
						setTimeout(resizeImageDiv, 200)
					});
			}
		}
	}
	
	function saveWidgetDefinition(){
		var safe = {};
		safe.widgetMaps = widgetsToJSON(widgetMaps);
		var regionDefs = [];
		d3.selectAll("#prototypeMap area").each(function(){
			var region = {}, a = d3.select(this);
			region.class = a.attr("class");
			region.shape = a.attr("shape");
			region.coords = a.attr("coords");
			region.href = a.attr("href");
			regionDefs.push(region);
		});
		
		safe.regionDefs = regionDefs;
		//save to the user's drive
		var safeStr = JSON.stringify(safe, null, " ");
		console.log(safeStr);
		var fd = new FormData();
		fd.append("filename", randomFileName() + ".json");
		fd.append("filecontent", safeStr);
		
		d3.xhr("/saveWidgetDefinition").post(fd).on("load", function(res){
			//write the download link to the client
			var diag = d3.select("body").append("div").attr("class", "dialog overlay").
				append("div").attr("class", "downloader center shadow");
			
			diag.append("textarea").text(safeStr);
			diag.append("br");
			diag.append("hr");
			diag.append("a").attr("href", "/widgetDefinitions/" + res.responseText)
				.attr("download", "widget-definition.json")
					.attr("class", "btn left").html("Save to Disk").on("click", function(){
						d3.select("div.dialog.overlay").transition().delay(1000).remove();
					});
			diag.append("button").attr("class", "btn btn-danger right").html("Close Window").on("click", function(){
				d3.select("div.dialog.overlay").remove();
			})
		});
		
		function widgetsToJSON(map){
			var res = {}, k;
			for(k in map){
				res[k] = map[k].toJSON();
			}
			return res;
		}
		
		
	}
	
	function openWidgetDefinition(){
		
		
		function widgetFromJSON(json){
			
		}
	}
	
	function randomFileName(){
		return shuffle(alphabet).slice(-5).join("") + new Date().getTime();
	}
	
});