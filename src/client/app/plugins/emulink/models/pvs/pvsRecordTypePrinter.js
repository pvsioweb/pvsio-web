/**
 * @author Paolo Masci
 * @date 19/11/14 9:20:12 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, Backbone, Handlebars, self */
define(function (require, exports, module) {
    "use strict";
    
    var pvsRecordType, pvsRecordValue, pvsTypeDefinition;
    
    function PVSRecordPrinter() {
        /**
         * Template pvsRecordValue expects context = [ ... ]
         */
        Handlebars.registerHelper("pvsRecordType", function (context, options) {
            if (!context) { return ""; }
            
            function print_aux(key, data) {
                if (data.$type === "identifier") {
                    return {
                        init: data.$val.name + ": " + data.$val.type,
                        separator: ","
                    };
                } else {
                    // objects starting with $ are attributes characterising the parsed element (e.g., $type, $val)
                    var children = Object.keys(data).filter(function (key) {
                        return key.indexOf("$") !== 0;
                    });
                    var tmp = [];
                    children.forEach(function (key) {
                        tmp.push(print_aux(key, data[key]).init);
                    });
                    var type = tmp.join(", ");
                    return {
                        init: data.$val.name + ": " + "[# " + type + " #]",
                        separator : ","
                    };
                }
            }
            var tmp = [];
            var keys = Object.keys(context);
            keys.forEach(function (key) {
                tmp.push(print_aux(key, context[key]));
            });
            tmp[tmp.length - 1].separator = "";
            
            var ans = "";
            tmp.forEach(function (data) {
                ans += options.fn(data);
            });
            return ans;
        });
        pvsRecordType = Handlebars.compile(require("text!./templates/pvsRecordType.handlebars"));
        /**
         * Template pvsRecordValue expects context = [ ... ]
         */
        Handlebars.registerHelper("pvsRecordValue", function (context, options) {
            if (!context) { return ""; }
            function isBooleanType(name) {
                return name.toLowerCase() === "bool" || name.toLowerCase() === "boolean";
            }
            function print_aux(key, data) {
                if (data.$type === "identifier") {
                    if (!data.$val.value) {
                        console.log("Warning: initial value was not provided for variable " + data.$val.name);
                        if (isBooleanType(data.$val.type)) {
                            data.$val.value = "false";
                        } else {
                            data.$val.value = 0;
                        }
                    }
                    return {
                        assignment: data.$val.name + " := " + data.$val.value,
                        separator: ","
                    };
                } else {
                    // objects starting with $ are attributes characterising the parsed element (e.g., $type, $val)
                    var children = Object.keys(data).filter(function (key) {
                        return key.indexOf("$") !== 0;
                    });
                    var tmp = [];
                    children.forEach(function (key) {
                        tmp.push(print_aux(key, data[key]).assignment);
                    });
                    var value = tmp.join(", ");
                    return {
                        assignment: data.$val.name + " := " + "(# " + value + " #)",
                        separator : ","
                    };
                }
            }
            var tmp = [];
            var keys = Object.keys(context);
            keys.forEach(function (key) {
                tmp.push(print_aux(key, context[key]));
            });
            tmp[tmp.length - 1].separator = "";
            
            var ans = "";
            tmp.forEach(function (data) {
                ans += options.fn(data);
            });
            return ans;
        });
        pvsRecordValue = Handlebars.compile(require("text!./templates/pvsRecordValue.handlebars"));
        /**
         * Template pvsTypeDefinition expects context = { name: (string), value: (string) }
         */
        Handlebars.registerHelper("pvsTypeDefinition", function (context, options) {
            if (!context) { return ""; }
            return options.fn(context);
        });
        pvsTypeDefinition = Handlebars.compile(require("text!./templates/pvsTypeDefinition.handlebars"));
        return this;
    }
    PVSRecordPrinter.prototype.printRecordValue = function (value) {
        return pvsRecordValue({ record: value });
    };
    PVSRecordPrinter.prototype.printRecordType = function (type) {
        return pvsRecordType({ record: type });
    };
    /**
     * Translates an object state into a pvs record
     * @param state = { type: { name: (string), value: (string) } }
     */
    PVSRecordPrinter.prototype.printTypeDefinition = function (name, type) {
        var t = type;
        if (typeof type === "object") {
            t = this.printRecordType(type);
        }
        return pvsTypeDefinition({ data: { name: name, type: t }});
    };
    
    module.exports = {
        create: function () {
            return new PVSRecordPrinter();
        }
    };
});
