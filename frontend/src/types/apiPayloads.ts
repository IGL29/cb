import { TToken } from './token';

export interface ILoginRequestPayload {
  login: string;
  password: string;
}
export interface ILoginResponsePayload {
  token: TToken;
}

// GET ACCOUNTS

export interface IGetAccountsRequestPayload {
  token: TToken;
}
export type TGetAccountsResponsePayload = IAccount[];

// GET ACCOUNT

export interface IGetAccountRequestPayload {
  id: TAccountId;
}
export type TGetAccountResponsePayload = IAccount;
export interface IAccount {
  account: TAccountId;
  balance: number;
  transactions: TTransactions;
}

export type TAccountId = string;
export type TTransactions = ITransaction[];
export interface ITransaction {
  amount: number;
  date: string;
  from: string;
  to: string;
}

// POST TRANSFER

export interface ITransferRequestPayload {
  from: string;
  to: string;
  amount: string;
}
export type TTransferResponsePayload = IAccount;

// CREATE ACCOUNT

export interface ICreateAccountRequestPayload {
  token: TToken;
}
export interface ICreateAccountResponsePayload extends INewAccount {}
export interface INewAccount extends IAccount {
  mine: boolean;
}

// GET ALL CURRENCIES

export type TCurrency =
  | 'RUB'
  | 'AUD'
  | 'BTC'
  | 'BYR'
  | 'CAD'
  | 'CHF'
  | 'CNH'
  | 'ETH'
  | 'EUR'
  | 'GBP'
  | 'HKD'
  | 'JPY'
  | 'NZD'
  | 'UAH'
  | 'USD';
export type TCurrencies = TCurrency[];

export interface IAllCurrenciesRequestPayload {}
export type TAllCurrenciesResponsePayload = TCurrencies;

// GET CURRENCIES

export interface ICurrenciesRequestPayload {}
export type ICurrenciesResponsePayload = CurrencyData;
export type CurrencyData = {
  [K in TCurrency]: {
    amount: number;
    code: TCurrency;
  };
};

// POST CURRENCIES BUY

export interface ICurrencyBuyRequestPayload {
  from: string;
  to: string;
  amount: string;
}
export type TCurrencyBuyResponsePayload = CurrencyData;

// GET BANKS

export interface IGetBanksRequestPayload {}
export type TGetBanksResponsePayload = ICoordinate[];
export interface ICoordinate {
  lat: number;
  lon: number;
}

// WEBSOCKET CURRENCY FEED

export interface ICurrencyFeed {
  type: string;
  from: TCurrency;
  to: TCurrency;
  rate: number;
  change: number;
}
