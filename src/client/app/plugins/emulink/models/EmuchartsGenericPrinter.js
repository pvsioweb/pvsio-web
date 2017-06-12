/** @module EmuchartsGenericPrinter */
/**
 * EmuchartsGenericPrinter provides utility functions that can be used by other printers for creating the data structures necessary to all printers
 * @author Paolo Masci
 * @date May 29, 2017
 * Emuchart objects have the following structure:
      emuchart = {
                name: (string),
                author: {
                    name: (string),
                    affiliation: (string),
                    contact: (string)
                },
                importings: (not used for now),
                constants: (array of {
                                name: (string), // the constant identifier
                                type: (string), // the constant type
                                value: (string) // the constant value (can be undefined)
                            }),
                variables: (array of {
                                name: (string), // the variable identifier
                                type: (string), // the variable type
                                scope: (string) // the variable scope, either local or global
                                value: (string) // the initial value of the variable
                            }),
                states: (array of {
                                name: (string), // the state label
                                id: (string),   // a unique identifier
                            }),
                transitions: (array of {
                                name: (string), // the transition label
                                id: (string),   // a unique identifier
                                source: {
                                    name: (string), // the source state label
                                    id: (string)    // a unique identifier
                                },
                                target: {
                                    name: (string), // the target state label
                                    id: (string)    // a unique identifier
                                },
                            }),
                initial_transitions: (array of {
                                name: (string), // the initial transition label
                                id: (string),   // a unique identifier
                                target: {
                                    name: (string), // the target state label
                                    id: (string)    // a unique identifier
                                },
                            })
      }
*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3*/
define(function (require, exports, module) {
    "use strict";
    // var printer_version = "2.2";
    var EmuchartsParser = require("plugins/emulink/EmuchartsParser");
    var EmuchartsParser2 = require("plugins/emulink/EmuchartsParser2");
    // var projectManager = require("project/ProjectManager").getInstance();
    var displayAskParameters = require("plugins/emulink/forms/displayAskParameters");

    var parser;
    var parser2;

    var undef = "ERROR_MODE_UNINITIALIZED";
    var mode_type = "Mode";
    var state_type = "State";
    var predefined_variables = {
        previous_mode: { name: "previous_mode", type: mode_type, value: undef },
        current_mode: { name: "mode", type: mode_type, value: undef }
    };

    /**
     * Constructor
     */
    function EmuchartsGenericPrinter(opt) {
        opt = opt || {};
        parser = EmuchartsParser.getInstance();
        parser2 = EmuchartsParser2.getInstance();
        return this;
    }

    /**
     * Gets Emuchart modes
     */
    EmuchartsGenericPrinter.prototype.get_modes = function (emuchart) {
        if (emuchart && emuchart.states) {
            return {
                comment: "modes of operation",
                modes: [{
                    name: mode_type,
                    constructors: emuchart.states.map(function (state) {
                        return state.name;
                    })
                }]
            };
        }
        return null;
    };

    /**
     * Gets user-defined datatypes
     */
    EmuchartsGenericPrinter.prototype.get_datatypes = function (emuchart) {
        if (emuchart && emuchart.datatypes && emuchart.datatypes.length > 0) {
            return {
                comment: "user defined datatypes",
                datatypes: emuchart.datatypes
            };
        }
        return null;
    };

    function split_variables(emuchart) {
        var basic = [];
        var records = d3.map(); //hashtable used for grouping together variables in the form l1.a l1.b --- these will be part of the same record type.
                                //   key: name (string); value: Array of { l1_name: (string), l2_name: (string), type: (string) }
        if (emuchart.variables) {
            emuchart.variables.forEach(function (variable) {
                var tmp = variable.name.split(".");
                if (tmp.length === 2) {
                    var l1 = records.get(tmp[0]) || [];
                    l1.push({
                        name: tmp[1],
                        type: variable.type,
                        value: variable.value
                    });
                    records.set(tmp[0], l1);
                } else {
                    basic.push({ name: variable.name, type: variable.type, value: variable.value });
                }
            });
        }
        return {
            basic: basic,
            records: records
        };
    }

    /**
     * Gets Emuchart variables
     */
    EmuchartsGenericPrinter.prototype.get_variables = function (emuchart) {
        var variables = [];
        variables.push({ name: predefined_variables.current_mode.name, type: predefined_variables.current_mode.type });
        if (predefined_variables.previous_mode) {
            variables.push({ name: predefined_variables.previous_mode.name, type: predefined_variables.previous_mode.type });
        }
        var x = split_variables(emuchart);
        x.basic.forEach(function (basic) {
            variables.push({ name: basic.name, type: basic.type });
        });
        x.records.keys().forEach(function (key) {
            variables.push({
                name: key,
                children: x.records.get(key)
            });
        });
        return {
            comment: "state attributes",
            indent: "  ",
            variables: [{
                name: state_type,
                variables: variables
            }]
        };
    };

    /**
     * Gets utility functions used in Emuchart
     */
    EmuchartsGenericPrinter.prototype.get_enter_leave = function (emuchart) {
        function process_actions(actions, state, opt) {
            opt = opt || [];
            var x = (opt.enter) ? state.enter : state.leave;
            var ans = parser2.parseTrigger("{" + x + "}");
            if (ans.res && ans.res.type === "transition") {
                var action_sequence = [];
                ans.res.val.actions.val.forEach(function (action) {
                    var tmp = action.val.identifier.val.split(".");
                    // this printer supports up to 2 hierarchical levels
                    if (tmp.length === 2) {
                        action_sequence.push({
                            l1_name: tmp[0], // variable name in the form l1_name.l2_name
                            l2_name: tmp[1],
                            value: action.val.expression.val // variable value
                        });
                    } else {
                        action_sequence.push({
                            name: tmp[0], // variable name
                            value: action.val.expression.val // variable value
                        });
                    }
                });
                actions.push({
                    state: state.name,
                    action_sequence: action_sequence
                });
            }
        }
        var entry_actions = null, leave_actions = null;
        var states_with_entry_actions = emuchart.states.filter(function (state) {
            return state.enter && state.enter !== "";
        });
        if (states_with_entry_actions.length > 0) {
            entry_actions = [];
            states_with_entry_actions.forEach(function (state) {
                process_actions(entry_actions, state, { enter: true });
            });
        }
        var states_with_leave_actions = emuchart.states.filter(function (state) {
            return state.leave && state.leave !== "";
        });
        if (states_with_leave_actions.length > 0) {
            leave_actions = [];
            states_with_leave_actions.forEach(function (state) {
                process_actions(leave_actions, state, { leave: true });
            });
        }
        var data = {
            entry_actions: entry_actions || [],
            leave_actions: leave_actions || [],
            current_mode: predefined_variables.current_mode,
            previous_mode: predefined_variables.previous_mode,
            state_type: state_type
        };
        if (predefined_variables.previous_mode) {
            data.previous_mode = predefined_variables.previous_mode;
        }
        return data;
    };

    function setVariables (parser, emuchart) {
        var variables = [ { name: predefined_variables.current_mode.name, type: predefined_variables.current_mode.type } ]
                .concat(emuchart.variables.map(function (v) { return { name: v.name, type: v.type }; }));
        if (predefined_variables.previous_mode) {
            variables.concat({ name: predefined_variables.previous_mode.name, type: predefined_variables.previous_mode.type });
        }
        parser.setVariables(variables);
    }

    function shapeAction (action, emuchart) {
        if (action) {
            if (action.identifier.isVariable) {
                var x = action.identifier.val.split(".");
                if (x.length === 2) {
                    return {
                        variable_type: action.identifier.variableType,
                        variable_name: x[0],
                        variable_name_l2: x[1],
                        override_expression: action.expression.val
                    };
                }
                return {
                    variable_type: action.identifier.variableType,
                    variable_name: x[0],
                    override_expression: action.expression.val
                };
            } else {
                return {
                    // variable_type: getVariableType(action.identifier), FIXME: need to find a way to identify the type, e.g., use the type of the first term in the override expression
                    local_binding: true,
                    variable_name: action.identifier.val,
                    override_expression: action.expression.val
                };
            }
        }
        return action;
    }

    /**
     * Prints PVS definitions for Emuchart initial transitions
     */
    EmuchartsGenericPrinter.prototype.get_initial_transition = function (emuchart) {
        if (emuchart.initial_transitions && emuchart.initial_transitions.length > 0) {
            setVariables(parser2, emuchart);
            // the name of the initial transition is always init, regardless of what the emucharts says
            var theTransition = { name: "init", init: [], override: [], variables: [] };
            // the initial part of the init function is the initialisation of the state variables
            var x = split_variables(emuchart);
            theTransition.variables = x.basic;
            x.records.keys().forEach(function (l1_name) {
                theTransition.variables = theTransition.variables.concat({
                    name: l1_name,
                    children: x.records.get(l1_name)
                });
            });
            // the second part is the override, if any
            var has_cond = false;
            emuchart.initial_transitions.forEach(function (initial_transition) {
                if (initial_transition && initial_transition.name && initial_transition.name !== "") {
                    var ans = parser2.parseTrigger(initial_transition.name);
                    if (ans.res) {
                        var actions = (ans.res.val.actions) ? ans.res.val.actions.val.map(function (action) {
                            return shapeAction(action.val, emuchart);
                        }) : null;
                        if (ans.res.val.cond) {
                            if (emuchart.initial_transitions.length > 1) {
                                // we need to force the override of current_mode when the emuchart has multiple initial transitions
                                // because each one of them will lead to a different initial state
                                actions = actions || [];
                                actions = actions.concat({
                                    variable_name: predefined_variables.current_mode.name,
                                    override_expression: initial_transition.target.name
                                });
                            }
                            // print_expression will take care of printing variable names and operators according to the pvs syntax
                            // option attach_state instructs print_expression to concatenate (st) to variable names
                            theTransition.override.push({
                                cond: ans.res.val.cond.val,
                                actions: actions
                            });
                            has_cond = true;
                        } else {
                            if (actions) {
                                theTransition.override.push({
                                    cond: "true",
                                    actions: actions
                                });
                            }
                        }
                    } else {
                        console.error(ans.err);
                    }
                }
            });
            var data = {
                comment: "initialisation function",
                name: theTransition.name,
                // args: [{ name: "x",type: "real"}],
                init: theTransition.init,
                override: theTransition.override,
                variables: [{
                    name: predefined_variables.current_mode.name,
                    type: predefined_variables.current_mode.type,
                    value: (emuchart.initial_transitions.length === 1) ? emuchart.initial_transitions[0].target.name : predefined_variables.current_mode.value
                }].concat(theTransition.variables)
            };
            if (predefined_variables.previous_mode) {
                data.variables = [{
                    name: predefined_variables.previous_mode.name,
                    type: predefined_variables.previous_mode.type,
                    value: (emuchart.initial_transitions.length === 1) ? emuchart.initial_transitions[0].target.name : predefined_variables.current_mode.value
                }].concat(data.variables);
            }
            if (emuchart.initial_transitions.length === 1 && theTransition.override.length === 0) {
                data.DEFAULT_INIT = true;
            } else if (theTransition.override.length > 0 && !has_cond) {
                data.INIT_WITH_OVERRIDES = true;
            } else {
                data.INIT_MULTI = true;
            }
            return data;
        }
        return null;
    };

    /**
     * Prints definitions for Emuchart transitions given in the form transition [condition] {actions}
     */
    EmuchartsGenericPrinter.prototype.get_transitions = function (emuchart, opt) {
        opt = opt || {};
        // multiple transitions can have the same identifier
        // (because the same transition can originate from different nodes)
        // this keeps track of the transitions we've already processed -- needed to avoid duplicates
        var done = d3.map();

        if (emuchart.transitions && emuchart.transitions.length > 0) {
            setVariables(parser2, emuchart);
            var transitions = [];
            // parse transition labels, to extract transition name, guard, and actions
            emuchart.transitions.forEach(function (t) {
                // add here mode updates
                var trigger = parser2.parseTrigger(t.name);
                if (trigger.res && trigger.res.val) {
                    trigger = trigger.res.val;
                    var trigger_id = { type: "identifier", val: trigger.identifier || "tick" };
                    var trigger_cond = predefined_variables.current_mode.name + "=" + t.source.name;
                    if (trigger.cond) {
                        trigger_cond += " AND (" + trigger.cond.trim() + ")";
                    }
                    trigger_cond = parser2.parseCondition(trigger_cond);
                    var trigger_actions = [];
                    if (trigger.actions) {
                        trigger.actions.trim().split(";").forEach(function (action) {
                            if (action.trim() !== "") {
                                var a = parser2.parseAction(action);
                                if (a) {
                                    if (a.err) {
                                        trigger_actions.push(a.err);
                                    } else if (a.res && a.res.val && a.res.val){
                                        trigger_actions.push(shapeAction(a.res.val.val, emuchart));
                                    }
                                }
                            }
                        });
                    }
                    transitions.push({
                        identifier: trigger_id,
                        cond: (trigger_cond && trigger_cond.err) ? trigger_cond.err
                                : (trigger_cond && trigger_cond.res) ? trigger_cond.res
                                : null,
                        actions: trigger_actions,
                        label: t.name,
                        from: t.source.name,
                        to:   t.target.name
                    });
                }
            });
            // theFunction is an array of objects representing pvs functions.
            // Each object is in the form: { name: (string), permission: (string), actions: (Array of strings) }
            var theFunction = [];
            transitions.forEach(function (theTransition) {
                // first, check whether we have already processed the transition
                // if not, process the transition and add the transition identifier to the list of transitions already processed
                if (done.get(theTransition.identifier.val)) { return; }
                done.set(theTransition.identifier.val, true);

                // transition function
                // the body of the function is given by a COND-ENDCOND statement
                // made up from the expressions collected in array cases
                var transitionFunction = {
                    name: theTransition.identifier.val,
                    cases: []
                };

                // generate cases for permission function and transition function
                transitions.forEach(function (transition) {
                    // each case depends on the state from which the transition starts, and the transition conditions
                    // transitions with the same name can start from different states and have different conditions
                    if (transition.identifier.val === theTransition.identifier.val) {
                        var data = {
                            identifier: transition.identifier.val,
                            cond: transition.cond.val,
                            actions: transition.actions,
                            label: transition.label,
                            from: transition.from,
                            to: transition.to
                        };
                        transitionFunction.cases.push(data);
                    }
                });
                // store results for the specific transition
                theFunction.push(transitionFunction);
            });
            var data = {
                comment: "triggers",
                functions: theFunction
            };
            return data;
        }
        return null;
    };

    /**
     * Gets Emuchart constants
     */
    EmuchartsGenericPrinter.prototype.get_constants = function (emuchart) {
        if (emuchart.constants && emuchart.constants.length > 0) {
            return {
                comment: "user defined constants",
                constants: emuchart.constants
            };
        }
        return null;
    };

    // utility function for getting basic printer options
    EmuchartsGenericPrinter.prototype.get_params = function() {
        return new Promise (function (resolve, reject) {
            displayAskParameters.create({
                header: "PVS Printer Options",
                params: [{
                    id: "current_mode",
                    name: "Current system mode",
                    value: predefined_variables.current_mode.name,
                    inputbox: true
                },{
                    id: "previous_mode",
                    name: "Previous system mode",
                    value: (predefined_variables.previous_mode) ? predefined_variables.previous_mode.name : "",
                    inputbox: true
                },{
                    id: "mode_type",
                    name: "System mode type",
                    value: predefined_variables.current_mode.type,
                    inputbox: true
                }],
                buttons: ["Cancel", "Ok"]
            }).on("ok", function (e, view) {
                view.remove();
                var par = ({
                    current_mode: e.data.labels.get("current_mode"),
                    previous_mode: e.data.labels.get("previous_mode"),
                    state_type: e.data.labels.get("state_type")
                });
                if (par.current_mode) {
                    predefined_variables.current_mode.name = par.current_mode;
                }
                if (par.previous_mode) {
                    predefined_variables.previous_mode = {
                        name: par.previous_mode,
                        type: mode_type,
                        value: undef
                    };
                } else {
                    predefined_variables.previous_mode = null; // this will disable the creation of this state attribute
                }
                if (par.state_type) {
                    state_type = par.state_type;
                }
                resolve(par);
            }).on("cancel", function (e, view) {
                // just remove window
                view.remove();
            });
        });
    };

    module.exports = EmuchartsGenericPrinter;
});
