/** @module EmuchartsTestGenerator */
/**
 * EmuchartsTestGenerator provides functions to generate abstract tests from Emuchart models
 * @authors: Nathan Robb
 * @date 2015/21/04 08:11:43 PM
 *
 * Presentation Interaction Models have the structure of:
 PIMs = array of PIM
 PIM = {
    states: (array of {
                name: (string) // the state name
        }),
    transitions: (array of {
                start_state: (string), // Initial state
                endState: (string),    // End state
                I_behaviour: (string)  // Action on transition (Interactive behaviour)
        }),
    name: (string),
    pm: (Presentation Model {   // Presentation model for this PIM
                name: (string),
                widgets: (array of widget {
                        name : (string),
                        category : (string),
                        S_behaviours : (array of string)
                    }),
                components: (array of {
                        name: (string),
                        widgets: (array of widget {
                                name : (string),
                                category : (string),
                                S_behaviours : (array of string)
                            }),
                        components: (empty array (of Presentation Model),
                        pmr: (array of {
                                behaviour : (string),
                                operation : (string)
                            })
                    }),
                pmr: (array of {
                        behaviour : (string),
                        operation : (string)
                    })
        }),
    start_state: (State {
                name: (string)  // Starting state of the PIM
        }),
    final_states: (array of {
                name: (string) // Ending states of the PIM
        })
}
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3 */

define(function (require, exports, module) {
    "use strict";

    var modelName;

    /**
     * Constructor
     */
    function EmuchartsTestGenerator(name) {
        this.modelName = name;
        return this;
    }

    /**
     * Returns a string of abstract tests for the emuchart
     */
    EmuchartsTestGenerator.prototype.generateTests = function (pim) {
        // add test generation
        var tests = "";
        var abstractTests = [];
        // For each widget in each component of the PIM
        pim.pm.components.forEach(function(pm) {
            pm.widgets.forEach(function(widget) {
                var tPredicates =[], tArgs = [];
                // Add widget predicates
                tPredicates.push({ name: "hasWidget", args: [widget.name] });
                tPredicates.push({ name: "Visible", args: [widget.name] });
                tPredicates.push({ name: "Active", args: [widget.name] });

                if (widget.S_behaviours.length > 0) {
                    tArgs.push(widget.name);
                    tArgs.push.apply(tArgs, widget.S_behaviours);

                    var pName = "hasBehaviour";

                    // If the category contains Responder
                    if (~widget.category.indexOf("Responder")) {
                        pName = "resBehaviour";
                    } else if (~widget.category.indexOf("Generator")) {
                        pName = "genBehaviour";
                    }
                    // Add widget behaviour predicate
                    tPredicates.push({ name: pName, args: tArgs });
                }

                abstractTests.push({
                    state_name: pm.name,
                    widget_name: widget.name,
                    predicates: tPredicates
                });
            });
        });

        // Print tests
        abstractTests.forEach(function(test) {
            var predArr = [];
            test.predicates.forEach(function (p) {
                predArr.push(p.name + "(" + p.args.join(", ") + ")");
            });
            tests += "State(" + test.state_name + ") => " + predArr.join("/\\") + "\n";
            predArr = [];
        });

        return tests;
    };

    /**
     * Returns a string of the emuchart description tests were generated for
     */
    EmuchartsTestGenerator.prototype.printDescriptor = function (pim) {
        var ans = "# ---------------------------------------------------------------\n";
        ans += "#  Tests for PIM: " + pim.name;
        ans += "\n# ---------------------------------------------------------------\n";
        return ans;
    };

    /**
     * Returns a string of the disclaimer for using this tool
     */
    EmuchartsTestGenerator.prototype.printDisclaimer = function () {
        return "\n# ---------------------------------------------------------------\n" +
            "#  Tests generated using PVSio-web Test Generator ver 0.1\n" +
            "#  Tool freely available at http://www.pvsioweb.org" +
            "\n# ---------------------------------------------------------------\n";
    };

    /**
     * Returns a string of abstract tests for the emuchart to be saved in a file
     */
    EmuchartsTestGenerator.prototype.print = function (models) {
        var _this = this;

        var ans = "";
        // Foreach pim generate tests
        models.pims.forEach(function(pim) {
            ans += _this.printDescriptor(pim) + "\n";
            ans += _this.generateTests(pim) + "\n\n";
        });
        ans += this.printDisclaimer() + "\n";
        //TODO: change name on model
        return { name: "PIM_tests", res: ans };
    };

    module.exports = EmuchartsTestGenerator;
});