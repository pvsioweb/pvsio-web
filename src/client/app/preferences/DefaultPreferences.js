/**
 * Manages the default preferences used in the app. These can be overriden by explicit values set using
 * PreferenceStorage through the PreferenceDialog
  * @author Patrick Oladimeji
  * @date 25/06/2015 9:25:20 AM
  */
define(function (require, exports, module) {
    "use strict";

    var preferenceKeys = require("preferences/PreferenceKeys");
    var prefs = {}, instance;

    var paths = { Desktop: "/Users/hmtlg/Desktop", 
                  Documents: "/Users/hmtlg/Documents",
                  Pictures: "/Users/hmtlg/Pictures"
                };

    function DefaultPreferences() {
        prefs[preferenceKeys.BACKUP_INTERVAL] = 60 * 10; //in seconds
        prefs[preferenceKeys.REMEMBER_LAST_DIRECTORY] = true;
        prefs[preferenceKeys.REMEMEBER_ENABLED_PLUGINS] = true;
        prefs[preferenceKeys.LAST_DIRECTORY_VISITED] = "~";
        prefs[preferenceKeys.WALL_CLOCK_NAME] = "tick";
        prefs[preferenceKeys.WALL_CLOCK_INTERVAL] = 1; //seconds
        prefs[preferenceKeys.BOOKMARKS] = paths;
    }

    DefaultPreferences.prototype.get = function (key) {
        return prefs[key];
    };

    module.exports = {
        getInstance: function () {
            instance = instance || new DefaultPreferences();
            return instance;
        }
    };

});
