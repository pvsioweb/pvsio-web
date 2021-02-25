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
                }
            }
        }
        return this.widgetClassMap;
    }

}