import { DialEVO } from './core/DialEVO';
import { SelectorEVO } from './core/SelectorEVO';
import { WidgetClassMap } from './widgetClassMap';

export const dials: WidgetClassMap = {
    "Dial": [
        { id: DialEVO.constructorName, label: "Rotary Dial", cons: DialEVO },
        { id: SelectorEVO.constructorName, label: "Switch Selector", cons: SelectorEVO }
    ]
};