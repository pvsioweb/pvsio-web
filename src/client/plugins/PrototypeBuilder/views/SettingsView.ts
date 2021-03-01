import * as Backbone from 'backbone';
import { PVSioWebDataAttribute, DataAttribute, WebFileAttribute, WebFile, IoFile, PictureSize, IoFileAttribute } from '../../../utils/builderUtils';
import { Connection } from '../../../env/Connection';
import { CentralView, CentralViewEvents, CentralViewOptions, DELAYED_TRIGGER_TIMEOUT } from './CentralView';
import { compactDropdownButtonTemplate, editMenu } from '../PrototypeBuilder';

export interface SettingsViewOptions extends CentralViewOptions {
    settings?: {
        contextFolder?: string,
        io?: IoFile,
        web?: WebFile
    }
};

const settingsTemplate: string = `
{{#each settings}}
<div id="{{@key}}" class="input-group input-group-sm mb-3 settings">
    <div class="input-group-prepend">
        <span class="input-group-text" id="{{@key}}-label" style="min-width:10em;">{{#if label}}{{label}}{{else}}{{id}}{{/if}}</span>
    </div>
    <input {{#if readonly}}disabled{{/if}} id="{{@key}}-input" key="{{@key}}" type="text" value="{{value}}" class="form-control" placeholder="{{placeholder}}" aria-label="{{#if label}}{{label}}{{else}}{{id}}{{/if}}" aria-describedby="{{@key}}-label">
    {{browse}}
</div>
{{/each}}
`;

const contentTemplate: string = `
<style>
.input-group-text {
    font-size: small;
}
</style>
<div class="settings-view container-fluid p-0">
    <div class="card">
        <!--
        <div class="card-header d-flex justify-content-between">
            <button class="btn btn-sm btn-outline-primary save">Save</button>
        </div>
        -->
        <div class="card-body">
        ${settingsTemplate}
        </div>
    </div>
</div>`;

export enum SettingsEvents {
    DidUpdateSettings = "DidUpdateSettings"
}

export class SettingsView extends CentralView {
    protected viewOptions: SettingsViewOptions;

    /**
     * Settings editable from the panel
     */
    protected contextFolder: string;
    protected ioSettings: IoFile;
    protected webSettings: WebFile;

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
    updateSettings (data: { io?: IoFile, web?: WebFile, contextFolder?: string }): void {
        if (data) {
            if (data.io) { this.ioSettings = data.io; }
            if (data.web) { this.webSettings = data.web; }
            if (data.contextFolder) { this.contextFolder = data.contextFolder || ""; }
            this.refreshView();
        }
    }

    /**
     * Utility function, updates the picture size
     * @param size 
     */
    updatePictureSize (size: PictureSize): void {
        if (size) {
            if (size.width) { this.webSettings.pictureWidth = size.width; }
            if (size.height) { this.webSettings.pictureHeight = size.height; }
            this.refreshView();
        }
    }

    /**
     * Internal function, refreshes the value shown in the view with the values stored in the settings
     */
    protected refreshView (): void {
        for (let key in this.ioSettings) {
            const v: string = this.ioSettings[key]?.value || "";
            this.$el.find(`#${key}-input`).val(v);
        }
        for (let key in this.webSettings) {
            let v: string = this.webSettings[key] || "";
            if (key === WebFileAttribute.pictureHeight || key === WebFileAttribute.pictureWidth) {
                const val: number = parseFloat(v);
                if (!isNaN(val)) {
                    v = `${parseFloat(v)}px`;
                    this.$el.find(`#${key}-input`).val(v);
                }
            } else {
                this.$el.find(`#${key}-input`).val(v);
            }
        }
        this.$el.find(`#${DataAttribute.contextFolder}-input`).val(this.contextFolder || "");
    }

