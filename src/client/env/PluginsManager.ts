import * as Backbone from 'backbone';
import { Connection } from './Connection';
import { PVSioWebPlugin } from './PVSioWeb';

// the set of plugins is declared in pluginList
import { plugins } from '../plugins/pluginList';
export interface PluginsMap { [pluginName: string]: PVSioWebPlugin };

export class PluginsManager extends Backbone.Model {
    protected connection: Connection;

    protected pluginsObj: PluginsMap = {};

    /**
     * Activates all plugins
     */
    async activate (opt?: { global?: PluginsMap }): Promise<boolean> {
        opt = opt || {};
        for (let i in plugins) {
            const obj: PVSioWebPlugin = new plugins[i].cons();
            const name: string = obj.getName();
            this.pluginsObj[name] = obj;
            if (opt?.global) {
                opt.global[name] = obj;
            }
            if (plugins[i].autoload) {
                const success: boolean = await obj.activate({ connection: this.connection, parent: "toolkit-body", top: 28 });
                const msg: string = success ? `[plugin-manager] Plugin ${name} active!`
                    : `[plugin-manager] Failed to activate plugin ${name}`;
                success ? console.log(msg) : console.warn(msg);
            }
        }
        return true;
    }

    isActive (pluginName: string): boolean {
        if (pluginName) {
            return this.pluginsObj[pluginName]?.isActive();
        }
        return false;
    }


}