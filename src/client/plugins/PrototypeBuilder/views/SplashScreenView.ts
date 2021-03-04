import { Connection } from '../../../env/Connection';
import { CentralView, CentralViewOptions } from './CentralView';

const content: string = `
<style>
.splash-options {
    max-width: 300px;
}
</style>
<div class="splash-screen-view container-fluid p-0">
    <div class="card">
        <div class="card-body animated zoomIn">
            <h5>Welcome to Prototype Builder!</h5>
            <br>
            <div>Choose the visual appearance of your prototype.</div>
            <br>
            <div class="splash-options">
                <form class="load-picture-form">
                    <div class="custom-file">
                        <input class="change-picture custom-file-input" type="file" accept="image"">
                        <label class="custom-file-label">Select a Picture</label>
                    </div>
                </form>
                </br>or<br><br>
                <div class="btn btn-sm btn-outline-dark remove-picture" style="width:100%">Use Whiteboard</div>
            </div>
        </div>
    </div>
</div>`;

export class SplashScreenView extends CentralView {

    /**
     * Constructor
     */
    constructor (data: CentralViewOptions, connection: Connection) {
        super(data, connection);
    }

    /**
     * Render the view
     */
    async renderView (opt?: CentralViewOptions): Promise<SplashScreenView> {
        await super.renderView({ ...this.viewOptions, content });
        return this;
    }

}