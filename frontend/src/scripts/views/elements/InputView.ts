import { ErrorIconPresenter } from '~presenters/ErrorIconPresenter';
import { generateRandomString } from '~utils/generateRandomString';
import { IClasses } from '~types/select';
import { IInputArgs } from '~types/input';
import { IAddHandlerArgs, IAddHandlers, View } from '~types/view';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class InputView extends View implements IAddHandlers<'input-element'> {
  private readonly rootElement: HTMLElement;
  private readonly labelElement: HTMLElement;
  private readonly inputElement: HTMLInputElement;
  private readonly wrapperInputElement: HTMLElement;

  private readonly slotInWrapperInputElement: HTMLElement;

  private readonly errorIconPresenter: ErrorIconPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private defaultClasses: IClasses = ['flex', 'items-center', 'relative'];
  private inputClasses: IClasses = [
    'w-full',
    'rounded-[7px]',
    'border',
    'border-[#9CA3AF]',
    'font-Ubuntu',
    'text-[16px]',
    'text-[#374151]',
    'focus:border-[#116ACC]',
    'hover:border-[#116ACC]',
    'pt-[10px]',
    'pr-[16px]',
    'pb-[10px]',
    'pl-[16px]',
    'bg-[#FFFFFF]',
    'focus:bg-[#EBEFF7]',
    'hover:bg-[#EFF2F6]',
    'transition-background',
    'duration-300'
  ];
  private labelClasses: IClasses = ['text-[16px]', 'font-medium', 'mr-[18px]'];
  private inputStateErrorClasses: IClasses = ['border-[#C11E1F]'];
  private wrapperInputClasses: IClasses = ['relative'];
  private externalRootClasses: IClasses;
  private externalInputClasses: IClasses;
  private externalLabelClasses: IClasses;
  private externalWrapperInputClasses: IClasses;
  private externalTypeInput = 'text';
  private externalAutoComplete = 'off';

  private id: string;
  private labelValue: string;
  private inputValue: string;
  private placeholderValue: string;

  constructor({
    labelValue = '',
    inputValue = '',
    placeholderValue = '',
    classNamesRoot = [],
    classNamesInput = [],
    classNamesLabel = [],
    classNamesWrapperInput = [],
    type = 'text',
    autocomplete = 'off'
  }: IInputArgs) {
    super();
    this.id = generateRandomString();
    this.labelValue = labelValue;
    this.inputValue = inputValue;
    this.placeholderValue = placeholderValue;
    this.externalRootClasses = classNamesRoot;
    this.externalInputClasses = classNamesInput;
    this.externalLabelClasses = classNamesLabel;
    this.externalWrapperInputClasses = classNamesWrapperInput;
    this.externalTypeInput = type;
    this.externalAutoComplete = autocomplete;
    this.errorIconPresenter = new ErrorIconPresenter();
    this.domCreatorService = new DOMCreatorService();
    this.init();
  }

  public init() {
    this.createElements();
    this.addClasses();
    this.setValues();
    this.setAttributes();
    this.combineElements();
  }

  protected createElements() {
    (this.rootElement as HTMLElement) = this.domCreatorService.createElement('div');
    (this.labelElement as HTMLElement) = this.domCreatorService.createElement('label');
    (this.wrapperInputElement as HTMLElement) = this.domCreatorService.createElement('div');
    (this.inputElement as HTMLElement) = this.domCreatorService.createElement('input');
  }

  public showInputErrorState(message?: string): void {
    this.inputElement.classList.add(...this.inputStateErrorClasses);
    if (message) {
      this.errorIconPresenter.getView().showError(message);
    }
  }

  public showInputDefaultState(): void {
    this.inputElement.classList.remove(...this.inputStateErrorClasses);
    this.errorIconPresenter.getView().hideError();
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.defaultClasses, ...this.externalRootClasses);
    this.labelElement.classList.add(...this.labelClasses, ...this.externalLabelClasses);
    this.inputElement.classList.add(...this.inputClasses, ...this.externalInputClasses);
    this.wrapperInputElement.classList.add(
      ...this.wrapperInputClasses,
      ...this.externalWrapperInputClasses
    );
  }

  public getId(): string {
    return this.id;
  }

  protected setValues(): void {
    this.labelElement.textContent = this.labelValue;
    this.inputElement.value = this.inputValue;
  }

  public setInputValue(value: string): void {
    this.inputElement.value = value;
  }

  public clearInputValue(): void {
    this.inputElement.value = '';
  }

  protected setAttributes(): void {
    this.labelElement.setAttribute('for', this.id);
    this.inputElement.id = this.id;
    this.inputElement.placeholder = this.placeholderValue;
    this.inputElement.type = this.externalTypeInput;
    this.inputElement.autocomplete = this.externalAutoComplete;
  }

  protected combineElements(): void {
    if (this.labelValue) {
      this.rootElement.append(this.labelElement);
    }
    if (this.slotInWrapperInputElement) {
      this.wrapperInputElement.append(this.slotInWrapperInputElement);
    }
    this.wrapperInputElement.append(this.inputElement, this.errorIconPresenter.render());
    this.rootElement.append(this.wrapperInputElement);
  }

  public addHandlers(args: IAddHandlerArgs<'input-element'>): void {
    if (args.target === 'input-element') {
      this.inputElement.addEventListener(args.type, args.handler);
    }
  }

  public appendToWrapperInputSlot(element: HTMLElement): void {
    this.wrapperInputElement.append(element);
  }

  public getInputValue(): string {
    return this.inputElement.value;
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
