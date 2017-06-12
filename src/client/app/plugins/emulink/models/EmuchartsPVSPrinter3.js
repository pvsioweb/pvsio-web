/** @module EmuchartsPVSPrinter */
/**
 * EmuchartsPVSPrinter provides functions to generate PVS models from Emucharts
 * @author Paolo Masci
 * @version 3.0
 * @date June 2, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";
    var printer_version = "3.0";
    var GenericPrinter = require("plugins/emulink/models/EmuchartsGenericPrinter");

    var projectManager = require("project/ProjectManager").getInstance();

    var leave_enter_function_template = require("text!plugins/emulink/models/pvs/templates/pvs_leave_enter_functions.handlebars"),
        init_function_template = require("text!plugins/emulink/models/pvs/templates/pvs_init_function.handlebars"),
        transition_functions_template = require("text!plugins/emulink/models/pvs/templates/pvs_transition_functions.handlebars"),
        enumerated_type_template = require("text!plugins/emulink/models/pvs/templates/pvs_enumerated_type.handlebars"),
        record_type_template = require("text!plugins/emulink/models/pvs/templates/pvs_record_type.handlebars"),
        constants_type_template = require("text!plugins/emulink/models/pvs/templates/pvs_constants_type.handlebars"),
        pvs_theory_template = require("text!plugins/emulink/models/pvs/templates/pvs_theory.handlebars"),
        pvs_descriptor_template = require("text!plugins/emulink/models/pvs/templates/pvs_descriptor.handlebars"),
        pvs_disclaimer_template = require("text!plugins/emulink/models/pvs/templates/pvs_disclaimer.handlebars"),
        pvs_utils_template = require("text!plugins/emulink/models/pvs/templates/pvs_utils.handlebars");

    var predefined_functions = { leave: "leave", enter: "enter" };

    // var displayNotificationView  = require("plugins/emulink/forms/displayNotificationView");
    // var displayNotification = function (msg, title) {
    //     title = title || "Notification";
    //     displayNotificationView.create({
    //         header: title,
    //         message: msg,
    //         buttons: ["Ok"]
    //     }).on("ok", function (e, view) {
    //         view.remove();
    //     });
    // };
    // var displayError = function (msg) {
    //     displayNotification(msg, "Compilation Error");
    // };
//    var displayWarning = function (msg) {
//        displayNotification(msg, "Warning");
//    };
    /**
     * Constructor
     */
    function EmuchartsPVSPrinter(name) {
        this.theory_name = name;
        this.genericPrinter = new GenericPrinter();
        return this;
    }

    EmuchartsPVSPrinter.prototype.set_theory_name = function (name) {
        this.theory_name = name;
        return this;
    };

    /**
     * Prints PVS definitions for Emuchart states
     */
    EmuchartsPVSPrinter.prototype.print_modes = function (emuchart) {
        if (emuchart && emuchart.states) {
            var ans = this.genericPrinter.get_modes(emuchart);
            return Handlebars.compile(enumerated_type_template, { noEscape: true })({
                comment: ans.comment,
                enumtype: ans.modes
            });
        }
        return "";
    };

    /**
     * Prints PVS definitions for Emuchart states
     */
    EmuchartsPVSPrinter.prototype.print_datatypes = function (emuchart) {
        if (emuchart && emuchart.datatypes && emuchart.datatypes.length > 0) {
            var ans = this.genericPrinter.get_datatypes(emuchart);
            return Handlebars.compile(enumerated_type_template, { noEscape: true })({
                comment: "user defined datatypes",
                enumtype: ans.datatypes
            });
        }
        return "";
    };


    /**
     * Prints the PVS definition for Emuchart variables
     */
    EmuchartsPVSPrinter.prototype.print_variables = function (emuchart) {
        if (emuchart) {
            var ans = this.genericPrinter.get_variables(emuchart);
            return Handlebars.compile(record_type_template, { noEscape: true })({
                comment: "emuchart state",
                indent: "  ",
                recordtype: ans.variables
            });
        }
        return "";
    };

    /**
     * Prints PVS definitions of utility functions used in Emuchart
     */
    EmuchartsPVSPrinter.prototype.print_enter_leave = function (emuchart) {
        if (emuchart) {
            var ans = this.genericPrinter.get_enter_leave(emuchart);
            // if (predefined_variables.previous_state) {
            //     data.previous_state = predefined_variables.previous_state;
            // }
            return Handlebars.compile(leave_enter_function_template, { noEscape: true })({
                entry_actions: ans.entry_actions.map(function (action) {
                    return {
                        name: action.name,
                        value: print_pvs_expression(action.value, emuchart, { attach_state: true })
                    };
                }),
                leave_actions: ans.leave_actions.map(function (action) {
                    return {
                        name: action.name,
                        value: print_pvs_expression(action.value, emuchart, { attach_state: true })
                    };
                }),
                current_mode: ans.current_mode,
                previous_mode: ans.previous_mode,
                state_type: ans.state_type,
                enter: predefined_functions.enter,
                leave: predefined_functions.leave,
                full_coverage: true
            });
        }
        return "";
    };

    // This function "flattens" Object expressions into a string
    // and converts the name of operators in expressions -- needed for && || == != !
    function print_pvs_expression(expr, emuchart, opt) {
        function preProcess (term, emuchart) {
            function preprocessFunction(term, emuchart) {
                if (term.type === "function") {
                    var ans = "";
                    for (var i = 0; i < term.val.length; i++) {
                        ans += preprocessFunction(term.val[i], emuchart);
                    }
                    return ans;
                } else if (term.type === "identifier") {
                    if (term.isVariable) {
                        if (term.val.indexOf(".") >= 0) {
                            var v = term.val.split(".");
                            v[0] += "(st)";
                            term.val = v.join("`");
                        } else {
                            term.val += "(st)";
                        }
                    }
                    return term.val;
                } else if (term.type === "binop") {
                    return " " + term.val + " ";
                } else if (typeof term.val === "string") {
                    return term.val;
                }
                return term;
            }
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
                } else if (term.type === "function") {
                    term.val = preprocessFunction(term, emuchart);
                }
            }
            return term;
        }
        opt = opt || [];
        var tmp = [];
        expr.forEach(function (term) {
            if (term.isVariable) {
                term.type = "variable";
                if (opt.attach_state) {
                    if (term.val.indexOf(".") >= 0) {
                        var v = term.val.split(".");
                        v[0] += "(st)";
                        term.val = v.join("`");
                    } else {
                        term.val += "(st)";
                    }
                }
            } else {
                term = preProcess(term, emuchart);
            }
            tmp.push(term.val);
        });
        return tmp.join(" ");
    }


    /**
     * Prints PVS definitions for Emuchart initial transitions
     */
    EmuchartsPVSPrinter.prototype.print_initial_transition = function (emuchart) {
        if (emuchart && emuchart.initial_transitions && emuchart.initial_transitions.length > 0) {
            var ans = this.genericPrinter.get_initial_transition(emuchart);
            var data = {
                comment: ans.comment,
                name: ans.name,
                args: ans.args,
                init: ans.init,
                override: ans.override.map(function (ov) {
                    ov.cond = print_pvs_expression(ov.cond, emuchart, { attach_state: true });
                    ov.actions = ov.actions.map(function (action) {
                        return {
                            variable_name: action.variable_name,
                            variable_name_l2: action.variable_name_l2,
                            override_expression: print_pvs_expression(action.override_expression, emuchart)
                        };
                    });
                    return {
                        cond: ov.cond,
                        actions: ov.actions
                    };
                }),
                variables: ans.variables,
                DEFAULT_INIT: ans.DEFAULT_INIT,
                INIT_WITH_OVERRIDES: ans.INIT_WITH_OVERRIDES,
                INIT_MULTI: ans.INIT_MULTI
            };
            return Handlebars.compile(init_function_template, { noEscape: true })(data);
        }
        return "";
    };

    /**
     * Prints PVS definitions for Emuchart transitions given in the form transition [condition] {actions}
     */
    EmuchartsPVSPrinter.prototype.print_transitions = function (emuchart) {
        if (emuchart && emuchart.transitions && emuchart.transitions.length > 0) {
            var ans = this.genericPrinter.get_transitions(emuchart);
            var data = {
                comment: ans.comment,
                functions: ans.functions.map(function(f) {
                    f.cases = f.cases.map(function (cc) {
                        cc.cond = print_pvs_expression(cc.cond, emuchart, { attach_state: true });
                        cc.actions = cc.actions.map(function (action) {
                            action.value = print_pvs_expression(action.override_expression, emuchart, { attach_state: true });
                            return action;
                        });
                        return {
                            cond: cc.cond,
                            actions: cc.actions,
                            from: cc.from,
                            to: cc.to
                        };
                    });
                    return {
                        name: f.name,
                        cases: f.cases
                    };
                }),
                enter: predefined_functions.enter,
                leave: predefined_functions.leave,
                full_coverage: true
            };
            return Handlebars.compile(transition_functions_template, { noEscape: true })(data);
        }
        return "";
    };


    /**
     * Prints PVS definitions for Emuchart constants
     */
    EmuchartsPVSPrinter.prototype.print_constants = function (emuchart) {
        if (emuchart && emuchart.constants && emuchart.constants.length > 0) {
            var ans = this.genericPrinter.get_constants(emuchart);
            return Handlebars.compile(constants_type_template, { noEscape: true })({
                comment: ans.comment,
                constants: ans.constants
            });
        }
        return "";
    };

    EmuchartsPVSPrinter.prototype.print_descriptor = function (emuchart) {
        return Handlebars.compile(pvs_descriptor_template, { noEscape: true })({
            name: emuchart.name,
            author: emuchart.author,
            description: emuchart.description
        });
    };

    EmuchartsPVSPrinter.prototype.print_disclaimer = function () {
        return Handlebars.compile(pvs_disclaimer_template, { noEscape: true })({
            printer_version: printer_version,
            www: "http://www.pvsioweb.org"
        });
    };




    /**
     * Prints the entire PVS theory
     * When opt.interactive is true, a dialog is shown to the user to select compilation parameters.
     */
    EmuchartsPVSPrinter.prototype.print = function (emuchart, opt) {
        opt = opt || {};
        var _this = this;
        function finalize(resolve, reject) {
            var extras_theory_name = "pvsioweb_utils";
            var model = {
                descriptor: _this.print_descriptor(emuchart),
                name: emuchart.name, // Note: it is important to have the theory name identical to the file name -- otherwise PVSio refuses to evaluate commands!
                importings: emuchart.importings.concat(extras_theory_name),
                utils: _this.print_enter_leave(emuchart),
                //extras: Handlebars.compile(pvs_utils_template, { noEscape: true })(),
                constants: _this.print_constants(emuchart),
                modes: _this.print_modes(emuchart),
                datatypes: _this.print_datatypes(emuchart),
                state_variables: _this.print_variables(emuchart),
                init: _this.print_initial_transition(emuchart),
                transitions: _this.print_transitions(emuchart),
                disclaimer: _this.print_disclaimer()
            };
            var theory = Handlebars.compile(pvs_theory_template, { noEscape: true })(model);

            var model_extras = {
                name: extras_theory_name, // Note: it is important to have the theory name identical to the file name -- otherwise PVSio refuses to evaluate commands!
                extras: Handlebars.compile(pvs_utils_template, { noEscape: true })()
            };
            var extras = Handlebars.compile(pvs_theory_template, { noEscape: true })(model_extras);
            if (theory) {
                var overWrite = {overWrite: true};
                var folder = "/pvs";
                projectManager.project().addFile(folder + "/" + emuchart.name + ".pvs", theory, overWrite).then(function (res){
                    projectManager.project().addFile(folder + "/" + extras_theory_name + ".pvs", extras, overWrite).then(function (res) {
                        resolve(true);
                    }).catch(function (err) {
                        console.log(err);
                        reject(err);
                    });
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            } else {
                console.error("Warning, PVS model could not be generated.");
            }
        }
        return new Promise (function (resolve, reject) {
            if (opt.interactive) {
                return _this.genericPrinter.get_params().then(function (par) {
                    finalize(resolve, reject);
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            }
            return finalize(resolve, reject);
        });
    };

    module.exports = EmuchartsPVSPrinter;
});
