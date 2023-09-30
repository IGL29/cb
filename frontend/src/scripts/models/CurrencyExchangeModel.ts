import { Requests } from '~services/Requests';
import { ICurrencyBuyRequestPayload } from '~types/apiPayloads';
import { TErrors, TValidationError } from '~types/currencyExchange';
import {
  ICurrencyBuyRequestArgs,
  TAllCurrenciesResponse,
  TCurrencyBuyResponse
} from '~types/requests';

export class CurrencyExchangeModel {
  private requestsService: Requests;

  constructor() {
    this.requestsService = new Requests();
  }

  public getAllCurrencies(): Promise<TAllCurrenciesResponse> {
    return this.requestsService
      .getAllCurrencies()
      .then((data) => Promise.resolve(data))
      .catch((err: Error) => Promise.reject(err));
  }

  private postCurrencyBuy(data: ICurrencyBuyRequestArgs): Promise<TCurrencyBuyResponse> {
    return this.requestsService
      .postCurrencyBuy(data)
      .then((payload) => {
        if (!payload.error) {
          return Promise.resolve(payload);
        }
        return Promise.reject(payload);
      })
      .catch((err: Error) => Promise.reject(err));
  }

  public handlerSubmitCurrencyBuy(data: ICurrencyBuyRequestPayload): Promise<TCurrencyBuyResponse> {
    const checkingResult = this.checkCurrencyBuyData(data);

    if (!checkingResult.isValid) {
      return Promise.reject({ errors: checkingResult.errors });
    }

    return this.postCurrencyBuy({ data });
  }

  private checkCurrencyBuyData(data: ICurrencyBuyRequestPayload): TValidationError {
    const errors: TErrors = { from: [], to: [], amount: [] };
    let isValid = true;

    if (!data.from) {
      errors.from.push('Необходимо выбрать валютный счет списания');
    }
    if (!data.to) {
      errors.to.push('Необходимо выбрать валютный счет зачисления');
    }
    if (!data.amount) {
      errors.amount.push('Необходимо указать сумму');
    }
    if (data.amount?.match(/\d+/)?.[0] !== data.amount) {
      errors.amount.push('Сумма может содержать только цифры и не может быть отрицательной');
    }
    if (data.from === data.to) {
      errors.from.push('Невозможно совершить перевод на один и тот же счет');
      errors.to.push('Невозможно совершить перевод на один и тот же счет');
    }
    if (errors.amount.length || errors.from.length || errors.to.length) {
      isValid = false;
    }
    return { isValid, errors };
  }
}
