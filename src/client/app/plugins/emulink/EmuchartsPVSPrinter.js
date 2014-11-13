/** @module EmuchartsPVSPrinter */
/**
 * EmuchartsPVSPrinter provides functions to generate PVS models from Emucharts
 * @author Paolo Masci
 * @date 27/05/14 9:38:13 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3 */
define(function (require, exports, module) {
	"use strict";

    var EmuchartsParser = require("plugins/emulink/EmuchartsParser");
    var EmuchartsParser_UnitTest = require("plugins/emulink/EmuchartsParser_UnitTest");
    var displayNotificationView  = require("plugins/emulink/forms/displayNotificationView");
    
    
    var theory_name;
    var parser;
    
    var parserUnitTest;
    var unitTestEnabled = true;
    
    var predefined_variables = {
        previous_state: { name: "previous_state", type: "MachineState" },
        current_state:  { name: "current_state", type: "MachineState" }
    };
    
    var automaticConstants;

    var displayNotification = function (msg, title) {
        title = title || "Notification";
        displayNotificationView.create({
            header: title,
            message: msg,
            buttons: ["Ok"]
        }).on("ok", function (e, view) {
            view.remove();
        });
    };
    var displayError = function (msg) {
        displayNotification(msg, "Compilation Error");
    };
    var displayWarning = function (msg) {
        displayNotification(msg, "Warning");
    };
    /**
	 * Constructor
	 */
    function EmuchartsPVSPrinter(name) {
        theory_name = name;
        automaticConstants = [];
        parser = new EmuchartsParser();
        if (unitTestEnabled) {
            parserUnitTest = new EmuchartsParser_UnitTest();
            console.log(parserUnitTest.unitTest());
        }
        return this;
    }
    
    /**
     * Prints PVS definitions for Emuchart states
     */
    EmuchartsPVSPrinter.prototype.print_states = function (emuchart) {
        var states = emuchart.states;
        var ans = "\n  %-- machine states\n" +
                    "  MachineState: TYPE";
        if (states && states.length > 0) {
            var tmp = [];
            states.forEach(function (state) {
                tmp.push(state.name);
            });
            ans += " = { " + tmp.join(", ") + " }";
        }
        return ans + "\n";
    };
    

    /**
     * Prints PVS definitions of utility functions used in Emuchart
     */
    function print_utils() {
        var ans = "\n  %-- utility functions";
        ans += "\n  enter_into(ms: " + predefined_variables.current_state.type +
                        ")(st: State): State = st WITH [ " + predefined_variables.current_state.name + " := ms ]";
        ans += "\n  leave_state(ms: " + predefined_variables.previous_state.type +
                        ")(st: State): State = st WITH [ " + predefined_variables.previous_state.name + " := ms ]\n";
        return ans;
    }
    
    /**
     * This function converts the name of operators in expressions -- needed for && || == != !
     */
    function preProcessTerm(term) {
        if (term) {
            if (term.type === "binop") {
                if (term.val === "&&") {
                    term.val = "AND";
                } else if (term.val === "||") {
                    term.val = "OR";
                } else if (term.val === "==") {
                    term.val = "=";
                } else if (term.val === "!=") {
                    term.val = "/=";
                }
            } else if (term.type === "unaryop") {
                if (term.val === "!") {
                    term.val = "NOT";
                }
            }
        }
    }
    
    
    /**
     * Prints PVS definitions for Emuchart initial transitions
     */
    EmuchartsPVSPrinter.prototype.print_initial_transition = function (emuchart) {
        function preProcess(term) {
            return preProcessTerm(term);
        }
        
        var ret = { err: null, res: null };
        emuchart.constants = emuchart.constants || [];

        if (emuchart.initial_transitions && emuchart.initial_transitions.length > 0) {
            var theTransition = {
                identifier: "init", // the name is always init for the current version of PVSio-web
                cond:    { type: "expression", val: [] },
                actions: { type: "actions", val: [] },
                to:      emuchart.initial_transitions[0].target.name
            };
            var ans = parser.parseTransition(emuchart.initial_transitions[0].name);
            if (ans.res) {
                if (ans.res.type === "transition") {
                    theTransition = {
                        identifier: "init", // the name is always init for the current version of PVSio-web
                        cond:    ans.res.val.cond,
                        actions: ans.res.val.actions,
                        to:      emuchart.initial_transitions[0].target.name
                    };
                } else if (ans.res.type === "actions") {
                    theTransition = {
                        identifier: "init", // the name is always init for the current version of PVSio-web
                        cond:    { type: "expression", val: [] },
                        actions: ans.res,
                        to:      emuchart.initial_transitions[0].target.name
                    };
                }
            }
            
            var pvsFunction = {
                identifier: "init",
                signature:  "init(x: real): State",
                cases: {
                    st: [
                        (predefined_variables.current_state.name + " := " + theTransition.to),
                        (predefined_variables.previous_state.name + " := " + theTransition.to)
                    ],
                    letExpr: [],
                    inExpr: [ ("st") ]
                }
            };
            if (emuchart.variables && emuchart.variables.length) {
                emuchart.variables.forEach(function (variable) {
                    var initialisation = null;
                    // look for the initialisation in the actions
                    if (theTransition.actions && theTransition.actions.val &&
                            theTransition.actions.val.length) {
                        theTransition.actions.val.forEach(function (action) {
                            if (action.val.identifier.val === variable.name) {
                                action.val.expression.val.forEach(function (term) {
                                    initialisation = variable.name + " := " + term.val;
                                });
                            }
                        });
                    }
                    if (initialisation === null) {
                        var msg = "Warning: initial value for variable " + variable.name +
                                    " of type " + variable.type + " was not specified.";
                        // set a default value -- try to check the type so that an appropriate value can be chosen
                        if (variable.type.toLowerCase() === "bool") {
                            initialisation = variable.name + " := false";
                        } else if (variable.type.toLowerCase() === "real" ||
                                        variable.type.toLowerCase() === "int" ||
                                        variable.type.toLowerCase() === "nat" ||
                                        variable.type.toLowerCase() === "posnat" ||
                                        variable.type.toLowerCase() === "posreal") {
                            initialisation = variable.name + " := 0";
                            msg += "\nNumeric variable detected: setting value 0.";
                        } else {
                            var constant = "initial_" + variable.type;
                            automaticConstants.push({
                                name: constant,
                                type: variable.type
                            });
                            initialisation = variable.name + " := " + constant;
                            msg += "\nUsing symbolic constant " + constant;
                        }
                        displayWarning(msg);
                    }
                    pvsFunction.cases.st.push(initialisation);
                });
            }
    
            if (theTransition.actions && theTransition.actions.val &&
                    theTransition.actions.val.length) {
                theTransition.actions.val.forEach(function (action) {
                    // actions involving variables have already been taken into account
                    var isVariable = false;
                    emuchart.variables.forEach(function (variable) {
                        if (variable.name === action.val.identifier.val) {
                            isVariable = true;
                        }
                    });
                    if (isVariable === false) {
                        var expr = "st = st WITH [ " + action.val.identifier.val + " := ";
                        var tmp = [];
                        action.val.expression.val.forEach(function (term) {
                            preProcess(term);
                            tmp.push(term.val);
                        });
                        expr += tmp.join(" ") + " ]";
                        pvsFunction.cases.letExpr.push(expr);
                    }
                });
            }

            var code = "\n  %-- initial state\n  ";
            code += pvsFunction.signature + " =\n    ";
            if (pvsFunction.cases.letExpr.length) {
                code += "LET st = (# " + pvsFunction.cases.st.join(", ") + " #)";
                code += ",\n    " + pvsFunction.cases.letExpr.join(",\n  ");
                code += "\n    IN " + pvsFunction.cases.inExpr + "\n";
            } else {
                code += "(# " + pvsFunction.cases.st.join(", ") + " #)\n";
            }

            ret.res = code;
        }
        return ret;
    };
    
    /**
     * Prints PVS definitions for Emuchart transitions given in the form transition [condition] {actions}
     */
    EmuchartsPVSPrinter.prototype.print_transitions = function (emuchart) {
        function isVariable(term) {
            if (term.type === "identifier") {
                if (term.val === predefined_variables.current_state.name ||
                        term.val === predefined_variables.previous_state.name) {
                    return true;
                }
                if (emuchart.variables) {
                    var i = 0;
                    for (i = 0; i < emuchart.variables.length; i++) {
                        if (term.val === emuchart.variables[i].name) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        
        function preProcess(term) {
            return preProcessTerm(term);
        }
        
        var ret = { err: null, res: null };
        // multiple transitions can have the same identifier 
        // (because the same transition can originate from different nodes)
        // this keeps track of the transitions we've already processed -- needed to avoid duplicates
        var done = d3.map();
        
        if (emuchart.transitions && emuchart.transitions.length > 0) {
            var transitions = [];
            emuchart.transitions.forEach(function (t) {
                var ans = parser.parseTransition(t.name);
                                
                if (!ans.err && ans.res && ans.res.type === "transition") {
                    transitions.push({
                        identifier: ans.res.val.identifier,
                        cond:    ans.res.val.cond,
                        actions: ans.res.val.actions,
                        from: t.source.name,
                        to:   t.target.name
                    });
                } else {
                    ret.err = t.name + "\n" + ans.err;
                    console.log(ans.err);
                    return ret;
                }
            });
            var pvsFunctions = []; // this is an array of objects representing pvs functions
            transitions.forEach(function (theTransition) {
                // first, check whether we have already processed the transition
                // if not, add the transition identifier to the list of transitions already processed
                if (done.get(theTransition.identifier.val)) { return; }
                done.set(theTransition.identifier.val, true);
                
                // permission function
                var permissionFunction = {
                    identifier: "per_" + theTransition.identifier.val,
                    signature : "per_" + theTransition.identifier.val + "(st: State): bool",
                    cases: []
                    // the body of the permission is given by the disjunction of the collected cases
                };
                // transition function
                var transitionFunction = {
                    identifier: theTransition.identifier.val,
                    signature : theTransition.identifier.val + "(st: (" + permissionFunction.identifier + ")): State",
                    cases: []
                    // the body of the function is given by a COND-ENDCOND statement 
                    // made up from the expressions collected in array cases
                };
                
                // generate cases for permission function and transition function
                transitions.forEach(function (transition) {
                    // each case depends on the state from which the transition starts, and the transition conditions
                    // transitions with the same name can start from different states and have different conditions
                    if (transition.identifier.val === theTransition.identifier.val) {
                        // the final expression for pre is the conjunction of all expressions
                        var cond = [ ("(current_state(st) = " + transition.from + ")") ];
                        if (transition.cond && transition.cond.type === "expression" &&
                                transition.cond.val && transition.cond.val.length > 0) {
                            var tmp = [];
                            transition.cond.val.forEach(function (term) {
                                // identifiers of state variables need to be followed by (st)
                                if (isVariable(term)) {
                                    tmp.push(term.val + "(st)");
                                } else {
                                    preProcess(term);
                                    tmp.push(term.val);
                                }
                            });
                            cond.push("(" + tmp.join(" ") + ")");
                        }
                        // the final expression for post is a LET-IN expression 
                        // given by the sequence of collected statements separated by commas
                        var letExpr = [ ("LET new_st = leave_state(" + transition.from + ")(st)") ];
                        var inExpr = "";
                        if (transition.actions && transition.actions.val &&
                                transition.actions.val.length > 0) {
                            transition.actions.val.forEach(function (action) {
                                var expr = "new_st = new_st WITH [ " + action.val.identifier.val + " := ";
                                var tmp = [];
                                action.val.expression.val.forEach(function (term) {
                                    if (isVariable(term)) {
                                        tmp.push(term.val + "(st)");
                                    } else {
                                        preProcess(term);
                                        tmp.push(term.val);
                                    }
                                });
                                expr += tmp.join(" ") + " ]";
                                letExpr.push(expr);
                            });
                        }
                        inExpr = "IN enter_into(" + transition.to + ")(new_st)";
                        
                        permissionFunction.cases.push("(" + cond.join(" AND ") + ")");
                        transitionFunction.cases.push({ cond: cond, letExpr: letExpr, inExpr: inExpr });
                    }
                });

                // store results
                pvsFunctions.push({ per: permissionFunction, tran: transitionFunction });
            });
            
            var ans = print_utils();
            ans += "\n  %-- transition functions\n";
            pvsFunctions.forEach(function (f) {
                ans += "  " + f.per.signature + " = " + f.per.cases.join(" OR ") + "\n";
                ans += "  " + f.tran.signature + " =\n    COND\n";
                var tmp = [];
                f.tran.cases.forEach(function (c) {
                    var expr = "    " + c.cond.join(" AND ") + "\n     -> ";
                    expr += c.letExpr.join(",\n            ") + "\n         ";
                    expr += c.inExpr;
                    tmp.push(expr);
                });
                ans += tmp.join(",\n") + "\n    ENDCOND\n\n";
            });
            ret.res = ans;
        }
        return ret;
    };

    /**
     * Prints PVS definitions for Emuchart variables
     */
    EmuchartsPVSPrinter.prototype.print_variables = function (emuchart) {
        var ans = "\n  %-- emuchart state\n  State: TYPE = [#\n" +
                    "   current_state : MachineState,\n" +
                    "   previous_state: MachineState";
        if (emuchart.variables && emuchart.variables.length) {
            emuchart.variables.forEach(function (v) {
                ans += ",\n   " + v.name + ": " + v.type;
            });
        }
        ans += "\n  #]\n";
        return ans;
    };

    /**
     * Prints PVS definitions for Emuchart constants
     */
    EmuchartsPVSPrinter.prototype.print_constants = function (emuchart) {
        var constants = emuchart.constants;
        var ans = "";
        if (constants && constants.length > 0) {
            ans += "\n  %-- constants\n";
            constants.forEach(function (c) {
                ans += "  " + c.name + ": " + c.type;
                if (c.value) { ans += " = " + c.value; }
                ans += "\n";
            });
        }
        if (automaticConstants.length > 0) {
            ans += "\n  %-- constants generated by PVSPrinter\n";
            automaticConstants.forEach(function (c) {
                ans += "  " + c.name + ": " + c.type;
                if (c.value) { ans += " = " + c.value; }
                ans += "\n";
            });
        }
        return ans;
    };

    /**
     * Prints PVS definitions for Emuchart constants
     */
    EmuchartsPVSPrinter.prototype.print_importings = function (emuchart) {
        var importings = emuchart.importings;
        var ans = "";
        if (importings && importings.length > 0) {
            ans += " IMPORTING ";
            importings.forEach(function (importing) {
                ans += importing + ", ";
            });
            ans = ans.substr(0, ans.length - 1) + "\n";
        }
        return ans;
    };
        
    EmuchartsPVSPrinter.prototype.print_descriptor = function (emuchart) {
        var ans = "% ---------------------------------------------------------------" +
                    "\n%  Theory: " + emuchart.name;
        if (emuchart.author) {
            ans += "\n%  Author: " + emuchart.author.name +
                    "\n%          " + emuchart.author.affiliation +
                    "\n%          " + emuchart.author.contact;
        }
        if (emuchart.description) {
            ans += "\n% ---------------------------------------------------------------" +
                    "\n%  " + emuchart.description;
        }
        ans += "\n% ---------------------------------------------------------------\n";
        return ans;
    };
    
    EmuchartsPVSPrinter.prototype.print_disclaimer = function () {
        var ans = "\n% ---------------------------------------------------------------\n" +
                    "%  PVS theory generated using PVSio-web PVSPrinter ver 0.1\n" +
                    "%  Tool freely available at http://www.pvsioweb.org" +
                    "\n% ---------------------------------------------------------------\n";
        return ans;
    };
    
    /**
     * Prints the entire PVS theory
     */
    EmuchartsPVSPrinter.prototype.print = function (emuchart) {
        automaticConstants = [];
        var ret = { err: null, res: null };
        var initialTransitions = this.print_initial_transition(emuchart);
        var transitions = this.print_transitions(emuchart);
        if (initialTransitions.err || transitions.err) {
            ret.err = initialTransitions.err || transitions.err;
            displayError(ret.err);
            return ret;
        }
        
        var ans = this.print_descriptor(emuchart) + "\n";
        ans += emuchart.name + ": THEORY\n BEGIN\n";
        ans += this.print_importings(emuchart);
        ans += this.print_constants(emuchart);
        ans += this.print_states(emuchart);
        ans += this.print_variables(emuchart);
        ans += initialTransitions.res;
        ans += transitions.res;
        ans += " END " + emuchart.name + "\n";
        ans += this.print_disclaimer();
        ret.res = ans;
        
        return ret;
    };
    
    module.exports = EmuchartsPVSPrinter;
});