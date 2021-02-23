/**
 * Interactive prototype builder for PVSio based on the html map attribute
 */
import { PrototypeBuilder } from './plugins/PrototypeBuilder/PrototypeBuilder';
import { basicSettings, SettingsElem } from './plugins/PrototypeBuilder/views/SettingsView';
import { PrototypeData } from './utils/pvsiowebUtils';

// augment the basic settings with a new field 'theoryName'
export const pvsSettings: SettingsElem[] = basicSettings;

//@ts-ignore
if (pvsioweb) {
    const builder: PrototypeBuilder = new PrototypeBuilder();
    const name: string = builder.getName();
    //@ts-ignore
    pvsioweb[name] = new PrototypeBuilder();
}
//@ts-ignore
const builder: PVSioWebPlugin = pvsioweb?.builder || new PrototypeBuilder();
builder.activate({ parent: "pvsioweb", settings: pvsSettings });
// test
builder.connection.on("SavePrototype", (data: PrototypeData) => {
    console.log(`Received SavePrototype request`);
});