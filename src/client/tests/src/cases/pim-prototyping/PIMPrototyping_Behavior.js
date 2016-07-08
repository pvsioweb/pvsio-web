/*jshint unused: false*/
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50*/
/*global d3, $, it, expect, define, describe, beforeEach, afterAll, beforeAll, spyOn, Promise, Event, fail*/

/**
 * Behaviour tests for the PIM prototyping mode (and related features)
 * @author Nathaniel Watson <nathaniel@nwatson.nz>
 */
define(function (require, exports, module) {
    "use strict";

    return function () {
        // https://github.com/nathanielw/pvsio-web/issues/2
        describe("Switching to PIM prototyping mode", function() {
            it("provides a button to switch to the mode", function() {
                /*
                 Given the UI is loaded
                Then a tab for activating the mode exists
                 */
                
                var button = d3.select(".plugin-box input[name='PIM Prototyper']");
                expect(button.empty()).toBe(false);
            });

            it("switches to PIM mode correctly", function() {
                /*
                Given the prototyping module is visible
                When the PIM Builder tab is clicked
                Then the PIM prototyping interface is shown
                And the EmuCharts editor is switched to PIM mode
                 */
                fail();
            });

            it("does not wipe existing charts without confirmation", function() {
                /*
                Given the prototyping module is visible
                And a chart is already loaded in the EmuCharts editor
                When the PIM Builder tab is clicked for the first time
                Then the user is informed that the existing chart will be lost.
                 */
                fail();
            });
        });

        // https://github.com/nathanielw/pvsio-web/issues/3
        describe("Switching screens in the PIM prototyping mode", function() {
            it("provides a dropdown that lists the screens", function() {
                /*
                Given At least two images have been loaded into the builder
                Then a dropdown menu exists that lists these images
                 */
                fail();
            });

            it("switches screens when a screen is selected from the dropdown", function() {
                /*
                Given at least two images have been loaded into the builder
                When an item is selected from the dropdown
                Then the screen being edited is swapped for the one that was selected from the dropdown
                And the state that the previous screen was in is not lost
                 */
                fail();
            });
        });

        // https://github.com/nathanielw/pvsio-web/issues/4
        describe("Adding and removing screens from the PIM prototype", function() {
            it("allows a screen to be added via a button and a dialog", function() {
                /*
                Given the PIM Builder mode is active
                When the "add screen" button is clicked
                Then a dialog is shown for adding a new screen
                And the dialog allows an image file to be selected
                And the dialog allows a screen name to be set
                 */
                fail();
            });

            it("shows a confirmation before a screen is deleted", function() {
                /*
                Given at least one image has been loaded into the builder
                Then a button exists for deleting the current screen.
                When the button is clicked
                Then a dialog is shown to confirm the screen deletion
                And choosing to delete the screen removes its data and any display of it within the prototype
                And the editor switches to a different screen
                 */
                fail();
            });
        });

        // https://github.com/nathanielw/pvsio-web/issues/5
        describe("Editing screens in the PIM prototype", function() {
            it("allows an existing screen to be edited via a dialog", function() {
                /*
                Given a screen is being edited within the PIM builder
                When the screen settings button is clicked
                Then a dialog opens
                And the dialog provides input for changing the screen name
                And the dialog provides input for changing the screen image
                 */
                fail();
            });
        });

        // https://github.com/nathanielw/pvsio-web/issues/6
        describe("Setting the start screen in the PIM prototype", function() {
            it("provides a button for marking the start screen", function() {
                /*
                Given a screen is active/being edited in the PIM builder
                Then there is a button for the current screen for marking it as the start screen.
                 */
                fail();
            });

            it("alters the screens so that the correct one (and only one) is marked as the start screen", function() {
                /*
                Given a screen is active/being edited in the PIM builder
                When the button for marking the current screen as the start screen is clicked
                Then the current screen is marked as the start screen
                And none of the other screens are the start screen
                 */
                fail();
            });
        });

        // https://github.com/nathanielw/pvsio-web/issues/7
        describe("The link between the prototype and the FSM chart", function() {
            it("adds states to the chart for each new screen", function() {
                /*
                Given the prototyping module is visible
                When a new screen is added to the prototype
                Then a new state is added in the chart editor
                And the new state has the same name as the new screen
                 */
                fail();
            });

            it("updates states in the chart when a screen is edited", function() {
                /*
                Given the prototyping module is visible
                When the screen is renamed
                Then the corresponding state in the chart editor should also have the new name
                 */
                fail();
            });

            it("removes the correct state from the chart when a screen is deleted", function() {
                /*
                Given the prototyping module is visible
                When a screen is deleted from the prototype
                Then the corresponding state in the chart editor should also be removed
                */
                fail();
            });

            it("adds transitions to the chart for each link in the prototype", function() {
                /*
                Given the prototyping module is visible
                And at least one hotspot exists on the current screen
                When a hotspot is linked to a screen
                Then a new transition is added in the chart editor
                And the new transition is labelled with the same name as the behaviour generated by the PIM builder for the link
                */
                fail();
            });

            it("removes the correct transition from the chart when a link is removed", function() {
                /*
                Given the prototyping module is visible
                And it has a link from a hotspot to a screen
                When the link between screens is removed from the prototype
                Then the corresponding transition in the chart editor should also be removed
                */
                fail();
            });
        });

        // https://github.com/nathanielw/pvsio-web/issues/8
        describe("Adding hotspots to the PIM prototype", function() {
            it("is possible to add hotspots by dragging over the image", function() {
                /*
                Given a screen is active/being edited in the PIM builder
                When the screen image is dragged over
                Then a hotspot is added and drawn as rectangle where the user dragged
                And a dialog is shown for configuring the hotspot
                */
                fail();
            });
        });

        // https://github.com/nathanielw/pvsio-web/issues/9
        describe("Editing hotspots in the PIM prototype", function() {
            it("shows an edit dialog when a hotspot is clicked", function() {
                /*
                Given a hotspot exists within the current screen
                When the hotspot is double-clicked
                Then a dialog is shown for editing the hotspot
                And the dialog allows naming the hotspot
                And the dialog allows setting the type of hotspot (responder, selection, etc.)
                */
                fail();
            });

            it("allows hotspots to be moved by dragging", function() {
                /*
                Given a hotspot exists within the current screen
                When the hotspot is dragged
                Then the hotspot is moved to the cursor location
                */
                fail();
            });

            it("allows hotspots to be selected and then deleted", function() {
                /*
                Given a hotspot exists within the current screen
                When the hotspot is clicked
                Then it is drawn as selected
                When the delete key is pressed
                Then the hotspot is deleted
                */
                fail();
            });

            // https://github.com/nathanielw/pvsio-web/issues/10
            describe("Setting a hotspot's behaviour", function() {
                it("provides a dropdown that lists possible behaviours", function() {
                    /*
                    Given a hotspot is being edited
                    And the hotspot type is an input
                    Then a dropdown exists listing the screens and behaviours it can trigger
                    */
                    fail();
                });

                it("can set a hotspot to link to a screen", function() {
                    /*
                    Given a hotspot is being edited
                    And the hotspot type is an input
                    When a screen is selected from the dropdown
                    And the hotspot settings are saved
                    Then the hotspot's action is set to the screen that was selected
                    */
                    fail();
                });

                it("can set a hotspot to trigger behaviours", function() {
                    /*
                    Given a hotspot is being edited
                    And the hotspot type is an input
                    And the hotspot action is to trigger a behaviour
                    Then an input box exists for specify the behaviours
                    When behaviours are entered into the input box
                    And the hotspot settings are saved
                    Then the hotspot's action is set to the behaviour(s) that were selected
                    */
                    fail();
                });
            });

            // https://github.com/nathanielw/pvsio-web/issues/11
            describe("Viewing a PIM prototype in the simulator", function() {
                it("is possible to switch between the type of prototype being simulated", function() {
                    /*
                    Given the prototyping module is visible
                    And the Simulator View tab is selected
                    Then an input should exist that allows selecting the active prototyping mode (PIM or classic)
                    When the input is interacted with to change the mode
                    Then the prototype displayed in the simulator should change to the selected option
                    */
                    fail();
                });

                it("links hotspots between screens", function() {
                    /*
                    Given the PIM Simulator is the active mode
                    And a PIM exists with hotspots linking multiple screens
                    Then the same hotspots should be present in the simulator view
                    When a hotspot is clicked
                    Then the simulator switches to showing the linked screen's image
                    And the hotspots from the previous screen are removed/hidden
                    And the hotspots from the linked screen are shown
                    */
                    fail();
                });

                it("highlights widgets that are triggered by the activated S_behaviour", function() {
                    /*
                    Given the PIM Simulator is the active mode
                    And a PIM screen exists with hotspots that have S_behaviours
                    And the screen has output hotspots that respond to those behaviours
                    When an input hotspot that has some S_behaviour is clicked
                    Then the output hotspots that respond to that behaviour are highlighted
                    */
                    fail();
                });
            });
        });
    };
});
