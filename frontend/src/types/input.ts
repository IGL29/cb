import { IClasses } from './select';

export interface IInputArgs {
  labelValue?: string;
  placeholderValue: string;
  inputValue?: string;
  classNamesRoot?: IClasses;
  classNamesInput?: IClasses;
  classNamesLabel?: IClasses;
  classNamesWrapperInput?: IClasses;
  type?: 'text' | 'password';
  autocomplete?: HTMLInputElement['autocomplete'];
}
