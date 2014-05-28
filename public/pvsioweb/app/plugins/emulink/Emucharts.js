/** @module Emucharts*/
/**
 * Emucharts encodes an emuchart diagram into a graphs. This is code is a re-engineered
 * version of stateMachine.js implemented in branch emulink-commented
 * @author Paolo Masci
 * @date 14/05/14 2:53:03 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _, Promise, document, FileReader*/

define(function (require, exports, module) {
	"use strict";
    
    var nodes = d3.map(),
        edges = d3.map();
    
    var constants, // d3.map()
        variables; // d3.map()
	var eventDispatcher = require("util/eventDispatcher");

    var defaultValues = { x: 100, y: 100, width: 36, height: 36, fontSize: 10 };

    // FIXME: improve these functions -- here we assume that generated IDs are compact
    var nextNodeID = 0, nextEdgeID = 0;
    var newNodeID = function () { return ++nextNodeID; };
    var newEdgeID = function () { return ++nextEdgeID; };
    var getFreshNodeID = function () { return nextNodeID + 1; };
    var getFreshEdgeID = function () { return nextEdgeID + 1; };
    var nextConstantID = 0, nextVariableID = 0;
    var newConstantID = function () { return ++nextConstantID; };
    var newVariableID = function () { return ++nextVariableID; };
    var getFreshConstantID = function () { return nextConstantID + 1; };
    var getFreshVariableID = function () { return nextVariableID + 1; };
    
	/**
	 * Constructor
	 * @memberof Emucharts
	 */
    function Emucharts(nodes, edges) {
        if (nodes) {
            this.nodes = nodes;
            nextNodeID = nodes.keys().length; // FIXME: this is fragile: we need to check the actual indexes
        }
        if (edges) {
            this.edges = edges;
            nextEdgeID = edges.keys().length; // FIXME: this is fragile: we need to check the actual indexes
        }
        this.constants = d3.map();
        this.variables = d3.map();
		eventDispatcher(this);
        return this;
    }
    
    Emucharts.prototype.getEdges = function () {
        return this.edges;
    };
    Emucharts.prototype.getNodes = function () {
        return this.nodes;
    };
    
    Emucharts.prototype.getDefaultValues = function () {
        return defaultValues;
    };
    
    
	/**
	 * Renames an existing node
     * @returns true if node renamed successfully; otherwise returns false
	 * @memberof Emucharts
	 */
    Emucharts.prototype.rename_node = function (id, newName) {
        var _this = this;
        if (!id || !this.nodes || !this.nodes.get(id)) { return false; }
        // get node and rename it
        var node = this.nodes.get(id);
        node.name = newName;
        this.nodes.set(node.id, node);
        // we need to rename also nodes cached in the edge structure
        // this can be quite expensive in term of time, but renaming is unlikely to be a frequent operation
        // so the time cost is acceptable (given that caching is quite useful to speed up rendering)
        if (this.edges) {
            this.edges.forEach(function (key) {
                var edge = _this.edges.get(key);
                var dirty = false;
                if (edge.source.id === id) {
                    edge.source.name = newName;
                    dirty = true;
                }
                if (edge.target.id === id) {
                    edge.target.name = newName;
                    dirty = true;
                }
                if (dirty) { this.edges.set(key, edge); }
            });
        }
        return true;
    };

    /**
	 * Adds a new node to the diagram
     * @returns the new node
	 * @memberof Emucharts
	 */
    Emucharts.prototype.add_node = function (node) {
        if (!node) { return null; }
        // create a new node with a unique ID
        var id = "X" + newNodeID();
        var name = node.name || id;
        var estimatedTextWidth = name.length * defaultValues.fontSize / 2;
        var width = (estimatedTextWidth < defaultValues.width) ? defaultValues.width : estimatedTextWidth;
        var newNode = {
                id  : id, // nodes have unique IDs
                name: name,
                x: node.x || defaultValues.x,
                y: node.y || defaultValues.y,
                width : width,
                height: defaultValues.height
            };
        // add the new node to the diagram
        this.nodes.set(newNode.id, newNode);
        // fire event
        this.fire({
            type: "emuCharts_stateAdded",
            state: {
                id: id,
                name: name
            }
        });
        return newNode;
    };

    /**
	 * Removes a node from the diagram
	 * @memberof Emucharts
	 */
    Emucharts.prototype.remove_node = function (node) {
        var rem = this.nodes.get(node);
        if (rem && this.nodes.remove(node)) {
            // fire event
            this.fire({
                type: "emuCharts_stateRemoved",
                state: {
                    id: rem.id,
                    name: rem.name
                }
            });
            return true;
        }
        return false;
    };

	/**
	 * Renames an existing edge
     * @returns true if edge renamed successfully; otherwise returns false
	 * @memberof Emucharts
	 */
    Emucharts.prototype.rename_edge = function (id, newName) {
        if (!id || !this.edges || !this.edges.get(id)) { return false; }
        // get edge and rename it
        var edge = this.edges.get(id);
        edge.name = newName;
        this.edges.set(edge.id, edge);
        // fire event
        this.fire({
            type: "emuCharts_transitionRenamed",
            transition: {
                id: edge.id,
                name: edge.name,
                source: {
                    id: edge.source.id,
                    name: edge.source.name
                },
                target: {
                    id: edge.target.id,
                    name: edge.target.name
                }
            }
        });
        return true;
    };
    
	/**
	 * Adds a new edge to the diagram
     * @returns the new edge
	 * @memberof Emucharts
	 */
    Emucharts.prototype.add_edge = function (edge) {
        if (!edge || !edge.target) {
            return null;
        }
        if (!this.nodes.has(edge.target.id)) {
            console.log("dbg: warning, target ID not found in emuchart data. New transitions not added.");
            return null;
        }
        
        var target = this.nodes.get(edge.target.id);
        var source = (edge.source) ? this.nodes.get(edge.source.id) : null;
        // create a new node with a unique ID
        var id = "T" + newEdgeID();
        var newEdge = {
                id  : id, // nodes have unique IDs
                name: edge.name || id,
                source: source,
                target: target
            };
        // add the new edge to the diagram
        this.edges.set(newEdge.id, newEdge);
        // fire event
        this.fire({
            type: "emuCharts_transitionAdded",
            transition: {
                id: newEdge.id,
                name: newEdge.name,
                source: {
                    id: newEdge.source.id,
                    name: newEdge.source.name
                },
                target: {
                    id: newEdge.target.id,
                    name: newEdge.target.name
                }
            }
        });
        return newEdge;
    };

    /**
	 * Removes an edge from the diagram
	 * @memberof Emucharts
	 */
    Emucharts.prototype.remove_edge = function (edge) {
        var rem = this.edges.get(edge);
        if (rem && this.edges.remove(edge)) {
            // fire event
            this.fire({
                type: "emuCharts_transitionRemoved",
                transition: {
                    id: rem.id,
                    name: rem.name,
                    source: {
                        id: rem.source.id,
                        name: rem.source.name
                    },
                    target: {
                        id: rem.target.id,
                        name: rem.target.name
                    }
                }
            });
            return true;
        }
        return false;
    };

    
	/**
	 * Automatically adjusts nodes width using name length
	 * @memberof Emucharts
	 */
    Emucharts.prototype.adjustWidth = function (fontSize) {
        var _this = this;
        if (this.nodes) {
            this.nodes.forEach(function (key) {
                var node = _this.nodes.get(key);
                node.width = node.name.length * fontSize;
                _this.nodes.set(node);
            });
        }
        if (this.edges) {
            this.edges.forEach(function (key) {
                var edge = _this.edges.get(key);
                edge.source.width = edge.source.name.length * fontSize;
                edge.target.width = edge.target.name.length * fontSize;
                _this.edges.set(edge);
            });
        }
        
    };
        
    /**
	 * Returns a fresh state name
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getFreshStateName = function () {
        return "X" + getFreshNodeID();
    };
    
    /**
	 * Returns a fresh transitions name
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getFreshTransitionName = function () {
        return "T" + getFreshEdgeID();
    };
    
    /**
	 * Returns an array containing the current set of states
     * Each states is given as a pair { name, id }
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getStates = function () {
        var _this = this;
        var states = [];
        this.nodes.forEach(function (key) {
            var node = _this.nodes.get(key);
            states.push({
                name: node.name,
                id: node.id,
                x: node.x,
                y: node.y,
                width : node.width,
                height: node.height
            });
        });
        return states;
    };

    /**
	 * Returns the state associated to the provided id
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getState = function (id) {
        return this.nodes.get(id);
    };

    /**
	 * Returns the transition associated to the provided id
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getTransition = function (id) {
        return this.edges.get(id);
    };
    
    /**
	 * Returns an array containing the current set of transitions
     * Each transition is given as a 4-tuple { name, id, source, target }
     * where source and target are pairs { name, id }
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getTransitions = function () {
        var _this = this;
        var transitions = [];
        this.edges.forEach(function (key) {
            var trans = _this.edges.get(key);
            transitions.push({
                name: trans.name,
                id: key,
                source: {
                    name: trans.source.name,
                    id: trans.source.id
                },
                target: {
                    name: trans.target.name,
                    id: trans.target.id
                }
            });
        });
        return transitions;
    };
    
    /**
	 * Interface function for adding new constant definitions
     * @memberof Emucharts
	 */
    Emucharts.prototype.add_constant = function (name) {
        this.constants.set(name);
        // fire event
        this.fire({
            type: "emuCharts_constantAdded",
            constant: {
                name: name
            }
        });
    };
    
    /**
	 * Interface function for adding new state variables definitions
     * @memberof Emucharts
	 */
    Emucharts.prototype.add_variable = function (name) {
        this.variables.set(name);
        // fire event
        this.fire({
            type: "emuCharts_variableAdded",
            variable: {
                name: name
            }
        });
    };

    
    /**
	 * Returns an array containing the current set of constants
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getConstants = function () {
        return this.constants.keys();
    };
    
    /**
	 * Returns an array containing the current set of variables
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getVariables = function () {
        return this.variables.keys();
    };

    /**
	 * Utility function that checks whether the diagram is empty (i.e., 0 nodes, 0 edges)
	 * @memberof Emucharts
	 */
    Emucharts.prototype.empty = function () {
        return this.nodes.empty() && this.edges.empty();
    };

    module.exports = Emucharts;
});