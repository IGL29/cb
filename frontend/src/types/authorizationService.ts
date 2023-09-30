import { ILoginRequestPayload } from './apiPayloads';

export type TErrors = { [key in keyof ILoginRequestPayload]: string[] };

export type TResultOfChecked = {
  isValid: boolean;
  errors: TErrors;
};
export type TValidationError = TResultOfChecked;
