import * as Backbone from 'backbone';
import { SettingsAttributes } from '../../../utils/pvsiowebUtils';
import { Connection } from '../../../env/Connection';
import { CentralView, CentralViewOptions, DELAYED_TRIGGER_TIMEOUT } from './CentralView';

export declare type SettingsElemValue = string;
export declare interface Settings {
    id: SettingsAttributes,
    value: SettingsElemValue // initial value of the setting
}
export declare interface SettingsElem extends Settings {
    label?: string,
    placeholder?: string
}
export declare interface SettingsMap { 
    [key: string]: Settings
}
export declare interface SettingsElemMap {
    [key:string]: SettingsElem
}
export interface SettingsViewOptions extends CentralViewOptions {
    settings?: SettingsElem[]
}
export enum SettingsEvents {
    DidUpdateSettings = "DidUpdateSettings"
}

const settingsTemplate: string = `
{{#each settings}}
<div id="{{id}}" class="input-group input-group-sm mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="{{id}}-label" style="min-width:10em;">{{#if label}}{{label}}{{else}}{{id}}{{/if}}</span>
    </div>
    <input id="{{id}}-input" type="text" value="{{value}}" class="form-control" placeholder="{{placeholder}}" aria-label="{{#if label}}{{label}}{{else}}{{id}}{{/if}}" aria-describedby="{{id}}-label">
</div>
{{/each}}
`;

const contentTemplate: string = `
<div class="builder-settings container-fluid" style="padding-left:0;">
    <div class="card">
        <div class="card-header">Settings</div>
        <div class="card-body settings">
        ${settingsTemplate}
        </div>
    </div>
</div>`;


// keys need to be consistent with the fields declared in PVSioWebFile (see pvsioweb.d.ts)
export const fileSettings: SettingsElem[] = [
    { id: SettingsAttributes.mainFile, label: "Main File", value: "", placeholder: "" },
    { id: SettingsAttributes.mainModule, label: "Main Function", value: "", placeholder: "" },
    { id: SettingsAttributes.contextFolder, label: "Context Folder", value: "", placeholder: "" }
];
export const functionSettings: SettingsElem[] = [
    { id: SettingsAttributes.initFunction, label: "Init Function", value: "init", placeholder: "" },
    { id: SettingsAttributes.tickFunction, label: "Tick Function (optional)", value: "", placeholder: "" },
    { id: SettingsAttributes.tickFrequency, label: "Tick Frequency", value: "1000ms", placeholder: "" }
];
export const printerSettings: SettingsElem[] = [
    { id: SettingsAttributes.outputPrinter, label: "Output Printer (optional)", value: "", placeholder: "" }
];
export const basicSettings: SettingsElem[] = fileSettings.concat(functionSettings).concat(printerSettings);

export class SettingsView extends CentralView {
    protected viewOptions: SettingsViewOptions;

    /**
     * Settings map
     */
    protected settings: SettingsElemMap;

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
    protected updateSettings (settings: SettingsElem[]): void {
        this.settings = {}
        if (this.viewOptions?.settings?.length) {
            for (let i = 0; i < this.viewOptions?.settings.length; i++) {
                const elem: SettingsElem = this.viewOptions?.settings[i];
                const id: string = elem.id;
                this.settings[id] = elem;
            }
        }
    }

    /**
     * Renders view content
     * @param data 
     */
    async renderView (): Promise<SettingsView> {
        const settings: SettingsElem[] = this.viewOptions?.settings || basicSettings;
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
            const data: SettingsMap = this.getCurrentSettings();
            this.trigger(SettingsEvents.DidUpdateSettings, data);
        }, DELAYED_TRIGGER_TIMEOUT);
    }

    /**
     * Configures the list of settings shown in the panel 
     * @param settings 
     */
    configure (data: { settings: SettingsElem[] }): void {
        if (data) {
            const settings: SettingsElem[] = data?.settings;
            this.updateSettings(settings);
            const content: string = Handlebars.compile(settingsTemplate, { noEscape: true})({ settings });
            this.$settings.html(content);
        }
    }

    /**
     * Get the current value of a given setting
     * @param name 
     */
    getValue (id: SettingsAttributes): string {
        return <string> this.$settings?.find(`#${id} input`)?.val();
    }

    /**
     * Get the current value of all settings
     */
    getCurrentSettings (): SettingsMap {
        const ans: SettingsMap = {};
        for (let key in this.settings) {
            const settings: Settings = this.settings[key];
            const id: SettingsAttributes = settings.id;
            const value: SettingsElemValue = this.getValue(id);
            if (value !== undefined) {
                ans[key] = { id, value };
            }
        }
        return ans;
    }
    
    /**
     * Returns the backbone events handled by this view 
     */
    events (): Backbone.EventsHash {
        return { };
    }

}