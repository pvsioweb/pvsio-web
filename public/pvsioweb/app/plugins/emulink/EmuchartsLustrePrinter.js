/** @module EmuchartsLustrerinter */
/**
 * EmuchartsPVSPrinter provides functions to generate a lustre spec for emucharts
 * The printer knows only the theory name, all expressions within the theory are provided as function arguments
 * @author Paolo Masci
 * @date 27/05/14 9:38:13 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3 */
define(function (require, exports, module) {
	"use strict";
    
    var lustre_node;
    
    /**
	 * Constructor
	 */
    function EmuchartsLustrePrinter(name) {
        lustre_node = name;
        return this;
    }
    
    EmuchartsLustrePrinter.prototype.print_inputs = function (emuchart) {
        var ans = "(...)\n";
        return ans;
    };
    EmuchartsLustrePrinter.prototype.print_outputs = function (emuchart) {
        var ans = "returns (...);\n";
        return ans;
    };
    EmuchartsLustrePrinter.prototype.print_variables = function (emuchart) {
        // local variables
        var ans = "var ...;\n";
        return ans;
    };
    EmuchartsLustrePrinter.prototype.print_transitions = function (emuchart) {
        // transitions
        if (emuchart && emuchart.transitions && emuchart.transitions.length > 0) {
            var transition = emuchart.transitions[0].name;
            var openCur = transition.indexOf("{");
            var closeCur = transition.lastIndexOf("}");
            var ans = transition.substring(openCur + 1, closeCur).replace(/\:\=/g, "=").replace(/\;/g, ";\n");
            return ans;
        }
    };
    /**
     * Prints the entire PVS theory
     */
    EmuchartsLustrePrinter.prototype.print = function (emuchart) {
        var ans = "node " + emuchart.name;
        ans += this.print_inputs(emuchart);
        ans += this.print_outputs(emuchart);
        ans += this.print_variables(emuchart);
        ans += "let\n";
        ans += this.print_transitions(emuchart);
        ans += "tel\n";
        return ans;
    };
    
    module.exports = EmuchartsLustrePrinter;
});