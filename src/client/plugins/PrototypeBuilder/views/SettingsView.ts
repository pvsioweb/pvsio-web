import * as Backbone from 'backbone';
import { Connection } from '../../../env/Connection';
import { CentralView, CentralViewOptions } from './CentralView';

export const content: string = `
<div class="builder-settings container-fluid" style="padding-left:0;">
    Builder Settings
</div>`;


export class SettingsView extends CentralView {
    
    constructor (data: CentralViewOptions, connection: Connection) {
        super(data, connection);
    }

    render (data?: CentralViewOptions): SettingsView {
        super.render({ ...data, content, label: `<i class="fa fa-cogs"></i>` });
        return this;
    }

    events (): Backbone.EventsHash {
        return { };
    }

}