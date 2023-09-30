import { Requests } from '~services/Requests';
import { IGetBanksResponse } from '~types/requests';

export class AtmsMapModel {
  private requestsService: Requests;

  constructor() {
    this.requestsService = new Requests();
  }

  public getBanks(): Promise<IGetBanksResponse> {
    return this.requestsService
      .getBanks()
      .then((data) => {
        if (data.error) {
          return Promise.reject(new Error(data.error));
        }
        return Promise.resolve(data);
      })
      .catch((err: Error) => Promise.reject(err));
  }
}
