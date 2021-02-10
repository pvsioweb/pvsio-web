import { Constructable } from '../../../env/PVSioWeb';
import { WidgetEVO } from './core/WidgetEVO';
import { BasicDisplayEVO } from './core/BasicDisplayEVO';
import { ButtonEVO } from './core/ButtonEVO';
import { LedEVO } from './core/LedEVO';
import { NumericDisplayEVO } from './core/NumericDisplayEVO';
import { TouchScreenEVO } from './core/TouchScreenEVO';
import { DialEVO } from './core/DialEVO';
import { SelectorEVO } from './core/SelectorEVO';
import { SelectionButtonEVO } from './core/SelectionButtonEVO';
import { ToggleButtonEVO } from './core/ToggleButtonEVO';

export interface WidgetClassDescriptor {
    label: string,
    cons: Constructable<WidgetEVO>
};

export interface WidgetClassMap { [ kind: string ]: WidgetClassDescriptor[] };

export const widgetList: WidgetClassMap = {
    "Display": [ // the kind should be identical with that declared in the class
        { label: "Basic Display", cons: BasicDisplayEVO },
        { label: "Numeric Display", cons: NumericDisplayEVO }
    ],
    "Button": [
        { label: "Standard Button", cons: ButtonEVO },
        { label: "Selection Button", cons: SelectionButtonEVO },
        { label: "Toggle Switch", cons: ToggleButtonEVO }
    ],
    "Touchscreen": [
        { label: "TouchScreen Element", cons: TouchScreenEVO }
    ],
    "Dial": [
        { label: "Rotary Dial", cons: DialEVO },
        { label: "Switch Selector", cons: SelectorEVO }
    ],
    "LED": [
        { label: "Multicolor LED", cons: LedEVO }
    ]
};