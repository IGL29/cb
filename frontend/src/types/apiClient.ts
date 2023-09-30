import {
  ILoginClientArgs,
  IGetAccountClientArgs,
  IGetAccountsClientArgs,
  ICreateAccountClientArgs,
  IGetBanksClientArgs,
  ICurrenciesClientArgs,
  IAllCurrenciesClientArgs,
  ICurrencyBuyClientArgs,
  ITransferClientArgs
} from './requests';

export interface IApiClient {
  login: (args: ILoginClientArgs) => Promise<Response>;
  getAccount: (args: IGetAccountClientArgs) => Promise<Response>;
  getAccounts: (args: IGetAccountsClientArgs) => Promise<Response>;
  postCreateAccount: (args: ICreateAccountClientArgs) => Promise<Response>;
  getBanks: (args: IGetBanksClientArgs) => Promise<Response>;
  getCurrencies: (args: ICurrenciesClientArgs) => Promise<Response>;
  getAllCurrencies: (args: IAllCurrenciesClientArgs) => Promise<Response>;
  postCurrencyBuy: (args: ICurrencyBuyClientArgs) => Promise<Response>;
  postTransfer: (args: ITransferClientArgs) => Promise<Response>;
}
