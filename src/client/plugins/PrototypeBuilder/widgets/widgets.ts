import { Constructable } from '../../../env/PVSioWeb';
import { WidgetEVO } from './core/WidgetEVO';
import { BasicDisplayEVO } from "./core/BasicDisplayEVO";
import { ButtonEVO } from "./core/ButtonEVO";
import { LedEVO } from "./core/LedEVO";
import { NumericDisplayEVO } from "./core/NumericDisplayEVO";
import { TouchScreenEVO } from "./core/TouchScreenEVO";

export type WidgetClassDescriptor = {
    name: string,
    cons: Constructable<WidgetEVO>
};

export const widgets: WidgetClassDescriptor[] = [
    { name: "Display", cons: BasicDisplayEVO },
    { name: "Button", cons: ButtonEVO },
    { name: "LED", cons: LedEVO },
    { name: "Numeric", cons: NumericDisplayEVO },
    { name: "TouchScreen", cons: TouchScreenEVO }
];