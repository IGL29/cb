import { ButtonPresenter } from '~presenters/ButtonPresenter';
import { InputPresenter } from '~presenters/InputPresenter';
import { LoaderPresenter } from '~presenters/LoaderPresenter';
import { SelectPresenter } from '~presenters/SelectPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { IClasses } from '~types/select';
import { ITransferArgs, TTarget } from '~types/transfer';
import { View, IAddHandlerArgs, IAddHandlers } from '~types/view';

export class TransferView extends View implements IAddHandlers<TTarget> {
  private readonly rootElement: HTMLElement;
  private readonly formElement: HTMLElement;
  private readonly titleElement: HTMLElement;

  private readonly loaderPresenter: LoaderPresenter;
  private readonly inputTransferPricePresenter: InputPresenter;
  private readonly selectNumberRecipient: SelectPresenter;
  private readonly buttonTransferPresenter: ButtonPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private readonly rootClasses: IClasses = [
    'py-[25px]',
    'px-[50px]',
    'bg-[#F3F4F6]',
    'rounded-[50px]',
    'sm:px-[30px]',
    'xs:px-[20px]'
  ];
  private readonly formClasses: IClasses = ['relative'];
  private readonly titleClasses: IClasses = [
    'font-Work-Sans',
    'font-bold',
    'text-[20px]',
    'mb-[25px]',
    'xs:text-center',
    'xs:mb-[20px]'
  ];

  private _isLoading: boolean = false;
  private titleValue: string = 'Новый перевод';
  private buttonTransferValue: string = 'Перевести';

  constructor({ callbackSAccountSelect }: ITransferArgs) {
    super();
    this.selectNumberRecipient = new SelectPresenter({
      buttonValue: 'Номер счета',
      classNamesWrapperSelect: ['max-w-[300px]', 'w-full', 'lg:max-w-full'],
      classNamesRoot: ['justify-between', 'mb-[25px]', 'xs:flex-col', 'mb-[20px]'],
      classNamesLabel: [
        'flex-[1_0_120px]',
        'xs:self-start',
        'xs:flex-[initial]',
        'xs:mb-[10px]',
        'xs:text-[14px]'
      ],
      inputConfig: {
        isWithInput: true,
        placeholderValue: 'Введите номер счета',
        labelValue: 'Номер счета получателя'
      },
      callback: (val) => callbackSAccountSelect(val)
    });
    this.inputTransferPricePresenter = new InputPresenter({
      labelValue: 'Сумма перевода',
      placeholderValue: 'Введите сумму перевода',
      classNamesRoot: ['justify-between', 'mb-[25px]', 'xs:flex-col'],
      classNamesLabel: [
        'flex-[1_0_120px]',
        'xs:self-start',
        'xs:flex-[initial]',
        'xs:mb-[10px]',
        'xs:text-[14px]'
      ],
      classNamesWrapperInput: ['max-w-[300px]', 'w-full', 'lg:max-w-full']
    });
    this.buttonTransferPresenter = new ButtonPresenter({ buttonValue: this.buttonTransferValue });
    this.loaderPresenter = new LoaderPresenter();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.setValues();
    this.addClasses();
    this.combineElements();
  }

  protected createElements(): void {
    (this.rootElement as HTMLElement) = this.domCreatorService.createElement('form');
    (this.formElement as HTMLElement) = this.domCreatorService.createElement('form');
    (this.titleElement as HTMLElement) = this.domCreatorService.createElement('h2');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses);
    this.titleElement.classList.add(...this.titleClasses);
    this.formElement.classList.add(...this.formClasses);
  }

  public setRootClasses(classes: IClasses): void {
    this.rootElement.classList.add(...classes);
  }

  protected combineElements(): void {
    this.rootElement.append(this.formElement);
    this.formElement.append(this.titleElement);
    this.formElement.append(this.selectNumberRecipient.render());
    this.formElement.append(this.inputTransferPricePresenter.render());
    this.formElement.append(this.buttonTransferPresenter.render());
    this.formElement.append(this.loaderPresenter.render());
  }

  protected setValues(): void {
    this.titleElement.textContent = this.titleValue;
  }

  public addHandlers(args: IAddHandlerArgs<TTarget>): void {
    if (args.target === 'input-account') {
      this.selectNumberRecipient.getView().addHandlerInput(args);
    }
    if (args.target === 'input-amount') {
      this.inputTransferPricePresenter
        .getView()
        .addHandlers({ target: 'input-element', type: args.type, handler: args.handler });
    }
    if (args.target === 'btn-transfer') {
      this.buttonTransferPresenter.getView().addHandler({ type: args.type, handler: args.handler });
    }
  }

  public addOptionsToAccountSelect(options: { title: string; isActive?: boolean }[]): void {
    this.selectNumberRecipient.getView().addOptions(options);
  }

  public showInputAccountError(errorMessage?: string): void {
    this.selectNumberRecipient.getView().showErrorState(errorMessage);
  }

  public showInputAccountDefault(): void {
    this.selectNumberRecipient.getView().showDefaultState();
  }

  public showInputAmountError(errorMessage?: string): void {
    this.inputTransferPricePresenter.getView().showInputErrorState(errorMessage);
  }

  public showInputAmountDefault(): void {
    this.inputTransferPricePresenter.getView().showInputDefaultState();
  }

  public clearInputAccountValue(): void {
    this.selectNumberRecipient.getView().clearSelectedValue();
  }

  public clearInputAmountValue(): void {
    this.inputTransferPricePresenter.getView().clearInputValue();
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;

    this.switchVisibleLoader(value);
    this.buttonTransferPresenter.getView().isDisabled(value);
  }

  private switchVisibleLoader(isShow: boolean): void {
    this.loaderPresenter.getView().switchVisibleLoader(isShow);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
