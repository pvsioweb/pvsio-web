import { Constructable } from '../../../env/PVSioWeb';
import { WidgetEVO } from './core/WidgetEVO';
import { BasicDisplayEVO } from './core/BasicDisplayEVO';
import { ButtonEVO } from './core/ButtonEVO';
import { LedEVO } from './core/LedEVO';
import { NumericDisplayEVO } from './core/NumericDisplayEVO';
import { TouchScreenEVO } from './core/TouchScreenEVO';
import { DialEVO } from './core/DialEVO';
import { SelectorEVO } from './core/SelectorEVO';
import { PushButtonEVO } from './core/PushButtonEVO';
import { ToggleButtonEVO } from './core/ToggleButtonEVO';

export type WidgetClassDescriptor = {
    name: string,
    cons: Constructable<WidgetEVO>
};

export const widgets: WidgetClassDescriptor[] = [
    { name: "Display", cons: BasicDisplayEVO },
    { name: "Numeric", cons: NumericDisplayEVO },
    { name: "Button", cons: ButtonEVO },
    { name: "PushButton", cons: PushButtonEVO },
    { name: "ToggleButton", cons: ToggleButtonEVO },
    { name: "TouchScreen", cons: TouchScreenEVO },
    { name: "Dial", cons: DialEVO },
    { name: "Selector", cons: SelectorEVO },
    { name: "LED", cons: LedEVO }
];