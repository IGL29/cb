import { transformAddStringFilter } from 'src/scripts/filters/transformAddStringFilter';
import { transformCurrencyFilter } from 'src/scripts/filters/transformCurrencyFilter';
import { transformDateFilter } from 'src/scripts/filters/transformDateFilter';
import { LoaderPresenter } from '~presenters/LoaderPresenter';
import { TablePresenter } from '~presenters/TablePresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { IHistoryTransferArgs, IFillHistoryDataArgs } from '~types/historyTransfer';

import { IClasses } from '~types/select';
import { View } from '~types/view';

export class HistoryTransferView extends View {
  private readonly rootElement: HTMLElement;
  private readonly titleElement: HTMLElement;

  private readonly tablePresenter: TablePresenter;
  private readonly loaderPresenter: LoaderPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private containerClasses = [
    'pt-[25px]',
    'pb-[66px]',
    'px-[50px]',
    'bg-[#F3F4F6]',
    'rounded-[50px]',
    'relative',
    'sm:px-[30px]',
    'xs:px-[20px]'
  ];
  private titleClasses = [
    'font-Work-Sans',
    'font-bold',
    'text-[20px]',
    'mb-[25px]',
    'xs:text-center',
    'xs:mb-[20px]'
  ];
  private headerValues = ['Счёт отправителя', 'Счёт получателя', 'Сумма', 'Дата'];
  private titleValue: string = 'История переводов';
  private _isLoading = false;

  constructor({ loadMoreCallback }: IHistoryTransferArgs = {}) {
    super();
    this.tablePresenter = new TablePresenter({ headerValues: this.headerValues, loadMoreCallback });
    this.loaderPresenter = new LoaderPresenter();
    this.domCreatorService = new DOMCreatorService();

    this.createElements();
    this.addClasses();
    this.setValues();
    this.combineElements();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.titleElement) = this.domCreatorService.createElement('h2');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.containerClasses);
    this.titleElement.classList.add(...this.titleClasses);
  }

  protected setValues(): void {
    this.titleElement.textContent = this.titleValue;
  }

  protected combineElements(): void {
    this.rootElement.append(this.titleElement);
    this.rootElement.append(this.loaderPresenter.render());
    this.rootElement.append(this.tablePresenter.render());
  }

  public fillData(args: IFillHistoryDataArgs): void {
    let dataForTable: string[][] = [];
    const optionsForTable: (null | string)[][] = [];

    if (!args.values.length) {
      dataForTable = [['История пуста']];
      this.tablePresenter.getView().fillData({ values: dataForTable, options: optionsForTable });
      return;
    }

    args.values.forEach((transaction) => {
      const isTransactionFromCurrentAcc = transaction.from === args.currentAccount;
      const characterBeforeAmount = isTransactionFromCurrentAcc ? '- ' : '+ ';

      dataForTable.push([
        transaction.from,
        transaction.to,
        transformAddStringFilter(
          transformCurrencyFilter(transaction.amount),
          characterBeforeAmount,
          'begin'
        ),
        transformDateFilter(transaction.date)
      ]);

      if (isTransactionFromCurrentAcc) {
        optionsForTable.push([null, null, 'down', null]);
      } else {
        optionsForTable.push([null, null, 'up', null]);
      }
    });
    this.tablePresenter.getView().fillData({
      values: dataForTable,
      options: optionsForTable,
      renderingMethod: args.renderingMethod
    });
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;

    this.switchVisibleLoader();
  }

  public setRootClasses(classes: IClasses): void {
    this.rootElement.classList.add(...classes);
  }

  public switchVisibleLoader(): void {
    if (this._isLoading) {
      this.loaderPresenter.getView().switchVisibleLoader(true);
    }
    this.loaderPresenter.getView().switchVisibleLoader(false);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
