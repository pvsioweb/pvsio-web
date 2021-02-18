/**
 * Interactive prototype builder for PVSio based on the html map attribute
 */
import { PrototypeData } from './env/PVSioWeb';
import { PrototypeBuilder } from './plugins/PrototypeBuilder/PrototypeBuilder';
import { fileSettings, functionSettings, printerSettings, Settings } from './plugins/PrototypeBuilder/views/SettingsView';

// augment the basic settings with a new field 'theoryName'
export const pvsSettings: Settings[] = fileSettings.concat([
    { id: "mainFile", label: "Main File", value: "" }
]).concat(functionSettings).concat(printerSettings);

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