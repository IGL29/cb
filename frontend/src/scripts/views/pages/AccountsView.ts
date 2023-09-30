import { ButtonPresenter } from '~presenters/ButtonPresenter';
import { CardPresenter } from '~presenters/CardPresenter';
import { LoaderPresenter } from '~presenters/LoaderPresenter';
import { SelectPresenter } from '~presenters/SelectPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { TSorting, TTitle } from '~types/accounts';
import { IAccount, INewAccount } from '~types/apiPayloads';
import { IClasses } from '~types/select';
import { View, IAddHandlers, IAddHandlerArgs } from '~types/view';

export class AccountsView extends View implements IAddHandlers<'btn-new-account'> {
  private rootElement: HTMLElement;
  private siteContainerElement1: HTMLElement;
  private siteContainerElement2: HTMLElement;
  private wrapperTitleElement: HTMLElement;
  private titleElement: HTMLElement;
  private cardListElement: HTMLElement;
  private errorElement: HTMLElement | null;

  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = ['pb-[50px]', 'grow', 'flex', 'flex-col'];
  private siteContainer1Classes: IClasses = [
    'pt-[53px]',
    'max-w-[1440px]',
    'px-[50px]',
    'mx-auto',
    'mb-[50px]',
    'w-full',
    'sm:px-[30px]',
    'xs:px-[20px]',
    'xs:pt-[30px]'
  ];
  private siteContainer2Classes: IClasses = [
    'max-w-[1440px]',
    'px-[50px]',
    'mx-auto',
    'relative',
    'w-full',
    'grow',
    'sm:px-[30px]',
    'xs:px-[20px]'
  ];
  private cardListClasses: IClasses = [
    'grid',
    'grid-cols-3',
    'gap-y-[50px]',
    'gap-x-[70px]',
    'lg:grid-cols-2',
    'md:grid-cols-1'
  ];
  private titleClasses: IClasses = [
    'text-[34px]',
    'font-Work-Sans',
    'font-bold',
    'mr-[35px]',
    'lg:mr-0',
    'lg:w-full',
    'lg:text-[25px]',
    'lg:mb-[30px]',
    'sm:w-[initial]',
    'sm:mr-[30px]',
    'xs:mr-0',
    'xs:text-[23px]',
    'xs:mb-[20px]'
  ];
  private wrapperTitleClasses: IClasses = ['flex', 'items-center', 'lg:flex-wrap', 'xs:flex-col'];
  private buttonNewAccountRoot: IClasses = ['ml-auto', 'sm:mb-[15px]', 'xs:w-full'];
  private sortingSelectRootClasses: IClasses = [
    'max-w-[300px]',
    'w-full',
    'sm:max-w-full',
    'sm:mb-[15px]'
  ];

  private sortingSelect: SelectPresenter;
  private loaderPresenter: LoaderPresenter;
  private buttonNewAccount: ButtonPresenter;

  private buttonNewAccounValue: string = 'Создать новый счёт';
  private sortingSelectButtonValue: string = 'Сортировка';
  private titleValue: string = 'Ваши счета';
  private _isLoading: boolean;
  private _isError: boolean;

  private cardsElements: {
    data: {
      account: string;
      balance: number;
      transactions: { amount: number; date: string; from: string; to: string }[];
    };
    element: HTMLElement;
  }[];
  private lastSorting: TSorting;

  constructor() {
    super();
    this.domCreatorService = new DOMCreatorService();
    this.buttonNewAccount = new ButtonPresenter({
      buttonValue: this.buttonNewAccounValue,
      rootClasses: this.buttonNewAccountRoot
    });
    this.sortingSelect = new SelectPresenter({
      buttonValue: this.sortingSelectButtonValue,
      classNamesRoot: this.sortingSelectRootClasses,
      callback: (value) => {
        if (value === 'account' || value === 'balance' || value === 'transaction') {
          const val = <TSorting>value;
          this.doSort(val);
        }
      }
    });

    this.loaderPresenter = new LoaderPresenter();

    this.createElements();
    this.addClasses();
    this.setValues();
    this.combineElements();
    this.addOptionsToSortSelect();
  }

  protected createElements(): void {
    this.rootElement = this.domCreatorService.createElement('div');
    this.siteContainerElement1 = this.domCreatorService.createElement('div');
    this.siteContainerElement2 = this.domCreatorService.createElement('div');
    this.titleElement = this.domCreatorService.createElement('h1');
    this.cardListElement = this.domCreatorService.createElement('ul');
    this.wrapperTitleElement = this.domCreatorService.createElement('div');
  }

  public addOptions(options: Array<{ title: string; value?: string; isActive?: boolean }>): void {
    this.sortingSelect.getView().addOptions(options);
  }

