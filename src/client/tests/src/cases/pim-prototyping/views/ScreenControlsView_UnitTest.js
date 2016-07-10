
define(function (require, exports, module) {
    
    var ScreenControlsView = require("plugins/pimPrototyper/forms/pimScreenControlsView");
    
    return function() {
        describe("the screen controls views", function() {
            
            var view = new ScreenControlsView();

            it("renders a dropdown list", function() {
                var viewEl = view.render().$el;
                var dropdown = viewEl.find(".dropdown");
                expect(dropdown.length).toBeGreaterThan(0);
            });
            
            it("renders a settings button", function() {
                var viewEl = view.render().$el;
                var button = viewEl.find(".btn");
                expect(button.length).toBeGreaterThan(0);
            });
            
            it("Lists all the screens in the model", function() {
            });
        });
    };
});
