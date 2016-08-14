
define(function (require, exports, module) {

    var Screen = require("plugins/pimPrototyper/Screen");

    return function() {
        describe("the Screen class", function () {
            var scr;

            beforeEach(function () {
                scr = new Screen();
            });

            describe("toJSON function", function () {
                it("calls toJSON on the screen's widgets", function() {
                    var widget = {
                        toJSON: function() {}
                    };

                    spyOn(widget, "toJSON");
                    scr.set("widgets", { 1: widget });
                    scr.toJSON();
                    expect(widget.toJSON).toHaveBeenCalled();
                });

                it("generates an object that contains an array for the `widgets` property", function() {
                    var widget = {
                        toJSON: function() {}
                    };

                    scr.set("widgets", { 1: widget });
                    var widgets = scr.toJSON().widgets;
                    expect(Array.isArray(widgets)).toBe(true);
                });
            });
        });
    };
});
