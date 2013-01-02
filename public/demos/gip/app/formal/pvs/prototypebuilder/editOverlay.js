/**
 * module for editing interactive overlays defined by users details
 * @author Patrick Oladimeji
 * @date Dec 5, 2012 : 10:29:16 PM
 */

define(['./displayMappings','./widgetMaps','util/Timer', 'd3/d3'], 
	function(displayMappings, widgetMaps, Timer){
	//define timer for sensing hold down actions on buttons
	var btnTimer = Timer(250), numTicks = 0, timerTickFunction = null;
	//add event listener for timer's tick 
	btnTimer.addListener('TimerTicked', function(){
		if(timerTickFunction){
			timerTickFunction();
		}
	});
	function mouseup(e){
		numTicks = btnTimer.getCurrentCount();
		btnTimer.reset();
	}
	
	
	/**
	 * requests the details fo the mark that was drawn. Details are:
	 * a unique name to give the mark, and
	 * a function to call when the mark was clicked
	 * @param callback is a function to call when all the details have been supplied by the user
	 * @param mark the mark to edit
	 * @param ws the ws to use for calling functions
	 */
	return function(callback, mark, ws){
		var eventRow, events = {}, type = "Button", name, funcText, funcRowLabel = "Function:", 
			displayLabel, displayLabelRow, displayWidgetLabel, presetRegexRow;
		//this form is used to both edit and create new details for an overlay so get the details if this is an edit
		if(mark && mark.attr("id")){
			var id = mark.attr("id");
			type = widgetMaps[id].type;
			name  = widgetMaps[id].name;
			funcText = widgetMaps[id].functionText;
			events = widgetMaps[id].events || {};
			if(type !== "Button")
				displayLabel = displayMappings[id].label;
		}
		var x = d3.event.pageX, y = d3.event.pageY;
		var form = d3.select("body").append("div")
			.attr("class", "detailsForm shadow")
			.style("top", y + "px").style("left", x + "px");
		//want to select ui component type, provide a name for it and provide a function to call when it is clicked
		var table = form.append("form").attr("class", ".form-horizontal");
		table.append("legend").html("Edit User Interface Widget");
		var typerow = table.append("div").attr("class", "control-group");
		typerow.append("label").attr("class", "control-label").html("Widget Type:");
		var widgetType = typerow.append("div").attr("class","controls").append("select")
			.on("change", function(){
				//update the label to show regex if display is selected
				widgetTypeChanged.call(this);
			});
		widgetType.selectAll("option").data(["Button", "Display"]).enter()
			.append("option").attr("value", String).attr("selected", function(d){
				return d === type ? 'selected' : null;
			}).html(String);
		funcRowLabel = widgetType.property("value") === "Button" ? "Function:" : "Regex:";

		//define the function/Regex row
		var funcrow = table.append("div").attr("id", "funcRow").attr("class", "control-group");
		funcrow.append("label").html(funcRowLabel).attr("id", "lblFunction").attr("class", "control-label");
		var functionDetails = funcrow.append("div").attr("class", "controls").append("input").attr("type", "text");
		if(funcText)
			functionDetails.property("value", funcText);
		
		widgetTypeChanged.call(widgetType.node());	
		//define the ok/cancel row
		var okcancelrow = table.append("div").attr("class", "buttons control-group").append("div").attr("class", "controls");
		okcancelrow.append("button")
			.attr("class", "btn btn-danger left").html("Delete").on("click", function(){
				//hide and delete the form and the mark
				form.remove();
				mark.remove();
			});
		okcancelrow.append("button")
			.attr("class", "btn btn-success right").html("OK").on("click", function(){
				
				type = widgetType.property("value");
				funcText = functionDetails.property("value");
				//generate a name for the widget automatically if you havent already done so
				if(!name){
					name = type + new Date().getTime(); 
					mark.attr("id", name);
				}
				if(type === "Display")
					displayLabel = displayWidgetLabel.property("value");
				//fetch the values input in the form and pass to the callback function
				callback(type, name, funcText, displayLabel, events);
				if(funcRowLabel === "Function:"){
					//need to create the area for this
					var top = parseFloat(mark.style('top')) - d3.select("#imageDiv img").node().y, 
						left = parseFloat(mark.style('left')) - d3.select("#imageDiv img").node().x,
						h = parseFloat(mark.style('height')),
						w = parseFloat(mark.style('width'));
					var coords = left + "," + top +	"," + (left + w) + "," + (top + h);
					d3.select("#prototypeMap")
						.append("area")
							.attr("class", name)
							.attr("shape", "rect")
							.attr("coords", coords)
							.attr("href", type === "Button" ? "#" : null)//only make buttons clickable
						.on('click', function(){
							var f = widgetMaps[name].functionText;
							if(numTicks === 0){
								console.log(f);
								if(events['click'])
									ws.sendGuiAction("click_" + f + "(" + ws.lastState().toString().replace(/,,/g, ",") + ");");
							}
						}).on("mousedown", function(){
							var f = widgetMaps[name].functionText;
							timerTickFunction = function(){
								console.log("button pressed");
								if(events['press/release'])
									ws.sendGuiAction("press_" + f + "(" + ws.lastState().toString().replace(/,,/g,',') + ");");
							};
							btnTimer.start();
						}).on("mouseup", function(){
							var f = widgetMaps[name].functionText;
							if(numTicks > 0){
								console.log("button released");	
								if(events['press/release'])
									ws.sendGuiAction("release_" + f + "(" + ws.lastState().toString().replace(/,,/g,',') + ");");
							}
							mouseup(d3.event);
						});
				}else{
					//the mark created should stay in place and be classed as a display element
					//also update the mapping object with this object
					mark.classed("display", true);
					displayMappings[name]  = {regex :new RegExp(funcText), uiElement:name, label:displayLabel};
				}
				//then remove the form
				form.remove();
				
			});
		

		function predefinedRegexes(){
			var res = [];
			for(var key in displayMappings){
				res.push(displayMappings[key]);
			}
			
			return res;
		}
		
		function widgetTypeChanged(){
			var regexData = [{label:'None', regex:''}].concat(predefinedRegexes());
			//update the label to show regex if display is selected
			funcRowLabel = d3.select(this).property("value") === "Button" ? "Function:" : "Regex:";
			d3.select("#lblFunction").html(funcRowLabel);
			
			if(eventRow)
				eventRow.remove();
			//show widget label field if widget type is display
			if(funcRowLabel === "Regex:") {
				//create preset regexes
				presetRegexRow = table.insert("div", "#funcRow").attr("id", "presetRegexRow").attr("class", "control-group");
				presetRegexRow.append("Label").html("Predefined Regexes:").attr("class", "control-label");
				var regexOptions = presetRegexRow.append('div').attr("class", "controls")
					.append("select")
					.on("change", function(){
						var d = regexData[this.selectedIndex];
						if(d.label === "None") {
							d3.select("#displayLabelRow input[type=text]").property("value", "");
							d3.select("#funcRow input[type=text]").property("value", "");
						}else{
							d3.select("#displayLabelRow input[type=text]").property("value", d.label || "");
							d3.select("#funcRow input[type=text]").property("value", d.regex.toString());
						}
					}).selectAll("options")
					.data(regexData)
					.enter().append('option').attr("value", function(d){
						return d.regex.toString();
					}).attr("selected", function(d){
						var res = !funcText ? d.label === "None" : d.regex.toString() === funcText;
						return res ? true : null;
					}).html(function(d){
						return d.label || d.regex.toString();
					});
				
				displayLabelRow = table.insert("div", "div.buttons").attr("id", "displayLabelRow").attr("class", "control-group");
				displayLabelRow.append("Label").html("Widget Label:").attr("class", "control-label");
				displayWidgetLabel = displayLabelRow.append("div").attr("class", "controls")
					.append("input").attr("type", "text").attr("id", "displayLabel");
				if(displayLabel)
					displayWidgetLabel.property("value", displayLabel);
			}else{//widget type is button so add the checkboxes for the events you wish to listen for
				if(displayLabelRow)
					displayLabelRow.remove();
				if(presetRegexRow)
					presetRegexRow.remove();
				//add check boxes
				eventRow = table.insert("div", "div.buttons").attr("id", "eventRow").attr("class", "control-group");
				eventRow.append("label").html("Registered Events:").attr("class", "control-label");
				var eventsTd = eventRow.append("div").attr("class", "controls");
				eventsTd.append("label").attr("class", "checkbox").html(" click")
					.append("input").attr("type", "checkbox").attr("value", "click").attr("class", "checkbox")
					.on("change", checkChanged).attr("checked", function(){
						return events && events['click'] ? true : null;
					});
				eventsTd.append("label").attr("class", "checkbox").html(" Press/Release")
					.append("input").attr("type", "checkbox").attr("class", "checkbox").attr("value","press/release")
					.on("change", checkChanged).attr("checked", function(){
						return events && events['press/release'] ? true : null;
					});
			}//end else
			
			function checkChanged(){
				if(this.checked){
					events[this.value] = true;
				}else{
					delete events[this.value];
				}
			}
		}
	};
});