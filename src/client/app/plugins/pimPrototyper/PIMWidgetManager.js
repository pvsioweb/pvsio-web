define(function (require, exports, module) {
    var BaseWidgetManager  = require("pvsioweb/BaseWidgetManager");

    var PIMWidgetManager = function() {
        this._widgets = {};
    };

    PIMWidgetManager.prototype = Object.create(BaseWidgetManager.prototype);

    return PIMWidgetManager;
});
