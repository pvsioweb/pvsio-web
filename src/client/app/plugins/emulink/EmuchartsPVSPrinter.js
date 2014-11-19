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
    var initialState;
    var variables;

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
        initialState = [];
        variables = {}; // each property represents a variable using a structured object whose properties reflect the structure specified using the dot notation. E.g., if a variable 'pump.display' is defined in emuchart, then variables = { pump: { display } }. If two or more emuchart variables have the same name, these will automatically be grouped together. E.g., if two variables 'pump.display' and 'pump.cursor' are defined in emuchart, variables = { pump: { display, cursor }}
        parser = new EmuchartsParser();
        if (unitTestEnabled) {
            parserUnitTest = new EmuchartsParser_UnitTest();
            console.log(parserUnitTest.unitTest());
        }
        return this;
    }
    
    EmuchartsPVSPrinter.prototype.set_theory_name = function (name) {
        theory_name = name;
        return this;
    };
    
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
        function printValue(term) {
            if (isVariable(term)) {
                if (term.val.indexOf(".") >= 0) {
                    var v = term.val.split(".");
                    v[0] += "(st)";
                    term.val = v.join("`");
                } else {
                    term.val += "(st)";
                }
            }
            return term.val;
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
            if (emuchart.initial_transitions[0].name === "") {
                emuchart.initial_transitions[0].name = "init";
            }
            var ans = parser.parseTransition(emuchart.initial_transitions[0].name);
            if (!ans.err && ans.res && ans.res.type === "transition") {
                theTransition = {
                    identifier: ans.res.val.identifier || { type: "identifier", val: "init" },
                    cond:    ans.res.val.cond,
                    actions: ans.res.val.actions,
                    to:   emuchart.initial_transitions[0].target.name
                };
            } else {
                ret.err = "Initial transition " + emuchart.initial_transitions[0].name + "\n\n" + ans.err;
                console.log(ans.err);
                return ret;
            }
            
            var pvsFunction = {
                identifier: "init",
                signature:  "init(x: real): State",
                cases: {
                    st: [
                        (predefined_variables.current_state.name + " := " + theTransition.to),
                        (predefined_variables.previous_state.name + " := " + theTransition.to)
                    ].concat(initialState),
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
                    if (isVariable) {
                        var expr = "st = st WITH [ ";
                        var brackets = [];
                        if (action.val.identifier.val.indexOf(".") >= 0) {
                            var v = action.val.identifier.val.split(".");
                            var i = 0;
                            for (i = 0; i < v.length; i++) {
                                expr += v[i];
                                if (i < v.length - 1) {
                                    expr += " := " + v[i] + "(st) WITH [ ";
                                    brackets.push("]");
                                }
                            }
                        } else {
                            expr += action.val.identifier.val;
                        }
                        expr += " := ";
                        var tmp = [];
                        action.val.expression.val.forEach(function (term) {
                            preProcess(term);
                            tmp.push(printValue(term));
                        });
                        expr += tmp.join(" ") + " ]";
                        brackets.forEach(function (bracket) {
                            expr += "]";
                        });
                        pvsFunction.cases.letExpr.push(expr);
                    }
                });
            }

            var code = "\n  %-- initial state\n  ";
            code += pvsFunction.signature;
            if (pvsFunction.cases.letExpr.length) {
                code += " = \n  LET st = (# " + pvsFunction.cases.st.join(",\n      ") + " #)";
                code += ",\n     " + pvsFunction.cases.letExpr.join(",\n     ");
                code += "\n    IN " + pvsFunction.cases.inExpr + "\n\n";
            } else if (initialState && initialState !== "") {
                code += " = (# " + pvsFunction.cases.st.join(",\n      ") + " #)\n";
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
        function printValue(term) {
            if (isVariable(term)) {
                if (term.val.indexOf(".") >= 0) {
                    var v = term.val.split(".");
                    v[0] += "(st)";
                    term.val = v.join("`");
                } else {
                    term.val += "(st)";
                }
            }
            return term.val;
        }
        
        var ret = { err: null, res: null };
        // multiple transitions can have the same identifier 
        // (because the same transition can originate from different nodes)
        // this keeps track of the transitions we've already processed -- needed to avoid duplicates
        var done = d3.map();
        
        if (emuchart.transitions && emuchart.transitions.length > 0) {
            var transitions = [];
            emuchart.transitions.forEach(function (t) {
                if (t.name === "") { t.name = "tick"; }
                var ans = parser.parseTransition(t.name);
                                
                if (!ans.err && ans.res && ans.res.type === "transition") {
                    transitions.push({
                        identifier: ans.res.val.identifier || { type: "identifier", val: "tick" },
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
                                if (term.type === "identifier") {
                                    preProcess(term);
                                    if (isVariable(term)) {
                                        if (term.val.indexOf(".") >= 0) {
                                            var v = term.val.split(".");
                                            v[0] += "(st)";
                                            term.val = v.join("`");
                                        } else {
                                            term.val += "(st)";
                                        }
                                    }
                                    tmp.push(term.val);
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
                                var expr = "new_st = new_st WITH [ ";
                                var brackets = [];
                                if (action.val.identifier.val.indexOf(".") >= 0) {
                                    var v = action.val.identifier.val.split(".");
                                    var i = 0;
                                    for (i = 0; i < v.length; i++) {
                                        expr += v[i];
                                        if (i < v.length - 1) {
                                            expr += " := " + v[i] + "(st) WITH [ ";
                                            brackets.push("]");
                                        }
                                    }
                                } else {
                                    expr += action.val.identifier.val;
                                }
                                expr += " := ";
                                var tmp = [];
                                action.val.expression.val.forEach(function (term) {
                                    preProcess(term);
                                    tmp.push(printValue(term));
                                });
                                expr += tmp.join(" ") + " ]";
                                brackets.forEach(function (bracket) {
                                    expr += "]";
                                });
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
        function print_aux(v, type) {
            if (v && v.type === "identifier") {
                return v.val + ": " + type;
            } else if (v && v.type === "selector") {
                return v.val + ": [# " + print_aux(v.child, type) + " #]";
            }
            return v;
        }
        function printSelector(v) {
            if (v && v.type === "selector") {
                if (v.child.type === "identifier") {
                    return v.val;
                }
                return v.val + "." + printSelector(v.child);
            }
            return "";
        }
        function printIdentifier(v) {
            if (v && v.type === "identifier") {
                return v.val;
            } else if (v && v.type === "selector") {
                return printIdentifier(v.child);
            }
            return "";
        }
        function extend(st, v, type) {
            if (v.type === "identifier") {
                st.set(v.val, type);
            } else if (v.type === "selector") {
                var selector = printSelector(v);
                var identifier = printIdentifier(v);
                var children = st.get(selector) || [];
                children.push({ identifier: identifier, type: type });
                st.set(selector, children);
            }
        }
        function printStateType(st) {
            var keys = st.keys();
            var tmp = [];
            keys.forEach(function (key) {
                var ans = key;
                var x = st.get(key);
                if (typeof x === "string") {
                    ans += ": " + x;
                } else if (typeof x === "object" && x.length) {
                    ans += ": [# ";
                    var tmp1 = [];
                    x.forEach(function (name) {
                        tmp1.push(name.identifier + ": " + name.type);
                    });
                    ans += tmp1.join(", ") + " #]";
                }
                tmp.push(ans);
            });
            return "[#\n   " + tmp.join(",\n   ") + "\n  #]";
        }
        function generateInitialStateAssignments(st, variables) {
            var keys = st.keys();
            var tmp = [];
            keys.forEach(function (key) {
                var ans = key;
                var x = st.get(key);
                if (typeof x === "string") {
                    if (key !== "current_state" && key !== "previous_state") {
                        var val = variables.get(key + "." + x);
                        if (!val) {
                            if (x.toLowerCase() === "bool" ||
                                    x.toLowerCase() === "boolean") {
                                val = "false";
                            } else {
                                val = 0;
                            }
                        }
                        ans += ":= " + val;
                        tmp.push(ans);
                    }
                } else if (typeof x === "object" && x.length) {
                    ans += ":= (# ";
                    var tmp1 = [];
                    x.forEach(function (name) {
                        var val = variables.get(key + "." + name) || 0;
                        tmp1.push(name.identifier + ":= " + val);
                    });
                    ans += tmp1.join(", ") + " #)";
                    tmp.push(ans);
                }
            });
            return tmp;
        }
        
        var ans = "\n  %-- emuchart state\n  State: TYPE";
        if (emuchart.variables && emuchart.variables.length) {
            var state = d3.map();
            state.set("current_state", "MachineState");
            state.set("previous_state", "MachineState");
            emuchart.variables.forEach(function (v) {
                var theVariable = parser.parseDotNotation(v.name);
                if (theVariable.err) {
                    console.log("Error while parsing variable " + v.name + "\n" + theVariable.err);
                    return;
                }
                extend(state, theVariable.res, v.type);
            });
            console.log(state);
            ans += " = " + printStateType(state);
            console.log(ans);
            var readVariables = function (ev) {
                var ans = d3.map();
                ev.forEach(function (v) {
                    ans.set(v.name, v.val);
                });
                return ans;
            };
            initialState = generateInitialStateAssignments(state, readVariables(emuchart.variables));
        }
        ans += "\n";
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
        initialState = [];
        var ret = { err: null, res: null };
        
        var ans = this.print_descriptor(emuchart) + "\n";
        ans += emuchart.name + ": THEORY\n BEGIN\n";
        ans += this.print_importings(emuchart);
        ans += this.print_constants(emuchart);
        ans += this.print_states(emuchart);
        ans += this.print_variables(emuchart);
        
        var initialTransitions = this.print_initial_transition(emuchart);
        var transitions = this.print_transitions(emuchart);
        if (initialTransitions.err || transitions.err) {
            ret.err = initialTransitions.err || transitions.err;
            displayError(ret.err);
            return ret;
        }
        
        ans += initialTransitions.res;
        ans += transitions.res;
        ans += " END " + emuchart.name + "\n";
        ans += this.print_disclaimer();
        ret.res = ans;
        
        return ret;
    };
    
    module.exports = EmuchartsPVSPrinter;
});