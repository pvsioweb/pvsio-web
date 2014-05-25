/** @module EmuchartsEditorModes*/
/**
 * EmuchartsEditorModes defines the modes of the emuchart editor. This is code is a re-engineered version of stateMachine.js implemented in branch emulink-commented
 * @author Paolo Masci
 * @date 16/05/14 10:44:12 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _, Promise, document, FileReader*/

define(function (require, exports, module) {
	"use strict";
    
    var MODE = { BROWSE: 0, ADD_TRANSITIONS: 1, ADD_STATE: 2, RENAME: 3, ZOOM: 4 };
    
    function EmuchartsEditorModes() {}
    
    EmuchartsEditorModes.prototype.BROWSE = function () { return MODE.BROWSE; };
    EmuchartsEditorModes.prototype.ADD_TRANSITION = function () { return MODE.ADD_TRANSITION; };
    EmuchartsEditorModes.prototype.ADD_STATE = function () { return MODE.ADD_STATE; };
    EmuchartsEditorModes.prototype.RENAME = function () { return MODE.RENAME; };
    
    EmuchartsEditorModes.prototype.mode2string = function (mode) {
        if (mode === MODE.BROWSE) {
            return "browse diagram";
        } else if (mode === MODE.ADD_TRANSITION) {
            return "add transitions";
        } else if (mode === MODE.ADD_STATE) {
            return "add states";
        } else if (mode === MODE.RENAME) {
            return "rename states and transitions";
        } else { return "error: unknown mode"; }
    };
    
    EmuchartsEditorModes.prototype.modeTooltip = function (mode) {
        if (mode === MODE.BROWSE) {
            return "Click on states and transitions to select them."
                    + "\n\nDrag mouse to move whole diagram or single states."
                    + "\n\nRoll mouse wheel to zoom diagram";
        } else if (mode === MODE.ADD_TRANSITION) {
            return "Drag mouse over states to create new transitions.";
        } else if (mode === MODE.ADD_STATE) {
            return "Click on an empty area of the diagram to create a new state.";
        } else if (mode === MODE.RENAME) {
            return "Click on states and transitions to rename them.";
        } else { return "Error: unexpected editor mode -- please report a bug."; }
    };
    
    module.exports = EmuchartsEditorModes;
});