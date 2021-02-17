import { PVSioWebPluginDescriptor } from "../env/PVSioWeb";
import { PrototypeBuilder } from './PrototypeBuilder/PrototypeBuilder';

/**
 * List of plugins to be loaded
 */
export const plugins: PVSioWebPluginDescriptor[] = [
    {
        cons: PrototypeBuilder,
        autoload: true
    }
];