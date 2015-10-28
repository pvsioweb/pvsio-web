/**
 *
 * @author Paolo Masci
 * @date 28/10/15
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global define, Promise, d3*/
define(function (require, exports, module) {
    "use strict";

    var _this;
    
    function EmuchartsMenu(emuchartsManager) {
        this.emuchartsManager = _this.emuchartsManager;
        installHandlers();
        _this = this;
        return this;
    }

    function installHandlers() {
        // show the menu items when the mouse goes over the menu name
        d3.select("#menuEmuchart").on("mouseover", function () {
            document.getElementById("menuEmuchart").children[1].style.display = "block";
        });
        //-- "File" menu
        d3.select("#btnNewEmuchart").on("click", function () {
            d3.select("#EmuchartLogo").classed("hidden", true);
            d3.select("#graphicalEditor").classed("hidden", false);
            _this.emuchartsManager.newEmucharts("emucharts.pvs");
            // render emuchart
            _this.emuchartsManager.render();
            // make svg visible and reset colors
            initToolbars();
            // set initial editor mode
            d3.select("#btn_toolbarBrowse").node().click();
            //set Variables Table
            contextTable.setContextVariables(_this.emuchartsManager.getVariables());            
        });

        function openChart() {
            function open(callback) {
                var opt = {
                    header: "Open EmuChart file...",
                    extensions: ".emdl,.muz,.pim"
                };
                FileHandler.openLocalFileAsText(function (err, res) {
                    if (res) {
                        if (res.name.lastIndexOf(".emdl") === res.name.length - 5) {
                            res.content = JSON.parse(res.content);
                            _this.emuchartsManager.importEmucharts(res);
                        } else if (res.name.lastIndexOf(".muz") === res.name.length - 4) {
                            _this.emuchartsManager.importPIMChart(res);
                        } else {
                            // Try parse as PIM
                            pimImporter.importPIM(res, _this.emuchartsManager);
                        }
                        if (callback && typeof callback === "function") {
                            callback(err, res);
                        }
                    } else {
                        console.log("Error while opening file (" + err + ")");
                    }
                }, opt);
            }            
            open(function f() {
                // make svg visible and reset colors
                initToolbars();
                // render emuchart
                _this.emuchartsManager.render();
                // set initial editor mode
                d3.select("#btn_toolbarBrowse").node().click();
                //set Variables Table
                contextTable.setContextVariables(_this.emuchartsManager.getVariables());                
            });
        }
        
        d3.select("#btnLoadEmuchart").on("click", openChart);
        

        d3.select("#btn_menuNewChart").on("click", function () {
            document.getElementById("menuEmuchart").children[1].style.display = "none";
            var newChart = function () {
                d3.select("#EmuchartLogo").classed("hidden", true);
                d3.select("#graphicalEditor").classed("hidden", false);
                _this.emuchartsManager.newEmucharts("emucharts.pvs");
                // set initial editor mode
                _this.emuchartsManager.set_editor_mode(MODE.BROWSE());
                // render emuchart
                _this.emuchartsManager.render();
            };
            if (!_this.emuchartsManager.empty_chart()) {
                // we need to delete the current chart because we handle one chart at the moment
                QuestionForm.create({
                    header: "Warning: unsaved changes will be discarded.",
                    question: "Unsaved changes in the current chart will be discarded."
                                + "Would you like continue?",
                    buttons: ["Cancel", "Ok"]
                }).on("ok", function (e, view) {
                    _this.emuchartsManager.delete_chart();
                    newChart();
                    initToolbars();
                    // set initial editor mode
                    d3.select("#btn_toolbarBrowse").node().click();
                    view.remove();
                }).on("cancel", function (e, view) {
                    view.remove();
                });
            }
        });
        d3.select("#btn_menuCloseChart").on("click", function () {
            document.getElementById("menuEmuchart").children[1].style.display = "none";
            if (!_this.emuchartsManager.empty_chart()) {
                // we need to delete the current chart because we handle one chart at the moment
                QuestionForm.create({
                    header: "Warning: the current chart has unsaved changes.",
                    question: "The current chart has unsaved changes that will be lost. Confirm Close?",
                    buttons: ["Cancel", "Confirm close"]
                }).on("ok", function (e, view) {
                    _this.emuchartsManager.delete_chart();
                    initToolbars();
                    // set initial editor mode
                    d3.select("#btn_toolbarBrowse").node().click();
                    view.remove();
                }).on("cancel", function (e, view) {
                    view.remove();
                });
            }
        });
        d3.select("#btn_menuOpenChart").on("click", function () {
            document.getElementById("menuEmuchart").children[1].style.display = "none";
            // we need to delete the current chart because we handle one chart at the moment
            if (!_this.emuchartsManager.empty_chart()) {
                QuestionForm.create({
                    header: "Warning: unsaved changes will be discarded.",
                    question: "Unsaved changes in the current chart will be discarded."
                                + "Would you like continue?",
                    buttons: ["Cancel", "Ok"]
                }).on("ok", function (e, view) {
                    _this.emuchartsManager.delete_chart();
                    document.getElementById("btnLoadEmuchart").click();
                    view.remove();
                }).on("cancel", function (e, view) {
                    view.remove();
                });
            } else {
                _this.emuchartsManager.delete_chart();
                document.getElementById("btnLoadEmuchart").click();
            }
        });
        d3.select("#btn_menuImportChart").on("click", function () {
            function importChart(callback) {
                var opt = {
                    header: "Import Chart...",
                    extensions: ".muz,.pim"
                };
                // MUZ
                FileHandler.openLocalFileAsText(function (err, res) {
                    if (res) {
                        if (res.name.lastIndexOf(".muz") === res.name.length - 4) {
                            _this.emuchartsManager.importPIMChart(res);
                        }
                        else {
                            pimImporter.importPIM(res, _this.emuchartsManager);
                        }
                        if (callback && typeof callback === "function") {
                            callback(err, res);
                        }
                    }
                }, opt);
            }            
            document.getElementById("menuEmuchart").children[1].style.display = "none";
            // we need to delete the current chart because we handle one chart at the moment
            QuestionForm.create({
                header: "Warning: unsaved changes will be discarded.",
                question: "Unsaved changes in the current chart will be discarded."
                            + "Would you like continue?",
                buttons: ["Cancel", "Ok"]
            }).on("ok", function (e, view) {
                _this.emuchartsManager.delete_chart();
                //document.getElementById("btnImportChart").click();
                view.remove();
                importChart(function f() {
                    // render emuchart
                    _this.emuchartsManager.render();
                    // make svg visible and reset colors
                    initToolbars();
                    // set initial editor mode
                    d3.select("#btn_toolbarBrowse").node().click();
                });
            }).on("cancel", function (e, view) {
                view.remove();
            });
        });
        d3.select("#btn_menuQuitEmulink").on("click", function () {
            document.getElementById("menuEmuchart").children[1].style.display = "none";
            if (!_this.emuchartsManager.empty_chart()) {
                // we need to delete the current chart because we handle one chart at the moment
                QuestionForm.create({
                    header: "Warning: the current chart has unsaved changes.",
                    question: "The current chart has unsaved changes that will be lost. Confirm quit?",
                    buttons: ["Cancel", "Quit Emulink"]
                }).on("ok", function (e, view) {
                    _this.emuchartsManager.delete_chart();
                    initToolbars();
                    view.remove();
                    // FIXME: need a better way to deselect the checkbox
                    document.getElementById("plugin_Emulink").checked = false;
                    _this.unload();
                }).on("cancel", function (e, view) {
                    view.remove();
                });
            }
        });
        d3.select("#btn_menuSaveChart").on("click", function () {
            document.getElementById("menuEmuchart").children[1].style.display = "none";
            if (!_this.emuchartsManager.empty_chart()) {
                var name = "emucharts_" + projectManager.project().name() + ".emdl";
                var emuchart = {
                    descriptor: {
                        file_type: "emdl",
                        version: "1.3",
                        description: "emucharts model",
                        chart_name: ("emucharts_" + projectManager.project().name())
                    },
                    chart: {
                        states: _this.emuchartsManager.getStates(),
                        transitions: _this.emuchartsManager.getTransitions(),
                        initial_transitions: _this.emuchartsManager.getInitialTransitions(),
                        constants: _this.emuchartsManager.getConstants(),
                        variables: _this.emuchartsManager.getVariables()
                    }
                };
                // PIM.
                emuchart.chart.pmr = _this.emuchartsManager.getPMR(null, true);
                emuchart.chart.isPIM = _this.emuchartsManager.getIsPIM();

                var content = JSON.stringify(emuchart, null, " ");
                projectManager.project().addFile(name, content, { overWrite: true }).then(function (res) {
                    displayNotification("File " + name + " saved successfully!");
                }).catch(function (err) {
                    displayNotification("Error while saving file " +
                                          name + " (" + JSON.stringify(err) + ")");
                });
            }
        });
        d3.select("#btn_menuExportAsImage").on("click", function () {
            var svg = d3.select("#ContainerStateMachine").select("svg")
                        .attr("version", 1.1)
                        .attr("xmlns", "http://www.w3.org/2000/svg")
                        //.attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
                        .style("background", "#ffffff")
                        .node();
            var SVGContent = (new window.XMLSerializer()).serializeToString(svg);
            // this workaround is needed to define the xlink namespace -- d3 for some reason does not allow to define it but we need it to export the svg as an image
            SVGContent = SVGContent.replace("xmlns=\"http://www.w3.org/2000/svg\"",
                                            "xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"");
            var imgsrc = "data:image/svg+xml;base64," + window.btoa(SVGContent);
            var img = '<img src="' + imgsrc + '">';
            d3.select("#svgdataurl").html(img);
            var canvas = document.querySelector("canvas");
            var context = canvas.getContext("2d");
            var image = new Image();

            // restore background colour
            d3.select("#ContainerStateMachine").select("svg").style("background", "white");

            function imageLoadError(res) {
                displayNotification("Failed to export chart");
            }
            function imageLoadComplete(res) {
                context.drawImage(image, 0, 0);
                var canvasdata = canvas.toDataURL("image/png");
//                var pngimg = '<img src="' + canvasdata + '">';

                var a = d3.select("#pngdataurl");
                a.node().download = projectManager.project().name() + "_emuChart.png";
                a.node().href = canvasdata;
                a.node().click();
            }

            image.onload = imageLoadComplete;
            image.onerror = imageLoadError;
            image.src = imgsrc;
        });

        //-- States menu -----------------------------------------------------------
        d3.select("#menuStates").on("mouseover", function () {
            document.getElementById("menuStates").children[1].style.display = "block";
        });

        d3.select("#btn_menuNewState").on("click", function () {
            document.getElementById("menuStates").children[1].style.display = "none";
//            var label = _this.emuchartsManager.getFreshStateName();
            displayAddState.create({
                header: "Please enter label for new state",
                textLabel: "New state",
                buttons: ["Cancel", "Create"]
            }).on("create", function (e, view) {
                var nodeLabel = e.data.labels.get("newLabel");
                _this.emuchartsManager.add_state(nodeLabel);
                view.remove();
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
            });
        });
        d3.select("#btn_menuRenameState").on("click", function () {
            document.getElementById("menuStates").children[1].style.display = "none";
            var states = _this.emuchartsManager.getStates();
            var labels = [];
            states.forEach(function (state) {
                labels.push(state.name + "  (id: " + state.id + ")");
            });
            displaySelectState.create({
                header: "Editing states...",
                message: "Please select a state",
                transitions: labels,
                buttons: ["Cancel", "Select"]
            }).on("select", function (e, view) {
                if (states.length > 0) {
                    var v = e.data.options.get("selectedState");
                    var theState = states[v];
                    view.remove();
                    editState(theState);
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
                return;
            });
        });
        d3.select("#btn_menuDeleteState").on("click", function () {
            document.getElementById("menuStates").children[1].style.display = "none";
            var states = _this.emuchartsManager.getStates();
            var labels = [];
            states.forEach(function (state) {
                labels.push(state.name + "  (id: " + state.id + ")");
            });
            displayDelete.create({
                header: "Please select state to be deleted...",
                textLabel: "State to be deleted",
                currentLabels: labels,
                buttons: ["Cancel", "Delete"]
            }).on("delete", function (e, view) {
                var s = e.data.options.get("currentLabel");
                var stateID = states[s].id;
                _this.emuchartsManager.delete_state(stateID);
                view.remove();
            }).on("cancel", function (e, view) {
                // just remove rename window
                view.remove();
            });
        });

        //-- Transitions menu -----------------------------------------------------------
        d3.select("#menuTransitions").on("mouseover", function () {
            document.getElementById("menuTransitions").children[1].style.display = "block";
        });
        d3.select("#btn_menuNewTransition").on("click", function () {
            document.getElementById("menuTransitions").children[1].style.display = "none";
//            var newTransitionName = _this.emuchartsManager.getFreshTransitionName();
            var states = _this.emuchartsManager.getStates();
            var labels = [];
            states.forEach(function (state) {
                labels.push(state.name + "  (id: " + state.id + ")");
            });
            displayAddTransition.create({
                header: "Please enter label for new transition",
                textLabel: "New transition",
                sourceNodes: labels,
                targetNodes: labels,
                buttons: ["Cancel", "Create"]
            }).on("create", function (e, view) {
                var transitionLabel = e.data.labels.get("newLabel");
                if (transitionLabel && transitionLabel.value !== "") {
                    var sourceNode = e.data.options.get("sourceNode");
                    var sourceNodeID = states[sourceNode].id;
                    var targetNode = e.data.options.get("targetNode");
                    var targetNodeID = states[targetNode].id;
                    _this.emuchartsManager.add_transition(transitionLabel, sourceNodeID, targetNodeID);
                    view.remove();
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
            });
        });
        d3.select("#btn_menuRenameTransition").on("click", function () {
            document.getElementById("menuTransitions").children[1].style.display = "none";
            var transitions = _this.emuchartsManager.getTransitions();
            var nTransitions = transitions.length;
            var initialTransitions = _this.emuchartsManager.getInitialTransitions();
            initialTransitions.forEach(function (it) {
                transitions.push(it);
            });
            var labels = [];
            transitions.forEach(function (transition) {
                if (transition.source) {
                    labels.push(transition.name + "  ("
                                + transition.source.name + "->"
                                + transition.target.name + ")");
                } else {
                    labels.push(transition.name + "  ("
                                + "INIT" + "->"
                                + transition.target.name + ")");
                }
            });
            displaySelectTransition.create({
                header: "Editing transitions...",
                message: "Please select a transition",
                transitions: labels,
                buttons: ["Cancel", "Select"]
            }).on("select", function (e, view) {
                if (transitions.length > 0) {
                    var v = e.data.options.get("selectedTransition");
                    var theTransition = transitions[v];
                    view.remove();
                    if (v < nTransitions) {
                        editTransition(theTransition);
                    } else {
                        editInitialTransition(theTransition);
                    }
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
                return;
            });
        });
        d3.select("#btn_menuDeleteTransition").on("click", function () {
            document.getElementById("menuTransitions").children[1].style.display = "none";
            var transitions = _this.emuchartsManager.getTransitions();
            var initialTransitions = _this.emuchartsManager.getInitialTransitions();
            initialTransitions.forEach(function (it) {
                transitions.push(it);
            });
            var labels = [];
            transitions.forEach(function (transition) {
                if (transition.source) {
                    labels.push(transition.name + "  ("
                                + transition.source.name + "->"
                                + transition.target.name + ")");
                } else {
                    labels.push(transition.name + "  ("
                                + "INIT" + "->"
                                + transition.target.name + ")");
                }
            });
            displayDelete.create({
                header: "Please select transition to be deleted...",
                textLabel: "Transition to be deleted",
                currentLabels: labels,
                buttons: ["Cancel", "Delete"]
            }).on("delete", function (e, view) {
                var t = e.data.options.get("currentLabel");
                var transitionID = transitions[t].id;
                _this.emuchartsManager.delete_transition(transitionID);
                _this.emuchartsManager.delete_initial_transition(transitionID);
                view.remove();
            }).on("cancel", function (e, view) {
                // just remove rename window
                view.remove();
            });
        });

        //-- Context menu -----------------------------------------------------------
        d3.select("#menuContext").on("mouseover", function () {
            document.getElementById("menuContext").children[1].style.display = "block";
        });
        d3.select("#btn_menuNewVariable").on("click", function () {
            document.getElementById("menuContext").children[1].style.display = "none";
            var scopeOptions = _this.emuchartsManager.getVariableScopes();
            displayAddVariable.create({
                header: "Please enter new state variable...",
                textLabel: {
                    newVariableName: "Variable name",
                    newVariableType: "Variable type",
                    newVariableValue: "Initial value",
                    newVariableScope: "Variable scope"
                },
                placeholder: {
                    newVariableName: "Name, e.g., display",
                    newVariableType: "Type, e.g., real",
                    newVariableValue: "Value, e.g., 0"
                },
                scopeOptions: scopeOptions,
                buttons: ["Cancel", "Create variable"]
            }).on("create_variable", function (e, view) {
                console.log("add variable");
                var newVariableName = e.data.labels.get("newVariableName");
                var newVariableType = e.data.labels.get("newVariableType");
                var newVariableValue = e.data.labels.get("newVariableValue");
                var newVariableScope = scopeOptions[e.data.options.get("newVariableScope")];
                if (newVariableName && newVariableName.value !== "" &&
                        newVariableType && newVariableType.value !== "" &&
                        newVariableValue && newVariableValue.value !== "") {
                    _this.emuchartsManager.add_variable({
                        name: newVariableName,
                        type: newVariableType,
                        value: newVariableValue,
                        scope: newVariableScope
                    });
                    view.remove();
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
            });
        });
        d3.select("#btn_menuEditVariable").on("click", function () {
            var editVariable = function (theVariable) {
                var variableScopes = _this.emuchartsManager.getVariableScopes();
                var scopeOptions = [];
                variableScopes.forEach(function (option) {
                    if (option === theVariable.scope) {
                        scopeOptions.push({ value: option, selected: true});
                    } else {
                        scopeOptions.push({ value: option, selected: false});
                    }
                });
                displayEditVariable.create({
                    header: "Editing variable " + theVariable.name,
                    textLabel: {
                        newVariableName: "Variable name",
                        newVariableType: "Variable type",
                        newVariableValue: "Initial value",
                        newVariableScope: "Variable scope"
                    },
                    placeholder: {
                        newVariableName: theVariable.name,
                        newVariableType: theVariable.type,
                        newVariableValue: theVariable.value,
                        newVariableScope: theVariable.scope
                    },
                    scopeOptions: scopeOptions,
                    buttons: ["Cancel", "Ok"]
                }).on("ok", function (e, view) {
                    var newVariableName = e.data.labels.get("newVariableName");
                    var newVariableType = e.data.labels.get("newVariableType");
                    var newVariableValue = e.data.labels.get("newVariableValue");
                    var newVariableScope = variableScopes[e.data.options.get("newVariableScope")];
                    if (newVariableName && newVariableName.value !== "" &&
                            newVariableType && newVariableType.value !== "" &&
                            newVariableValue && newVariableValue.value !== "") {
                        _this.emuchartsManager.rename_variable(
                            theVariable.id,
                            {   name: newVariableName,
                                type: newVariableType,
                                value: newVariableValue,
                                scope: newVariableScope   }
                        );
                        view.remove();
                    }
                }).on("cancel", function (e, view) {
                    // just remove window
                    view.remove();
                });
            };

            document.getElementById("menuContext").children[1].style.display = "none";
            // step 1: ask to select the variable that needs to be edited
            var stateVariables = _this.emuchartsManager.getVariables();
            var labels = [];
            var variables = [];
            stateVariables.forEach(function (variable) {
                labels.push(variable.name + ": " + variable.type + " (" + variable.scope + ")");
                variables.push(variable);
            });
            displaySelectVariable.create({
                header: "Edit state variable",
                message: "Please select a state variable",
                variables: labels,
                buttons: ["Cancel", "Select"]
            }).on("select", function (e, view) {
                if (variables.length > 0) {
                    var v = e.data.options.get("selectedVariable");
                    var theVariable = variables[v];
                    view.remove();
                    editVariable(theVariable);
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
                return;
            });
        });

        d3.select("#btn_menuDeleteVariable").on("click", function () {
            document.getElementById("menuContext").children[1].style.display = "none";
            // step 1: ask to select the variable that needs to be edited
            var stateVariables = _this.emuchartsManager.getVariables();
            var labels = [];
            var variables = [];
            stateVariables.forEach(function (variable) {
                labels.push(variable.name + ": " + variable.type + " (" + variable.scope + ")");
                variables.push(variable);
            });
            displaySelectVariable.create({
                header: "Delete state variable",
                message: "Please select a state variable",
                variables: labels,
                buttons: ["Cancel", "Delete Variable"]
            }).on("delete_variable", function (e, view) {
                if (variables.length > 0) {
                    var v = e.data.options.get("selectedVariable");
                    var theVariable = variables[v];
                    view.remove();
                    _this.emuchartsManager.delete_variable(theVariable.id);
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
                return;
            });
        });

        d3.select("#btn_menuNewConstant").on("click", function () {
            document.getElementById("menuContext").children[1].style.display = "none";
            displayAddConstant.create({
                header: "Please enter new constant...",
                textLabel: {
                    newConstantName: "Constant name",
                    newConstantType: "Constant type",
                    newConstantValue: "Constant value"
                },
                placeholder: {
                    newConstantName: "Name, e.g., maxRate",
                    newConstantType: "Type, e.g., real",
                    newConstantValue: "Value, e.g., 1200"
                },
                buttons: ["Cancel", "Create constant"]
            }).on("create_constant", function (e, view) {
                var newConstantName = e.data.labels.get("newConstantName");
                var newConstantType = e.data.labels.get("newConstantType");
                var newConstantValue = e.data.labels.get("newConstantValue");
                if (newConstantName && newConstantName.value !== ""
                        && newConstantType && newConstantType.value !== "") {
                    _this.emuchartsManager.add_constant({
                        name: newConstantName,
                        type: newConstantType,
                        value: newConstantValue //value can be left unspecified (uninterpreted constant)
                    });
                    view.remove();
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
            });
        });

        d3.select("#btn_menuEditConstant").on("click", function () {
            var editConstant = function (theConstant) {
                displayEditConstant.create({
                    header: "Editing constant " + theConstant.name,
                    textLabel: {
                        newConstantName: "Constant name",
                        newConstantType: "Constant type",
                        newConstantValue: "Constant value"
                    },
                    placeholder: {
                        newConstantName: theConstant.name,
                        newConstantType: theConstant.type,
                        newConstantValue: theConstant.value
                    },
                    buttons: ["Cancel", "Ok"]
                }).on("ok", function (e, view) {
                    var newConstantName = e.data.labels.get("newConstantName");
                    var newConstantType = e.data.labels.get("newConstantType");
                    var newConstantValue = e.data.labels.get("newConstantValue");
                    if (newConstantName && newConstantName.value !== ""
                            && newConstantType && newConstantType.value !== "") {
                        _this.emuchartsManager.rename_constant(
                            theConstant.id,
                            {   name: newConstantName,
                                type: newConstantType,
                                value: newConstantValue   }
                        );
                        view.remove();
                    }
                }).on("cancel", function (e, view) {
                    // just remove window
                    view.remove();
                });
            };

            document.getElementById("menuContext").children[1].style.display = "none";
            // step 1: ask to select the variable that needs to be edited
            var constants = _this.emuchartsManager.getConstants();
            var labels = [];
            constants.forEach(function (constant) {
                var l = constant.name + ": " + constant.type;
                if (constant.value) {
                    l += " = " + constant.value;
                }
                labels.push(l);
                constants.push(constant);
            });
            displaySelectConstant.create({
                header: "Edit constant",
                message: "Please select a constant",
                constants: labels,
                buttons: ["Cancel", "Select"]
            }).on("select", function (e, view) {
                if (constants.length > 0) {
                    var c = e.data.options.get("selectedConstant");
                    var theConstant = constants[c];
                    view.remove();
                    editConstant(theConstant);
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
                return;
            });
        });

        d3.select("#btn_menuDeleteConstant").on("click", function () {
            document.getElementById("menuContext").children[1].style.display = "none";
            // step 1: ask to select the variable that needs to be edited
            var constants = _this.emuchartsManager.getConstants();
            var labels = [];
            constants.forEach(function (constant) {
                var l = constant.name + ": " + constant.type;
                if (constant.value) {
                    l += " = " + constant.value;
                }
                labels.push(l);
                constants.push(constant);
            });
            displaySelectConstant.create({
                header: "Delete constant",
                message: "Please select a constant",
                constants: labels,
                buttons: ["Cancel", "Delete Constant"]
            }).on("delete_constant", function (e, view) {
                if (constants.length > 0) {
                    var c = e.data.options.get("selectedConstant");
                    var theConstant = constants[c];
                    view.remove();
                    _this.emuchartsManager.delete_constant(theConstant.id);
                }
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
                return;
            });
        });

        //-- Code generators menu -----------------------------------------------------------
        d3.select("#menuCodeGenenerators").on("mouseover", function () {
            document.getElementById("menuCodeGenenerators").children[1].style.display = "block";
        });
        d3.select("#btn_menuPVSPrinter").on("click", function () {
            var emucharts = {
                name: ("emucharts_" + projectManager.project().name().replace(/-/g, "_") + "_th"),
                author: {
                    name: "Paolo Masci",
                    affiliation: "Queen Mary University of London, United Kingdom",
                    contact: "http://www.eecs.qmul.ac.uk/~masci/"
                },
                importings: [],
                constants: _this.emuchartsManager.getConstants(),
                variables: _this.emuchartsManager.getVariables(),
                states: _this.emuchartsManager.getStates(),
                transitions: _this.emuchartsManager.getTransitions(),
                initial_transitions: _this.emuchartsManager.getInitialTransitions()
            };
            var model = emuchartsPVSPrinter.print(emucharts);
            if (model.err) {
                console.log(model.err);
                return;
            }
            if (model.res) {
                var name = emucharts.name + ".pvs";
                var content = model.res;
                return projectManager.project().addFile(name, content, { overWrite: true });
            } else {
                console.log("Warning, PVS model is undefined.");
            }
        });
        d3.select("#btn_menuPIMPrinter").on("click", function () {
            var emucharts = {
                name: ("emucharts_" + projectManager.project().name() + "_PIM"),
                author: {
                    name: "<author name>",
                    affiliation: "<affiliation>",
                    contact: "<contact>"
                },
                importings: [],
                constants: _this.emuchartsManager.getConstants(),
                variables: _this.emuchartsManager.getVariables(),
                states: _this.emuchartsManager.getStates(),
                transitions: _this.emuchartsManager.getTransitions(),
                initial_transitions: _this.emuchartsManager.getInitialTransitions()
            };
            var model = emuchartsPIMPrinter.print(emucharts);
            console.log(model);
            if (model.err) {
                console.log(model.err);
                return;
            }
            if (model.res) {
                var name = emucharts.name + ".tex";
                var content = model.res;
                return projectManager.project().addFile(name, content, { overWrite: true });
            } else {
                console.log("Warning, PIM model is undefined.");
            }
        });
        d3.select("#btn_menuCppPrinter").on("click", function () {
            var emucharts = {
                name: ("emucharts_" + projectManager.project().name()),
                author: {
                    name: "<author name>",
                    affiliation: "<affiliation>",
                    contact: "<contact>"
                },
                importings: [],
                constants: _this.emuchartsManager.getConstants(),
                variables: _this.emuchartsManager.getVariables(),
                states: _this.emuchartsManager.getStates(),
                transitions: _this.emuchartsManager.getTransitions(),
                initial_transitions: _this.emuchartsManager.getInitialTransitions()
            };
            var model = emuchartsPIMPrinter.print(emucharts);
            console.log(model);
            if (model.err) {
                console.log(model.err);
                return;
            }
            if (model.res) {
                var name = emucharts.name + ".cpp";
                var content = model.res;
                return projectManager.project().addFile(name, content, { overWrite: true });
            } else {
                console.log("Warning, C++ model is undefined.");
            }
        });
        d3.select("#btn_menuMALPrinter").on("click", function () {
            var emucharts = {
                name: ("emucharts_" + projectManager.project().name() + "_MAL"),
                author: {
                    name: "<author name>",
                    affiliation: "<affiliation>",
                    contact: "<contact>"
                },
                importings: [],
                constants: _this.emuchartsManager.getConstants(),
                variables: _this.emuchartsManager.getVariables(),
                states: _this.emuchartsManager.getStates(),
                transitions: _this.emuchartsManager.getTransitions(),
                initial_transitions: _this.emuchartsManager.getInitialTransitions()
            };
            var model = emuchartsMALPrinter.print(emucharts);
            console.log(model);
            if (model.err) {
                console.log(model.err);
                return;
            }
            if (model.res) {
                var name = emucharts.name + ".i";
                var content = model.res;
                return projectManager.project().addFile(name, content, { overWrite: true });
            } else {
                console.log("Warning, MAL model is undefined.");
            }
        });
        d3.select("#btn_menuVDMPrinter").on("click", function () {
            var emucharts = {
                name: ("emucharts_" + projectManager.project().name() + "_VDM"),
                author: {
                    name: "<author name>",
                    affiliation: "<affiliation>",
                    contact: "<contact>"
                },
                importings: [],
                constants: _this.emuchartsManager.getConstants(),
                variables: _this.emuchartsManager.getVariables(),
                states: _this.emuchartsManager.getStates(),
                transitions: _this.emuchartsManager.getTransitions(),
                initial_transitions: _this.emuchartsManager.getInitialTransitions()
            };
            var model = emuchartsVDMPrinter.print(emucharts);
            console.log(model);
            if (model.err) {
                console.log(model.err);
                return;
            }
            if (model.res) {
                var name = emucharts.name + ".vdmsl";
                var content = model.res;
                return projectManager.project().addFile(name, content, { overWrite: true });
            } else {
                console.log("Warning, VDM model is undefined.");
            }
        });

        d3.select("#btn_menuJavaScriptPrinter").on("click", function () {
            var emucharts = {
                name: (emuchartsJSPrinter.modelName),
                author: {
                    name: "<author name>",
                    affiliation: "<affiliation>",
                    contact: "<contact>"
                },
                importings: [],
                constants: _this.emuchartsManager.getConstants(),
                variables: _this.emuchartsManager.getVariables(),
                states: _this.emuchartsManager.getStates(),
                transitions: _this.emuchartsManager.getTransitions(),
                initial_transitions: _this.emuchartsManager.getInitialTransitions()
            };
            var model = emuchartsJSPrinter.print(emucharts);
            console.log(model);
            if (model.err) {
                console.log(model.err);
                return;
            }
            if (model.res) {
                var name = emucharts.name + ".js";
                var content = model.res;
                return projectManager.project().addFile(name, content, { overWrite: true });
            } else {
                console.log("Warning, JavaScript model is undefined.");
            }
        });

        d3.select("#btn_menuAdaPrinter").on("click", function () {
            var emucharts = {
                name: (emuchartsAdaPrinter.modelName),
                author: {
                    name: "<author name>",
                    affiliation: "<affiliation>",
                    contact: "<contact>"
                },
                importings: [],
                constants: _this.emuchartsManager.getConstants(),
                variables: _this.emuchartsManager.getVariables(),
                states: _this.emuchartsManager.getStates(),
                transitions: _this.emuchartsManager.getTransitions(),
                initial_transitions: _this.emuchartsManager.getInitialTransitions()
            };
            var model = emuchartsAdaPrinter.print(emucharts);
            console.log(model);
            if (model.err) {
                console.log(model.err);
                return;
            }
            if (model.spec && model.body) {
                var overWrite = {overWrite: true};
                projectManager.project().addFile(emucharts.name + ".adb", model.body, overWrite);
                projectManager.project().addFile(emucharts.name + ".ads", model.spec, overWrite);
            } else {
                console.log("Warning, Ada model is undefined.");
            }
        });
        d3.select("#btn_menuBlessPrinter").on("click", function () {
            var emucharts = {
                name: (emuchartsBlessPrinter.modelName),
                author: {
                    name: "<author name>",
                    affiliation: "<affiliation>",
                    contact: "<contact>"
                },
                importings: [],
                constants: _this.emuchartsManager.getConstants(),
                variables: {
                    input: _this.emuchartsManager.getInputVariables(),
                    output: _this.emuchartsManager.getOutputVariables(),
                    local: _this.emuchartsManager.getLocalVariables()
                },
                states: _this.emuchartsManager.getStates(),
                transitions: _this.emuchartsManager.getTransitions(),
                initial_transitions: _this.emuchartsManager.getInitialTransitions()
            };
            var model = emuchartsBlessPrinter.print(emucharts);
            console.log(model);
            if (model.err) {
                console.log(model.err);
                return;
            }
            if (model.thread) {
                var overWrite = {overWrite: true};
                projectManager.project().addFile(emucharts.name + ".aadl", model.thread, overWrite);
            } else {
                console.log("Warning, Bless model is undefined.");
            }
        });        
        //-- Zoom menu -----------------------------------------------------------
        d3.select("#menuZoom").on("mouseover", function () {
            document.getElementById("menuZoom").children[1].style.display = "block";
        });
        d3.select("#btn_menuZoomIn").on("click", function () {
            _this.emuchartsManager.zoom_in();
            document.getElementById("menuZoom").children[1].style.display = "none";
        });
        d3.select("#btn_menuZoomOut").on("click", function () {
            _this.emuchartsManager.zoom_out();
            document.getElementById("menuZoom").children[1].style.display = "none";
        });
        d3.select("#btn_menuZoomReset").on("click", function () {
            _this.emuchartsManager.zoom_reset();
            document.getElementById("menuZoom").children[1].style.display = "none";
        });

        //--node filter handler
        d3.select("input#filter").on("keyup", function () {
            var editor = _this.emuchartsManager.getSelectedEditor();
            if (editor) {
                editor._nodeFilter = d3.select("input#filter").property("value");
                _this.emuchartsManager.render();
            }
        });

        //-- PIM -----------------------------------------------------------------
        d3.select("#btn_toPIM").on("click", function () {
            if (_this.emuchartsManager.getIsPIM()) {
                console.log("Warning, current emuchart is already a PIM.");
                return;
            }
            if (_this.emuchartsManager.toPIM(true)) {
                console.log("Success, converted emuchart to a PIM.");
            }
            else {
                console.log("Warning, unable to convert emuchart to a PIM.");
            }
        });
        d3.select("#btn_fromPIM").on("click", function () {
            if (!_this.emuchartsManager.getIsPIM()) {
                console.log("Warning, current emuchart is not a PIM.");
                return;
            }
            if (_this.emuchartsManager.toPIM(false)) {
                console.log("Success, converted emuchart from a PIM.");
            }
            else {
                console.log("Warning, unable to convert emuchart from a PIM.");
            }
        });
        d3.select("#btn_menuTestGenerator").on("click", function () {
            if (!_this.emuchartsManager.getIsPIM()) {
                console.log("Warning, current emuchart is not a PIM.");
                return;
            }
            var initTrans = _this.emuchartsManager.getInitialTransitions();
            var emuchart = {
                name: ("emucharts_" + projectManager.project().name()),
                author: {
                    name: "<author name>",
                    affiliation: "<affiliation>",
                    contact: "<contact>"
                },
                //constants: _this.emuchartsManager.getConstants(),
                //variables: _this.emuchartsManager.getVariables(),
                states: _this.emuchartsManager.getStates(),
                transitions: _this.emuchartsManager.getTransitions(),
                initial_transitions: initTrans,
                pm: {
                    name: projectManager.project().name(),
                    widgets: [],
                    components: _this.emuchartsManager.getStates(),
                    pmr: []
                },
                start_state: initTrans ? initTrans[0].target.name : "",
                final_states: [],
                isPIM: _this.emuchartsManager.getIsPIM()
            };

            var tests = pimTestGenerator.print(emuchart.name, { pims: [ emuchart ], pms: [] });
            if (tests.err) {
                console.log(tests.err);
                return;
            }
            if (tests.res) {
                var name = tests.file_name;
                var content = tests.res;
                return projectManager.project().addFile(name, content, { overWrite: true });
            } else {
                console.log("Warning, TestGenerator model is undefined.");
            }
        });
        d3.select("#btn_menuTestGeneratorFromFile").on("click", function () {
            var models;
            // Generate tests from importing a file
            fs.openLocalFileAsText(function (err, res) {
                if (res) {
                    // Try parse as PIM
                    models = pimImporter.importPIM(res);
                    if (models.err) {
                        console.log(models.err);
                        return;
                    }
                    // Remove file extension
                    var name = res.name.substr(0, res.name.lastIndexOf('.'));
                    var tests = pimTestGenerator.print(name, models.models);
                    if (tests.err) {
                        console.log(tests.err);
                        return;
                    }

                    if (tests.res) {
                        var testsName = tests.file_name;
                        var content = tests.res;
                        return projectManager.project().addFile(testsName, content, { overWrite: true });

                    } else {
                        console.log("Warning, TestGenerator model is undefined.");
                    }

                } else {
                    console.log("Error while opening file (" + err + ")");
                }

            }, { header: "Open PIM file..." });
        });
	}


    Emulink.prototype.getDependencies = function () {
        return [];
    };

    function onProjectChanged(event) {
        // try to open the default emuchart file associated with the project
        var defaultEmuchartFilePath = event.current + "/" + "emucharts_" + event.current + ".emdl";
        fs.readFile(defaultEmuchartFilePath).then(function (res) {
            res.content = JSON.parse(res.content);
            _this.emuchartsManager.importEmucharts(res);
            // make svg visible and reset colors
            initToolbars();
            // render emuchart
            _this.emuchartsManager.render();
            // set initial editor mode
            d3.select("#btn_toolbarBrowse").node().click();
            //set Variables Table
            contextTable.setContextVariables(_this.emuchartsManager.getVariables());            
        }).catch(function (err) {
            // if the default emuchart file is not in the project, then just clear the current diagram
            d3.select("#btnNewEmuchart").node().click();
        });
    }

    Emulink.prototype.initialise = function () {
//        //enable the plugin -- this should also enable any dependencies defined in getDependencies method
//        var prototypeBuilder = PrototypeBuilder.getInstance();
        // create local references to PVS editor, websocket client, and project manager
        editor = ModelEditor.getInstance().getEditor();
        ws = pvsioWebClient.getWebSocket();
        projectManager = ProjectManager.getInstance();
        // listen to ProjectChanged events so that we can update the editor when a new project is opened
        projectManager.addListener("ProjectChanged", onProjectChanged);
        // create user interface elements
        this.createHtmlElements();
        // try to load default emuchart for the current project
        onProjectChanged({current: projectManager.project().name()});
        return Promise.resolve(true);
    };

    Emulink.prototype.unload = function () {
        PVSioWebClient.getInstance().removeCollapsiblePanel(canvas);
        canvas = null;
    };

    module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new Emulink();
            }
            return instance;
        }
    };
});
