import { ICurrencyBuyRequestPayload } from './apiPayloads';
import { TCurrenciesResponse, TCurrencyBuyResponse } from './requests';
import { IClasses, TSelectCallback } from './select';

export interface ICurrencyExchangeViewArgs {
  classNamesRoot?: IClasses;
  callbackCurrencyFromSelect: TSelectCallback;
  callbackCurrencyToSelect: TSelectCallback;
}
export interface IOption {
  title: string;
  isActive?: boolean;
}

export type TTarget = 'input-amount' | 'btn-transfer';
export type TOptions = IOption[];

export type TErrors = { [key in keyof ICurrencyBuyRequestPayload]: string[] };
export type TValidationError = {
  isValid: boolean;
  errors: TErrors;
};
export type TServerError = Omit<TCurrencyBuyResponse, 'payload'>;

export interface ICallbackPassCarrencyData {
  (data: TCurrenciesResponse): any;
}
