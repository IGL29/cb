import { Requests } from '~services/Requests';
import { TCurrenciesResponse } from '~types/requests';

export class CurrencyConversionModel {
  private requestsService: Requests;
  private streamCurrencyRate: WebSocket;

  constructor() {
    this.requestsService = new Requests();
  }

  public getCurrencies(): Promise<TCurrenciesResponse> {
    return this.requestsService
      .getCurrencies()
      .then((data) => Promise.resolve(data))
      .catch((err) => Promise.reject(err));
  }

  public getStreamCurrencyRate(): WebSocket {
    if (this.streamCurrencyRate) {
      return this.streamCurrencyRate;
    }
    this.streamCurrencyRate = this.requestsService.streamCurrencyRate();
    return this.streamCurrencyRate;
  }

  public closeStreamCurrencyRate(): void {
    if (!this.streamCurrencyRate) {
      return;
    }
    this.streamCurrencyRate.close();
  }
}
