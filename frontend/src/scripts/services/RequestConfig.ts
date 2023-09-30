import { IApiClient } from '~types/apiClient';
import { IApiWebSocket } from '~types/apiWebSocket';
import { IRequestsConfigArgs } from '~types/requestConfig';
import { TUrl } from '~types/requests';

export class RequestConfig {
  private _apiClent: IApiClient;
  private _apiWebSocket: IApiWebSocket;
  private _url: TUrl;
  private _protocolRest: string;
  private _protocolWS: string;

  constructor({
    apiClient,
    apiWebSocket,
    url,
    protocolRest,
    protocolWS = 'ws'
  }: IRequestsConfigArgs) {
    this._apiClent = apiClient;
    this._apiWebSocket = apiWebSocket;
    this._url = url;
    this._protocolRest = protocolRest;
    this._protocolWS = protocolWS;
  }

  get apiClient(): IApiClient {
    return this._apiClent;
  }

  get apiWebSocket(): IApiWebSocket {
    return this._apiWebSocket;
  }

  get url(): TUrl {
    return this._url;
  }

  get protocolRest(): string {
    return this._protocolRest;
  }

  get protocolWS(): string {
    return this._protocolWS;
  }

  get restURL(): string {
    return `${this._protocolRest}://${this.url}`;
  }

  get webSocketURL(): string {
    return `${this._protocolWS}://${this.url}`;
  }
}
