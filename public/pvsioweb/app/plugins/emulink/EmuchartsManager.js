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
            newEmuchartsEditor.addListener(
                "emuCharts_editorModeChanged",
                function (event) { _this.fire(event); }
            );
            _emuchartsEditors.set(name, newEmuchartsEditor);
            _selectedEditor = newEmuchartsEditor;
        } else { console.log("dbg: warning, undefined or null emuchart name"); }
    };
    
	/**
	 * Imports the emuchart passed as argument.
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.importEmucharts = function (emucharts) {
        var _this = this;
        if (emucharts) {
            var emuchartsObject = JSON.parse(emucharts.content());
            if (emuchartsObject) {
                var emuchartsNames = Object.keys(emuchartsObject);
                if (emuchartsNames) {
                    // create a map for each chart
                    emuchartsNames.forEach(function (name) {
                        var chart = { nodes: d3.map(), edges: d3.map() };
                        emuchartsObject[name].nodes
                            .forEach(function (node) { chart.nodes.set(node.id, node); });
                        emuchartsObject[name].edges
                            .forEach(function (edge) { chart.edges.set(edge.id, edge); });
                        // associate an editor to the created emuchart
                        var emucharts = new Emucharts(chart.nodes, chart.edges);
                        var newEmuchartsEditor = new EmuchartsEditor(emucharts);
                        newEmuchartsEditor.addListener(
                            "emuCharts_editorModeChanged",
                            function (event) { _this.fire(event); }
                        );
                        _emuchartsEditors.set(name, newEmuchartsEditor);
                        if (!_selectedEditor) {
                            _selectedEditor = newEmuchartsEditor;
                        }
                    });
                }
            }
        } else { console.log("dbg: warning, undefined or null emuchart"); }
    };

    /**
	 * Draws the diagrams stored in _emucharts.
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.render = function () {
        _selectedEditor.render();
    };
    
    
	/**
	 * Interface function for changing mode in the currently selected editor
	 * @memberof EmuchartsManager
	 */
    EmuchartsManager.prototype.set_editor_mode = function (mode) {
        _selectedEditor.set_editor_mode(mode);
    };

    module.exports = EmuchartsManager;
});