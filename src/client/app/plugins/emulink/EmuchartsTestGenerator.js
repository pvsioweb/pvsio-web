/** @module EmuchartsTestGenerator */
/**
 * EmuchartsTestGenerator provides functions to generate abstract tests from Emuchart models
 * @authors: Nathan Robb
 * @date 2015/21/04 08:11:43 PM
 *
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

/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3 */

define(function (require, exports, module) {
    "use strict";

    var EmuchartsParser = require("plugins/emulink/EmuchartsParser");

    var modelName;
    var parser;

    /**
     * Constructor
     */
    function EmuchartsTestGenerator(name) {
        this.modelName = name;
        this.parser = new EmuchartsParser();
        return this;
    }

    /**
     * Returns a string of an abstract test for the transition.
     *
     * For example, a presentation model called MainWidget
     * describes an ActionControl titled OtherWidget which
     * has a behaviour I_SwitchWidget (as detailed below).
     *
     * MainWidget : {OtherWidget → I_SwitchWidget}
     *
     * Then the test to check that the correct UI is present
     * in the applicable state is as follows:
     *
     * UIState(MainWidget) ⇒
     *      Widget(OtherWidget)  ∧
     *      Visible(OtherWidget) ∧
     *      Active(OtherWidget)  ∧
     *      hasBehaviour(OtherWidget, I_SwitchWidget)
     */
    function getAbstractTestForTransition(transition) {
        var presentationModel = transition.source.name;
        var actionControl = transition.target.name;
        var behaviour = transition.name;

        return "UIState(" + presentationModel + ") => " +
            "Widget(" + actionControl + ") Λ " +
            "Visible(" + actionControl + ") Λ " +
            "Active(" + actionControl + ") Λ " +
            "hasBehaviour(" + actionControl + ", I_" + behaviour  + ")";
    }

    /**
     * Returns a string of abstract tests for the emuchart
     */
    EmuchartsTestGenerator.prototype.generateTests = function (emuchart) {
        // for debug
        console.log(emuchart);

        // add test generation
        var tests = "";

        // Get the tests generated from the transition
        emuchart.transitions.forEach(function(transition) {
            tests += getAbstractTestForTransition(transition) + "\n";
        });

        return tests;
    };

    /**
     * Returns a string of the emuchart description tests were generated for
     */
    EmuchartsTestGenerator.prototype.printDescriptor = function (emuchart) {
        var ans = "# ---------------------------------------------------------------\n" +
            "#  Tests for: " + emuchart.name;
        if (emuchart.author) {
            ans += "\n#  Author: " + emuchart.author.name +
            "\n#          " + emuchart.author.affiliation +
            "\n#          " + emuchart.author.contact;
        }
        if (emuchart.description) {
            ans += "\n# ---------------------------------------------------------------" +
            "\n#  " + emuchart.description;
        }
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
    EmuchartsTestGenerator.prototype.print = function (emuchart) {
        var ans = this.printDescriptor(emuchart) + "\n";
        ans += this.generateTests(emuchart) + "\n";
        ans += "\n";
        ans += this.printDisclaimer(emuchart) + "\n";
        return { res: ans };
    };

    module.exports = EmuchartsTestGenerator;
});