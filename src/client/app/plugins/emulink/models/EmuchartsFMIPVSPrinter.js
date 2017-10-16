/** @module EmuchartsFMIPVSPrinter */
/**
 * EmuchartsFMIPVSPrinter provides functions to generate Alloy models from Emucharts
 * @author Paolo Masci
 * @version 3.0
 * @date June 2, 2017
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
define(function (require, exports, module) {
    "use strict";
    // var printer_version = "1.0";
    var GenericPrinter = require("plugins/emulink/models/EmuchartsGenericPrinter");
    var projectManager = require("project/ProjectManager").getInstance();
    var scheleton_cpp_template = require("text!plugins/emulink/models/fmi-pvs/templates/scheleton_cpp.handlebars");

    /**
     * Constructor
     */
    function EmuchartsFMIPVSPrinter(name) {
        this.module_name = name;
        this.genericPrinter = new GenericPrinter();
        return this;
    }

    /**
     * Prints the FMU package
     * When opt.interactive is true, a dialog is shown to the user to enter/select parameters.
     */
    EmuchartsFMIPVSPrinter.prototype.print = function (emuchart, opt) {
        opt = opt || {};
        opt.interactive = false;
        var _this = this;
        function finalize(resolve, reject, par) {
            var model = _this.genericPrinter.print(emuchart);
            var scheleton_cpp = (model && model.init) ?
                        Handlebars.compile(scheleton_cpp_template, { noEscape: true })({
                            variables: model.init.variables
                        }) : "";
            // var fmu_module = Handlebars.compile(alloy_module_template, { noEscape: true })({
            //     name: emuchart.name,
            //     modes: modes_declaration,
            //     init: init_function,
            //     variables: variables_declaration,
            //     triggers: triggers,
            //     disclaimer: disclaimer
            // });

            //-- write data to disk
            var overWrite = {overWrite: true};
            var folder = "fmu-pvs/";
            projectManager.project().addFile(folder + "scheleton.cpp", scheleton_cpp, overWrite);
            resolve(true);
        }
        return new Promise (function (resolve, reject) {
            if (opt.interactive) {
                return _this.genericPrinter.get_params().then(function (par) {
                    finalize(resolve, reject, par);
                }).catch(function (err) {
                    console.log(err);
                    reject(err);
                });
            }
            return finalize(resolve, reject);
        });
    };

    module.exports = EmuchartsFMIPVSPrinter;
});
