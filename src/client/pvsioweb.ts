import { LayoutManager } from "./env/LayoutManager";
import { PluginsManager } from "./env/PluginsManager";

const layoutManager: LayoutManager = new LayoutManager({ version: "3.0", autoStart: true, parent: "#pvsio-web" });
const pvsioweb: PluginsManager = new PluginsManager();
module.exports = pvsioweb;