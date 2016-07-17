
define(function (require, exports, module) {

    var PIMPrototyper = require("plugins/pimPrototyper/PIMPrototyper"),
    Descriptor = require("project/Descriptor");

    return function() {
        describe("the PIM Prototyper class", function () {
            var prototyper = PIMPrototyper.getInstance();

            beforeEach(function () {
                prototyper._init(document.createElement("div"));
            });

            describe("changeImage function", function () {
                it("creates a new screen (and selects it) if none are selected", function() {
                    spyOn(prototyper._screens, "setSelected");
                    var image = new Descriptor("", "", "");
                    prototyper.changeImage(image);
                    expect(prototyper._screens.setSelected).toHaveBeenCalled();
                    expect(prototyper._screens.length).toBe(1);
                });

                it("sets the image on the selected screen", function() {
                    prototyper._screens.add({});
                    var scrn = prototyper._screens.first();
                    prototyper._screens.setSelected(scrn);
                    spyOn(scrn, "set");

                    var image = new Descriptor("", "", "");
                    prototyper.changeImage(image);
                    expect(scrn.set).toHaveBeenCalledWith("image", image);
                });
            });
        });
    };
});
