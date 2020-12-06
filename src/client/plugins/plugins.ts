import { PVSioWebPluginDescriptor } from "../env/PVSioWeb";
import { PrototypeBuilder } from './PrototypeBuilder/PrototypeBuilder';

export const plugins: PVSioWebPluginDescriptor[] = [
    {
        cons: PrototypeBuilder,
        autoload: true
    }
];