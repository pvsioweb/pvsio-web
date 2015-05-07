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
    EmuchartsTestGenerator.prototype.generateTests = function (pm) {
        /**
         * Generate tests for the presentation model
         * (If the pm is a PIM then generates tests for all its
         * component models, else if PM then generates tests for its
         * widgets)
         * @param pm The presentation model to get component model
         * tests for
         * @returns {Array} Array of AbstractTests {
         *          state_name: (string),
         *          widget_name: (string),
         *          predicates: (array of {
         *                  name: (string),
         *                  args: (array of string)
         *              })
         *      }
         */
        function genTests(pm) {
            var componentTests = [];
            // If a PIM PM is passed in 1st this will be skipped
            pm.widgets.forEach(function(widget) {
                var tPredicates =[], tArgs = [];
                // Add widget predicates
                tPredicates.push({ name: "hasWidget", args: [widget.name] });
                tPredicates.push({ name: "Visible", args: [widget.name] });
                tPredicates.push({ name: "Active", args: [widget.name] });

                if (widget.S_behaviours.length > 0) {
                    // The behaviour is on this widget
                    tArgs.push(widget.name);
                    // The behaviours this widget has (add all)
                    tArgs.push.apply(tArgs, widget.S_behaviours);

                    var pName = "hasBehaviour";

                    // If the category contains Responder or Generator
                    if (~widget.category.indexOf("Responder")) {
                        pName = "resBehaviour";
                    } else if (~widget.category.indexOf("Generator")) {
                        pName = "genBehaviour";
                    }
                    // Add widget behaviour predicate
                    tPredicates.push({ name: pName, args: tArgs });
                }

                componentTests.push({
                    state_name: pm.name,
                    widget_name: widget.name,
                    predicates: tPredicates
                });
            });

            pm.components.forEach(function(component) {
                componentTests.push.apply(componentTests, genTests(component));
            });

            return componentTests;
        }

        /**
         * Generage the tests for the states within a PM / PIM
         * @param pm PM to get state tests for
         * @returns {Array} Array of state tests for the PM / PIM
         */
        function stateTests(pm) {
            /**
             * Get the tests for a PM
             * @param pm
             * @returns AbstractTest {
             *          state_name: (string),
             *          widget_name: (string),
             *          predicates: (array of {
             *                  name: (string),
             *                  args: (array of string)
             *              }) or null
             *      }
             */
            function addState(pm) {
                if (pm.widgets.length === 0) {
                    return null;
                }

                var tPredicates =[];
                // Add widgets predicates
                pm.widgets.forEach(function(widget) {
                    tPredicates.push({ name: "hasWidget", args: [widget.name] });
                    tPredicates.push({ name: "Visible", args: [widget.name] });
                    tPredicates.push({ name: "Active", args: [widget.name] });
                    tPredicates.push({ name: "" });
                });

                return {
                    state_name: pm.name,
                    widget_name: pm.widgets[0].name,
                    predicates: tPredicates
                };
            }

            var tests = [];
            if (pm.components === 0) {
                tests.push(addState(pm));
            } else {
                pm.components.forEach(function (comp) {
                    tests.push(stateTests(comp));
                });
            }

            return tests;
        }

        function printStateTests(tests) {
            var testStr = "";
            tests.forEach(function(test) {
                if (test === null) {
                    return;
                }
                testStr += "State(" + test.state_name + ") => ";
                // testString += "\n\t";
                test.predicates.forEach(function (p) {
                    // Split condition
                    if (p.name === "") {
                        // Replace with "" if want all on the same line
                        testStr += "\n\t";
                    } else {
                        testStr += p.name + "(" + p.args.join(", ") + ")/\\";
                    }
                });
                // slice to remove last '/\\n\t'
                testStr = testStr.slice(0, -4);
                testStr += "\n";
            });

            return testStr;
        }

        // add test generation
        var tests = "";

        // Get tests for the PIM / PM
        var _tests = genTests(pm.pm || pm);
        // Print state tests
        tests += printStateTests(stateTests(pm.pm || pm));
    //    tests += printIBehaviourTests(IBehaviourTests(_tests));
    //    tests += printSBehaviourGenTests(SBehaviourGenTests(_tests));
    //    tests += printSBehaviourResTests(SBehaviourResTests(_tests));
    //    tests += printNoBehaviourTests(noBehaviourTests(_tests));

        return tests;
    };

    /**
     * Returns a string of the emuchart description tests were generated for
     */
    EmuchartsTestGenerator.prototype.printDescriptor = function (name, pm) {
        var ans = "# ---------------------------------------------------------------\n";
        ans += "#  Tests for "+ name +": " + pm.name;
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

        var ans = "Tests for Presentation Interaction Models:\n";
        // Foreach pim generate tests
        models.pims.forEach(function(pim) {
            ans += _this.printDescriptor("PIM", pim) + "\n";
            ans += _this.generateTests(pim) + "\n";
        });

        ans += "\nTests for Presentation Models:\n"

        models.pms.forEach(function(pm) {
            // Only test the PMs
            if (pm.components.length !== 0) {
                return;
            }
            ans += _this.printDescriptor("PM", pm) + "\n";
            ans += _this.generateTests(pm) + "\n";
        });

        ans += this.printDisclaimer() + "\n";
        //TODO: change name on model
        return { name: "PIM_tests", res: ans };
    };

    module.exports = EmuchartsTestGenerator;
});