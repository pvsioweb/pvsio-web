define(function (require, exports, module) {
    "use strict";
    var PVSioWebClient = require("PVSioWebClient");
        
    var instance;
        
    var PIMPrototyper = function() {
    };
    
    PIMPrototyper.prototype._init = function () {
        PVSioWebClient.getInstance().createCollapsiblePanel({headerText: "PIM Prototyper", owner: this.getName()});
    };
    
    PIMPrototyper.prototype.getName = function() {
        return "PIM Prototyper";
    };
    
    PIMPrototyper.prototype.initialise = function () {
        this._init();
        return Promise.resolve(true);
    };
    
    PIMPrototyper.prototype.getDependencies = function () {
        return [];
    };
    
    module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new PIMPrototyper();
            }
            return instance;
        }
    };
});
