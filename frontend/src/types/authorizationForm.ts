import { TLoginResponse } from './requests';

export type TAuthElements = 'form' | 'inputLogin' | 'inputPassword';

export type TServerError = Omit<TLoginResponse, 'payload'>;
