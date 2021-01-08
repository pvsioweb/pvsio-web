/**
 * Manages the available plugins
 */
import { plugins } from '../plugins/plugins';
import { PVSioWebPlugin } from './PVSioWeb';
import { Connection } from './Connection';
import * as Backbone from 'backbone';

const pluginToggle: string = `
<li class="list-group-item plugin-box" id="pluginBox_{{id}}" style="display:flex;">
<div class="toggle toggle-modern plugin-toggle" style="width:80px; height:32px;" id="pluginToggle_{{id}}"></div>
<label for="{{label}}" id="pluginLabel_{{id}}" style="margin: 6px 0 0 10px;">{{label}}</label>
</li>`;

export class PluginManager extends Backbone.Model {

    protected connection: Connection;
    protected plugins: { [name: string]: PVSioWebPlugin } = {};
    protected active: { [name: string]: boolean } = {};

    async activate (connection: Connection): Promise<boolean> {
        this.connection = connection;
        for (let i in plugins) {
            const obj: PVSioWebPlugin = new plugins[i].cons();
            this.plugins[i] = obj;
            if (plugins[i].autoload) {
                const success: boolean = await obj.activate(this.connection);
                const msg: string = success ? `[plugin-manager] Plugin ${obj.getName()} active!`
                    : `[plugin-manager] Failed to activate plugin ${obj.getName()}`;
                this.active[i] = success;
                success ? console.log(msg) : console.warn(msg);
            } else {
                this.active[i] = false;
            }
        }
        return true;
    }

    isActive (plugin: string): boolean {
        return this.active[plugin];
    }
    
    /**
     * @description Enables a plugin
     * @param {object} plugin the plugin to be enabled
     * @returns {Promise} a promise that resolves when the plugin has been enabled
     */
    // async enablePlugin (plugin: PVSioWebPlugin): Promise<boolean> {
    //     return new Promise(async (resolve, reject) => {
    //         if (this.isEnabled(plugin)) {
    //             const name: string = plugin.getName();
    //             this.enabledPlugins[name] = plugin;
    //             this.fire({ type: "PluginEnabled", plugin });
    //             // initialise the plugin after loading and initialising any dependencies
    //             const dependencies: string[] = plugin.getDependencies();
    //             if (dependencies && dependencies.length) {
    //                 for (let i = 0; i < dependencies.length; i++) {
    //                     // await this.enablePlugin(dependencies[i]);
    //                     // await dependencies[i].init();
    //                 }
    //             } else {
    //                 await plugin.activate();
    //             }
    //         } else {
    //             //plugin is already enabled
    //             resolve(true);
    //             // jumpTo(plugin.getId());
    //         }
    //     });
    // }
    /**
     * @description Disables a plugin.
     * @param {object} plugin the plugin to be disabled
     * @returns {Promise} a promise that resolves when the plugin has been disabled
     */
    // disablePlugin (plugin) {
        // return new Promise(function (resolve, reject) {
        //     var index = enabledPlugins.indexOf(plugin);
        //     if (enabledPlugins.indexOf(plugin) > -1) {
        //         enabledPlugins.splice(index, 1);
        //         instance.fire({type: "PluginDisabled", plugin: plugin});
        //         return plugin.unload().then(function (res) {
        //             resolve(res);
        //         }).catch(function (err) { reject(err); });
        //     } else {
        //         return resolve(true);
        //     }
        // });
    // }
    // loadPlugin (pluginID, thePlugin, opt) {
        // opt = opt || {};
        // let pluginView = Handlebars.compile(pluginTemplate);
        // d3.select("#" + pluginID).html(pluginView({
        //     id: pluginID,
        //     label: thePlugin.getInstance().getName()
        // }));
        // $('#pluginToggle_'+ pluginID).toggles();
        // $('.toggle-inner').css("display", "flex"); // this is needed to fix a bug in jquery-toggles, which messes up the labels of the toggle buttons when zooming in/out in the browser
        // $('#pluginToggle_'+ pluginID).on('toggle', function (e, active) {
        //     if (active) {
        //         instance.enablePlugin(thePlugin.getInstance());
        //     } else {
        //         instance.disablePlugin(thePlugin.getInstance());
        //     }
        // });
        // if (opt.autoload) {
        //     $('#pluginToggle_'+ pluginID).toggles(opt.autoload);
        // }
        // return this;
    // }
    // loadPlugins () {
        // function load_aux(plugin) {
        //     return new Promise(function (resolve, reject) {
        //         try {
        //             require(["plugins/" + plugin.main], function (thePlugin) {
        //                 let pluginID = normalize.removeSpaceDash(plugin.id);
        //                 plugins[pluginID] = thePlugin;
        //                 let msg = plugin.id + " loaded successfully!";
        //                 console.log(msg);
        //                 if (document.getElementById("loading-info")) {
        //                     document.getElementById("loading-info").innerHTML = msg;
        //                 }
        //                 instance.loadPlugin(pluginID, thePlugin, { autoload: plugin.autoload });
        //                 resolve();
        //             });
        //         } catch (pluginError) {
        //             console.log("unable to load " + plugin.main + " :((");
        //         }
        //     });
        // }
        // function prepareHTML (pluginList) {
        //     pluginList.forEach(function (plugin) {
        //         d3.select("#plugins-group").append("div").attr("id", normalize.removeSpaceDash(plugin.id));
        //     });
        // }
        // return new Promise(function (resolve, reject) {
        //     try {
        //         console.log("loading plugins...");
        //         var promises = [];
        //         require(["text!" + pluginListFile], function (jsonFile) {
        //             console.log(jsonFile);
        //             let pluginList = JSON.parse(jsonFile);
        //             prepareHTML(pluginList); // this is necessary to ensure the toolks are always displayed in the same order
        //             pluginList.forEach(function (plugin) {
        //                 promises.push(
        //                     load_aux(plugin)
        //                 );
        //             });
        //             Promise.all(promises).then(function (res) {
        //                 resolve(res);
        //             }).catch(function (err) {
        //                 reject(err);
        //             });
        //         });
        //     } catch (load_error) {
        //         console.error(load_error);
        //         return Promise.reject();
        //     }
        // });
    // }
    // getEnabledPlugins () {
    //     return this.plugins;
    // }
    // isLoaded (p) {
    //     return enabledPlugins.indexOf(p) > -1 ? true : false;
    // }
}
