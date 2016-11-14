/** @module EmuchartsNuXMVPrinter */
/**
 * EmuchartsNuXMVPrinter provides functions to generate NuXMV models from Emucharts
 * @author Paolo Masci
 * @date Nov 13, 2016
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";

    var EmuchartsParser = require("plugins/emulink/EmuchartsParser");
    // var version = 0.1;

    var var_declarations = require("text!plugins/emulink/models/nuxmv/templates/var_declarations.handlebars"),
        var_init = require("text!plugins/emulink/models/nuxmv/templates/var_init.handlebars"),
        transitions = require("text!plugins/emulink/models/nuxmv/templates/transitions.handlebars"),
        nuxmv_module = require("text!plugins/emulink/models/nuxmv/templates/nuxmv_module.handlebars");

    var parser;
    var model_name;

    var predefined_variables = {
        previous_state: { name: "previous_state" },
        current_state: { name: "current_state" }
    };

    /**
     * Constructor
     */
    function EmuchartsNuXMVPrinter(name) {
        model_name = name;
        parser = new EmuchartsParser();
        return this;
    }

    EmuchartsNuXMVPrinter.prototype.set_model_name = function (name) {
        model_name = name;
        return this;
    };

    function isVariable(name, emuchart) {
        if (name === predefined_variables.current_state.name ||
                name === predefined_variables.previous_state.name) {
            return true;
        }
        if (emuchart.variables) {
            var i = 0;
            for (i = 0; i < emuchart.variables.length; i++) {
                if (name === emuchart.variables[i].name ||
                      emuchart.variables[i].name.indexOf(name + ".") >= 0 ) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * This function converts the name of operators in expressions -- needed for && || == != !
     */
    var preProcess = function (term, emuchart) {
        function printFunction(term) {
            if (term.type === "identifier") {
                if (isVariable(term.val, emuchart)) {
                    if (term.val.indexOf(".") >= 0) {
                        var v = term.val.split(".");
                        term.val = v.join("_");
                    }
                }
                return term.val;
            } else if (typeof term.val === "string") {
                return term.val;
            } else if (term.type === "function") {
                var ans = "", i = 0;
                for (i = 0; i < term.val.length; i++) {
                    ans += printFunction(term.val[i]);
                }
                return ans;
            }
            return term;
        }
        if (term) {
            if (term.type === "binop") {
                if (term.val === "&&" || term.val === "AND") {
                    term.val = "&";
                } else if (term.val === "||" || term.val === "OR") {
                    term.val = "|";
                } else if (term.val === "==") {
                    term.val = "=";
                }
            } else if (term.type === "unaryop") {
                if (term.val === "NOT") {
                    term.val = "!";
                }
            } else if (term.type === "function") {
                term.val = printFunction(term);
            }
        }
        return term;
    };

    function from_emucharts_transition(trans, emuchart) {
        var t = parser.parseTransition(trans.name);
        var cond = [];
        if (t.res && t.res.val.cond) {
            t.res.val.cond.val.forEach(function (term) {
                if (term.type === "identifier") {
                    preProcess(term, emuchart);
                    if (isVariable(term.val, emuchart)) {
                        if (term.val.indexOf(".") >= 0) {
                            var v = term.val.split(".");
                            term.val = v.join("_");
                        }
                    }
                    cond.push(term.val);
                } else {
                    preProcess(term, emuchart);
                    cond.push(term.val);
                }
            });
        }
        var actions = [];
        if (trans.source && (!trans.target || trans.source.name !== trans.target.name)) {
            actions.push(
                "next(" + predefined_variables.previous_state.name + ") = " + trans.source.name
            );
        }
        if (trans.target && (!trans.source || trans.source.name !== trans.target.name)) {
            actions.push(
                "next(" + predefined_variables.current_state.name + ") = " + trans.target.name
            );
        }
        if (t.res && t.res.val.actions) {
            t.res.val.actions.val.forEach(function (action) {
                var expr = [];
                if (action.type === "assignment") {
                    action.val.expression.val.forEach(function (term) {
                        if (term.type === "identifier") {
                            preProcess(term, emuchart);
                            if (isVariable(term.val, emuchart)) {
                                if (term.val.indexOf(".") >= 0) {
                                    var v = term.val.split(".");
                                    term.val = v.join("_");
                                }
                            }
                            expr.push(term.val);
                        } else {
                            preProcess(term, emuchart);
                            expr.push(term.val);
                        }
                    });
                    actions.push("next(" + preProcess(action.val.identifier.val) + ") = " + expr.join(" "));
                }
            });
        }
        return {
            name: (t.res.val.identifier) ? t.res.val.identifier.val : "tick",
            cond: cond.join(" "),
            action: actions.join(" & ")
        };
    }

    EmuchartsNuXMVPrinter.prototype.print_declarations = function (emuchart) {
        // Example use of the template:
        // Handlebars.compile(var_declarations, { noEscape: true })({
        //     declarations: [
        //         { isBoundedInteger: true, name: "c", min: "0", max: "10" },
        //         { isEnumeration: true, name: "m", constants: [ "slow", "fast" ] }
        //     ],
        //     trans: [
        //         { name: "up", cond: "display < 100", action: "next(display) = display + 1" },
        //         { name: "down", cond: "display > 0", action: "next(display) = display - 1" }
        //     ]
        // });
        var theDeclarations = emuchart.variables.map(function (variable) {
            return { name: variable.name, type: variable.type};
        });
        // add the definitions of the pre-defined variables (current_state and previous_state)
        var machineStateType = "{ " + emuchart.states.map(function (state) {
            return state.name;
        }).join(", ") + " }";
        theDeclarations = theDeclarations.concat([
            { name: predefined_variables.current_state.name,
              type: machineStateType },
            { name: predefined_variables.previous_state.name,
              type: machineStateType }
        ]);
        var theTransitions = new d3.map(); // this is necessary to avoid duplicate transition names
        emuchart.transitions.forEach(function (trans) {
            var t = from_emucharts_transition(trans, emuchart);
            theTransitions.set(t.name);
        });
        return Handlebars.compile(var_declarations, { noEscape: true })({
            declarations: theDeclarations,
            trans: theTransitions.keys().map(function (trans) { return { name: trans }; })
        });
    };

    EmuchartsNuXMVPrinter.prototype.print_init = function (emuchart) {
        // Example use of the template:
        // Handlebars.compile(var_init, { noEscape: true })({
        //     init: [
        //         { name: "c", val: "0" },
        //         { name: "m", val: "slow" }
        //     ],
        //     indent: " "
        // });
        var init = emuchart.variables.map(function (variable) {
            return { name: variable.name, value: variable.value };
        });
        // add the initialisation for the pre-defined variables (current_state and previous_state)
        // FIXME: investigate how to express conditional initialisation, e.g., c = if disp < 10 then 0 else 1 endif
        emuchart.initial_transitions.forEach(function (trans) {
            init.push({
                name: predefined_variables.current_state.name,
                value: trans.target.name
            });
            init.push({
                name: predefined_variables.previous_state.name,
                value: trans.target.name
            });
            init.push({
                name: "event",
                value: trans.name || "tick"
            });
        });
        return Handlebars.compile(var_init, { noEscape: true })({
            init: init,
            indent: " "
        });
    };

    EmuchartsNuXMVPrinter.prototype.print_transitions = function (emuchart) {
        // Example use of the template:
        // Handlebars.compile(transitions, { noEscape: true })({
        //     trans: [
        //         { name: "up", cond: "display < 100", action: "next(display) = display + 1" },
        //         { name: "down", cond: "display > 0", action: "next(display) = display - 1" }
        //     ],
        //     indent: " "
        // });
        var theTransitions = emuchart.transitions.map(function (trans) {
            return from_emucharts_transition(trans, emuchart);
        });
        return Handlebars.compile(transitions, { noEscape: true })({
            trans: theTransitions,
            indent: " "
        });
    };

    EmuchartsNuXMVPrinter.prototype.print_descriptor = function (emuchart) {
        var ans = "-- ---------------------------------------------------------------" +
                    "\n--  Theory: " + emuchart.name;
        if (emuchart.author) {
            ans += "\n--  Author: " + emuchart.author.name +
                    "\n--          " + emuchart.author.affiliation +
                    "\n--          " + emuchart.author.contact;
        }
        if (emuchart.description) {
            ans += "\n-- ---------------------------------------------------------------" +
                    "\n--  " + emuchart.description;
        }
        ans += "\n-- ---------------------------------------------------------------\n";
        return ans;
    };

    EmuchartsNuXMVPrinter.prototype.print_disclaimer = function () {
        var ans = "\n-- ---------------------------------------------------------------\n" +
                    "--  PVS theory generated using PVSio-web NuXMVPrinter ver 0.1\n" +
                    "--  Tool freely available at http://www.pvsioweb.org" +
                    "\n-- ---------------------------------------------------------------\n";
        return ans;
    };

    /**
     * Prints the entire NuXMV model
     */
    EmuchartsNuXMVPrinter.prototype.print = function (emuchart) {
        var body = this.print_declarations(emuchart);
        body += this.print_init(emuchart);
        body += this.print_transitions(emuchart);
        var res = Handlebars.compile(nuxmv_module, { noEscape: true })({
            name: "main",
            body: body
        });
        res = this.print_descriptor(emuchart) + res + this.print_disclaimer(emuchart);
        console.log(res);
        console.log(emuchart);
        return { res: res };
    };

    module.exports = EmuchartsNuXMVPrinter;
});
