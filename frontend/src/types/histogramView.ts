import { IClasses } from './select';

export interface IHistogramViewArgs {
  rootExternalClasses?: IClasses;
}

export interface IDataForValuesRightArgs {
  minValue: number;
  maxValue: number;
  widthForHistogram: number;
  heightForHistogram: number;
  widthRightValues: number;
  spaceToTextRight: number;
  fontSize: number;
}

export interface IDrawValuesRightArgs {
  minValue: number;
  maxValue: number;
  minValueX: number;
  minValueY: number;
  minValueWidth: number;
  maxValueX: number;
  maxValueY: number;
  maxValueWidth: number;
}
