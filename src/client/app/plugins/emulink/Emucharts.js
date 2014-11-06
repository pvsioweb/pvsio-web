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
        edges = d3.map(),
        initial_edges = d3.map();
    
    var constants, // d3.map()
        variables; // d3.map()
	var eventDispatcher = require("util/eventDispatcher");

    var defaultValues = { x: 100, y: 100, width: 36, height: 36, fontSize: 10 };

    // FIXME: improve these functions -- here we assume that generated IDs are compact
    var nextNodeID = 0, nextEdgeID = 0, nextInitialEdgeID = 0;
    var newNodeID = function () { return ++nextNodeID; };
    var newEdgeID = function () { return ++nextEdgeID; };
    var newInitialEdgeID = function () { return ++nextInitialEdgeID; };
    var getFreshNodeID = function () { return nextNodeID + 1; };
    var getFreshEdgeID = function () { return nextEdgeID + 1; };
    var getFreshInitialEdgeID = function () { return nextInitialEdgeID + 1; };
    var nextConstantID = 0, nextVariableID = 0;
    var newConstantID = function () { return ++nextConstantID; };
    var newVariableID = function () { return ++nextVariableID; };
    var createVariableID = function (variable) {
        var id = "VAR_" + variable.name + ":" + variable.type + "(" + variable.scope + ")";
        return id;
    };
    var createConstantID = function (constant) {
        var id = "CONST_" + constant.name + ":" + constant.type;
        return id;
    };
    var getFreshConstantID = function () { return nextConstantID + 1; };
    var getFreshVariableID = function () { return nextVariableID + 1; };
    
	/**
	 * Constructor
	 * @memberof Emucharts
	 */
    function Emucharts(nodes, edges, initial_edges) {
        if (nodes) {
            this.nodes = nodes;
            nextNodeID = nodes.keys().length; // FIXME: this is fragile: we need to check the actual indexes
        }
        if (edges) {
            this.edges = edges;
            nextEdgeID = edges.keys().length; // FIXME: this is fragile: we need to check the actual indexes
        }
        if (initial_edges) {
            this.initial_edges = initial_edges;
            nextInitialEdgeID = edges.keys().length;  // FIXME: this is fragile: we need to check the actual indexes
        }
        this.constants = d3.map();
        this.variables = d3.map();
		eventDispatcher(this);
        return this;
    }
    
    Emucharts.prototype.getEdges = function () {
        return this.edges;
    };
    Emucharts.prototype.getInitialEdges = function () {
        return this.initial_edges;
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
                if (dirty) { _this.edges.set(key, edge); }
            });
        }
        this.fire({
            type: "emuCharts_stateRenamed",
            state: {
                id: node.id,
                name: node.name
            }
        });
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
        var estimatedTextWidth = name.length * defaultValues.fontSize / 4;
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
	 * Renames an existing initial edge
     * @returns true if edge renamed successfully; otherwise returns false
	 * @memberof Emucharts
	 */
    Emucharts.prototype.rename_initial_edge = function (id, newName) {
        if (!id || !this.initial_edges || !this.initial_edges.get(id)) { return false; }
        // get edge and rename it
        var initial_edge = this.initial_edges.get(id);
        initial_edge.name = newName;
        this.initial_edges.set(initial_edge.id, initial_edge);
        // fire event
        this.fire({
            type: "emuCharts_initialTransitionRenamed",
            transition: {
                id: initial_edge.id,
                name: initial_edge.name,
                target: {
                    id: initial_edge.target.id,
                    name: initial_edge.target.name
                }
            }
        });
        return true;
    };
    
    /**
	 * Adds a new control point to an edge of the diagram
     * @returns the new edge
	 * @memberof Emucharts
	 */
    Emucharts.prototype.set_controlPoint = function (edge, cp) {
        if (!edge || !cp) { return false; }
        var ed = this.edges.get(edge.id);
        if (ed) {
            ed.controlPoint = cp;
            this.edges.set(edge.id, ed);
            return true;
        } else {
            console.log("dbg: warning - control point associated to unknown edge");
        }
        return false;
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
                target: target,
                controlPoint: edge.controlPoint
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
                },
                controlPoint: edge.controlPoint
            }
        });
        return newEdge;
    };

	/**
	 * Adds a new initial edge to the diagram
     * @returns the new edge
	 * @memberof Emucharts
	 */
    Emucharts.prototype.add_initial_edge = function (edge) {
        if (!edge || !edge.target) {
            return null;
        }
        if (!this.nodes.has(edge.target.id)) {
            console.log("dbg: warning, target ID not found in emuchart data. New transitions not added.");
            return null;
        }
        
        var target = this.nodes.get(edge.target.id);
        // create a new node with a unique ID
        var id = "IT" + newInitialEdgeID();
        var newEdge = {
                id  : id, // nodes have unique IDs
                name: edge.name || id,
                target: target
            };
        // add the new edge to the diagram
        this.initial_edges.set(newEdge.id, newEdge);
        // fire event
        this.fire({
            type: "emuCharts_initialTransitionAdded",
            transition: {
                id: newEdge.id,
                name: newEdge.name,
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
	 * Removes an initial edge from the diagram
	 * @memberof Emucharts
	 */
    Emucharts.prototype.remove_initial_edge = function (initial_edge) {
        var rem = this.initial_edges.get(initial_edge);
        if (rem && this.initial_edges.remove(initial_edge)) {
            // fire event
            this.fire({
                type: "emuCharts_initialTransitionRemoved",
                transition: {
                    id: rem.id,
                    name: rem.name,
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
	 * Returns a fresh initial transitions name
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getFreshInitialTransitionName = function () {
        return "IT" + getFreshInitialEdgeID();
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
     * Each transition is given as a 5-tuple { name, id, source, target, controlPoint }
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
                },
                controlPoint: (trans.controlPoint) ? {
                    x: trans.controlPoint.x,
                    y: trans.controlPoint.y
                } : null
            });
        });
        return transitions;
    };
    
    /**
	 * Returns the initial transition associated to the provided id
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getInitialTransition = function (id) {
        return this.initial_edges.get(id);
    };
    
    /**
	 * Returns the current set of initial transitions
     * Each transition is given as a 3-tuple { name, id, target }
     * where target is a pair { name, id }
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getInitialTransitions = function () {
        var _this = this;
        var initial_transitions = [];
        this.initial_edges.forEach(function (key) {
            var trans = _this.initial_edges.get(key);
            initial_transitions.push({
                name: trans.name,
                id: key,
                target: {
                    name: trans.target.name,
                    id: trans.target.id
                }
            });
        });
        return initial_transitions;
    };

    /**
	 * Interface function for adding new constant definitions
     * @memberof Emucharts
	 */
    Emucharts.prototype.add_constant = function (constant) {
        // we use name and type as ID so that we automatically avoid duplicated constants
        // (those three fields together identify constants uniquely)
        // note: value can be undefined
        var id = createConstantID(constant);
        var newConstant = {
            id: id,
            name: constant.name,
            type: constant.type,
            value: constant.value
        };
        this.constants.set(id, newConstant);
        // fire event
        this.fire({
            type: "emuCharts_constantAdded",
            constant: {
                id: id,
                name: constant.name,
                type: constant.type,
                value: constant.value
            }
        });
    };
    
    /**
	 * Interface function for adding new state variables definitions
     * @memberof Emucharts
	 */
    Emucharts.prototype.add_variable = function (variable) {
        // we use name type and scope as ID so that we automatically avoid duplicated variables
        // (those three fields together identify variables uniquely)
        var id = createVariableID(variable);
        var newVariable = {
            id: id,
            name: variable.name,
            type: variable.type,
            scope: variable.scope
        };
        this.variables.set(id, newVariable);
        // fire event
        this.fire({
            type: "emuCharts_variableAdded",
            variable: {
                id: id,
                name: variable.name,
                type: variable.type,
                scope: variable.scope
            }
        });
    };
    
    /**
	 * Interface function for removing a constant
     * @param constantID is the unique constant identifier
     * @returns true if constant removed successfully; otherwise returns false     
	 * @memberof Emucharts
	 */
    Emucharts.prototype.remove_constant = function (constantID) {
        var rem = this.constants.get(constantID);
        if (rem && this.constants.remove(constantID)) {
            // fire event
            this.fire({
                type: "emuCharts_constantRemoved",
                constant: rem
            });
            return true;
        }
        return false;
    };
    
    /**
	 * Interface function for removing a state variable
     * @param variableID is the unique variable identifier
     * @returns true if variable removed successfully; otherwise returns false     
	 * @memberof Emucharts
	 */
    Emucharts.prototype.remove_variable = function (variableID) {
        var rem = this.variables.get(variableID);
        if (rem && this.variables.remove(variableID)) {
            // fire event
            this.fire({
                type: "emuCharts_variableRemoved",
                variable: rem
            });
            return true;
        }
        return false;
    };

    /**
	 * Interface function for renaming (i.e., editing) a constant
     * @param constantID is the unique constant identifier
     * @param newData is a record containing fields { type: (string), name: (string), value: (string) }
     *              (field value is optional)
     * @returns true if variable renamed successfully; otherwise returns false
	 * @memberof Emucharts
	 */
    Emucharts.prototype.rename_constant = function (constantID, newData) {
        var _this = this;
        if (!constantID || !this.constants || !this.constants.get(constantID)) { return false; }
        // get the constant, delete it from the constants list, 
        // rename fields, and put it back in the constants list
        var theConstant = this.constants.get(constantID);
        this.constants.remove(constantID);
        var newConstant = {
            type: newData.type || theConstant.type,
            name: newData.name || theConstant.name,
            value: newData.value || theConstant.value
        };
        // update constantID
        var newConstantID = createConstantID(newConstant);
        newConstant.id = newConstantID;
        this.constants.set(newConstantID, newConstant);
        this.fire({
            type: "emuCharts_constantRenamed",
            pre: {
                id: theConstant.id,
                type: theConstant.type,
                name: theConstant.name,
                value: theConstant.value
            },
            post: {
                id: newConstant.id,
                type: newConstant.type,
                name: newConstant.name,
                value: newConstant.value
            }
        });
        return true;
    };
    
    /**
	 * Interface function for renaming (i.e., editing) a state variable
     * @param variableID is the unique variable identifier
     * @param newData is a record containing fields { type: (string), name: (string), scope: (string) }
     * @returns true if variable renamed successfully; otherwise returns false
	 * @memberof Emucharts
	 */
    Emucharts.prototype.rename_variable = function (variableID, newData) {
        var _this = this;
        if (!variableID || !this.variables || !this.variables.get(variableID)) { return false; }
        // get the varable, delete it from the variables list, 
        // rename fields, and put it back in the variables list
        var theVariable = this.variables.get(variableID);
        this.variables.remove(variableID);
        var newVariable = {
            type: newData.type || theVariable.type,
            name: newData.name || theVariable.name,
            scope: newData.scope || theVariable.scope
        };
        // update variableID
        var newVariableID = createVariableID(newVariable);
        newVariable.id = newVariableID;
        this.variables.set(newVariableID, newVariable);
        this.fire({
            type: "emuCharts_variableRenamed",
            pre: {
                id: theVariable.id,
                type: theVariable.type,
                name: theVariable.name,
                scope: theVariable.scope
            },
            post: {
                id: newVariable.id,
                type: newVariable.type,
                name: newVariable.name,
                scope: newVariable.scope
            }
        });
        return true;
    };
    
    /**
	 * Returns an array containing the current set of constants
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getConstants = function () {
        var _this = this;
        var ans = [];
        this.constants.forEach(function (key) {
            var c = _this.constants.get(key);
            ans.push({
                id: c.id,
                name: c.name,
                type: c.type,
                value: c.value
            });
        });
        return ans;
    };
    
    /**
	 * Returns an array containing the current set of variables
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getVariables = function (scope) {
        var _this = this;
        var ans = [];
        this.variables.forEach(function (key) {
            var v = _this.variables.get(key);
            if (!scope || scope === v.scope) {
                ans.push({
                    id: v.id,
                    name: v.name,
                    type: v.type,
                    scope: v.scope
                });
            }
        });
        return ans;
    };
    
    /**
	 * Returns an array containing the current set of input variables
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getInputVariables = function () {
        return this.getVariables("Input");
    };

    /**
	 * Returns an array containing the current set of output variables
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getOutputVariables = function () {
        return this.getVariables("Output");
    };

    /**
	 * Returns an array containing the current set of local variables
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getLocalVariables = function () {
        return this.getVariables("Local");
    };

    /**
	 * Returns an array specifying the supported variable scopes
	 * @memberof Emucharts
	 */
    Emucharts.prototype.getVariableScopes = function () {
        return ["Local", "Input", "Output"];
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