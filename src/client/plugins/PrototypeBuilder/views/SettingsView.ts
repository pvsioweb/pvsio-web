import * as Backbone from 'backbone';
import { Connection } from '../../../env/Connection';
import { CentralView, CentralViewOptions } from './CentralView';

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

export type SettingId = "mainFile" | "contextFolder" | "initFunction" | "tickFunction" | "tickFrequency" | "jsonPrinter" | string;
export interface Settings {
    id: SettingId,
    label?: string,
    value?: string, 
    placeholder?: string, 
    init?: boolean // indicates whether this setting will be sent to the server to initialize the simulation
};

export interface SettingsViewOptions extends CentralViewOptions {
    settings?: Settings[]
}

export const fileSettings: Settings[] = [
    { id: "mainFile", label: "Main File", value: "" },
    { id: "contextFolder", label: "Context Folder", value: "" }
];
export const functionSettings: Settings[] = [
    { id: "initFunction", label: "Init Function", value: "" },
    { id: "tickFunction", label: "Tick Function", value: "" },
    { id: "tickFrequency", label: "Tick Frequency", value: "250ms" }
];
export const printerSettings: Settings[] = [
    { id: "jsonPrinter", label: "JSON Printer", value: "" }
];
export const basicSettings: Settings[] = fileSettings.concat(functionSettings).concat(printerSettings);

export class SettingsView extends CentralView {
    protected viewOptions: SettingsViewOptions;

    /**
     * Pointer to the DOM element with settings
     */
    protected $settings: JQuery<HTMLElement>;
    protected keys: string[]; // we are keeping the keys so the value of the settings to make sure the value is always taken from the DOM
    
    /**
     * Constructor
     * @param data 
     * @param connection 
     */
    constructor (data: SettingsViewOptions, connection: Connection) {
        super(data, connection);
    }

    /**
     * Renders view content
     * @param data 
     */
    async renderView (): Promise<SettingsView> {
        const settings: Settings[] = this.viewOptions?.settings || basicSettings;
        const content: string = Handlebars.compile(contentTemplate, { noEscape: true })({ settings });
        await super.renderView({ ...this.viewOptions, content, label: `<i class="fa fa-cogs"></i>` });
        this.$settings = this.$el.find(`.settings`);
        this.keys = this.viewOptions?.settings ? this.viewOptions.settings.map((elem: Settings) => {
            return elem.id;
        }) : [];
        return this;
    }

    /**
     * Configures the list of settings shown in the panel 
     * @param settings 
     */
    configure (data: { settings: Settings[] }): void {
        if (data) {
            console.log(`[settings-view] Updating settings`, data);
            const settings: Settings[] = data?.settings;
            const content: string = Handlebars.compile(settingsTemplate, { noEscape: true})({ settings });
            this.$settings.html(content);
            this.keys = Object.keys(settings);
        }
    }

    /**
     * Get the current value of a given setting
     * @param name 
     */
    getValue (id: SettingId): string {
        return <string> this.$settings?.find(`#${id} input`)?.val();
    }

    /**
     * Get the current value of all settings
     */
    getSettings (): Settings[] {
        const ans: Settings[] = [];
        for (let i = 0; i < this.keys?.length; i++) {
            const id: SettingId = this.keys[i];
            ans[id] = {
                id,
                value: this.getValue(id)
            };
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