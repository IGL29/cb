import { IApiClient } from '~types/apiClient';
import {
  IAllCurrenciesClientArgs,
  ICreateAccountClientArgs,
  ICurrenciesClientArgs,
  ICurrencyBuyClientArgs,
  IGetAccountClientArgs,
  IGetAccountsClientArgs,
  IGetBanksClientArgs,
  ILoginClientArgs,
  ITransferClientArgs
} from '~types/requests';

export class ApiFetchService implements IApiClient {
  private static instance: ApiFetchService;

  constructor() {
    if (ApiFetchService.instance) {
      return ApiFetchService.instance;
    }
    ApiFetchService.instance = this;
  }

  public login({ url, data }: ILoginClientArgs): Promise<Response> {
    return fetch(`${url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    });
  }

  public getAccount({ url, id, token }: IGetAccountClientArgs): Promise<Response> {
    return fetch(`${url}/account/${id}`, {
      headers: {
        Authorization: `Basic ${token}`
      }
    });
  }

  public getAccounts({ url, token }: IGetAccountsClientArgs): Promise<Response> {
    return fetch(`${url}/accounts`, {
      headers: {
        Authorization: `Basic ${token}`
      }
    });
  }

  public postCreateAccount({ url, token }: ICreateAccountClientArgs): Promise<Response> {
    return fetch(`${url}/create-account`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`
      }
    });
  }

  public getBanks({ url, token }: IGetBanksClientArgs): Promise<Response> {
    return fetch(`${url}/banks`, {
      headers: {
        Authorization: `Basic ${token}`
      }
    });
  }

  public getCurrencies({ url, token }: ICurrenciesClientArgs): Promise<Response> {
    return fetch(`${url}/currencies`, {
      headers: {
        Authorization: `Basic ${token}`
      }
    });
  }

  public getAllCurrencies({ url, token }: IAllCurrenciesClientArgs): Promise<Response> {
    return fetch(`${url}/all-currencies`, {
      headers: {
        Authorization: `Basic ${token}`
      }
    });
  }

  public postCurrencyBuy({ url, token, data }: ICurrencyBuyClientArgs): Promise<Response> {
    return fetch(`${url}/currency-buy`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    });
  }

  public postTransfer({ url, token, data }: ITransferClientArgs): Promise<Response> {
    return fetch(`${url}/transfer-funds`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${token}`,
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    });
  }
}
