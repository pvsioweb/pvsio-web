
define(function (require, exports, module) {

    var PIMProjectManager = require("plugins/pimPrototyper/PIMProjectManager"),
        ProjectManager = require("project/ProjectManager");

    return function() {
        describe("the PIM Project Manager class", function () {
            var pm;

            beforeEach(function () {
                pm = new PIMProjectManager(ProjectManager.getInstance());
            });

            describe("serialization and deserialization", function () {
                it("correct deserilizes a string created using the serialize function", function() {
                    // TODO: nwatson
                });
            });
        });
    };
});
