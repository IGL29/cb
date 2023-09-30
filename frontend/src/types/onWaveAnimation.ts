import { IClasses } from './select';

export interface IOnWaveAnimationArgs {
  floatElement?: TFloatElement;
  classNamesRoot?: IClasses;
  classNamesFloat?: IClasses;
}

export type TFloatElement = HTMLElement | SVGElement | undefined;
