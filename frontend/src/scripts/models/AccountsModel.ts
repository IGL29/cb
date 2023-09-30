import { Requests } from '~services/Requests';

export class AccountsModel {
  private requestsService: Requests;

  constructor() {
    this.requestsService = new Requests();
  }

  public getAccounts() {
    return this.requestsService
      .getAccounts()
      .then((data) => {
        if (data.error) {
          return Promise.reject(data);
        }
        return Promise.resolve(data);
      })
      .catch((err: Error) => Promise.reject(err));
  }

  public postCreateAccount() {
    return this.requestsService
      .postCreateAccount()
      .then((data) => {
        if (data.error) {
          return Promise.reject(data);
        }
        return Promise.resolve(data);
      })
      .catch((err: Error) => Promise.reject(err));
  }
}
