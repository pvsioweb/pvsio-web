/**
 * @author Paolo Masci
 * @date 04 October 2016
 *
 * consistency template:
 *      consistent: THEOREM
 *        FORALL (pre, post: State):
 *           (state_transitions(pre,post) AND guardem(pre))
 *             IMPLIES (filterem(pre) = filterem(post))
 *
 */
define(function (require, exports, module) {
    var propertyTemplate = require("text!plugins/propertytemplates/consistency/consistency.handlebars");

    function Printer() {
        this.property = {};
        return this;
    }

    Printer.prototype.constructor = Printer;

    Printer.prototype.print = function (data) {
        var property = Handlebars.compile(propertyTemplate)(this.property);
        return { property: property };
    };

    module.exports = Printer;
});
