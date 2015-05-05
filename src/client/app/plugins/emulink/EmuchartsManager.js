/** @module EmuchartsManager*/
/**
 * EmuchartsManager handles all operations with emuchart diagrams. Uses external modules
 * for rendering and storing emuchart diagrams. This is code is a re-engineered version 
 * of stateMachine.js implemented in branch emulink-commented
 * @author Paolo Masci
 * @date 14/05/14 2:49:23 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _, Promise, document, FileReader*/

define(function (require, exports, module) {
	"use strict";
	var Emucharts = require("plugins/emulink/Emucharts"),
        EmuchartsEditor = require("plugins/emulink/EmuchartsEditor"),
        eventDispatcher = require("util/eventDispatcher");
    
    var _emuchartsEditors; // stores emucharts renderers
    var _selectedEditor; // this is the selected editor
    
	/**
	 * Constructor
	 * @memberof EmuchartsManager
	 */
    function EmuchartsManager() {
        _emuchartsEditors = d3.map();
        eventDispatcher(this);
    }
    
    EmuchartsManager.prototype.installHandlers = function (editor) {
        var _this = this;
        editor.addListener("emuCharts_editorModeChanged", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_addState", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_addTransition", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_addInitialTransition", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_constantAdded", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_variableAdded", function (event) { _this.fire(event); });
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
        var _this = this;
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
                        // associate an editor to the created emuchart
                        // FIXME: Improve the constructor and this importEmuchart function
                        var emucharts = new Emucharts({
                            nodes:  chart.nodes,
                            edges: chart.edges,
                            initial_edges: chart.initial_edges,
                            variables: chart.variables,
                            constants: chart.constants
                        });
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
                            .forEach(function (node) { chart.nodes.set(node.id, node); });
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
        var _this = this;
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
     * Reads in Presentation Interaction Models with corresponding
     * Presentation Models from a file.
     * @param file The file to read the models from
     * @returns {{pims: Array, pms: Array}} The PIMS and PMS from the file
     * @memberof EmuchartsManager
     */
    EmuchartsManager.prototype.importPIMChartV2 = function (fileIn) {
        /** Index within the file */
        var index;
        /** File array */
        var file;
        /** Presentation Models array */
        var pModels = [];
        /** Presentation Interaction Models array */
        var pims = [];

        /**
         * Reads in PIMs (Populates pims)
         */
        function readPIMs() {
            /**
             * Reads in states
             * @returns {Array} Array of states for a PIM
             */
            function readStates() {
                var i, n = parseInt(file[index++], 10);
                var states = [];
                // Read in states for a PIM
                for (i = 0; i < n; i++) {
                    states.push(file[index++]);
                }
                return states;
            }

            /**
             * Reads in the transitions for a PIM
             * @returns {Array} Array of transitions for a PIM
             */
            function readTransitions() {
                var i, n = parseInt(file[index++], 10);
                var transitions = [];
                var tStartState, tEndState, tBehaviour;
                // Read in transitions for a PIM
                for (i = 0; i < n; i++) {
                    tStartState = file[index++];
                    tEndState = file[index++];
                    tBehaviour = file[index++];
                    transitions.push({
                        start_state: tStartState,
                        endState: tEndState,
                        I_behaviour: tBehaviour
                    } );
                }
                return transitions;
            }

            var i, n = parseInt(file[index++], 10);
            var pm, pmName;
            var pimStates, pimTransitions, pimName, pModel, pimStartState, pimFinalStates;

            // Read in PIMs
            for (i = 0; i < n; i++) {
                pimName = file[index++];
                pimStartState = file[index++];

                pModel = 'undefined';
                pmName = file[index++];
                for (pm in pModels) {
                    if (pModels.hasOwnProperty(pm)) {
                        if (pModels[pm].name === pmName) {
                            pModel = pModels[pm];
                            break;
                        }
                    }
                }
                // Can't make a PIM without a PM
                if (pModel === 'undefined') {
                    throw "PModel (" + pmName + ") not found for PIM";
                }

                pimStates = readStates();
                pimFinalStates = readStates();
                pimTransitions = readTransitions();

                pims.push({
                    states: pimStates,
                    transitions: pimTransitions,
                    name: pimName,
                    pm: pModel,
                    start_state: pimStartState,
                    final_states: pimFinalStates
                });
            }
        }

        /**
         * Reads in Presentation models (populates pModels)
         * @param withPMR Do these models have presentation model relations
         */
        function readModels(withPMR) {
            /** Counters used for each PMs widgets and CMs */
            var widgetsCount, componentModelsCount;
            /**
             * Returns the widgets
             * @returns {Array} Array of widgets
             */
            function readWidgets() {
                /**
                 * Returns the behaviours for the current widget
                 * @returns {Array.<T>} Array of behaviours
                 */
                function readBehaviours() {
                    var i, n = parseInt(file[index++], 10);
                    var behaviours = [];
                    var behaviour;
                    // Read in the behaviours for a widget
                    for (i = 0; i < n; i++) {
                        behaviour = file[index++];
                        if (behaviour.charAt(behaviours.length - 1) === '/') {
                            behaviour = behaviour.slice(0, -1);
                        }
                        behaviours.push(behaviour);
                    }
                    return behaviours;
                }

                var widgets = [];
                var i;
                var wName, wCategory, wBehaviours;
                // Read in the widgets
                for (i = 0; i < widgetsCount; i++) {
                    wName = file[index++];
                    wCategory = file[index++];
                    wBehaviours = readBehaviours();
                    widgets.push({
                        name : wName,
                        category : wCategory,
                        S_behaviours : wBehaviours
                    });
                }
                return widgets;
            }

            /**
             * Returns the presentation model relations
             * @returns {Array} Array of PMRs
             */
            function readPMRs() {
                var i, n = parseInt(file[index++], 10);
                var pmrPairs = [];
                var pmrBehaviour, pmrOperation;
                // Read in the PMRs for a presentation model
                for (i = 0; i < n; i++) {
                    // Add pmr pair
                    pmrBehaviour = file[index++];
                    pmrOperation = file[index++];

                    pmrPairs.push({
                        behaviour : pmrBehaviour,
                        operation : pmrOperation
                    });
                }

                return pmrPairs;
            }

            /**
             * Reads in the component models for the presentation model
             * @returns {Array} Array of component models
             */
            function readComponentModels() {
                var components = [];
                var i;
                var cName, pModel;
                // Read in the component models for a presentation model
                for (i = 0; i < componentModelsCount; i++) {
                    cName = file[index++];
                    for (pModel in pModels) {
                        if (pModels.hasOwnProperty(pModel)) {
                            if (cName === pModels[pModel].name) {
                                components.push(pModels[pModel]);
                            }
                        }
                    }
                }
                return components;
            }

            var i, n = parseInt(file[index++], 10);
            var pmName, pmr, pmWidgets, pmComponentModels;
            // Read in the presentation models
            for (i = 0; i < n; i++) {
                pmName = file[index++];
                pmr = [];

                // Need to read these in together
                widgetsCount = parseInt(file[index++], 10);
                componentModelsCount = parseInt(file[index++], 10);

                pmWidgets = readWidgets();

                if (withPMR) {
                    pmr = readPMRs();
                }

                pmComponentModels = readComponentModels();

                pModels.push({
                    name: pmName,
                    widgets: pmWidgets,
                    components: pmComponentModels,
                    pmr: pmr
                });
            }
        }

        // Read file
        if (fileIn && fileIn.content) {
            index = 0;
            // Split the file on new line, trim and remove empty lines
            file = fileIn.content.split("\n").map(function(s) { return s.trim(); }).filter(function(s){ return s; });

            readModels(false);
            // If more to read in file
            if (index < file.length -1) {
                while (file[index] === "") {
                    index++;
                }

                if (file[index++] === "====") {
                    readModels(true);
                }
            }
            // If more to read in file
            if (index < file.length -1) {
                while (file[index] === "") {
                    index++;
                }

                if (file[index++] === "====") {
                    readPIMs();
                }
            }
        }

        // TODO: update the EmuChart model with PIM models

        // Return the read in PIMs and PMs
        return {
            pims: pims,
            pms: pModels
        };
    }

    /**
	 * Draws the diagrams stored in _emucharts.
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.render = function () {
        _selectedEditor.render();
        return this;
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
	 * Returns an array containing the current set of constants defined in the model
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.getConstants = function () {
        return _selectedEditor.getConstants();
    };

    /**
	 * Returns an array containing the current set of variables defined in the model
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.getVariables = function () {
        return _selectedEditor.getVariables();
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
	 * Utility function to rename initial transitions
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.rename_initial_transition = function (transitionID, newLabel) {
        return _selectedEditor.rename_initial_transition(transitionID, newLabel);
    };

    /**
	 * Utility function to rename states
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.rename_state = function (stateID, newLabel) {
        return _selectedEditor.rename_state(stateID, newLabel);
    };
    
    /**
	 * Interface function for renaming (i.e., editing) a constant
     * @param constantID is the unique constant identifier
     * @param newData is a record containing fields { type: (string), name: (string), value: (string) }
     *              (field value is optional)
     * @returns true if variable renamed successfully; otherwise returns false
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.rename_constant = function (constantID, newData) {
        return _selectedEditor.rename_constant(constantID, newData);
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

    module.exports = EmuchartsManager;
});