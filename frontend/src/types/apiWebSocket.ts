import { IApiStreamCurrencyFeedArgs } from './requests';

export interface IApiWebSocket {
  streamCurrencyRate: (args: IApiStreamCurrencyFeedArgs) => WebSocket;
}
