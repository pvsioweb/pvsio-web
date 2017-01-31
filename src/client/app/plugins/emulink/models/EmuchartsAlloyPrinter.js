/**
 * @author Paolo Masci & Saulo Silva
 * @date Jan 2017
 *
 * Alloy printer for emuchart models.
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
define(function (require, exports, module) {
    // handlebars templates
    var alloyTemplate = require("text!plugins/emulink/models/alloy/templates/alloy.handlebars");

    // utility functions
    var EmuchartsParser = require("plugins/emulink/EmuchartsParser");
    var _parser = new EmuchartsParser();

    // constructor
    function Printer(name) {
        this.model = { modelName: name, transitions: [], initial_transitions: [], variables: [], states: [] };
    }

    Printer.prototype.constructor = Printer;

    Printer.prototype.print_descriptor = function (emuchart) {
        this.model.descriptor =
            "-- ---------------------------------------------------------------" +
            "\n--  Model: " + emuchart.name;
        if (emuchart.author) {
            this.model.descriptor +=
                "\n--  Author: " + emuchart.author.name +
                "\n--          " + emuchart.author.affiliation +
                "\n--          " + emuchart.author.contact;
        }
        if (emuchart.description) {
            this.model.descriptor +=
                "\n-- ---------------------------------------------------------------" +
                "\n--  " + emuchart.description;
        }
        this.model.descriptor +=
            "\n-- ---------------------------------------------------------------\n";
    };

    Printer.prototype.print_disclaimer = function (emuchart) {
        this.model.disclaimer = "\n-- ---------------------------------------------------------------\n" +
                    "--  Alloy model generated using PVSio-web AlloyPrinter ver 0.1\n" +
                    "--  Tool freely available at http://www.pvsioweb.org" +
                    "\n-- ---------------------------------------------------------------\n";
    };

    Printer.prototype.print_model= function(emuchart) {
        this.model.states = emuchart.states.map(function (state) {
            return state.name;
        });
        this.model.transitions = emuchart.transitions.map(function (transition) {
            var ans = _parser.parseTransition(transition.name);
            return (ans.res) ? ans.res.val.identifier.val : ans.err;
        });
        this.model.variables = emuchart.variables.map(function (variable) {
            return { name: variable.name, type: variable.type };
        });
    };

    Printer.prototype.print = function (emuchart) {
        this.print_model(emuchart);
        this.print_descriptor(emuchart);
        this.print_disclaimer(emuchart);
        // see http://handlebarsjs.com/builtin_helpers.html for guidance on writing the handlebars template
        var model = Handlebars.compile(alloyTemplate, { noEscape: true })(this.model);
        return { res: model };
    };

    module.exports = Printer;
});
