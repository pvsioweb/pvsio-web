
define(function (require, exports, module) {

    var PIMWidget = require("plugins/pimPrototyper/PIMWidget");

    return function() {
        describe("the PIM Widget class", function () {
            describe("getCoords function", function () {
                it("returns an object with the correct x, y, width and height values", function() {
                    var inputCoords = {
                        top: 50,
                        left: 60,
                        width: 70,
                        height: 80
                    };

                    var widget = new PIMWidget(1, inputCoords);
                    var coords = widget.getCoords();

                    expect(coords.x).toBe(inputCoords.left);
                    expect(coords.y).toBe(inputCoords.top);
                    expect(coords.width).toBe(inputCoords.width);
                    expect(coords.height).toBe(inputCoords.height);
                });
            });

            describe("toJSON function", function () {
                it("returns the expected object representation", function() {
                    var inputCoords = {
                        top: 50,
                        left: 60,
                        width: 70,
                        height: 80
                    };

                    var id = 1;

                    var opt = {
                        targetScreen: new Backbone.Model(),
                        name: "a widget"
                    };

                    var widget = new PIMWidget(id, inputCoords, opt);
                    var json = widget.toJSON();

                    expect(json).toEqual({
                        id: id,
                        coords: {
                            x: inputCoords.left,
                            y: inputCoords.top,
                            width: inputCoords.width,
                            height: inputCoords.height
                        },
                        targetScreen: opt.targetScreen.cid,
                        name: opt.name,
                        type: "pim-button"
                    });
                });
            });
        });
    };
});
