import * as Backbone from 'backbone';
import { Connection } from '../common/interfaces/Connection';
import { PVSioWebPlugin } from '../common/interfaces/Plugins';

// the set of plugins is declared in pluginList
import { plugins } from '../plugins/pluginList';
export interface PluginsMap { [pluginName: string]: PVSioWebPlugin };

export class PluginsManager extends Backbone.Model {
    protected connection: Connection;
    protected pluginsMap: PluginsMap = {};

    /**
     * Constructor
     */
    constructor () {
        super();
        this.importPlugins();
    }

    /**
     * Imports available plugins -- defined in imported variable pluginList
     */
    importPlugins (): boolean {
        for (let i in plugins) {
            const obj: PVSioWebPlugin = new plugins[i].cons();
            const name: string = obj.getName();
            this.pluginsMap[name] = obj;
        }
        return true;
    }

    /**
     * Activates all plugins
     */
    getPlugins (): PluginsMap {
        return this.pluginsMap;
    }

    /**
     * Activates all plugins
     */
    async activate (): Promise<PluginsMap> {
        for (let name in this.pluginsMap) {
            const success: boolean = await this.pluginsMap[name].activate({
                connection: this.connection,
                parent: "#toolkit-body",
                top: 28
            });
            const msg: string = success ? 
                `[plugin-manager] Plugin ${name} active!`
                    : `[plugin-manager] Failed to activate plugin ${name}`;
            success ? console.log(msg) : console.warn(msg);
        }
        return this.pluginsMap;
    }

}