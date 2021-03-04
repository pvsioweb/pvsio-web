import { coreWidgetClassMap, WidgetClassMap, WidgetClassDescriptor } from "./widgets/widgetClassMap";

export class WidgetClassManager {
    protected widgetClassMap: WidgetClassMap;

    /**
     * Constructor
     */
    constructor () {
        this.widgetClassMap = coreWidgetClassMap;
    }

    /**
     * Returns the current list of widgets
     */
    getWidgetClassMap (): WidgetClassMap {
        return this.widgetClassMap || {};
    }

    /**
     * Utility function to import external widget libraries
     */
    importWidgetClassMap (widgetList: WidgetClassMap): WidgetClassMap {
        if (widgetList) {
            console.log(`[pvsio-web] Importing widget class map`, widgetList);
            for (let kind in widgetList) {
                const elems: WidgetClassDescriptor[] = widgetList[kind];
                for (let i = 0; i < elems.length; i++) {
                    this.widgetClassMap[kind] = this.widgetClassMap[kind] || [];
                    const desc: WidgetClassDescriptor = elems[i];
                    // remove any widget class with same ID
                    this.widgetClassMap[kind] = this.widgetClassMap[kind].filter(elem => {
                        return elem.id !== desc.id;
                    });
                    // add the new widget class
                    this.widgetClassMap[kind].push(desc);
                    console.log(`[pvsio-web] New widget added`, desc);
                }
            }
        }
        return this.widgetClassMap;
    }

    /**
     * Utility function, imports widget library
     */
    importWidgetLibrary (widgetLib: any): void {
        console.log(`[pvsio-web] Importing widget library`, widgetLib);
        if (widgetLib) {
            const libNames = Object.keys(widgetLib);
            for (let i = 0; i < libNames.length; i++) {
                const name: string = libNames[i];
                console.log(`[pvsio-web] Importing ${name}`, widgetLib[name]);
                try {
                    this.importWidgetClassMap(widgetLib[name]);
                    console.log(`[pvsio-web] Library ${name} imported successfully!`);
                } catch (error) {
                    console.warn(`[pvsio-web] Warning: unable to load widget library`, widgetLib);
                }
            }
        }
    }

}