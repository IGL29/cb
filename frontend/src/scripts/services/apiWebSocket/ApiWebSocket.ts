import { IApiStreamCurrencyFeedArgs } from '~types/requests';

export class ApiWebSocket {
  private static instance: ApiWebSocket;

  constructor() {
    if (ApiWebSocket.instance) {
      return ApiWebSocket.instance;
    }
    ApiWebSocket.instance = this;
  }

  public streamCurrencyRate({ url }: IApiStreamCurrencyFeedArgs): WebSocket {
    return new WebSocket(`${url}/currency-feed`);
  }
}
