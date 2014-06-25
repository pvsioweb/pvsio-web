/**
 * Manages the list of avalaible plugins
 * @author Patrick Oladimeji
 * @date 5/3/14 15:46:27 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, brackets, window, _ */
define(function (require, exports, module) {
    "use strict";
    var enabledPlugins;//contains instances of plugins
    
    var instance;
    
    function PluginManager() {
        enabledPlugins = [];
    }
    
    PluginManager.prototype.enablePlugin = function (plugin) {
        var pm = this;
        if (enabledPlugins.indexOf(plugin) < 0) {
            enabledPlugins.push(plugin);
            //initialise the plugin after loading and initialising any dependencies
            var dependencies = plugin.getDependencies();
            if (dependencies && dependencies.length) {
                dependencies.filter(function (p) {
                    return !pm.isLoaded(p);
                }).forEach(function (p) {
                    pm.enablePlugin(p);
                });
            }
            plugin.initialise();
        }
    };
    
    PluginManager.prototype.disablePlugin = function (plugin) {
        var index = enabledPlugins.indexOf(plugin);
        if (enabledPlugins.indexOf(plugin) > -1) {
            enabledPlugins.splice(index, 1);
            //
            plugin.unload();
        }
    };
    
    PluginManager.prototype.getEnabledPlugins = function () {
        return enabledPlugins;
    };
    
    PluginManager.prototype.isLoaded = function (p) {
        return enabledPlugins.indexOf(p) > -1 ? true : false;
    };
    
    PluginManager.prototype.init = function () {
        enabledPlugins = [];
    };
    module.exports = {
        getInstance: function () {
            if (!instance) {
                instance = new PluginManager();
            }
            return instance;
        }
    };
});
