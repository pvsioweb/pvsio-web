/**
 * Interactive prototype builder for PVSio based on the html map attribute
 */
import { PVSioWebClient } from './env/PVSioWebClient';
import './css/pvsio-web.css';
import './css/style.css';

const client: PVSioWebClient = new PVSioWebClient({ autostart: true });