import { CurrenciesTablePresenter } from '~presenters/CurrenciesTablePresenter';
import { CurrencyExchangePresenter } from '~presenters/CurrencyExchangePresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { DragAndDropService } from '~services/DragAndDropService';
import { ICallbackPassCarrencyData } from '~types/currencyExchange';
import { IFillDataArgs } from '~types/horizontalTable';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class CurrencyConversionView extends View {
  private rootElement: HTMLElement;
  private siteContainerElement: HTMLElement;
  private titleElement: HTMLElement;
  private titleContainer: HTMLElement;
  private firstColumnElement: HTMLElement;
  private secondColumnElement: HTMLElement;
  private draggableAccountCurrencies: HTMLElement;
  private draggableCurrencyExchange: HTMLElement;

  private currencyExchangePresenter: CurrencyExchangePresenter;
  private accountCurrenciesTablePresenter: CurrenciesTablePresenter;
  private currencyRatePresenter: CurrenciesTablePresenter;
  private dragAndDropService: DragAndDropService;
  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = ['grow', 'flex', 'flex-col'];
  private titleContainerClasses: IClasses = [
    'w-full',
    'max-w-[1440px]',
    'ml-auto',
    'mr-auto',
    'mb-[30px]',
    'pt-[53px]',
    'px-[50px]',
    'sm:px-[30px]',
    'xs:px-[20px]',
    'xs:pt-[30px]',
    'xs:mb-[20px]'
  ];
  private siteContainerClass: IClasses = [
    'pb-[50px]',
    'max-w-[1440px]',
    'justify-between',
    'px-[50px]',
    'mx-auto',
    'w-full',
    'grow',
    'flex',
    'md:flex-col',
    'sm:px-[30px]',
    'xs:px-[20px]'
  ];
  private titleClasses = [
    'text-[34px]',
    'font-Work-Sans',
    'font-bold',
    'mr-[35px]',
    'lg:mr-0',
    'lg:w-full',
    'lg:text-[25px]',
    'lg:mb-[15px]',
    'sm:w-[initial]',
    'sm:mr-[30px]',
    'xs:mr-0',
    'xs:text-[23px]'
  ];
  private firstColumnClasses: IClasses = [
    'basis-[50%]',
    'flex',
    'flex-col',
    'mr-[49px]',
    'md:mr-0',
    'md:mb-[44px]',
    'xs:mb-[40px]'
  ];
  private secondColumnClasses: IClasses = ['h-full', 'basis-[50%]'];
  private currencyExchangeClasses: IClasses = ['mt-auto'];
  private accountCurrenciesTableClasses: IClasses = [
    'grow',
    'h-[650px]',
    'overflow-hidden',
    'flex',
    'flex-col',
    'xs:h-[500px]'
  ];
  private accountCurrencieWrapperClasses: IClasses = ['overflow-auto'];
  private currencyRateClasses: IClasses = [
    'min-h-full',
    'bg-[#E5E5E5]',
    'flex-col',
    'flex',
    'overflow-hidden',
    'h-[975px]',
    'xs:h-[500px]'
  ];
  private currencyRateTableClasses: IClasses = ['flex-[1_1_100%]', 'overflow-auto', 'pr-[10px]'];

  private titleValue: string = 'Валютный обмен';
  private accountCurrenciesTitle: string = 'Ваши валюты';
  private currencyRateTitle: string = 'Изменение курсов в реальном времени';

  constructor({
    passCallbackToCurrencyExchange
  }: {
    passCallbackToCurrencyExchange?: ICallbackPassCarrencyData;
  }) {
    super();
    this.currencyExchangePresenter = new CurrencyExchangePresenter({
      classNamesRoot: this.currencyExchangeClasses,
      callBackPassExchangeData: passCallbackToCurrencyExchange
    });
    this.accountCurrenciesTablePresenter = new CurrenciesTablePresenter({
      title: this.accountCurrenciesTitle,
      classNamesRoot: this.accountCurrenciesTableClasses,
      classNamesTable: this.accountCurrencieWrapperClasses
    });
    this.currencyRatePresenter = new CurrenciesTablePresenter({
      title: this.currencyRateTitle,
      classNamesRoot: this.currencyRateClasses,
      classNamesTable: this.currencyRateTableClasses
    });
    this.dragAndDropService = new DragAndDropService();
    this.domCreatorService = new DOMCreatorService();

    this.createElements();
    this.addClasses();
    this.makeDraggable();
    this.combineElements();
    this.setValues();
  }

  protected createElements(): void {
    this.rootElement = this.domCreatorService.createElement('div');
    this.siteContainerElement = this.domCreatorService.createElement('div');
    this.firstColumnElement = this.domCreatorService.createElement('div');
    this.secondColumnElement = this.domCreatorService.createElement('div');
    this.titleElement = this.domCreatorService.createElement('h1');
    this.titleContainer = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses);
    this.siteContainerElement.classList.add(...this.siteContainerClass);
    this.firstColumnElement.classList.add(...this.firstColumnClasses);
    this.secondColumnElement.classList.add(...this.secondColumnClasses);
    this.titleElement.classList.add(...this.titleClasses);
    this.titleContainer.classList.add(...this.titleContainerClasses);
  }

  protected combineElements(): void {
    this.firstColumnElement.append(this.draggableAccountCurrencies, this.draggableCurrencyExchange);
    this.secondColumnElement.append(this.currencyRatePresenter.render());
    this.siteContainerElement.append(
      this.titleElement,
      this.firstColumnElement,
      this.secondColumnElement
    );
    this.titleContainer.append(this.titleElement);
    this.rootElement.append(this.titleContainer, this.siteContainerElement);
  }

  private makeDraggable(): void {
    this.draggableAccountCurrencies = this.dragAndDropService.makeDraggable(
      this.accountCurrenciesTablePresenter.render(),
      'inFirstColumn'
    );
    this.draggableCurrencyExchange = this.dragAndDropService.makeDraggable(
      this.currencyExchangePresenter.render(),
      'inFirstColumn'
    );
    this.draggableAccountCurrencies.classList.add('mb-[44px]', 'xs:mb-[40px]');
  }

  protected setValues(): void {
    this.titleElement.textContent = this.titleValue;
  }

  public fillAccountCurrenciesTable(args: IFillDataArgs): void {
    this.accountCurrenciesTablePresenter.getView().fillData(args);
  }

  set isLoadingCurrencyRate(value: boolean) {
    this.currencyRatePresenter.getView().isLoading = value;
  }

  set isLoadingAccountCurrencies(value: boolean) {
    this.accountCurrenciesTablePresenter.getView().isLoading = value;
  }

  public fillCurrenciesRateTable(args: IFillDataArgs): void {
    this.currencyRatePresenter.getView().fillData(args);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
