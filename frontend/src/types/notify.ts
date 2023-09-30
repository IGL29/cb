import { IClasses } from './select';

export interface INotifyItemArgs {
  title: string;
  description?: string;
  classNamesRoot?: IClasses;
  type?: INotifyType;
}

export type INotifyType = 'error' | 'message' | 'warn' | 'success';
