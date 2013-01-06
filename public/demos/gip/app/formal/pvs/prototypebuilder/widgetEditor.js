/**
 * creates a form for making or editing widgets
 * @author Patrick Oladimeji
 * @date Dec 29, 2012 : 1:22:57 PM
 */

define(['./displayMappings','util/Timer','util/eventDispatcher', "./widgetEvents",
        "./buttonWidget", "./displayWidget", './widgetMaps','d3/d3'], 
      function(displayMappings,  timer, eventDispatcher, widgetEvents, buttonWidget, displayWidget, widgetMaps){
	
			return{
				create:function(mark){
					return create(mark);
				}
			};
			
			function create(mark){
				var widget = widgetMaps[mark.attr("id")]  || buttonWidget();
				var o = eventDispatcher({}), controls, el;
				var x = d3.event.pageX, y = d3.event.pageY;
				
				renderElements(widget);
				
				function renderElements(widget){
					var form = createForm(x, y);
					var data = widget.getRenderData();
					var controlgroups  = form.selectAll("div.control-group").data(data).enter()
						.append("div").attr("class", "control-group");
				
					controlgroups.each(function(d, i){
						d3.select(this).append("label")
							.attr("class", "control-label").attr("for", d.name).html(d.label);
						controls = d3.select(this).append("div").attr("class", "controls");
						el = controls.append(d.element).attr("id", d.name);
						if(d.inputType){
							el.attr("type", d.inputType).attr("value", d.value).attr("name", d.name);
							if(d.inputType === 'text'){
								el.property("value", d.value);
							}
						}
						
						if(d.other){
							d.other.forEach(function(d){
								el.attr(d, true);
							});
						}
						if(d.data){
							if(d.element === "select") {
								el.selectAll("option").data(d.data).enter()
									.append("option")
										.html(function(d){
											return d.label;
										}).attr("value", function(d){
											return d.value;
										}).attr("selected", function(o){
											return d.value === o.value ? true : null;
										});
							}else if(d.inputType === "checkbox"){
								el.remove();
								controls.selectAll("label.checkbox").data(d.data).enter()
									.append("label").attr("class", "checkbox").html(function(d){
											return d.label;
										})
										.append("input").attr("type", "checkbox").property("value", function(d){
											return d.value;
										}).attr("name", d.name)
										.attr("checked", function(){
											return d.value.indexOf(this.value) > -1 ? true : null;
										});
							}
						}
					});//end foreach row
					//add row for delete/save
					controls = form.append("div").attr("class", "buttons control-group")
						.append("div").attr("class", "controls");
					//delete handler for widget
					controls.append("button").html("Delete Widget").attr("class", "btn btn-danger left")
						.on("click", function(){
							var event = {type:widgetEvents.WidgetDeleted, mark:mark, widget:widget,
									formContainer:d3.select("div.detailsForm")};
							o.fire(event);
						});
					//close window handler
					controls.append("button").html("Close Window").attr("class", "btn")
						.style("margin", "0 10px 0 10px")
						.on("click", function(){
							d3.select("div.detailsForm").remove();
						});
					//save handler for widget
					controls.append("button").attr("class", "btn btn-success right").html("Save Widget")
						.on("click", function(){
							var res = data.map(function(d){
								var el = d3.select("#" + d.name), value = el.empty() ? null : el.property("value")|| el.text();
								value = value ? value.trim() : value;
								///for checkboxes add list of items selected
								if(d.data && d.inputType === 'checkbox'){
									value = [];
									d3.selectAll("input[type=checkbox][name=events]").each(function(d,i){
										if(this.checked){
											value.push(this.value);
										}
									});
								}
								return {key:d.name, value:value};
							});
							widget = dataToWidget(res, widget);
							widgetMaps[widget.id()] = widget;
							var event = {type:widgetEvents.WidgetSaved, mark:mark, 
									formContainer:d3.select("div.detailsForm"), formData:res, widget:widget};
							o.fire(event);
						});
					
					//if the type of widget changes update the widget and recreate the form
					d3.select("select#type").on("change", function(d){
						widget = changeWidget(widget, this.value);
						widgetMaps[widget.id()] = widget;
						renderElements(widget);
					});
					//bind listener to function text to automatically update the boundfunction text
					d3.select("#functionText").on("keyup", function(){
						updateBoundFunctionsLabel();
					});
					//bind listener for checkchanged events
					d3.selectAll("input[type=checkbox][name=events]").on("change", function(){
						updateBoundFunctionsLabel();
					});
					
					d3.select("select#predefinedRegex").on('change', function(){
						updateRegex();
					});
					d3.select("#prefix").on("keyup", function(){
						updateRegex();
					});
					
					if(widget.type() === "Button") {
						updateBoundFunctionsLabel();
					}else{
						updateRegex();
					}
				}
				return o;
			}
			
			function updateRegex(){
				var r = "", predefined = d3.select("#predefinedRegex").property("value"), prefix = d3.select("#prefix").property("value");
				r = prefix + " := (" + predefined + ")";
				d3.select("#regex").property("value", r);
			}
			
			function updateBoundFunctionsLabel(){
				var f = d3.select("#functionText").property("value"), str = "", events = [];
				d3.selectAll("input[type=checkbox][name=events]").each(function(){
					if(this.checked)
						events = events.concat(this.value.split("/"));
				});
				str = events.map(function(d){
					return d + "_" + f;
				}).join(", ");
				d3.select("#boundFunction").text( str);
			}
			
			function dataToWidget(data, w){
				data.forEach(function(d){
					w[d.key](d.value);
				});
				return w;				
			}
			
			function changeWidget(w, newtype){
				var res;
				if(newtype === "Display") {
					res = displayWidget();
					res.__olddata = w;
				}else if(newtype === "Button"){
					res = buttonWidget();
					res.__olddata = w;
				}
				
				if(w.__olddata){
					for(var key in w.__olddata){
						res[key] = w.__olddata[key];
					}
				}
				return res;
			}
			
			function createForm(x, y){
				d3.select("div.detailsForm.shadow").remove();
				var form = d3.select("body").append("div").attr("class", "detailsForm shadow")
					.style("top", y).style("left", x)
						.append("div").attr("class", "form-horizontal");
				form.append("legend").html("Edit User Interface Widget");
				return form;
			}
		});