import { PVSioWebPluginDescriptor } from "../common/interfaces/Plugins";
import { PrototypeBuilder } from './PrototypeBuilder/PrototypeBuilder';

/**
 * List of plugins to be loaded
 */
export const plugins: PVSioWebPluginDescriptor[] = [
    {
        cons: PrototypeBuilder
    }
];