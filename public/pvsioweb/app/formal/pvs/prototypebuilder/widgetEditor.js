/**
 * creates a form for making or editing widgets
 * @author Patrick Oladimeji
 * @date Dec 29, 2012 : 1:22:57 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50, es5: true */
/*global define, d3, require, __dirname, process, _*/

define(function (require, exports, module) {
    "use strict";
    var displayMappings                         = require("./displayMappings"),
        timer                                   = require("util/Timer"),
        eventDispatcher                         = require("util/eventDispatcher"),
        widgetEvents                            = require("./widgetEvents"),
        buttonWidget                            = require("./buttonWidget"),
        displayWidget                           = require("./displayWidget"),
        widgetMaps                              = require("./widgetMaps");
    
    var preventDefault = function () { d3.event.stopPropagation(); };
    
    function createForm(x, y) {
        d3.select("div.detailsForm.shadow").remove();
        var form = d3.select("body").append("div").attr("class", "detailsForm shadow")
            .style("top", y + "px").style("left", x + "px")
            .append("form").attr("class", "");
        form.append("legend").html("Edit User Interface Area");
        return form;
    }
	
    function validate(o) {
        var res = true;
        o.selectAll("select,input,textarea").each(function (d) {
            res = res && this.checkValidity();
        });
        return res;
    }
    
    function dataToWidget(data, w) {
        data.forEach(function (d) {
            w[d.key](d.value);
        });
        return w;
    }
    
    function changeWidget(w, newtype) {
        var res;
        if (newtype === "Display") {
            res = displayWidget();
            res.__olddata = w;
        } else if (newtype === "Button") {
            res = buttonWidget();
            res.__olddata = w;
        }
        
        if (w.__olddata) {
            _.each(w.__olddata, function (value, key) {
                res[key] = value;
            });
        }
        return res;
    }
    
    function updateBoundFunctionsLabel() {
        var f = d3.select("#functionText").property("value"), str = "", events = [];
        d3.selectAll("input[type=checkbox][name=events]").each(function () {
            if (this.checked) {
                events = events.concat(this.value.split("/"));
            }
        });
        str = events.map(function (d) {
            return d + "_" + f;
        }).join(", ");
        d3.select("#boundFunction").text(str);
    }
    
    
    function updateRegex() {
        var r = "", predefined = d3.select("#predefinedRegex").property("value"), prefix = d3.select("#prefix").property("value");
        r = prefix + ":=(" + predefined + ")";
        d3.select("#regex").property("value", r);
    }
    
    function create(mark) {
        var widget = widgetMaps.get(mark.attr("id"))  || buttonWidget();
        var o = eventDispatcher({}), controls, el;
        var x = d3.event.pageX, y = d3.event.pageY;
        
        function renderElements(widget) {
            var formMoving = false, sx, sy, sTop, sLeft;
            var form = createForm(x, y).on("mousedown", preventDefault)
                .on("mouseup", preventDefault)
                .on("mousemove", preventDefault);
            d3.select("div.detailsForm").on('mousedown', function () {
                if (d3.event.target === this) {
                    d3.event.preventDefault();
                    formMoving = true;
                    sx = d3.event.clientX;
                    sy = d3.event.clientY;
                    sTop = parseFloat(d3.select(this).style("top"));
                    sLeft = parseFloat(d3.select(this).style("left"));
                }
            }).on('mouseup', function () {
                formMoving = false;
            }).on("mouseout", function () {
                formMoving = false;
            }).on("mousemove", function () {
                if (formMoving && d3.event.target === this) {
                    d3.event.preventDefault();
                    var dx = sx - d3.event.clientX, dy = sy - d3.event.clientY;
                    d3.select(this).style("top", (sTop - dy) + "px").style("left", (sLeft - dx) + "px");
                }
            });
            var data = widget.getRenderData();
            var controlgroups  = form.selectAll("div.control-group").data(data).enter()
                .append("div").attr("class", "control-group");
        
            controlgroups.each(function (d, i) {
                d3.select(this).append("label")
                    .attr("class", "control-label").attr("for", d.name).html(d.label);
                controls = d3.select(this).append("div").attr("class", "controls");
                el = controls.append(d.element).attr("id", d.name);
                if (d.inputType) {
                    el.attr("type", d.inputType).attr("value", d.value).attr("name", d.name);
                    if (d.inputType === 'text') {
                        el.property("value", d.value);
                    }
                }
                
                if (d.other) {
                    d.other.forEach(function (d) {
                        el.attr(d, true);
                    });
                }
                if (d.pattern) {
                    el.attr('pattern', d.pattern);
                }
                if (d.data) {
                    //sort the data to fix the chrome bug that causes the select box to show the first item and not the selected one
                    d.data.sort(function (a, b) {
                        return a.value === d.value ? -1 : 1;
                    });
                    
                    if (d.element === "select") {
                        el.selectAll("option").data(d.data).enter()
                            .append("option")
                            .html(function (d) {
                                return d.label;
                            }).attr("value", function (d) {
                                return d.value;
                            }).attr("selected", function (o) {
                                return d.value === o.value ? "selected" : null;
                            });
                    } else if (d.inputType === "checkbox") {
                        el.remove();
                        controls.selectAll("label.checkbox").data(d.data).enter()
                            .append("label").attr("class", "checkbox").html(function (d) {
                                return d.label;
                            })
                            .append("input").attr("type", "checkbox").property("value", function (d) {
                                return d.value;
                            }).attr("name", d.name)
                            .attr("checked", function () {
                                return d.value.indexOf(this.value) > -1 ? true : null;
                            });
                    }
                }
            });//end foreach row
            //add row for delete/save
            controls = form.append("div").attr("class", "buttons control-group")
                .append("div").attr("class", "controls");
            //delete handler for widget
            controls.append("button").attr("type", "button").html("Delete").attr("class", "btn btn-danger left")
                .on("click", function () {
                    var event = {type: widgetEvents.WidgetDeleted, mark: mark, widget: widget,
                            formContainer: d3.select("div.detailsForm")};
                    o.fire(event);
                });
            //close window handler
            controls.append("button").attr("type", "button").html("Cancel").attr("class", "btn")
                .style("margin", "0 10px 0 10px")
                .on("click", function () {
                    d3.select("div.detailsForm").remove();
                });
            //save handler for widget
            controls.append("button").attr("type", "submit").attr("class", "btn btn-success right").html("Save")
                .on("click", function () {
                    if (validate(form)) {
                        d3.select(this).attr("type", "button");
                        
                        var res = data.map(function (d) {
                            var el = d3.select("#" + d.name), value = el.empty() ? null : el.property("value") || el.text();
                            value = value ? value.trim() : value;
                            ///for checkboxes add list of items selected
                            if (d.data && d.inputType === 'checkbox') {
                                value = [];
                                d3.selectAll("input[type=checkbox][name=events]").each(function (d, i) {
                                    if (this.checked) {
                                        value.push(this.value);
                                    }
                                });
                            }
                            return {key: d.name, value: value};
                        });
                        widget = dataToWidget(res, widget);
                        widgetMaps.add(widget);
                        var event = {type: widgetEvents.WidgetSaved, mark: mark,
                                formContainer: d3.select("div.detailsForm"), formData: res, widget: widget};
                        o.fire(event);
                    }
                    
                });
            
            //if the type of widget changes update the widget and recreate the form
            d3.select("select#type").on("change", function (d) {
                widget = changeWidget(widget, this.value);
                widgetMaps.add(widget);
                renderElements(widget);
            });
            //bind listener to function text to automatically update the boundfunction text
            d3.select("#functionText").on("keyup", function () {
                updateBoundFunctionsLabel();
            });
            //bind listener for checkchanged events
            d3.selectAll("input[type=checkbox][name=events]").on("change", function () {
                updateBoundFunctionsLabel();
            });
            
            d3.select("select#predefinedRegex").on('change', function () {
                updateRegex();
            });
            d3.select("#prefix").on("keyup", function () {
                updateRegex();
            });
            
            if (widget.type() === "Button") {
                updateBoundFunctionsLabel();
            } else {
                updateRegex();
            }
        }
        
        renderElements(widget);
        return o;
    }
    
    module.exports = {
        create: function (mark) {
            return create(mark);
        }
    };
});