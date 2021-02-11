/**
 * Interactive prototype builder for PVSio based on the html map attribute
 */
import './css/pvsio-web.css';
import './css/style.css';
import { PrototypeBuilder } from './plugins/PrototypeBuilder/PrototypeBuilder';

//@ts-ignore
if (pvsioweb) {
    const builder: PrototypeBuilder = new PrototypeBuilder();
    const name: string = builder.getName();
    //@ts-ignore
    pvsioweb[name] = new PrototypeBuilder();
}
//@ts-ignore
const builder: PVSioWebPlugin = pvsioweb?.builder || new PrototypeBuilder();
builder.activate({ parent: "pvsioweb"});