import * as Backbone from 'backbone';
import { Connection } from '../../../env/Connection';
import { CentralView, CentralViewOptions } from './CentralView';
import * as fsUtils from '../../../utils/fsUtils';

export const contentTemplate: string = `
<div class="builder-settings container-fluid" style="padding-left:0;">
    <div class="card">
        <div class="card-header">Prototype Configuration</div>
        <div class="card-body">
            {{#each settings}}
            <div id="{{@key}}" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="{{@key}}-label" style="min-width:10em;">{{label}}</span>
                </div>
                <input id="{{@key}}-input" type="text" class="form-control" placeholder="{{placeholder}}" aria-label="{{label}}" aria-describedby="{{id}}-label">
            </div>
            {{/each}}
        </div>
    </div>
</div>`;

const settings: { [key: string]: { label: string, placeholder?: string } } = {
    "main-file": { label: "Main File" },
    "context-folder": { label: "Context Folder" },
    "init-function": { label: "Init Function" },
    "tick-function": { label: "Tick Function" },
    "tick-frequency": { label: "Tick Frequency" }
};

export interface Settings {
    fileName: string,
    fileExtension: string,
    contextFolder: string,
    initFunction: string,
    tickFunction: string,
    tickFrequency: number // ms
};

export class SettingsView extends CentralView {
    protected $settings: { [key: string]: JQuery<HTMLElement> } = {};
    
    constructor (data: CentralViewOptions, connection: Connection) {
        super(data, connection);
    }

    render (data?: CentralViewOptions): SettingsView {
        const content: string = Handlebars.compile(contentTemplate, { noEscape: true })({ settings });
        super.render({ ...data, content, label: `<i class="fa fa-cogs"></i>` });
        const keys: string[] = Object.keys(settings);
        for (let i = 0; i < keys.length; i++) {
            this.$settings[keys[i]] = this.$el.find(`#${keys[i]} input`);
        }
        return this;
    }

    getMainFile (): string {
        return <string> this.$settings["main-file"].val();
    }
    setMainFile (fname: string): void {
        this.$settings["main-file"].val(fname);
    }
    getContextFolder (): string {
        return <string> this.$settings["context-folder"].val() || "";
    }
    setContextFolder (fname: string): void {
        this.$settings["context-folder"].val(fname);
    }
    getInitFunction (): string {
        return <string> this.$settings["init-function"].val();
    }
    setInitFunction (init: string): void {
        this.$settings["init-function"].val(init) || "";
    }
    getTickFunction (): string {
        return <string> this.$settings["tick-function"].val();
    }
    setTickFunction (tick: string): void {
        this.$settings["tick-function"].val(tick) || "";
    }
    getTickFrequency (): number {
        const elem: string = <string> this.$settings["tick-frequency"].val();
        if (elem) {
            return parseFloat(elem);
        }
        return 250;
    }
    setTickFrequency (ms: number): void {
        if (ms) {
            this.$settings["tick-frequency"].val(`${ms}ms`);
        } else {
            this.$settings["tick-frequency"].val("");
        }
    }
    getSettings (): Settings {
        const fname: string = this.getMainFile();
        const contextFolder: string = this.getContextFolder();
        const initFunction: string = this.getInitFunction();
        const tickFunction: string = this.getTickFunction();
        const tickFrequency: number = this.getTickFrequency();
        return {
            fileName: fsUtils.getFileName(fname),
            fileExtension: fsUtils.getFileExtension(fname),
            contextFolder,
            initFunction,
            tickFunction,
            tickFrequency
        };
    }
    

    events (): Backbone.EventsHash {
        return { };
    }

}