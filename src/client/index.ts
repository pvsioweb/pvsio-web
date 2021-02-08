/**
 * Interactive prototype builder for PVSio based on the html map attribute
 */
import { PVSioWebClient } from './env/PVSioWebClient';

const client: PVSioWebClient = new PVSioWebClient();
client.start();