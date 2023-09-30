import { TToken } from './token';
import {
  IAllCurrenciesRequestPayload,
  ICreateAccountRequestPayload,
  ICreateAccountResponsePayload,
  ICurrenciesRequestPayload,
  ICurrencyBuyRequestPayload,
  ICurrencyFeed,
  IGetAccountRequestPayload,
  IGetAccountsRequestPayload,
  IGetBanksRequestPayload,
  ILoginRequestPayload,
  ILoginResponsePayload,
  ITransferRequestPayload,
  TAccountId,
  TAllCurrenciesResponsePayload,
  ICurrenciesResponsePayload,
  TCurrencyBuyResponsePayload,
  TGetAccountResponsePayload,
  TGetAccountsResponsePayload,
  TGetBanksResponsePayload,
  TTransferResponsePayload
} from './apiPayloads';

export type TUrl = string;

interface IResponse<Payload> {
  payload: Payload | null;
  error: string;
}

// LOGIN

export interface ILoginRequestArgs extends ILoginRequestPayload {}
export interface ILoginClientArgs {
  url: TUrl;
  data: ILoginRequestPayload;
}
export type TLoginResponse = IResponse<ILoginResponsePayload>;

// GET ACCOUNT

export interface IGetAccountRequestArgs extends IGetAccountRequestPayload {
  id: TAccountId;
}
export interface IGetAccountClientArgs extends IGetAccountRequestPayload {
  url: TUrl;
  token: TToken;
}
export type TGetAccountResponse = IResponse<TGetAccountResponsePayload>;

// GET ACCOUNTS

export interface IGetAccountsClientArgs extends IGetAccountsRequestPayload {
  url: TUrl;
}
export type TGetAccountsResponse = IResponse<TGetAccountsResponsePayload>;

// POST CREATE ACCOUNT

export interface ICreateAccountRequestArgs extends ICreateAccountRequestPayload {}
export interface ICreateAccountClientArgs extends ICreateAccountRequestPayload {
  url: TUrl;
  token: TToken;
}
export type TCreateAccountResponse = IResponse<ICreateAccountResponsePayload>;

// POST TRANSFER

export interface ITransferRequestArgs {
  data: ITransferRequestPayload;
}

export interface ITransferClientArgs {
  url: TUrl;
  token: TToken;
  data: ITransferRequestPayload;
}

export type TTransferResponse = IResponse<TTransferResponsePayload>;

// GET CURRENCIES

export interface ICurrenciesRequestArgs extends ICurrenciesRequestPayload {}
export interface ICurrenciesClientArgs extends ICurrenciesRequestPayload {
  url: TUrl;
  token: TToken;
}
export type TCurrenciesResponse = IResponse<ICurrenciesResponsePayload>;

// GET ALL CURRENCIES

export interface IAllCurrenciesRequestArgs extends IAllCurrenciesRequestPayload {}
export interface IAllCurrenciesClientArgs extends IAllCurrenciesRequestPayload {
  url: TUrl;
  token: TToken;
}
export type TAllCurrenciesResponse = IResponse<TAllCurrenciesResponsePayload>;

// POST CURRENCIES BUY

export interface ICurrencyBuyRequestArgs {
  data: ICurrencyBuyRequestPayload;
}
export interface ICurrencyBuyClientArgs {
  data: ICurrencyBuyRequestPayload;
  url: TUrl;
  token: TToken;
}
export type TCurrencyBuyResponse = IResponse<TCurrencyBuyResponsePayload>;

// GET BANKS

export interface IGetBanksRequestArgs extends IGetBanksRequestPayload {}
export interface IGetBanksClientArgs extends IGetBanksRequestPayload {
  url: TUrl;
  token: TToken;
}
export type IGetBanksResponse = IResponse<TGetBanksResponsePayload>;

// WEB SOCKET CURRENCY FEED

export type IStreamCurrencyRateResponse = IResponse<ICurrencyFeed>;

export interface IApiStreamCurrencyFeedArgs {
  url: TUrl;
}
