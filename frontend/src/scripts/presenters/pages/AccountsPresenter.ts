import { AccountsModel } from '~models/AccountsModel';
import { NotifyPresenter } from '~presenters/NotifyPresenter';
import { TSorting } from '~types/accounts';
import { IPresenter } from '~types/presenter';
import { AccountsView } from '~views/pages/AccountsView';

export class AccountsPresenter implements IPresenter<AccountsView> {
  static instance: AccountsPresenter;
  private view: AccountsView;
  private model: AccountsModel;
  private notifyPresenter: NotifyPresenter;

  constructor() {
    if (AccountsPresenter.instance) {
      AccountsPresenter.instance.onInit.call(AccountsPresenter.instance);
      return AccountsPresenter.instance;
    }
    AccountsPresenter.instance = this;

    this.view = new AccountsView();
    this.model = new AccountsModel();
    this.notifyPresenter = new NotifyPresenter();

    this.addHandlers();
    this.onInit();
  }

  public onInit() {
    this.getAccounts();
  }

  private async getAccounts() {
    this.view.isLoading = true;
    this.view.hideError();

    await this.model
      .getAccounts()
      .then((data) => {
        if (!data.payload) {
          return;
        }
        this.view.doFillCardList(data.payload);
        this.setDefaultSorting();
      })
      .catch(() => {
        this.view.showError('Произошла ошибка при запросе');
        this.notifyPresenter.notify({
          title: 'Ошибка при запросе',
          description:
            'Произошла неизвестная ошибка при запросе. Попробуйте обновить страницу и повторить снова.'
        });
      })
      .finally(() => {
        this.view.isLoading = false;
      });
  }

  private addHandlers() {
    this.view.addHandlers({
      type: 'click',
      target: 'btn-new-account',
      handler: () => {
        this.createAccount();
      }
    });
  }

  private createAccount() {
    this.view.isLoading = true;
    this.view.hideError();

    this.model
      .postCreateAccount()
      .then((data) => {
        if (data.payload) {
          this.view.doAddCardToList(data.payload);
        }
      })
      .catch(() => {
        this.view.showError('Произошла ошибка при запросе');
        this.notifyPresenter.notify({
          title: 'Ошибка при запросе',
          description:
            'Произошла неизвестная ошибка при запросе. Попробуйте обновить страницу и повторить снова.'
        });
      })
      .finally(() => {
        this.view.isLoading = false;
      });
  }

  private setDefaultSorting() {
    const sortingValue = localStorage.getItem('accounts-sorting');
    if (sortingValue) {
      this.view.setActiveOptionToSortSelect(sortingValue as TSorting);
    }
  }

  public getView(): AccountsView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
