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
        editor.addListener("emuCharts_createState", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_deleteTransition", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_deleteState", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_renameState", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_renameTransition", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_addTransition", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_stateAdded", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_stateRemoved", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_constantAdded", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_variableAdded", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_transitionAdded", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_transitionRenamed", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_transitionRemoved", function (event) { _this.fire(event); });
        editor.addListener("emuCharts_stateRenamed", function (event) { _this.fire(event); });
    };
    
	/**
	 * Creates a new empty emuchart using the data passed as argument.
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.newEmucharts = function (emuchartsName) {
        var _this = this;
        if (emuchartsName) {
            // create a new empty map for nodes and edges
            var chart = { nodes: d3.map(), edges: d3.map() };
            // create an editor for the new chart
            var emucharts = new Emucharts(chart.nodes, chart.edges);
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
        if (emuchartsFile && emuchartsFile.fileContent) {
            var emuchartsNames = Object.keys(emuchartsFile.fileContent);
            if (emuchartsNames) {
                // create a map for each chart
                emuchartsNames.forEach(function (name) {
                    var chart = { nodes: d3.map(), edges: d3.map() };
                    emuchartsFile.fileContent[name].nodes
                        .forEach(function (node) { chart.nodes.set(node.id, node); });
                    emuchartsFile.fileContent[name].edges
                        .forEach(function (edge) { chart.edges.set(edge.id, edge); });
                    // associate an editor to the created emuchart
                    var emucharts = new Emucharts(chart.nodes, chart.edges);
                    var newEmuchartsEditor = new EmuchartsEditor(emucharts);
                    _this.installHandlers(newEmuchartsEditor);
                    _emuchartsEditors.set(name, newEmuchartsEditor);
                    _selectedEditor = newEmuchartsEditor;
                    
                });
            }
        } else { console.log("dbg: warning, undefined or null emuchart"); }
    };

    /**
	 * Draws the diagrams stored in _emucharts.
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.render = function () {
        return _selectedEditor.render();
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
	 * Interface function for deleting transitions
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.delete_transition = function (transitionID) {
        return _selectedEditor.delete_transition(transitionID);
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
	 * Returns an array containing the current set of transitions
     * Each transition is given as a 4-tuple { name, id, source, target }
     * where source and target are pairs { name, id }
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.getTransitions = function () {
        return _selectedEditor.getTransitions();
    };

    /**
	 * Utility function to rename transitions
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.rename_transition = function (transitionID, newLabel) {
        return _selectedEditor.rename_transition(transitionID, newLabel);
    };

    /**
	 * Utility function to rename states
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.rename_state = function (stateID, newLabel) {
        return _selectedEditor.rename_state(stateID, newLabel);
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