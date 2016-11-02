/** @module EmuchartsManager*/
/**
 * EmuchartsManager handles all operations with emuchart diagrams. Uses external modules
 * for rendering and storing emuchart diagrams. This is code is a re-engineered version
 * of stateMachine.js implemented in branch emulink-commented
 * @author Paolo Masci
 * @date 14/05/14 2:49:23 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3*/
define(function (require, exports, module) {
    "use strict";
    var Emucharts = require("plugins/emulink/Emucharts"),
        EmuchartsEditor = require("plugins/emulink/EmuchartsEditor"),
        eventDispatcher = require("util/eventDispatcher"),
        Colors = require("plugins/emulink/tools/Colors"),
        UppaalConverter = require("plugins/emulink/tools/UppaalConverter").getInstance();

    var _emuchartsEditors; // stores emucharts renderers
    var _selectedEditor; // this is the selected editor

    /**
     * Constructor
     * @memberof EmuchartsManager
     */
    function EmuchartsManager() {
        _emuchartsEditors = d3.map();
        eventDispatcher(this);
        this.newEmucharts("foo");
        return this;
    }

    EmuchartsManager.prototype.getTransformation = function () {
        return _selectedEditor.getTransformation();
    };

    EmuchartsManager.prototype.installHandlers = function (editor) {
        var _this = this;
        editor.addListener("emuCharts_editorModeChanged", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_addState", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_addTransition", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_addInitialTransition", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_constantAdded", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_constantRemoved", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_constantRenamed", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_datatypeAdded", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_datatypeRemoved", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_datatypeRenamed", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_variableAdded", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_variableRemoved", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_variableRenamed", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_deleteState", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_deleteTransition", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_deleteInitialTransition", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_renameState", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_renameTransition", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_renameInitialTransition", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_stateAdded", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_transitionAdded", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_initialTransitionAdded", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_stateRemoved", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_transitionRemoved", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_initialTransitionRemoved", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_stateRenamed", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_transitionRenamed", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_initialTransitionRenamed", function (event) { _this.fire(event); });
    };

    /**
     * Creates a new empty emuchart using the data passed as argument.
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.newEmucharts = function (emuchartsName) {
        if (emuchartsName) {
            // create an editor for an empty chart
            var emucharts = new Emucharts({
                nodes: d3.map(),
                edges: d3.map(),
                initial_edges: d3.map(),
                variables: d3.map(),
                constants: d3.map()
            });
            var newEmuchartsEditor = new EmuchartsEditor(emucharts);
            this.installHandlers(newEmuchartsEditor);
            _emuchartsEditors.set(name, newEmuchartsEditor);
            _selectedEditor = newEmuchartsEditor;
        } else { console.log("dbg: warning, undefined or null emuchart name"); }
    };

    EmuchartsManager.prototype.importUppaalV4 = function (XMLFile) {
        if (XMLFile && XMLFile.content) {
            var uDesc = UppaalConverter.openUppaalV4(XMLFile);
            var emuDesc = UppaalConverter.Uppaal2Emucharts(uDesc);
            var chart = {
                descriptor: {
                    file_type: "emdl",
                    version: "1.1",
                    description: "emucharts model",
                    chart_name: emuDesc.name
                },
                chart: emuDesc
            };
            this.importEmucharts({ name: chart.chart_name, content: chart });
        }
        return this;
    }

    /**
     * Imports the emuchart passed as argument.
     * @memberof EmuchartsManager
     * FIXME: improve this function!
     */
    EmuchartsManager.prototype.importEmucharts = function (emuchartsFile) {
        var _this = this;
        if (emuchartsFile && emuchartsFile.content) {
            var keys = Object.keys(emuchartsFile.content);
            if (keys) {
                // check if this is version 1.0
                if (emuchartsFile.content && emuchartsFile.content.descriptor) {
                    var version = emuchartsFile.content.descriptor.version;
                    if (version && parseFloat(version) >= 1.1) {
                        var chart = { nodes: d3.map(), edges: d3.map(), initial_edges: d3.map(),
                                      variables: d3.map(), constants: d3.map() };
                        var chart_reader = emuchartsFile.content.chart;
                        if (chart_reader.states) {
                            chart_reader.states.forEach(function (node) {
                                node.color = node.color || Colors.getColor(node.id);
                                node.width = node.width || 36;
                                node.height = node.height || 36;
                                node.x = node.x || 100;
                                node.y = node.y || 100;
                                chart.nodes.set(node.id, node);
                            });
                        }
                        if (chart_reader.transitions) {
                            chart_reader.transitions.forEach(function (edge) {
                                if (edge.source) {
                                    var source = chart_reader.states.filter(function (node) {
                                        return node.id === edge.source.id;
                                    });
                                    if (source && source[0]) {
                                        edge.source = source[0];
                                    } else { console.log("dbg: warning, node " + edge.source.id + " not found while loading emdl file."); }
                                }
                                if (edge.target) {
                                    var target = chart_reader.states.filter(function (node) {
                                        return node.id === edge.target.id;
                                    });
                                    if (target && target[0]) {
                                        edge.target = target[0];
                                    } else { console.log("dbg: warning, node " + edge.target.id + " not found while loading emdl file."); }
                                }
                                chart.edges.set(edge.id, edge);
                            });
                        }
                        if (chart_reader.initial_transitions) {
                            chart_reader.initial_transitions.forEach(function (edge) {
                                if (edge.target) {
                                    var target = chart_reader.states.filter(function (node) {
                                        return node.id === edge.target.id;
                                    });
                                    if (target && target[0]) {
                                        edge.target = target[0];
                                    } else { console.log("dbg: warning, node " + edge.target.id + " not found while loading emdl file."); }
                                }
                                chart.initial_edges.set(edge.id, edge);
                            });
                        }
                        if (chart_reader.variables) {
                            chart_reader.variables.forEach(function (variable) {
                                chart.variables.set(variable.id, variable);
                            });
                        }
                        if (chart_reader.constants) {
                            chart_reader.constants.forEach(function (constant) {
                                chart.constants.set(constant.id, constant);
                            });
                        }
                        if (chart_reader.pmr) {
                            chart.pmr = d3.map();
                            for (var behaviour in chart_reader.pmr) {
                                if (chart_reader.pmr.hasOwnProperty(behaviour)) {
                                    chart.pmr.set(behaviour, chart_reader.pmr[behaviour]);
                                }
                            }
                        }
                        // associate an editor to the created emuchart
                        // FIXME: Improve the constructor and this importEmuchart function
                        var emuchart = {
                            nodes:  chart.nodes,
                            edges: chart.edges,
                            initial_edges: chart.initial_edges,
                            variables: chart.variables,
                            constants: chart.constants
                        };
                        if (chart.pmr !== 'undefined') {
                            emuchart.pmr = chart.pmr;
                        }
                        if (chart_reader.isPIM && chart_reader.isPIM === true) {
                            emuchart.isPIM = true;
                        }
                        var emucharts = new Emucharts(emuchart);
                        var newEmuchartsEditor = new EmuchartsEditor(emucharts);
                        _this.installHandlers(newEmuchartsEditor);
                        _emuchartsEditors.set(emuchartsFile.content.descriptor.chart_name, newEmuchartsEditor);
                        _selectedEditor = newEmuchartsEditor;
                    } else {
                        alert("Error while importing emuchart file: unsupported file version " + version);
                    }
                } else {
                    console.log("Warning: deprecated file version");
                    // create a map for each chart
                    keys.forEach(function (name) {
                        var chart = { nodes: d3.map(), edges: d3.map(), initial_edges: d3.map() };
                        emuchartsFile.content[name].nodes
                            .forEach(function (node) {
                                node.color = node.color || Colors.getColor(node.id);
                                chart.nodes.set(node.id, node);
                            });
                        emuchartsFile.content[name].edges
                            .forEach(function (edge) { chart.edges.set(edge.id, edge); });
                        emuchartsFile.content[name].initial_edges
                            .forEach(function (initial_edge) {
                                chart.initial_edges.set(initial_edge.id, initial_edge);
                            });
                        // associate an editor to the created emuchart
                        var emucharts = new Emucharts({
                            nodes: chart.nodes,
                            edges: chart.edges,
                            initial_edges: chart.initial_edges
                        });
                        var newEmuchartsEditor = new EmuchartsEditor(emucharts);
                        _this.installHandlers(newEmuchartsEditor);
                        _emuchartsEditors.set(name, newEmuchartsEditor);
                        _selectedEditor = newEmuchartsEditor;
                    });
                }
            }
        } else { console.log("dbg: warning, undefined or null emuchart"); }
    };

    /**
     * Imports the emuchart passed as argument.
     * @memberof EmuchartsManager
     * FIXME: improve this function!
     */
    EmuchartsManager.prototype.importPIMChart = function (MUZFile) {
        if (MUZFile && MUZFile.content) {
            // parse section ==Seq==
            var needle = MUZFile.content.indexOf("==Seq==");
            if (needle < 0) {
                console.log("Error while parsing MUZ file (section ==Seq== not found)");
                return;
            }
            MUZFile.content = MUZFile.content.substring(needle + 7);
            // first line is chart name
            var txt = new RegExp("[\\n\\s]+[A-Za-z_0-9]+").exec(MUZFile.content);
            if (txt.length === 0) {
                console.log("Error while parsing MUZ file (chart name not found)");
                return;
            }
            var chartName = txt[0];
            MUZFile.content = MUZFile.content.substring(chartName.length);
            // second line is initial state
            txt = new RegExp("[\\n\\s]+[A-Za-z_0-9]+").exec(MUZFile.content);
            if (txt.length === 0) {
                console.log("Error while parsing MUZ file (initial state not found)");
                return;
            }
            var initialTransition = {
                id: "INIT_" + txt[0].trim(),
                name: "INIT_" + txt[0].trim(),
                target: { name: txt[0].trim(), id: txt[0].trim() }
            };
            MUZFile.content = MUZFile.content.substring(chartName.length);

            // parse section ==States==
            needle = MUZFile.content.indexOf("==States==");
            if (needle < 0) {
                console.log("Error while parsing MUZ file (section ==States== not found)");
                return;
            }
            MUZFile.content = MUZFile.content.substring(needle + 10);

            var states = [];
            var stop = false;
            while (!stop) {
                // each line contains state name and coordinates
                txt = new RegExp("[\\n\\s]+[A-Za-z_0-9]+").exec(MUZFile.content);
                if (txt.length === 0) {
                    console.log("Error while parsing MUZ file (state names not found)");
                    return;
                }
                var stateName = txt[0];
                MUZFile.content = MUZFile.content.substring(stateName.length);
                txt = new RegExp("[\\n\\s]+[0-9]+").exec(MUZFile.content);
                if (txt.length === 0) {
                    console.log("Error while parsing MUZ file (position x not found for state " + stateName + ")");
                    return;
                }
                needle = MUZFile.content.indexOf("Atomic");
                if (needle < 0) {
                    console.log("Error while parsing MUZ file (Atomic keyword not found for state " + stateName + ")");
                    return;
                }
                MUZFile.content = MUZFile.content.substring(needle + 6);
                // note: we use just the first two coordinates to identify the center of the state; height and width are automatically computed by our graphical frontend
                var x = txt[0];
                MUZFile.content = MUZFile.content.substring(x.length);
                txt = new RegExp("[\\n\\s]+[0-9]+").exec(MUZFile.content);
                if (txt.length === 0) {
                    console.log("Error while parsing MUZ file (position y not found for state " + stateName + ")");
                    return;
                }
                var y = txt[0];
                MUZFile.content = MUZFile.content.substring(y.length);

                // add state to states array
                states.push({ name: stateName.trim(),
                              id: stateName.trim(),
                              x: parseFloat(x),
                              y: parseFloat(y),
                              width: 50,
                              height: 50 });

                // remove the rest of the line & check for stop condition
                MUZFile.content = MUZFile.content.substring(MUZFile.content.indexOf("\n"));
                if (MUZFile.content.trim().indexOf("==Transitions==") === 0) {
                    stop = true;
                }
            }

            // parse section ==Transitions==
            needle = MUZFile.content.indexOf("==Transitions==");
            if (needle < 0) {
                console.log("Error while parsing MUZ file (section ==Transitions== not found)");
                return;
            }
            MUZFile.content = MUZFile.content.substring(needle + 15);


            var transitions = [];
            stop = false;
            var uniqueToken = 0;
            while (!stop) {
                // each line contains state names (from, to) and transition name
                // parse source
                txt = new RegExp("[\\n\\s]+[A-Za-z_0-9]+").exec(MUZFile.content);
                if (txt.length === 0) {
                    console.log("Error while parsing MUZ file (source state for transition not found)");
                    return;
                }
                var source = txt[0];
                MUZFile.content = MUZFile.content.substring(source.length);
                // parse target
                txt = new RegExp("[\\s]+[A-Za-z_0-9]+").exec(MUZFile.content);
                if (txt.length === 0) {
                    console.log("Error while parsing MUZ file (target state for transition not found)");
                    return;
                }
                var target = txt[0];
                MUZFile.content = MUZFile.content.substring(target.length);
                // parse transition name
                txt = new RegExp("[\\s]+[A-Za-z_0-9]+").exec(MUZFile.content);
                if (txt.length === 0) {
                    console.log("Error while parsing MUZ file (transition name not found)");
                    return;
                }
                var transitionName = txt[0];
                MUZFile.content = MUZFile.content.substring(transitionName.length);

                // add transition to transitions array
                transitions.push({
                    name: transitionName.trim(),
                    id: transitionName.trim() + uniqueToken++,
                    source: {
                        name: source.trim(),
                        id: source.trim()
                    },
                    target: {
                        name: target.trim(),
                        id: target.trim()
                    }
                });

                // remove the rest of the line & check for stop condition
                MUZFile.content = MUZFile.content.substring(MUZFile.content.indexOf("\n"));
                if (MUZFile.content.trim().indexOf("==LocalVariables==") === 0) {
                    stop = true;
                }
            }
            var chart = {
                descriptor: {
                    file_type: "emdl",
                    version: "1.1",
                    description: "emucharts model",
                    chart_name: chartName.trim()
                },
                chart: {
                    states: states,
                    transitions: transitions,
                    initial_transitions: [ initialTransition ],
                    constants: null,
                    variables: null
                }
            };
            this.importEmucharts({ name: chartName.trim(), content: chart });
        } else { console.log("dbg: warning, undefined or null MUZFile"); }
    };

    /**
     * Draws the diagrams stored in _emucharts.
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.render = function (opt) {
        _selectedEditor.render(opt);
        return this;
    };

    /**
     * Draws the a preview of the diagram in the div element passed as parameter
     * @param container DIV element that will contain the preview
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.preview = function (container, scale_zoom, type) {
        _selectedEditor.preview(container, scale_zoom, type);
        return this;
    };

    /**
     * Returns a the Emucharts Editor that is currently active.
     * The current implementation supports only one Emucharts Editor.
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getSelectedEditor = function () {
        return _selectedEditor;
    };

    /**
     * Returns a fresh state name
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getFreshStateName = function () {
        return _selectedEditor.getFreshStateName();
    };

    /**
     * Returns a fresh transition name
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getFreshTransitionName = function () {
        return _selectedEditor.getFreshTransitionName();
    };

    /**
     * Returns a fresh name for initial transitions
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getFreshInitialTransitionName = function () {
        return _selectedEditor.getFreshInitialTransitionName();
    };

    /**
     * Interface function for changing mode in the currently selected editor
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.set_editor_mode = function (mode) {
        return _selectedEditor.set_editor_mode(mode);
    };

    /**
     * Interface function for adding new states to the diagram
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.add_state = function (stateName, position) {
        return _selectedEditor.add_state(stateName, position);
    };

    /**
     * Interface function for deleting states
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.delete_state = function (stateID) {
        return _selectedEditor.delete_state(stateID);
    };

    /**
     * Interface function for adding new transitions to the diagram
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.add_transition = function (transitionName, from, to) {
        return _selectedEditor.add_transition(transitionName, from, to);
    };

    /**
     * Interface function for adding new initial transitions to the diagram
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.add_initial_transition = function (transitionName, to) {
        return _selectedEditor.add_initial_transition(transitionName, to);
    };

    /**
     * Interface function for deleting transitions
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.delete_transition = function (transitionID) {
        return _selectedEditor.delete_transition(transitionID);
    };

    /**
     * Interface function for deleting a constant
     * @param constantID is the unique constant identifier
     * @returns true if constant removed successfully; otherwise returns false
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.delete_constant = function (constantID) {
        return _selectedEditor.delete_constant(constantID);
    };

    /**
     * Interface function for deleting a datatype
     * @param constantID is the unique datatype identifier
     * @returns true if datatype removed successfully; otherwise returns false
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.delete_datatype = function (datatypeID) {
        return _selectedEditor.delete_datatype(datatypeID);
    };

    /**
     * Interface function for deleting a variable
     * @param variableID is the unique variable identifier
     * @returns true if variable removed successfully; otherwise returns false
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.delete_variable = function (variableID) {
        return _selectedEditor.delete_variable(variableID);
    };

    /**
     * Interface function for deleting initial transitions
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.delete_initial_transition = function (transitionID) {
        return _selectedEditor.delete_initial_transition(transitionID);
    };

    /**
     * Returns an array containing the current set of states
     * Each states is given as a pair { name, id }
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getStates = function () {
        return _selectedEditor.getStates();
    };

    /**
     * Returns an array containing the current set of states
     * @description Returns the descriptor of a state.
     * @param id {String} The identifier of the state.
     * @memberof EmuchartsManager
     * @instance
     */
    EmuchartsManager.prototype.getState = function (id) {
        return _selectedEditor.getState(id);
    };

    /**
     * Returns an array containing the current set of constants defined in the model
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getConstants = function () {
        return _selectedEditor.getConstants();
    };

    /**
     * Returns the descriptor of the constant whose ID is the function argument
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getConstant = function (constantID) {
        return _selectedEditor.getConstant(constantID);
    };

    /**
     * Returns an array containing the current set of datatypes defined in the model
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getDatatypes = function () {
        return _selectedEditor.getDatatypes();
    };

    /**
     * Returns the descriptor of the datatype whose ID is the function argument
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getDatatype = function (datatypeID) {
        return _selectedEditor.getDatatype(datatypeID);
    };

    /**
     * Returns an array containing the current set of variables defined in the model
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getVariables = function () {
        return _selectedEditor.getVariables();
    };

    /**
     * Returns the descriptor of the variable whose ID is the function argument
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getVariable = function (variableID) {
        return _selectedEditor.getVariable(variableID);
    };

    /**
     * Returns an array containing the current set of input variables defined in the model
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getInputVariables = function () {
        return _selectedEditor.getInputVariables();
    };

    /**
     * Returns an array containing the current set of output variables defined in the model
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getOutputVariables = function () {
        return _selectedEditor.getOutputVariables();
    };

    /**
     * Returns an array containing the current set of local variables defined in the model
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getLocalVariables = function () {
        return _selectedEditor.getLocalVariables();
    };

    /**
     * Returns an array specifying the supported variable scopes
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getVariableScopes = function () {
        return _selectedEditor.getVariableScopes();
    };

    /**
     * Returns an array containing the current set of transitions
     * Each transition is given as a 4-tuple { name, id, source, target }
     * where source and target are pairs { name, id }
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getTransitions = function () {
        return _selectedEditor.getTransitions();
    };
    EmuchartsManager.prototype.getTransition = function (id) {
        return _selectedEditor.getTransition(id);
    };

    /**
     * Returns an array containing the current set of initial transitions
     * Each transition is given as a 3-tuple { name, id, target }
     * where target is a pair { name, id }
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.getInitialTransitions = function () {
        return _selectedEditor.getInitialTransitions();
    };

    /**
     * Utility function to rename transitions
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.rename_transition = function (transitionID, newLabel) {
        return _selectedEditor.rename_transition(transitionID, newLabel);
    };

    /**
     * Utility function to refresh transition style (e.g., color)
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.refresh_transition = function (transitionID, opt) {
        return _selectedEditor.refresh_transition(transitionID, opt);
    };

    /**
     * Utility function to rename initial transitions
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.rename_initial_transition = function (transitionID, newLabel) {
        return _selectedEditor.rename_initial_transition(transitionID, newLabel);
    };

    /**
     * Utility function to edit states
     * @param stateID unique state identifier
     * @param data Structured type with two fields:
     *    - name (String)
     *    - color (String)
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.edit_state = function (stateID, data) {
        return _selectedEditor.edit_state(stateID, data);
    };

    /**
     * Interface function for renaming (i.e., editing) a constant
     * @param constantID is the unique constant identifier
     * @param newData is a record containing fields { type: (string), name: (string), value: (string) }
     *              (field value is optional)
     * @returns true if constant renamed successfully; otherwise returns false
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.rename_constant = function (constantID, newData) {
        return _selectedEditor.rename_constant(constantID, newData);
    };

    /**
     * Interface function for renaming (i.e., editing) a datatype
     * @param constantID is the unique datatype identifier
     * @param newData is a record containing fields { type: (string), constructors: [Array], value: (string) }
     * @returns true if datatype renamed successfully; otherwise returns false
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.rename_datatype = function (datatypeID, newData) {
        return _selectedEditor.rename_datatype(datatypeID, newData);
    };

    /**
     * Interface function for renaming (i.e., editing) a state variable
     * @param variableID is the unique variable identifier
     * @param newData is a record containing fields { type: (string), name: (string), scope: (string) }
     * @returns true if variable renamed successfully; otherwise returns false
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.rename_variable = function (variableID, newData) {
        return _selectedEditor.rename_variable(variableID, newData);
    };

    /**
     * Interface function for adding constants
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.add_constant = function (newConstant) {
        return _selectedEditor.add_constant(newConstant);
    };

    /**
     * Interface function for adding datatypes
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.add_datatype = function (newDatatype) {
        return _selectedEditor.add_datatype(newDatatype);
    };

    /**
     * Interface function for adding state variables
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.add_variable = function (newVariable) {
        return _selectedEditor.add_variable(newVariable);
    };

    /**
     * Interface function for zooming in
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.zoom_in = function () {
        return _selectedEditor.zoom_in();
    };

    /**
     * Interface function for zooming out
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.zoom_out = function () {
        return _selectedEditor.zoom_out();
    };

    /**
     * Interface function for zoom reset
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.zoom_reset = function () {
        return _selectedEditor.zoom_reset();
    };

    /**
     * Interface function for deleting charts
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.delete_chart = function () {
        return _selectedEditor.delete_chart();
    };

    /**
     * Interface function for checking whether the selected chart is empty
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.empty_chart = function () {
        return _selectedEditor.empty_chart();
    };

//    /**
//	 * Interface function for handling d3 events
//	 * @memberof EmuchartsManager
//	 */
//    EmuchartsManager.prototype.d3ZoomTranslate = function (d3Scale, d3Translate) {
//        return _selectedEditor.d3ZoomTranslate(d3Scale, d3Translate);
//    };

    /** PIM **/

    /**
     * Convert the current Emuchart to a PIM (or if from a PIM).
     * @returns {boolean} True Emuchart became a PIM or a PIM became an Emuchart.
     */
    EmuchartsManager.prototype.toPIM = function (toPIM) {
        return _selectedEditor.toPIM ? _selectedEditor.toPIM(toPIM) : false;
    };

    /**
     * Returns if this emuchart is a PIM.
     * @returns {boolean} If this emuchart is a PIM.
     */
    EmuchartsManager.prototype.getIsPIM = function () {
        return _selectedEditor.getIsPIM ? _selectedEditor.getIsPIM() : false;
    };

    /**
     *
     * @param behaviour
     * @returns If no behaviour provided returns all PMR as a set,
     * If behaviour could be found then returns the relation (behaviour, operation),
     * else returns null.
     */
    EmuchartsManager.prototype.getPMR = function (behaviour, isSave) {
        return _selectedEditor.getPMR ? _selectedEditor.getPMR(behaviour, isSave) : d3.map();
    };

    /**
     * Add a PMR (overrites any existing PMR for the given behaviour).
     * ({behaviour (string), operation (string)}).
     * @param pmr
     * @returns boolean true if successfully added.
     */
    EmuchartsManager.prototype.addPMR = function (pmr) {
        return _selectedEditor.addPMR ? _selectedEditor.addPMR(pmr) : false;
    };

    /**
     * Saves the new PMRs into the pool of all PMRs
     * @param newPMRs
     * @returns {boolean}
     */
    EmuchartsManager.prototype.mergePMR = function (newPMRs) {
        return _selectedEditor.mergePMR ? _selectedEditor.mergePMR(newPMRs) : false;
    };

    module.exports = EmuchartsManager;
});
