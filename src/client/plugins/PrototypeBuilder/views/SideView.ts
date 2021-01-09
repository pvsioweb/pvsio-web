import * as Backbone from 'backbone';

export interface SideViewOptions extends Backbone.ViewOptions { }
export abstract class SideView extends Backbone.View {
    hide (): void {
        this.$el.css({ display: "none" });
    }
    reveal (): void {
        this.$el.css({ display: "block" });
    }
}