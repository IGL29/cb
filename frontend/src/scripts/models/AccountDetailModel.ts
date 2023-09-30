import { AccountService } from '~services/AccountService';

export class AccountDetailModel {
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
    return this.accountService.getLoadedTransactions(count);
  }
}
