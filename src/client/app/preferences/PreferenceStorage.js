/**
 *  *Manages the persistence of the preference items.
    * @author Patrick Oladimeji
    * @date 25/06/2015 9:27:14 AM
    */
define(function (require, exports, module) {
    "use strict";
    var DefaultPreferences = require("preferences/DefaultPreferences").getInstance();

    var instance;
    function PreferenceStorage() {

    }

    PreferenceStorage.prototype.get  = function (key) {
        var res = localStorage.getItem(key);
        if (res !== undefined && res !== null) {
            res = JSON.parse(res);
        } else {
            res = DefaultPreferences.get(key);
        }

        return res;
    };

    PreferenceStorage.prototype.set = function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    };

    module.exports = {
        getInstance: function () {
            instance = instance || new PreferenceStorage();
            return instance;
        }
    };
});
