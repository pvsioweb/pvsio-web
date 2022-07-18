/**
 * Utility function, returns a unique ID in the format wdgW1234
 */
export function widgetUUID (): string {
    return "wdg" + uuid("Wxxxx");
};
/**
 * Utility function, returns a unique ID in the format node-N1234-5678-9
 */
export function nodeUUID (): string {
    return "node-" + uuid("Nxxxx-xxxx-x");
};
/**
 * Utility function, returns a unique ID in the format edge-N1234-5678-9
 */
export function edgeUUID (): string {
    return "edge-" + uuid("Nxxxx-xxxx-x");
};
/**
 * universal user id generator
 * @author Patrick Oladimeji
 * @date 6/4/13 15:35:54 PM
 */
export function uuid (format?: string) {
    let d: number = new Date().getTime();
    format = format || 'xxxxxxxx_xxxx_4xxx_yxxx_xxxxxxxxxxxx';
    const uuid = format.replace(/[xy]/g, (c: string) => {
        const r: number = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};