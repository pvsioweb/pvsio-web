import { PVSioWebPluginDescriptor } from "../common/interfaces/Plugins";
import { PrototypeBuilder } from './PrototypeBuilder/PrototypeBuilder';
import { Emucharts } from "./Emucharts/Emucharts";

/**
 * List of plugins to be loaded
 */
export const plugins: PVSioWebPluginDescriptor[] = [
    {
        cons: PrototypeBuilder
    },
    // {
    //     cons: Emucharts
    // }
];