import { IApiClient } from './apiClient';
import { IApiWebSocket } from './apiWebSocket';
import { TUrl } from './requests';

export interface IRequestsConfigArgs {
  apiClient: IApiClient;
  apiWebSocket: IApiWebSocket;
  url: TUrl;
  protocolRest: string;
  protocolWS: string;
}
