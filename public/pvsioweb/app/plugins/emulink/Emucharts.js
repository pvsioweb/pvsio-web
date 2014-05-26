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

    var defaultValues = { x: 100, y: 100, width: 36, height: 36, fontSize: 10 };

    // FIXME: improve these functions -- here we assume that generated IDs are compact
    var nextNodeID = 0, nextEdgeID = 0;
    var newNodeID = function () { return nextNodeID++; };
    var newEdgeID = function () { return nextEdgeID++; };
    var getFreshNodeID = function () { return nextNodeID + 1; };
    var getFreshEdgeID = function () { return nextEdgeID + 1; };
    
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
                if (dirty) { edges.set(key, edge); }
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
        return newNode;
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
        return newEdge;
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
            states.push({
                name: _this.nodes.get(key).name,
                id: key
            });
        });
        return states;
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
    
    module.exports = Emucharts;
});