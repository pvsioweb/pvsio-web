/**
 * universal user id generator
 * @author Patrick Oladimeji
 * @date 6/4/13 15:35:54 PM
 */
export function uuid () {
    let d: number = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
        const r: number = ((d + Math.random() * 16) % 16) | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
};

