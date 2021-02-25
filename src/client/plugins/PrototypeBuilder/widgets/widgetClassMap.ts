import { Constructable } from '../../../env/PVSioWeb';
import { WidgetEVO } from './core/WidgetEVO';
import { BasicDisplayEVO } from './core/BasicDisplayEVO';
import { ButtonEVO } from './core/ButtonEVO';
import { LedEVO } from './core/LedEVO';
import { NumericDisplayEVO } from './core/NumericDisplayEVO';
import { TouchScreenEVO } from './core/TouchScreenEVO';
import { ToggleButtonEVO } from './core/ToggleButtonEVO';

export interface WidgetClassDescriptor {
    id: string,
    label: string,
    cons: Constructable<WidgetEVO>
};

export interface WidgetClassMap { [ kind: string ]: WidgetClassDescriptor[] };

export const coreWidgetClassMap: WidgetClassMap = {
    "Display": [ // the widget kind indicated here must be identical with that declared in the class
        { id: BasicDisplayEVO.constructorName, label: "Basic Display", cons: BasicDisplayEVO },
        { id: NumericDisplayEVO.constructorName, label: "Numeric Display", cons: NumericDisplayEVO }
    ],
    "Button": [
        { id: ButtonEVO.constructorName, label: "Standard Button", cons: ButtonEVO },
        { id: ToggleButtonEVO.constructorName, label: "Toggle Switch", cons: ToggleButtonEVO }
    ],
    "Touchscreen": [
        { id: TouchScreenEVO.constructorName, label: "TouchScreen Element", cons: TouchScreenEVO }
    ],
    "LED": [
        { id: LedEVO.constructorName, label: "Multicolor LED", cons: LedEVO }
    ]
};