    /**
     * Renders view content
     * @param data 
     */
    async renderView (): Promise<SettingsView> {
        const settings: {
            [key: string]: { 
                value: string, 
                label: string, 
                readonly?: true | undefined,
                browse?: string | undefined
            }
        } = {};
        settings[DataAttribute.contextFolder] = {
            value: this.contextFolder,
            label: "Context Folder",
            readonly: true
        }; 
        for (let key in this.ioSettings) {
            settings[key] = this.ioSettings[key];
        }
        for (let key in this.webSettings) {
            switch (key) {
                case WebFileAttribute.pictureFile: {
                    const menu: string = compactDropdownButtonTemplate + editMenu;
                    settings[key] = {
                        value: this.webSettings[key],
                        label: "Picture", 
                        readonly: true,
                        browse: menu
                    };
                    break;
                }
                case WebFileAttribute.pictureWidth: {
                    settings[key] = { value: `${this.webSettings[key]}px`, label: "Picture Width" };
                    break;
                }
                case WebFileAttribute.pictureHeight: {
                    settings[key] = { value: `${this.webSettings[key]}px`, label: "Picture Height" };
                    break;
                }
                default: {
                    break;
                }
            }
        }
        const content: string = Handlebars.compile(contentTemplate, { noEscape: true })({ settings });
        await super.renderView({ ...this.viewOptions, content, label: `<i class="fa fa-cogs"></i>` });
        this.$settings = this.$el.find(`.settings-view`);
        this.installHandlers();
        return this;
    }

    /**
     * Internal function, installs event handlers
     */
    protected installHandlers (): void {
        // trigger events when picture width/height is edited
        this.$settings.find(`#${WebFileAttribute.pictureHeight}`).on("input", (evt: JQuery.ChangeEvent) => {
            const val: number = parseFloat(evt.target.value);
            if (val && !isNaN(val)) {
                this.trigger(CentralViewEvents.DidChangePictureSize, { height: val })    
            }
        });
        this.$settings.find(`#${WebFileAttribute.pictureWidth}`).on("input", (evt: JQuery.ChangeEvent) => {
            const val: number = parseFloat(evt.target.value);
            if (val && !isNaN(val)) {
                this.trigger(CentralViewEvents.DidChangePictureSize, { width: val })    
            }
        });
        // install handlers
        this.$settings.find("input").on("input", (evt: JQuery.ChangeEvent) => {
            const key: string = $(evt?.target).attr("key");
            const val: string = evt?.target?.value;
            if (key) {
                if (key === DataAttribute.contextFolder) {
                    this.contextFolder = val;
                } else if (key in WebFileAttribute) {
                    this.webSettings[key] = val;
                } else if (key in IoFileAttribute) {
                    this.ioSettings[key].value = val;
                } else {
                    console.warn(`[settings-view] Warning, could not update setting after input`, evt);
                    return;
                }
                // use a delayed trigger to report the change to interested listeners,
                // to avoid potentially costly updates (e.g., write operation on the file system)
                this.delayedTrigger(SettingsEvents.DidUpdateSettings);
            }
        });
    }

    /**
     * Internal function, reports settings updates on the connection bus after a delay
     * @param evt 
     */
    protected delayedTrigger (evt: SettingsEvents.DidUpdateSettings): void {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.trigger(SettingsEvents.DidUpdateSettings);
        }, DELAYED_TRIGGER_TIMEOUT);
    }

    /**
     * Utility function, clears delayed triggers, used by prototype builder when switching mode
     * (mode switching triggers events carrying all prototype data, so delayed triggers are not necessary)
     */
    clearDelayedTriggers (): void {
        clearTimeout(this.timer);
    }

    /**
     * Get the current value of a given setting
     * @param name 
     */
    getValue (id: PVSioWebDataAttribute): string {
        return <string> this.$settings?.find(`#${id} input`)?.val();
    }

    /**
     * Get the current value of io settings
     */
    getCurrentIoSettings (): IoFile {
        return this.ioSettings;
    }
    
    /**
     * Get the current value of io settings
     */
    getCurrentWebSettings (): IoFile {
        return this.webSettings;
    }

    /**
     * Returns the backbone events handled by this view 
     */
    events (): Backbone.EventsHash {
        return { };
    }

}