  protected setValues(): void {
    this.titleElement.textContent = this.titleValue;
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses);
    this.siteContainerElement1.classList.add(...this.siteContainer1Classes);
    this.siteContainerElement2.classList.add(...this.siteContainer2Classes);
    this.cardListElement.classList.add(...this.cardListClasses);
    this.titleElement.classList.add(...this.titleClasses);
    this.wrapperTitleElement.classList.add(...this.wrapperTitleClasses);
  }

  protected combineElements(): void {
    this.rootElement.append(this.siteContainerElement1);
    this.rootElement.append(this.siteContainerElement2);
    this.siteContainerElement1.append(this.wrapperTitleElement);
    this.wrapperTitleElement.append(this.titleElement);
    this.wrapperTitleElement.append(this.sortingSelect.render());
    this.wrapperTitleElement.append(this.buttonNewAccount.render());
    this.siteContainerElement2.append(this.loaderPresenter.render());
    this.siteContainerElement2.append(this.cardListElement);
  }

  public addHandlers(args: IAddHandlerArgs<'btn-new-account'>): void {
    if (args.target === 'btn-new-account') {
      this.buttonNewAccount.render().addEventListener(args.type, args.handler);
    }
  }

  public doFillCardList(accounts: Array<IAccount>): void {
    this.cardListElement.innerHTML = '';
    this.cardsElements = [];

    const templateElement = this.domCreatorService.createElement('template');

    accounts.forEach((account: IAccount) => {
      const itemElement = new CardPresenter({
        numberValue: account.account,
        priceValue: account.balance,
        descrValue: account.transactions[account.transactions.length - 1]?.date,
        classNames: ['accounts-list__card', 'account-card']
      }).render();

      this.cardsElements.push({
        data: {
          account: account.account,
          balance: account.balance,
          transactions: [account.transactions[0]]
        },
        element: itemElement
      });
      templateElement.content.appendChild(itemElement);
    });
    this.cardListElement.append(templateElement.content);
  }

  public addOptionsToSortSelect(): void {
    this.sortingSelect.getView().addOptions<TTitle, TSorting>([
      { title: 'По номеру', value: 'account' },
      { title: 'По балансу', value: 'balance' },
      { title: 'По последней транзакции', value: 'transaction' }
    ]);
  }

  public setActiveOptionToSortSelect(value: TSorting): void {
    this.sortingSelect.getView().setActiveOption(value);
  }

  public doSort(sorting: TSorting): void {
    if (this.lastSorting === sorting) {
      return;
    }

    if (!this.cardsElements || !this.cardsElements.length) {
      return;
    }

    let sortFunction: (a: any, b: any) => any;

    if (sorting === 'account') {
      sortFunction = (a, b) => b.data.account - a.data.account;
    }
    if (sorting === 'balance') {
      sortFunction = (a, b) => b.data.balance - a.data.balance;
    }
    if (sorting === 'transaction') {
      sortFunction = (a, b) => {
        if (!a.data.transactions[0]?.date) {
          return 1;
        }
        if (!b.data.transactions[0]?.date) {
          return -1;
        }
        if (new Date(a.date) > new Date(b.date)) {
          return -1;
        }
        if (new Date(a.date) < new Date(b.date)) {
          return 1;
        }
        return 0;
      };
    }
    localStorage.setItem('accounts-sorting', sorting);
    this.lastSorting = sorting;
    this.cardsElements.sort(sortFunction!);
    this.doFillCardList(this.cardsElements.map((item) => item.data));
  }

  private switchVisibleLoader(): void {
    if (this._isLoading) {
      this.loaderPresenter.getView().switchVisibleLoader(true);
      return;
    }
    this.loaderPresenter.getView().switchVisibleLoader(false);
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;

    this.switchVisibleLoader();
  }

  public doAddCardToList(account: INewAccount): void {
    const newCardElement = new CardPresenter({
      numberValue: account.account,
      priceValue: account.balance,
      descrValue: account.transactions[0]?.date,
      classNames: ['accounts-list__card', 'account-card']
    }).render();
    this.cardListElement.appendChild(newCardElement);
    this.cardsElements.push({
      data: {
        account: account.account,
        balance: account.balance,
        transactions: [account.transactions[0]]
      },
      element: newCardElement
    });
  }

  public hideError(): void {
    if (!this.errorElement) {
      return;
    }
    this.errorElement.remove();
    this.errorElement = null;
  }

  public showError(errorMessage: string): void {
    if (!this.errorElement) {
      this.errorElement = this.domCreatorService.createElement('p');
    }
    this.errorElement.textContent = errorMessage;
    this.siteContainerElement2.append(this.errorElement);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
