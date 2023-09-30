import {
  ICurrencyBuyRequestArgs,
  IGetAccountRequestArgs,
  IGetBanksResponse,
  ILoginRequestArgs,
  ITransferRequestArgs,
  TAllCurrenciesResponse,
  TCreateAccountResponse,
  TCurrenciesResponse,
  TCurrencyBuyResponse,
  TGetAccountResponse,
  TGetAccountsResponse,
  TLoginResponse,
  TTransferResponse
} from '~types/requests';
import { TToken } from '~types/token';
import { RequestConfig } from './RequestConfig';

export class Requests {
  private static _instance: Requests;
  private _config: RequestConfig;
  private _token: TToken;

  constructor(config?: RequestConfig) {
    if (Requests._instance) {
      const instance = Requests._instance;
      Requests._instance.onInit.call(instance);
      return Requests._instance;
    }
    if (!config) {
      throw new Error('Config not received');
    }
    Requests._instance = this;
    this._config = config;
  }

  private onInit() {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
    }
  }

  public set token(value: TToken) {
    this._token = value;
  }

  public login(data: ILoginRequestArgs): Promise<TLoginResponse> {
    return this._config.apiClient
      .login({ url: this._config.restURL, data })
      .then((response) => response.json());
  }

  public getAccounts(): Promise<TGetAccountsResponse> {
    return this._config.apiClient
      .getAccounts({
        url: this._config.restURL,
        token: this._token
      })
      .then((data) => data.json());
  }

  public getAccount({ id }: IGetAccountRequestArgs): Promise<TGetAccountResponse> {
    return this._config.apiClient
      .getAccount({
        url: this._config.restURL,
        token: this._token,
        id
      })
      .then((response) => response.json());
  }

  public postCreateAccount(): Promise<TCreateAccountResponse> {
    return this._config.apiClient
      .postCreateAccount({
        url: this._config.restURL,
        token: this._token
      })
      .then((response) => response.json());
  }

  public postTransfer({ data }: ITransferRequestArgs): Promise<TTransferResponse> {
    return this._config.apiClient
      .postTransfer({
        url: this._config.restURL,
        token: this._token,
        data
      })
      .then((response) => response.json());
  }

  public getAllCurrencies(): Promise<TAllCurrenciesResponse> {
    return this._config.apiClient
      .getAllCurrencies({
        url: this._config.restURL,
        token: this._token
      })
      .then((response) => response.json());
  }

  public getCurrencies(): Promise<TCurrenciesResponse> {
    return this._config.apiClient
      .getCurrencies({
        url: this._config.restURL,
        token: this._token
      })
      .then((response) => response.json());
  }

  public postCurrencyBuy({ data }: ICurrencyBuyRequestArgs): Promise<TCurrencyBuyResponse> {
    return this._config.apiClient
      .postCurrencyBuy({
        url: this._config.restURL,
        token: this._token,
        data
      })
      .then((response) => response.json());
  }

  public getBanks(): Promise<IGetBanksResponse> {
    return this._config.apiClient
      .getBanks({
        url: this._config.restURL,
        token: this._token
      })
      .then((response) => response.json());
  }

  public streamCurrencyRate(): WebSocket {
    return this._config.apiWebSocket.streamCurrencyRate({
      url: this._config.webSocketURL
    });
  }
}
