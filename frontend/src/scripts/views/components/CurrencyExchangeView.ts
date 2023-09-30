import { View, IAddHandlerArgs, IAddHandlers } from '~types/view';
import { IClasses } from '~types/select';
import { ButtonPresenter } from '~presenters/ButtonPresenter';
import { InputPresenter } from '~presenters/InputPresenter';
import { LoaderPresenter } from '~presenters/LoaderPresenter';
import { SelectPresenter } from '~presenters/SelectPresenter';
import { ICurrencyExchangeViewArgs, TOptions, TTarget } from '~types/currencyExchange';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class CurrencyExchangeView extends View implements IAddHandlers<TTarget> {
  private readonly rootElement: HTMLElement;
  private readonly formElement: HTMLElement;
  private readonly formContentWrapper: HTMLElement;
  private readonly titleElement: HTMLElement;
  private readonly fieldsWrapperElement: HTMLElement;
  private readonly selectorsWrapperElement: HTMLElement;

  private readonly loaderPresenter: LoaderPresenter;
  private readonly selectCurrencyFrom: SelectPresenter;
  private readonly selectCurrencyTo: SelectPresenter;
  private readonly inputAmountPresenter: InputPresenter;
  private readonly buttonConversionPresenter: ButtonPresenter;
  private domCreatorService: DOMCreatorService;

  private readonly rootClasses: IClasses = [
    'pt-[50px]',
    'pb-[62px]',
    'px-[50px]',
    'bg-[#FFFFFF]',
    'rounded-[50px]',
    'shadow-[0px_5px_20px_rgba(0,0,0,0.25)]',
    'sm:px-[30px]',
    'xs:px-[20px]',
    'xs:py-[30px]'
  ];
  private externalRootClasses: IClasses;
  private formClasses: IClasses = ['relative'];
  private formContentClasses: IClasses = ['flex', 'justify-between', 'xs:flex-col'];
  private titleClasses: IClasses = [
    'font-Work-Sans',
    'font-bold',
    'text-[20px]',
    'mb-[25px]',
    'lg:text[17px]',
    'md:text-[16px]',
    'xs:text-center'
  ];
  private fieldsWrapperClasses: IClasses = ['mr-[25px]', 'grow', 'xs:mr-0', 'xs:mb-[20px]'];
  private selectorsWrapperClasses: IClasses = [
    'flex',
    'justify-between',
    'mb-[25px]',
    'xs:flex-col',
    'xs:mb-[15px]'
  ];
  private selectCurrencyWrapperClasses: IClasses = ['max-w-[300px]', 'w-full'];
  private selectCurrencyFromRoot: IClasses = [
    'basis-[50%]',
    'mr-[25px]',
    'xs:mr-0',
    'xs:mb-[15px]'
  ];
  private selectCurrencyToRoot: IClasses = ['basis-[50%]'];
  private inputAmountRootClasses: IClasses = ['justify-between', 'xs:flex-col'];
  private inputAmountWrapperClasses: IClasses = ['grow', 'w-full'];
  private inputAmountLabelClasses: IClasses = ['xs:self-start', 'xs:mb-[7px]'];

  private titleValue: string = 'Обмен валюты';
  private selectCurrencyButtonValue: string = 'Валюта';
  private inputAmountLabelValue: string = 'Сумма';
  private inputAmountPlaceholderValue: string = 'Введите сумму для обмена';
  private buttonConversionValue: string = 'Обменять';

  private _isLoading: boolean = false;

  constructor({
    classNamesRoot = [],
    callbackCurrencyFromSelect,
    callbackCurrencyToSelect
  }: ICurrencyExchangeViewArgs) {
    super();
    this.selectCurrencyFrom = new SelectPresenter({
      buttonValue: this.selectCurrencyButtonValue,
      classNamesWrapperSelect: this.selectCurrencyWrapperClasses,
      classNamesRoot: this.selectCurrencyFromRoot,
      callback: (val: string) => callbackCurrencyFromSelect(val),
      isShowActiveOptionToBtn: true
    });
    this.selectCurrencyTo = new SelectPresenter({
      buttonValue: this.selectCurrencyButtonValue,
      classNamesWrapperSelect: this.selectCurrencyWrapperClasses,
      classNamesRoot: this.selectCurrencyToRoot,
      callback: (val: string) => callbackCurrencyToSelect(val),
      isShowActiveOptionToBtn: true
    });
    this.inputAmountPresenter = new InputPresenter({
      labelValue: this.inputAmountLabelValue,
      placeholderValue: this.inputAmountPlaceholderValue,
      classNamesRoot: this.inputAmountRootClasses,
      classNamesWrapperInput: this.inputAmountWrapperClasses,
      classNamesLabel: this.inputAmountLabelClasses
    });
    this.buttonConversionPresenter = new ButtonPresenter({
      buttonValue: this.buttonConversionValue
    });
    this.loaderPresenter = new LoaderPresenter();
    this.externalRootClasses = classNamesRoot;
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.setValues();
    this.addClasses();
    this.combineElements();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.formElement) = this.domCreatorService.createElement('form');
    (<HTMLElement>this.formContentWrapper) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.titleElement) = this.domCreatorService.createElement('h2');
    (<HTMLElement>this.fieldsWrapperElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.selectorsWrapperElement) = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses, ...this.externalRootClasses);
    this.titleElement.classList.add(...this.titleClasses);
    this.formElement.classList.add(...this.formClasses);
    this.formContentWrapper.classList.add(...this.formContentClasses);
    this.fieldsWrapperElement.classList.add(...this.fieldsWrapperClasses);
    this.selectorsWrapperElement.classList.add(...this.selectorsWrapperClasses);
  }

  public setRootClasses(classes: string[]): void {
    this.rootElement.classList.add(...classes);
  }

  protected combineElements(): void {
    this.rootElement.append(this.formElement);
    this.formElement.append(this.titleElement, this.formContentWrapper);
    this.selectorsWrapperElement.append(
      this.selectCurrencyFrom.render(),
      this.selectCurrencyTo.render()
    );
    this.fieldsWrapperElement.append(
      this.selectorsWrapperElement,
      this.inputAmountPresenter.render()
    );
    this.formContentWrapper.append(
      this.fieldsWrapperElement,
      this.buttonConversionPresenter.render(),
      this.loaderPresenter.render()
    );
  }

  protected setValues(): void {
    this.titleElement.textContent = this.titleValue;
  }

  public addHandlers(args: IAddHandlerArgs<TTarget>): void {
    if (args.target === 'input-amount') {
      this.inputAmountPresenter
        .getView()
        .addHandlers({ target: 'input-element', type: args.type, handler: args.handler });
    }
    if (args.target === 'btn-transfer') {
      this.buttonConversionPresenter
        .getView()
        .addHandler({ type: args.type, handler: args.handler });
    }
  }

  public addOptionsToCurrencyFrom(options: TOptions): void {
    this.selectCurrencyFrom.getView().addOptions(options);
  }

  public addOptionsToCurrencyTo(options: TOptions): void {
    this.selectCurrencyTo.getView().addOptions(options);
  }

  public showInputAmountError(errorMessage?: string): void {
    this.inputAmountPresenter.getView().showInputErrorState(errorMessage);
  }

  public showSelectFromError(message: string): void {
    this.selectCurrencyFrom.getView().showErrorState(message);
  }

  public showSelectToError(message: string): void {
    this.selectCurrencyTo.getView().showErrorState(message);
  }

  public showInputAmountDefault(): void {
    this.inputAmountPresenter.getView().showInputDefaultState();
  }

  public showSelectToDefault(): void {
    this.selectCurrencyTo.getView().showDefaultState();
  }

  public showSelectFromDefault(): void {
    this.selectCurrencyFrom.getView().showDefaultState();
  }

  public clearInputAmountValue(): void {
    this.inputAmountPresenter.getView().clearInputValue();
  }

  public clearSelectFromValue(): void {
    this.selectCurrencyFrom.getView().clearSelectedValue();
  }

  public clearSelectToValue(): void {
    this.selectCurrencyTo.getView().clearSelectedValue();
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;

    this.switchVisibleLoader(value);
    this.buttonConversionPresenter.getView().isDisabled(value);
  }

  private switchVisibleLoader(isShow: boolean): void {
    this.loaderPresenter.getView().switchVisibleLoader(isShow);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
