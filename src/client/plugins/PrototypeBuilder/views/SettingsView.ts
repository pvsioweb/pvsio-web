import * as Backbone from 'backbone';
import { PVSioWebDataAttribute, IoData, IoFileValue, DataAttribute } from '../../../utils/pvsiowebFileUtils';
import { Connection } from '../../../env/Connection';
import { CentralView, CentralViewOptions, DELAYED_TRIGGER_TIMEOUT } from './CentralView';

// export declare interface SettingsElem extends Settings {
//     label?: string,
//     placeholder?: string
// }
// export declare interface SettingsMap { 
//     [key: string]: Settings
// }
// export declare interface SettingsElemMap {
//     [key:string]: SettingsElem
// }
export interface SettingsViewOptions extends CentralViewOptions {
    settings?: IoData
}
export enum SettingsEvents {
    DidUpdateSettings = "DidUpdateSettings"
}

const settingsTemplate: string = `
{{#each settings}}
<div id="{{@key}}" class="input-group input-group-sm mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="{{@key}}-label" style="min-width:10em;">{{#if label}}{{label}}{{else}}{{id}}{{/if}}</span>
    </div>
    <input id="{{@key}}-input" type="text" value="{{value}}" class="form-control" placeholder="{{placeholder}}" aria-label="{{#if label}}{{label}}{{else}}{{id}}{{/if}}" aria-describedby="{{id}}-label">
</div>
{{/each}}
`;

const contentTemplate: string = `
<style>
.input-group-text {
    font-size: small;
}
</style>
<div class="builder-settings container-fluid p-2" style="padding-left:0;">
    <div class="card">
        <div class="card-header">Settings</div>
        <div class="card-body settings">
        ${settingsTemplate}
        </div>
    </div>
</div>`;


// keys need to be consistent with the fields declared in PVSioWebFile (see pvsioweb.d.ts)
// export const infoSettings: SettingsElem[] = [
//     { id: IoDataAttribute.description, value: "", label: "Description" }
// ];
// export const fileSettings: SettingsElem[] = [
//     { id: IoDataAttribute.mainFile, value: "", label: "Main File" },
//     { id: IoDataAttribute.mainModule, value: "", label: "Main Function" },
//     { id: DataAttribute.contextFolder, value: "", label: "Context Folder" }
// ];
// export const functionSettings: SettingsElem[] = [
//     { id: IoDataAttribute.initFunction, value: "", label: "Init Function" },
//     { id: IoDataAttribute.tickInterval, value: "1000ms", label: "Tick Interval" },
//     { id: IoDataAttribute.tickFunction, value: "", label: "Tick Function (optional)" }
// ];
// export const printerSettings: SettingsElem[] = [
//     { id: IoDataAttribute.toStringFunction, value: "", label: "toString Function (optional)" }
// ];
// export const basicSettings: SettingsElem[] = 
//     infoSettings.concat(fileSettings).concat(functionSettings).concat(printerSettings);

export class SettingsView extends CentralView {
    protected viewOptions: SettingsViewOptions;

    /**
     * Settings map
     */
    protected settings: IoData;

    /**
     * Pointer to the DOM element with settings
     */
    protected $settings: JQuery<HTMLElement>;

    /**
     * Internal timer, used for delayed triggers
     */
    protected timer: NodeJS.Timer = null;
    
    /**
     * Constructor
     * @param data 
     * @param connection 
     */
    constructor (data: SettingsViewOptions, connection: Connection) {
        super(data, connection);
        this.updateSettings(data?.settings);
    }

    /**
     * Internal function, updates settings
     * @param settings 
     */
    updateSettings (settings: IoData): void {
        this.settings = settings;
        // this.renderView();
    }

    /**
     * Renders view content
     * @param data 
     */
    async renderView (): Promise<SettingsView> {
        const settings: { [key: string]: IoFileValue } = {};
        for (let key in this.viewOptions?.settings) {
            settings[key] = (key === DataAttribute.contextFolder) ? 
                { id: key, value: this.viewOptions[key], label: "Context Folder" } 
                    : this.viewOptions.settings[key]
        }
        const content: string = Handlebars.compile(contentTemplate, { noEscape: true })({ settings });
        await super.renderView({ ...this.viewOptions, content, label: `<i class="fa fa-cogs"></i>` });
        this.$settings = this.$el.find(`.settings`);
        // install handlers
        this.$settings.find("input").on("input", (evt: JQuery.ChangeEvent) => {
            // use a dealyed trigger to avoid constant write operation on the file system
            this.delayedTrigger(SettingsEvents.DidUpdateSettings);
        });
        return this;
    }

    /**
     * Internal function, reports settings updates on the connection bus after a delay
     * @param evt 
     */
    protected delayedTrigger (evt: SettingsEvents.DidUpdateSettings): void {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            const data: IoData = this.getCurrentSettings();
            this.trigger(SettingsEvents.DidUpdateSettings, data);
        }, DELAYED_TRIGGER_TIMEOUT);
    }

    /**
     * Configures the list of settings shown in the panel 
     * @param settings 
     */
    // loadIoDataData (data: IoData): void {
    //     if (data) {
    //         for (let key in this.settings) {
    //             const val = data[key]
    //         }
    //         const settings: SettingsElem[] = data?.settings;
    //         this.updateSettings(settings);
    //         const content: string = Handlebars.compile(settingsTemplate, { noEscape: true})({ settings });
    //         this.$settings.html(content);
    //     }
    // }

    /**
     * Get the current value of a given setting
     * @param name 
     */
    getValue (id: PVSioWebDataAttribute): string {
        return <string> this.$settings?.find(`#${id} input`)?.val();
    }

    /**
     * Get the current value of all settings
     */
    getCurrentSettings (): IoData {
        // const ans: SettingsMap = {};
        // for (let key in this.settings) {
        //     const settings: Settings = this.settings[key];
        //     const id: PVSioWebDataAttribute = settings.id;
        //     const value: string = this.getValue(id);
        //     if (value !== undefined) {
        //         ans[key] = { id, value };
        //     }
        // }
        // return ans;
        return this.settings;
    }
    
    /**
     * Returns the backbone events handled by this view 
     */
    events (): Backbone.EventsHash {
        return { };
    }

}