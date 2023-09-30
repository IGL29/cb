import { BalanceHistoryModel } from '~models/BalanceHistoryModel';
import { NotifyPresenter } from '~presenters/NotifyPresenter';
import { GraphService } from '~services/GraphService';
import { IPresenter } from '~types/presenter';
import { BalanceHistoryView } from '~views/pages/BalanceHistoryView';

export class BalanceHistoryPresenter implements IPresenter<BalanceHistoryView> {
  private view: BalanceHistoryView;
  private model: BalanceHistoryModel;

  private graphService: GraphService;
  private notifyPresenter: NotifyPresenter;

  private isAccountLoading: boolean = false;
  private isCanLoaded: boolean = true;

  constructor() {
    this.view = new BalanceHistoryView({ loadMoreCallback: this.loadMoreHistory.bind(this) });
    this.model = new BalanceHistoryModel();
    this.graphService = new GraphService();
    this.notifyPresenter = new NotifyPresenter();

    this.getAccount();
  }

  public getAccount() {
    this.view.transferBlockLoading = true;
    this.view.graphDynamicOfBalanceLoading = true;
    this.view.graphTransactionRationLoading = true;
    this.isAccountLoading = true;

    this.model
      .getAccount()
      .then((data) => {
        if (!data || !data.payload) {
          return;
        }
        this.view.setAccountNumberTitle(data.payload.account);
        this.view.setBalanceValue(String(data.payload.balance));
        this.view.fillDataToTable({
          values: this.model.getTransactions(5),
          currentAccount: data.payload.account
        });
        this.view.fillBalanceDynamic(
          this.graphService.processDataDynamicBalance(
            data.payload.account,
            data.payload.balance,
            this.model.getTransactions(),
            12
          )
        );
        this.view.fillTransactionsRate(
          this.graphService.processDataTransactionsRate(
            data.payload.account,
            this.model.getTransactions(),
            12
          )
        );
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
        this.view.transferBlockLoading = false;
        this.view.graphDynamicOfBalanceLoading = false;
        this.view.graphTransactionRationLoading = false;
        this.isAccountLoading = false;
      });
  }

  private loadMoreHistory(): void {
    if (this.isAccountLoading || !this.isCanLoaded) {
      return;
    }
    const moreTransactions = this.model.getMoreTransactions(5);

    if (!moreTransactions) {
      this.isCanLoaded = false;
      return;
    }
    this.view.fillDataToTable({
      values: moreTransactions,
      currentAccount: this.model.getCurrentAccount(),
      renderingMethod: 'append'
    });
  }

  public getView(): BalanceHistoryView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
