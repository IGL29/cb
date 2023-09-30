import { TEvent, THandlerEvent } from './view';

export type IClasses = ReadonlyArray<string>;

export interface IInputConfig {
  isWithInput?: boolean;
  placeholderValue: string;
  labelValue?: string;
}

export interface IItemListArgs {
  title: string;
  value?: string;
  isActive?: boolean;
}

export interface ISelectArgs {
  buttonValue: string;
  classNamesRoot?: IClasses;
  classNamesWrapperSelect?: IClasses;
  classNamesButton?: IClasses;
  classNamesList?: IClasses;
  classNamesLabel?: IClasses;
  inputConfig?: IInputConfig;
  callback?: TSelectCallback;
  wrapperOuterClick?: HTMLElement;
  isShowActiveOptionToBtn?: boolean;
}

export type TSelectCallback = <T extends string>(value: T) => any;

export interface IHandlerInputArgs {
  handler: THandlerEvent;
  type: TEvent;
}
