/**
 * JavaScript printer for emucharts model.
 * variables are mapped to js variables
 * constants are also mapped to js variables
 *
 * transitions are mapped to Javascript functions
 * transitions affect variables and may change the state of the system.
 * transitions may have a condition attached to them
 * transitions may have a source and target state
 *
 * To get the details of the transition use EmuchartsParser.parseTransition
 */
define(function (require, exports, module) {

    var EmuchartsParser = require("plugins/emulink/EmuchartsParser");
    var functionTemplate = require("text!plugins/emulink/models/javascript/templates/function.handlebars"),
        variablesTemplate = require("text!plugins/emulink/models/javascript/templates/variables.handlebars");
    var parser;
    var operatorOverrides = {
        ":=": "=",
        "AND": "&&",
        "OR": "||",
        "and": "&&",
        "or": "||"
    };
    var complexActions = ["expression", "assignment", "function"];

    function Printer(name) {
        parser = new EmuchartsParser();
    }

    Printer.prototype.print_descriptor = function (emuchart) {
        return "//JS code generated from Emuchart";
    };

    Printer.prototype.print_disclaimer = function (emuchart) {
        return "//--MIT Licenced";
    };

    Printer.prototype.print_types =  function (emuchart) {
        return "";
    };

    Printer.prototype.print_transitions = function (emuchart) {

        function getExpression(expression) {
            if (expression === undefined || expression === null) {
                return "";
            }
            if (expression.type === "assignment") {
                var args = [
                    expression.val.identifier.val,
                    getExpression(expression.val.binop),
                    getExpression(expression.val.expression)];
                return args.join(" ");
            } else {
                if (Array.isArray(expression.val)) {
                    var res = expression.val.map(function (token) {
                        if (complexActions.indexOf(token.val) > -1) {
                            return getExpression(token.val);
                        } else {
                            return operatorOverrides[token.val] || token.val;
                        }
                    });

                    return res.join(" ");
                } else {
                    if (complexActions.indexOf(expression.val) > -1) {
                        return getExpression(expression.val);
                    } else {
                        return operatorOverrides[expression.val] || expression.val;
                    }
                }
            }
        }

        //generate the javascript function
        var transitions = [], sourceData = {};
        emuchart.transitions.forEach(function (t) {
            var name = t.name;

            var functionBody = parser.parseTransition(name);
            var id, condition, actions;
            if (functionBody.res) {
                functionBody = functionBody.res.val;
                id = functionBody.identifier;
                condition = functionBody.cond;
                actions = functionBody.actions;
                if (condition) {
                    condition = condition.val.map(function (token) {
                        return getExpression(token);
                    }).join(" ");
                }

                if (actions) {
                    actions = actions.val.map(function (a) {
                        return getExpression(a);
                    });
                }
                transitions.push({id: id.val, actions: actions, condition: condition});
            }
        });
        sourceData = {transitions: transitions};
        return  Handlebars.compile(functionTemplate)(sourceData);
    };

    Printer.prototype.print_constants = function (emuchart) {
        var vars = emuchart.constants;
        var str = Handlebars.compile(variablesTemplate)(vars);
        return str;
    };

    Printer.prototype.print_variables = function (emuchart) {
        var vars = emuchart.variables;
        var extraVars = {}, declarations = [];
        //check if variable names contain dots and create additional object variables as needed
        vars.forEach(function (v) {
            if (v.name.indexOf(".") > -1) {
                var heirarchy = v.name.split(".");
                heirarchy.forEach(function (prop, i) {
                    if (i === 0) {
                        //we create an explicit variable for the first property
                        //all others are properties within this property
                        if (!extraVars[prop]) {
                            extraVars[prop] = "{}";
                        }
                    } else {
                        var decl = heirarchy.slice(0, i + 1).join(".") + "= {}";
                        declarations.push(decl);
                    }
                });
            }
        });

        var str = Object.keys(extraVars).map(function (name) {
            var v = extraVars[name];
            return "var " + name + " = " + v + ";";
        }).join("\n");
        str = str.concat("\n").concat(Handlebars.compile(variablesTemplate)(vars));
        return str;
    };

    Printer.prototype.print_initial_transition = function (emuchart) {
        return "//initial transition";
    };

    Printer.prototype.print_states = function (emuchart) {
        var states = emuchart.states;

        return "var machineStates = [" + states.map(function (s) {
            return "'" + s.name + "'";
        }).join(",") + "]";
    };

    Printer.prototype.print = function (emuchart) {
        var parts = [this.print_descriptor,
                     this.print_constants,
                     this.print_variables,
                     this.print_types,
                     this.print_states,
                     this.print_initial_transition,
                     this.print_transitions,
                     this.print_disclaimer];

        var str = parts.map(function (f) {
            return f(emuchart);
        }).join("\n");
        return {res: str};
    };

    module.exports = Printer;
});
