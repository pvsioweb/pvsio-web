/**
 * Interactive prototype builder for PVSio based on the html map attribute
 */
// import { PVSioWebClient } from './env/PVSioWebClient';
// const client: PVSioWebClient = new PVSioWebClient({ autostart: true });

import { LayoutManager } from "./env/LayoutManager";
import { PluginsManager } from "./env/PluginsManager";
const version: string = "3.0";

const layoutManager: LayoutManager = new LayoutManager();
layoutManager.activate({ version });

const pluginsManager: PluginsManager = new PluginsManager();
//@ts-ignore
pluginsManager.activate({ global: pvsioweb });