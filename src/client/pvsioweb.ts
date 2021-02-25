import { LayoutManager } from "./env/LayoutManager";
import { PluginsManager, PluginsMap } from "./env/PluginsManager";

const layoutManager: LayoutManager = new LayoutManager({ version: "3.0", autoStart: true });
const pvsioweb: PluginsManager = new PluginsManager();
module.exports = pvsioweb;