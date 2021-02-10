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
    name: string,
    cons: Constructable<WidgetEVO>
};

export interface WidgetClassMap { [ kind: string ]: WidgetClassDescriptor[] };

// NOTE: name cannot not contain white spaces for now
export const widgetList: WidgetClassMap = {
    "Display": [ // the kind should be consistent with that declared in the class
        { name: "Basic-Display", cons: BasicDisplayEVO },
        { name: "Numeric-Display", cons: NumericDisplayEVO }
    ],
    "Button": [
        { name: "Standard-Button", cons: ButtonEVO },
        { name: "Selection-Button", cons: SelectionButtonEVO },
        { name: "Toggle-Switch", cons: ToggleButtonEVO }
    ],
    "Touchscreen": [
        { name: "TouchScreen-Element", cons: TouchScreenEVO }
    ],
    "Dial": [
        { name: "Rotary-Dial", cons: DialEVO },
        { name: "Switch-Selector", cons: SelectorEVO }
    ],
    "LED": [
        { name: "Multicolor-LED", cons: LedEVO }
    ]
};