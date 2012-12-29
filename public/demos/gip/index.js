/**
 * Interactive prototype builder for PVSio based on the html map attribute
 * @author Patrick Oladimeji
 * @date Dec 3, 2012 : 4:42:55 PM
 */
require.config({baseUrl:'app',
	paths:{
		"ace":"../lib/ace",
		"d3":"../lib/d3"
	}
});

require(['websockets/pvs/pvsiowebsocket','formal/pvs/prototypebuilder/displayManager',
         'formal/pvs/prototypebuilder/createOverlay',
         'formal/pvs/prototypebuilder/editOverlay','formal/pvs/prototypebuilder/gip', 
         'ace/ace','formal/pvs/prototypebuilder/widgetMaps','d3/d3'], 
	function(pvsws, displayManager, createOverlay, editOverlay, gip, ace, widgetMaps){
	var editor = ace.edit("editor");
	editor.getSession().setMode('ace/mode/text');
	
	var isOnRegex = new RegExp("is_on := [0-9\/.]+"), isOn, gipTick, tickPeriod = 1000;
	var ctrlCmdRegex = new RegExp("ctrl_cmd := [0-9A-Za-z]+"), ctrlCmd;
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
					d3.select("area." + d3.select(this).attr("id")).remove();
					d3.select(this).remove();
				});
		}
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
	
	
	//create mouse actions for draging areas on top of the image
	var img = d3.select("#imageDiv img");
	var image = d3.select("#prototypeImage");
	var rect, drawing = false, moved = false;
	image.on('mousedown', function(){
		d3.event.stopPropagation();
		d3.event.preventDefault();
		drawing = true;
		rect = createOverlay(image, handleFormDetails, ws);
	}).on("mouseup", function(){
		//add the area for the drawn rectangle into the map element
		if(moved)
			editOverlay(handleFormDetails, rect, ws);
		else
			rect.remove();
		//rect finished drawing
		drawing = moved = false;
	}).on('mousemove', function(){
		if(drawing){
			moved = true;
			d3.event.preventDefault();
			var starty = parseFloat(rect.attr("starty")),
				startx = parseFloat(rect.attr("startx")),
				h = Math.abs(starty - d3.event.pageY),
				w = Math.abs(startx - d3.event.pageX);
			//if the current y is less than the start y, then top style should be height - current top style
			if(d3.event.pageY < starty ){
				rect.style('top', (starty - h) + "px");
			}else {
				rect.style('top', starty + "px");
			}
			//if the current x is less than the startx then left style should be width - current left style
			if(d3.event.pageX < startx){
				rect.style("left", (startx - w) + "px");
			}else{
				rect.style("left", startx + "px");
			}
			//update width and height of marker
			rect.style("height", h + "px").style("width", w + "px");
		}
	});
	
	image.style("height", img.property("height") + "px")
		.style("width", img.property("width") + "px");
	d3.select("#imageDiv").style("width",  img.property("width"));
	d3.select("#console").style("left", img.property('width') + 20)
		.style("height", img.property('height'));
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
});