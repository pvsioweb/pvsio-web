
define(function (require, exports, module) {

    var Screen = require("plugins/pimPrototyper/Screen"),
        PIMWidget = require("plugins/pimPrototyper/PIMWidget");

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

            describe("initFromJSON function", function () {
                it("correctly deserilizes a json representation of a screen", function() {
                    var json = {
                        "id":1,
                        "name":"test",
                        "isInitial":true,
                        "widgets":[{
                            "id":"1",
                            "type":"pim-button",
                            "name":"up",
                            "targetScreen":"c14",
                            "coords":{"x":1,"y":96,"width":39,"height":38}
                        }],
                        "image":"pic.jpg"
                    };

                    var deserializedScreen = Screen.initFromJSON(json, "");
                    expect(deserializedScreen.id).toBe(json.id);
                    expect(deserializedScreen.get("name")).toBe(json.name);
                    expect(deserializedScreen.get("isInitial")).toBe(json.isInitial);
                    expect(deserializedScreen.get("image").name).toBe(json.image);
                });
            });
        });
    };
});
