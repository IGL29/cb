import { TTransferResponse } from './requests';
import { TSelectCallback } from './select';

export interface ITransferArgs {
  callbackSAccountSelect: TSelectCallback;
}

export type TTarget = 'input-amount' | 'btn-transfer' | 'input-account';
export type TValidateErrors = {
  isValid: boolean;
  errors: {
    to: string[];
    amount: string[];
  };
};

export interface IServerError extends TTransferResponse {
  error: 'Invalid account to' | 'Overdraft prevented';
}

export interface ICallBackPassTransferData {
  (data: TTransferResponse): any;
}
