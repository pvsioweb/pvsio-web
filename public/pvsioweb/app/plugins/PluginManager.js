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
    
    var instance, pvsioWebClient;
    
    function PluginManager(client) {
        pvsioWebClient = client;
        enabledPlugins = [];
    }
  
    PluginManager.prototype.enablePlugin = function (plugin, client) {
        var pm = this;
        if (enabledPlugins.indexOf(plugin) < 0) {
            enabledPlugins.push(plugin);
            //initialise the plugin after loading and initialising any dependencies
            var dependencies = plugin.getDependencies();
            if (dependencies && dependencies.length) {
                dependencies.filter(function (type) {
                    return !pm.isLoaded(type);
                }).forEach(function (PluginDependency) {
                    var instance = new PluginDependency(client);
                    pm.enablePlugin(instance, client);
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
    
    PluginManager.prototype.getPlugin = function (type) {
        return _.find(enabledPlugins, function (p) {
            return p instanceof type;
        });
    };
    
    PluginManager.prototype.isLoaded = function (type) {
        return this.getPlugin(type) ? true : false;
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
