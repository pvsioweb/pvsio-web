import { Connection } from '../../../common/interfaces/Connection';
import { CentralView, CentralViewOptions } from '../../PrototypeBuilder/views/CentralView';

const content: string = `
<div class="splash-screen-view container-fluid p-0">
    <div class="card" style="height:100%;">
        <div class="card-body animated fadeIn align-self-center" style="text-align:center; padding-left:120px; margin-left:-6px;">
            <h5>Welcome to Emucharts!</h5>
            <br>
            <div>Define the logic behavior of your prototype</div>
            <br>
            <div>
                <form class="load-picture-form">
                    <div class="custom-file">
                        <input class="open-emuchart custom-file-input" type="file" accept=".emu">
                        <label class="custom-file-label">Open Emuchart</label>
                    </div>
                </form>
                </br>or<br><br>
                <div class="btn btn-sm btn-outline-dark new-emuchart" style="width:100%">Create New Emuchart</div>
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