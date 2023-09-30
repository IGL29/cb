import { AccountDetailModel } from '~models/AccountDetailModel';
import { NotifyPresenter } from '~presenters/NotifyPresenter';
import { GraphService } from '~services/GraphService';
import { TAccountId, TTransactions } from '~types/apiPayloads';
import { IPresenter } from '~types/presenter';
import { TGetAccountResponse } from '~types/requests';
import { AccountDetailView } from '~views/pages/AccountDetailView';

export class AccountDetailPresenter implements IPresenter<AccountDetailView> {
  private view: AccountDetailView;
  private model: AccountDetailModel;
  private graphService: GraphService;
  private notifyPresenter: NotifyPresenter;

  constructor() {
    this.view = new AccountDetailView(this.updateAccountDataToView.bind(this));
    this.model = new AccountDetailModel();
    this.graphService = new GraphService();
    this.notifyPresenter = new NotifyPresenter();
    this.getAccount();
  }

  private setAccountDataToView(data: TGetAccountResponse, prependToTable?: boolean) {
    if (!data.payload) {
      return;
    }
    this.view.setAccountValue(data.payload.account);
    this.view.setBalanceValue(String(data.payload.balance));
    if (prependToTable) {
      this.view.fillDataToTable({
        values: data.payload.transactions.slice(-1),
        currentAccount: data.payload.account,
        renderingMethod: 'prepend'
      });
    } else {
      this.view.fillDataToTable({
        values: this.model.getTransactions(10),
        currentAccount: data.payload.account
      });
    }

    this.processDataDynamicBalance(
      data.payload.account,
      data.payload.balance,
      this.model.getTransactions()
    );
  }

  private updateAccountDataToView(data: TGetAccountResponse) {
    this.setAccountDataToView(data, true);
  }

  private getAccount() {
    this.view.historyTransferLoading = true;
    this.view.graphTransferLoading = true;
    this.view.transferBlockLoading = true;

    this.model
      .getAccount()
      .then((data) => {
        if (!data) {
          return;
        }
        this.setAccountDataToView(data);
      })
      .catch((err: Error) => {
        this.view.setAccountNumberTitle('Произошла ошибка при запросе');
        this.notifyPresenter.notify({
          title: 'Ошибка при запросе',
          description:
            'Произошла неизвестная ошибка при запросе. Попробуйте обновить страницу и повторить снова.'
        });
        throw err;
      })
      .finally(() => {
        this.view.historyTransferLoading = false;
        this.view.graphTransferLoading = false;
        this.view.transferBlockLoading = false;
      });
  }

  private processDataDynamicBalance(
    account: TAccountId,
    balance: number,
    transactions: TTransactions
  ) {
    this.view.fillDynamicBalanceGraph(
      this.graphService.processDataDynamicBalance(account, balance, transactions, 6)
    );
  }

  public getView(): AccountDetailView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
