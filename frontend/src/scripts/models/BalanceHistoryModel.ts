import { AccountService } from '~services/AccountService';

export class BalanceHistoryModel {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  public getAccount() {
    return this.accountService.getAccount();
  }

  public getTransactions(count?: number) {
    return this.accountService.getLoadedTransactions(count);
  }

  public getMoreTransactions(count: number) {
    return this.accountService.getMoreTransactions(count);
  }

  public getCurrentAccount() {
    return this.accountService.getLoadedNumberAccount();
  }
}
