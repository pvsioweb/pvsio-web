/**
 * @author Gioacchino Mauro, Paolo Masci
 * @date June 9, 2017
 *
 * MISRA C code printer for emucharts models.
 */
define(function (require, exports, module) {
    "use strict";
    // var printer_version = "2.0";

    var GenericPrinter = require("plugins/emulink/models/EmuchartsGenericPrinter");
    var projectManager = require("project/ProjectManager").getInstance();

    var leave_enter_function_template = require("text!plugins/emulink/models/misraC/templates/misraC_leave_enter_functions.handlebars");
    var init_function_template = require("text!plugins/emulink/models/misraC/templates/misraC_init_function.handlebars");
    var enumerated_type_template = require("text!plugins/emulink/models/misraC/templates/misraC_enumerated_type.handlebars");

    var struct_type_template = require("text!plugins/emulink/models/misraC/templates/misraC_struct_type.handlebars");
    var transition_functions_template = require("text!plugins/emulink/models/misraC/templates/misraC_transition_functions.handlebars");

    var header_template = require("text!plugins/emulink/models/misraC/templates/misraC_header.handlebars");
    var body_template = require("text!plugins/emulink/models/misraC/templates/misraC_body.handlebars");

    var predefined_functions = { leave: "leave", enter: "enter" };

    var typesTable = {
        "bool"  : "UI_8",
        "short" : "I_16",
        "int"   : "I_32",
        "long"  : "I_64",
        "float" : "F_32",
        "double": "D_64",
        //--
        "real"  : "D_64",
        "nat"   : "UI_32"
    };

    /**
     * Set a number with the properly value's suffix, useful for parsing declaration's variable, with respect to MISRA 1998 rule (Rule 18, advisory)
     * Parameter is current value
     */
    function getSuffix(value, type) {
        if (type) {
            if (type === "nat") {
                return "u";
            } else if (type === "float" || type === "double" || type === "real") {
                return (value.indexOf(".") < 0) ? ".0f" : "f";
            }
        }
        return "";
    }


    function Printer(name) {
        this.modelName = name;
        this.genericPrinter = new GenericPrinter();
        this.model = { modelName: name, transitions: [] };
    }

    Printer.prototype.print_modes = function (emuchart) {
        if (emuchart && emuchart.states) {
            var ans = this.genericPrinter.get_modes(emuchart);
            return Handlebars.compile(enumerated_type_template, { noEscape: true })({
                comment: ans.comment,
                enumtype: ans.modes
            });
        }
        return "";
    };

    Printer.prototype.print_datatypes = function (emuchart) {
        if (emuchart && emuchart.datatypes && emuchart.datatypes.length > 0) {
            var ans = this.genericPrinter.get_datatypes(emuchart);
            return Handlebars.compile(enumerated_type_template, { noEscape: true })({
                comment: "user defined datatypes",
                enumtype: ans.datatypes
            });
        }
        return "";
    };

    Printer.prototype.print_variables = function (emuchart) {
        if (emuchart) {
            var ans = this.genericPrinter.get_variables(emuchart);
            if (ans && ans.variables && ans.variables[0] && ans.variables[0].variables) { //FIXME: why variables[0].variables??
                ans.variables[0].variables = ans.variables[0].variables.map(function (v) {
                    if (typesTable[v.type]) {
                        v.originalType = v.type;
                        v.type = typesTable[v.type];
                    }
                    return v;
                });
            }
            return Handlebars.compile(struct_type_template, { noEscape: true })({
                comment: "emuchart state",
                indent: "  ",
                recordtype: ans.variables
            });
        }
        return "";
    };

    Printer.prototype.print_enter_leave = function (emuchart, opt) {
        if (emuchart) {
            opt = opt || {};
            var ans = this.genericPrinter.get_enter_leave(emuchart);
            return Handlebars.compile(leave_enter_function_template, { noEscape: true })({
                entry_actions: ans.entry_actions.map(function (action) {
                    return {
                        name: action.name,
                        value: action.value//print_pvs_expression(action.value, emuchart, { attach_state: true })
                    };
                }),
                leave_actions: ans.leave_actions.map(function (action) {
                    return {
                        name: action.name,
                        value: action.value//print_pvs_expression(action.value, emuchart, { attach_state: true })
                    };
                }),
                current_mode: ans.current_mode,
                previous_mode: ans.previous_mode,
                state_type: ans.state_type,
                enter: predefined_functions.enter,
                leave: predefined_functions.leave,
                full_coverage: true,
                is_header_file: opt.is_header_file
            });
        }
        return "";
    };

    // This function "flattens" Object expressions into a string
    // and converts the name of operators in expressions -- needed for && || == != !
    function print_expression(expr, emuchart, opt) {
        function preProcess (term, emuchart) {
            function preprocessFunction(term, emuchart) {
                opt = opt || {};
                if (term.type === "function") {
                    var ans = "";
                    for (var i = 0; i < term.val.length; i++) {
                        // the first element in the array is the fuction name
                        ans += preprocessFunction(term.val[i], emuchart);
                    }
                    return ans;
                } else if (term.type === "identifier") {
                    return term.val;
                } else if (term.type === "number") {
                    return (term.val + getSuffix(term.val, opt.variable_type));
                } else if (term.type === "binop") {
                    return " " + term.val + " ";
                } else if (typeof term.val === "string") {
                    return term.val;
                }
                return term;
            }
            if (term) {
                if (term.type === "binop") {
                    if (term.val === "AND") {
                        term.val = "&&";
                    } else if (term.val === "OR") {
                        term.val = "||";
                    } else if (term.val === "=") {
                        term.val = "==";
                    }
                } else if (term.type === "unaryop") {
                    if (term.val === "NOT") {
                        term.val = "!";
                    }
                } else if (term.type === "number") {
                    term.val += getSuffix(term.val, opt.variable_type);
                } else if (term.type === "function") {
                    term.val = preprocessFunction(term, emuchart);
                }
            }
            return term;
        }
        opt = opt || {};
        var tmp = [];
        expr.forEach(function (term) {
            if (term.isVariable) {
                // term.type = "variable";
                term.val = "st->" + term.val;
            } else {
                term = preProcess(term, emuchart, opt);
            }
            tmp.push(term.val);
        });
        return tmp.join(" ");
    }

    Printer.prototype.print_initial_transition = function (emuchart, opt) {
        if (emuchart && emuchart.initial_transitions && emuchart.initial_transitions.length > 0) {
            opt = opt || {};
            var ans = this.genericPrinter.get_initial_transition(emuchart);
            ans.variables = ans.variables.map(function (v) {
                if (typesTable[v.type]) {
                    // it's a number
                    v.value += getSuffix(v.value, v.type);
                }
                return v;
            });
            var data = {
                comment: ans.comment,
                name: ans.name,
                args: ans.args,
                init: ans.init,
                override: ans.override.map(function (ov) {
                    ov.cond = print_expression(ov.cond, emuchart);
                    ov.actions = ov.actions.map(function (action) {
                        return {
                            variable_name: action.variable_name,
                            variable_name_l2: action.variable_name_l2,
                            override_expression: print_expression(action.override_expression, emuchart, { variable_type: action.variable_type })
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

    Printer.prototype.print_transitions = function (emuchart, opt) {
        if (emuchart && emuchart.transitions && emuchart.transitions.length > 0) {
            opt = opt || {};
            var ans = this.genericPrinter.get_transitions(emuchart);
            var data = {
                comment: ans.comment,
                functions: ans.functions.map(function(f) {
                    f.cases = f.cases.map(function (cc) {
                        cc.cond = print_expression(cc.cond, emuchart);
                        cc.actions = cc.actions.map(function (action) {
                            action.value = print_expression(action.override_expression, emuchart, { variable_type: action.variable_type });
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
                full_coverage: true,
                is_header_file: opt.is_header_file
            };
            return Handlebars.compile(transition_functions_template, { noEscape: true })(data);
        }
        return "";
    };

    // when opt.interactive is true, a dialog is shown to the user to select compilation parameters.
    Printer.prototype.print = function (emuchart, opt) {
        opt = opt || {};
        var _this = this;
        function finalize(resolve, reject, opt) {
            opt = opt || {};
            var extras_theory_name = "pvsioweb_utils.h";
            var model = {
                // descriptor: _this.print_descriptor(emuchart),
                // name: emuchart.name, // Note: it is important to have the theory name identical to the file name -- otherwise PVSio refuses to evaluate commands!
                importings: [ emuchart.name + ".h" ],
                importings_declarations: emuchart.importings.concat(extras_theory_name),
                utils: _this.print_enter_leave(emuchart),
                utils_declarations: _this.print_enter_leave(emuchart, { is_header_file: true }),
                // //extras: Handlebars.compile(pvs_utils_template, { noEscape: true })(),
                // constants: _this.print_constants(emuchart),
                modes: _this.print_modes(emuchart),
                datatypes: _this.print_datatypes(emuchart),
                state_variables: _this.print_variables(emuchart),
                init: _this.print_initial_transition(emuchart),
                transitions: _this.print_transitions(emuchart),
                transitions_declarations: _this.print_transitions(emuchart, { is_header_file: true })
                // disclaimer: _this.print_disclaimer()
            };
            var header = Handlebars.compile(header_template, { noEscape: true })(model);
            var body = Handlebars.compile(body_template, { noEscape: true })(model);

            var overWrite = {overWrite: true};
            var folder = "/misraC";
            projectManager.project().addFile(folder + "/" + emuchart.name + ".h", header, overWrite);
            projectManager.project().addFile(folder + "/" + emuchart.name + ".c", body, overWrite);
            resolve(true);
        }
        return new Promise (function (resolve, reject) {
            if (opt.interactive) {
                return _this.genericPrinter.get_params().then(function (par) {
                    opt.wordsize = "64";
                    finalize(resolve, reject, opt);
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            }
            return finalize(resolve, reject);
        });
    };

    module.exports = Printer;
});
