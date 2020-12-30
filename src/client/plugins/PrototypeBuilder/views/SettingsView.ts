import * as Backbone from 'backbone';
import { Connection } from '../../../env/Connection';
import { View, BuilderViewOptions } from './View';

export const content: string = `
<div class="builder-settings container-fluid" style="padding-left:0;">
    Builder Settings
</div>`;


export class SettingsView extends View {
    
    constructor (data: BuilderViewOptions, connection: Connection) {
        super(data, connection);        
        this.render(data);
    }

    render (data?: BuilderViewOptions): SettingsView {
        super.render({ ...data, content, label: `<i class="fa fa-cogs"></i>` });
        return this;
    }

    events (): Backbone.EventsHash {
        return {
        };
    }

}