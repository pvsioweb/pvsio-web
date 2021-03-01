import * as Backbone from 'backbone';
export interface SideViewOptions extends Backbone.ViewOptions { }

/**
 * Abstract class for side views in prototype builder
 */
export abstract class SideView extends Backbone.View {
    /**
     * Hide view
     */
    hide (): void {
        this.$el.css({ display: "none" });
    }
    /**
     * Reveal view
     */
    reveal (): void {
        this.$el.css({ display: "block" });
    }
}