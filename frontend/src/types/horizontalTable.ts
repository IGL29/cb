import { IClasses } from './select';

export interface ITableArgs {
  headerValues: string[];
  columnsCount?: number | null;
}

export interface ISetSelValueArgs {
  cellElement: HTMLElement;
  value: TValue;
}

export type TValue = string | number;

export type FillDataArgs = TValue[][];

export interface ICreateRowArgs {
  cellValues: TValue[];
  isHeader?: boolean;
  option?: TOption;
}

export interface IAppendCells {
  rowElement: HTMLElement;
  cellValues: TValue[];
  isHeader?: boolean;
  option?: TOption;
}

export interface IFillDataArgs {
  values: FillDataArgs;
  options?: TOptions;
  renderingMethod?: TRenderingMethod;
}

export type TOption = 'up' | 'down' | null;
export type TOptions = TOption[];
export type TRenderingMethod = 'append' | 'prepend' | 'replace' | 'update';

export interface IHorizontalTableArgs {
  classNamesRoot?: IClasses;
}
