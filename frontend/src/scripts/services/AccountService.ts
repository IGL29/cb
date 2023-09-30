import { Requests } from '~services/Requests';
import { ITransaction, TAccountId, TTransactions } from '~types/apiPayloads';
import { RouterPresenter } from '../presenters/RouterPresenter';

export class AccountService {
  static _instance: AccountService;
  private routerPresenter: RouterPresenter;
  private requestsService: Requests;
  private allLoadedTransactions: TTransactions;
  private countPassedTransactions: number = 0;
  private loadedAccountNumber: TAccountId;

  constructor() {
    if (AccountService._instance) {
      return AccountService._instance;
    }
    AccountService._instance = this;
    this.routerPresenter = new RouterPresenter();
    this.requestsService = new Requests();
  }

  public getAccount() {
    const accountId = this.routerPresenter.getParamsURL();

    if (accountId) {
      return this.requestsService
        .getAccount({ id: accountId })
        .then((data) => {
          if (data.error) {
            return Promise.reject(new Error(data.error));
          }
          if (!data.payload) {
            return null;
          }
          this.loadedAccountNumber = data.payload.account;
          this.allLoadedTransactions = data.payload.transactions.sort(
            (a: ITransaction, b: ITransaction) => {
              if (new Date(a.date) > new Date(b.date)) {
                return -1;
              }
              if (new Date(a.date) < new Date(b.date)) {
                return 1;
              }
              return 0;
            }
          );
          return Promise.resolve(data);
        })
        .catch((err: Error) => Promise.reject(err));
    }
    return Promise.reject('accountId is not found');
  }

  public getLoadedTransactions(count?: number): TTransactions {
    if (!count) {
      return this.allLoadedTransactions;
    }
    const result = this.allLoadedTransactions.slice(0, count);
    this.countPassedTransactions = count;
    return result;
  }

  public setLoadedTransactions(data: TTransactions): void {
    this.allLoadedTransactions = data;
  }

  public getMoreTransactions(count: number): TTransactions | null {
    if (this.countPassedTransactions >= this.allLoadedTransactions.length) {
      return null;
    }
    const expectedCountPassedTransactions = this.countPassedTransactions + count;
    const result = this.allLoadedTransactions.slice(
      this.countPassedTransactions,
      expectedCountPassedTransactions
    );
    this.countPassedTransactions = expectedCountPassedTransactions;
    return result;
  }

  public getLoadedNumberAccount(): TAccountId {
    return this.loadedAccountNumber;
  }
}
