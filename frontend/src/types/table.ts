export interface ITableArgs {
  headerValues: string[];
  columnsCount?: number | null;
  loadMoreCallback?: (args?: any) => any;
}

export interface ISetSelValueArgs {
  cellElement: HTMLElement;
  value: TValue;
}

export type TValue = string | number | HTMLElement;

export type FillDataArgs = TValue[][];

export interface ICreateRowArgs {
  cellValues: TValue[];
  isHeader?: boolean;
  options?: any;
  isVerticalTable?: boolean;
}

export interface IAppendCells {
  rowElement: HTMLElement;
  cellValues: TValue[];
  isHeader?: boolean;
  options: any[];
  isVerticalTable: boolean;
}

export interface IFillDataArgs {
  values: FillDataArgs;
  options?: any[];
  renderingMethod?: TRenderingMethod;
}

export type TSavedData = Required<IFillDataArgs>;

export type TRenderingMethod = 'append' | 'prepend' | 'replace';
