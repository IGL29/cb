import { ErrorIconPresenter } from '~presenters/ErrorIconPresenter';
import { InputPresenter } from '~presenters/InputPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { TSorting } from '~types/accounts';
import { Predicate } from '~types/Predicate';
import {
  IClasses,
  IInputConfig,
  ISelectArgs,
  IItemListArgs,
  IHandlerInputArgs
} from '~types/select';
import { View } from '~types/view';

export class SelectView extends View {
  private readonly rootElement: HTMLElement;
  private readonly buttonElement: HTMLElement;
  private readonly dropdownWrapperElement: HTMLElement;
  private readonly listElement: HTMLElement;
  private readonly labelElement: HTMLElement;
  private readonly wrapperSelectElement: HTMLElement;

  private readonly inputPresenter: InputPresenter;
  private readonly errorIconPresenter: ErrorIconPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = ['relative', 'flex', 'items-center'];
  private externalRootClasses: IClasses;
  private dropdownWrapperClasses: IClasses = [
    'absolute',
    'w-full',
    'rounded-[7px]',
    'bg-[#FFFFFF]',
    'shadow-[0px_8px_20px_rgba(0,0,0,0.25)]',
    'top-[100%]',
    'z-[2]',
    'max-h-[157px]',
    'overflow-y-auto',
    'overflow-x-hidden'
  ];
  private dropdownWrapperHiddenClasses: IClasses = ['hidden'];
  private listClasses: IClasses = ['py-[10px]'];
  private itemClasses: IClasses = [];
  private buttonClasses: IClasses = [
    'w-full',
    'rounded-[7px]',
    'border',
    'border-[#9CA3AF]',
    'text-left',
    'font-Ubuntu',
    'after:origin-[center_40%]',
    'text-[16px]',
    'text-[#374151]',
    'focus:border-[#116ACC]',
    'hover:border-[#116ACC]',
    'pt-[10px]',
    'pr-[43px]',
    'pb-[10px]',
    'pl-[16px]',
    'bg-[#FFFFFF]',
    'focus:bg-[#EBEFF7]',
    'hover:bg-[#EFF2F6]',
    'transition-background',
    'duration-300',
    'relative',
    'after:content("")',
    'after:absolute',
    'after:right-[22px]',
    'after:top-[50%]',
    'after:translate-y-[-25%]',
    'after:transition-transform',
    'after:pointer-events-none',
    'after:border-t-[6px]',
    'after:border-r-[5px]',
    'after:border-l-[5px]',
    'after:border-transparent',
    'after:border-t-[#182233]'
  ];
  private buttonActiveClasses: IClasses = ['after:rotate-180'];
  private buttonItemClasses: IClasses = [
    'py-[10px]',
    'w-full',
    'px-[16px]',
    'pr-[39px]',
    'text-left',
    'text-[#374151]',
    'text-[16px]',
    'font-Ubuntu',
    'focus:bg-[#A0C3EB]',
    'hover:bg-[#A0C3EB]',
    'active:bg-[#CFE1F5]',
    'transition-background',
    'after:transition-background',
    'duration-300',
    'relative',
    'after:content("")',
    'after:absolute',
    'after:right-[17px]',
    'after:top-[45%]',
    'after:translate-y-[-50%]',
    'after:transition-opacity',
    'after:w-[16px]',
    'after:pointer-events-none',
    'after:h-[11px]',
    'after:border-t-transparent',
    'after:border-r-transparent',
    'after:border-l-[#000000]',
    'after:border-b-[#000000]',
    'after:border-[3px]',
    'after:opacity-0',
    'after:rotate-[-50deg]',
    'overflow-hidden',
    'text-ellipsis',
    'whitespace-nowrap',
    'block'
  ];
  private inputWrapperClasses: IClasses = ['relative', 'w-full'];
  private inputWrapperActiveClasses: IClasses = ['after:rotate-180'];
  private inputClasses: IClasses = ['pr-[40px]'];
  private buttonStateErrorClasses: IClasses = ['border-[#C11E1F]'];
  private buttonItemActiveClasses: IClasses = ['after:opacity-100'];
  private labelClasses: IClasses = ['text-[16px]', 'font-medium', 'mr-[18px]'];
  private wrapperSelectClasses: IClasses = [
    'relative',
    'after:absolute',
    'after:right-[22px]',
    'after:top-[50%]',
    'after:translate-y-[-25%]',
    'after:pointer-events-none',
    'after:transition-transform',
    'after:border-t-[6px]',
    'after:border-r-[5px]',
    'after:border-l-[5px]',
    'after:border-transparent',
    'after:border-t-[#182233]'
  ];
  private externalWrapperSelectClasses: IClasses;
  private externalButtonClasses: IClasses;
  private externalListClasses: IClasses;
  private externalClassNamesLabel: IClasses;

  private buttonValue: string;
  private _isOpen: boolean = false;
  private currentOptionsInListElements: {
    parentElement: HTMLElement;
    buttonElement: HTMLElement;
  }[];
  private inputConfig: IInputConfig;
  private callback: ISelectArgs['callback'];
  private wrapperOuterClick: HTMLElement;
  private isShowActiveOptionToBtn: boolean;

  constructor({
    classNamesRoot = [],
    classNamesWrapperSelect = [],
    classNamesButton = [],
    classNamesList = [],
    classNamesLabel = [],
    buttonValue = '',
    inputConfig = {
      isWithInput: false,
      placeholderValue: '',
      labelValue: ''
    },
    isShowActiveOptionToBtn = false,
    wrapperOuterClick,
    callback
  }: ISelectArgs) {
    super();
    this.externalRootClasses = classNamesRoot;
    this.externalWrapperSelectClasses = classNamesWrapperSelect;
    this.externalButtonClasses = classNamesButton;
    this.externalListClasses = classNamesList;
    this.externalClassNamesLabel = classNamesLabel;
    this.buttonValue = buttonValue;
    this.isShowActiveOptionToBtn = isShowActiveOptionToBtn;
    this.inputConfig = inputConfig;
    this.callback = callback;
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.wrapperOuterClick = wrapperOuterClick || this.rootElement;
    this.setAttributes();
    this.addClasses();
    this.setValues();
    this.combineElements();
    this.addHandlerSelect();
    this.addHandlerOuterClick();

    if (inputConfig.isWithInput && callback) {
      this.inputPresenter.getView().addHandlers({
        target: 'input-element',
        type: 'input',
        handler: (ev) => callback((ev.target as HTMLInputElement).value)
      });
      this.inputPresenter.getView().addHandlers({
        target: 'input-element',
        type: 'focusin',
        handler: (ev) => {
          if (Predicate.isMouseEvent(ev) || Predicate.isFocusEvent(ev)) {
            this.handlerSwitchDropdown(ev);
          }
        }
      });
    } else {
      this.buttonElement.addEventListener('click', (ev) => this.handlerSwitchDropdown(ev));
    }
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');

    if (this.inputConfig.isWithInput) {
      (<HTMLElement>this.wrapperSelectElement) = this.domCreatorService.createElement('div');
      (<InputPresenter>this.inputPresenter) = new InputPresenter({
        placeholderValue: this.inputConfig.placeholderValue,
        classNamesWrapperInput: this.inputWrapperClasses,
        classNamesInput: this.inputClasses
      });
      (<HTMLElement>this.labelElement) = this.domCreatorService.createElement('label');
    } else {
      (<ErrorIconPresenter>this.errorIconPresenter) = new ErrorIconPresenter();
      (<HTMLElement>this.buttonElement) = this.domCreatorService.createElement('button');
    }
    (<HTMLElement>this.dropdownWrapperElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.listElement) = this.domCreatorService.createElement('ul');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses, ...this.externalRootClasses);
    if (this.inputConfig.isWithInput) {
      this.labelElement.classList.add(...this.labelClasses, ...this.externalClassNamesLabel);
      this.wrapperSelectElement.classList.add(
        ...this.wrapperSelectClasses,
        ...this.externalWrapperSelectClasses
      );
    } else {
      this.buttonElement.classList.add(...this.buttonClasses, ...this.externalButtonClasses);
    }
    this.dropdownWrapperElement.classList.add(
      ...this.dropdownWrapperClasses,
      ...(this.isOpen ? [] : this.dropdownWrapperHiddenClasses)
    );
    this.listElement.classList.add(...this.listClasses, ...this.externalListClasses);
  }

  public setInputValue(value: string): void {
    this.inputPresenter.getView().setInputValue(value);
  }

  protected setValues() {
    if (this.inputConfig.isWithInput) {
      if (this.inputConfig.labelValue) {
        this.labelElement.textContent = this.inputConfig.labelValue;
      }
    } else {
      this.buttonElement.textContent = this.buttonValue;
    }
  }

  protected setAttributes(): void {
    if (this.inputConfig.isWithInput) {
      this.labelElement.setAttribute('for', this.inputPresenter.getView().getId());
    }
  }

  protected combineElements(): void {
    if (this.inputConfig.isWithInput) {
      this.rootElement.append(this.labelElement);
      this.rootElement.append(this.wrapperSelectElement);
      this.wrapperSelectElement.append(this.inputPresenter.render());
      this.inputPresenter.getView().appendToWrapperInputSlot(this.dropdownWrapperElement);
    } else {
      this.rootElement.append(
        this.buttonElement,
        this.dropdownWrapperElement,
        this.errorIconPresenter.render()
      );
    }
    this.dropdownWrapperElement.append(this.listElement);
  }

  public setButtonValue(value: string): void {
    this.buttonElement.textContent = value;
  }

  public addOptions<Title extends string, Value extends string>(
    options: Array<{ title: Title; value?: Value; isActive?: boolean }>
  ): void {
    this.listElement.innerHTML = '';
    this.currentOptionsInListElements = [];

    options.forEach((option) => {
      const optionElement = this.createItemListElement(option);
      this.listElement.append(optionElement);

      if (option.isActive) {
        this.setButtonValue(option.title);
      }
    });
  }

  private createItemListElement({ title, value, isActive = false }: IItemListArgs): HTMLElement {
    const itemElement = this.domCreatorService.createElement('li');
    const buttonElement = this.domCreatorService.createElement('button');
    const buttonItemActiveClasses = isActive ? this.buttonItemActiveClasses : [];
    itemElement.classList.add(...this.itemClasses);
    buttonElement.classList.add(...this.buttonItemClasses, ...buttonItemActiveClasses);
    buttonElement.dataset.value = value || title;
    buttonElement.dataset.isactive = isActive ? String(isActive) : 'false';
    buttonElement.textContent = title;

    itemElement.append(buttonElement);
    this.currentOptionsInListElements.push({
      parentElement: itemElement,
      buttonElement
    });
    return itemElement;
  }

  public addHandlerOuterClick(): void {
    document.addEventListener('click', (ev) => this.handlerOuterClick(ev));
  }

  private handlerOuterClick(ev: MouseEvent): void {
    const target = ev.target as HTMLElement;
    if (!this.wrapperOuterClick.contains(target)) {
      this.isOpen = false;
    }
  }

  public addHandlerInput({ type, handler }: IHandlerInputArgs): void {
    this.inputPresenter.getView().addHandlers({ target: 'input-element', type, handler });
  }

  public addHandlerSelect(): void {
    this.listElement.addEventListener('click', (ev) => this.handlerSelect(ev));
  }

  public setActiveOption(value: TSorting): void {
    if (this.callback) {
      this.callback(value);
    }
    if (this.inputConfig.isWithInput && value) {
      this.inputPresenter.getView().setInputValue(value);
    }
    this.currentOptionsInListElements.forEach((item) => {
      if (item.buttonElement.dataset.value === value) {
        item.buttonElement.dataset.isactive = 'true';
        item.buttonElement.classList.add(...this.buttonItemActiveClasses);
        return;
      }
      item.buttonElement.dataset.isactive = 'false';
      item.buttonElement.classList.remove(...this.buttonItemActiveClasses);
    });
  }

  private handlerSelect(ev: MouseEvent): void {
    ev.preventDefault();

    const selectedOption = this.currentOptionsInListElements.find((item) =>
      item.parentElement.contains(ev.target as HTMLElement)
    );

    if (!selectedOption) {
      return;
    }

    if (this.callback && selectedOption.buttonElement.dataset.value) {
      const attrDataValue = selectedOption.buttonElement.dataset.value;
      this.callback(attrDataValue);
    }

    if (this.inputConfig.isWithInput && selectedOption.buttonElement.dataset.value) {
      this.inputPresenter.getView().setInputValue(selectedOption.buttonElement.dataset.value);
    }

    if (
      this.isShowActiveOptionToBtn &&
      this.buttonElement &&
      selectedOption.buttonElement.dataset.value
    ) {
      this.buttonElement.textContent = selectedOption.buttonElement.dataset.value;
    }

    this.currentOptionsInListElements.forEach((item) => {
      if (item === selectedOption) {
        item.buttonElement.dataset.isactive = 'true';
        item.buttonElement.classList.add(...this.buttonItemActiveClasses);
        return;
      }
      item.buttonElement.dataset.isactive = 'false';
      item.buttonElement.classList.remove(...this.buttonItemActiveClasses);
    });

    this.handlerSwitchDropdown(ev);
  }

  private handlerSwitchDropdown(ev: MouseEvent | FocusEvent): void {
    ev.preventDefault();

    if (!this.currentOptionsInListElements.length) {
      return;
    }

    if (ev.type === 'click') {
      this.isOpen = !this.isOpen;
    } else if (ev.type === 'focusin') {
      this.isOpen = true;
    }
  }

  public showErrorState(errorMessage?: string): void {
    if (this.inputConfig.isWithInput) {
      this.inputPresenter.getView().showInputErrorState(errorMessage);
      return;
    }
    this.buttonElement.classList.add(...this.buttonStateErrorClasses);
    this.errorIconPresenter.getView().showError(errorMessage);
  }

  public showDefaultState(): void {
    if (this.inputConfig.isWithInput) {
      this.inputPresenter.getView().showInputDefaultState();
      return;
    }
    this.buttonElement.classList.remove(...this.buttonStateErrorClasses);
    this.errorIconPresenter.getView().hideError();
  }

  public clearSelectedValue(): void {
    if (this.inputConfig.isWithInput) {
      this.inputPresenter.getView().clearInputValue();
      return;
    }
    this.buttonElement.innerHTML = this.buttonValue;
  }

  private changeButtonState(value: boolean): void {
    if (value) {
      this.buttonElement.classList.add(...this.buttonActiveClasses);
      return;
    }
    this.buttonElement.classList.remove(...this.buttonActiveClasses);
  }

  private changeInputState(value: boolean): void {
    if (value) {
      this.wrapperSelectElement.classList.add(...this.inputWrapperActiveClasses);
      return;
    }
    this.wrapperSelectElement.classList.remove(...this.inputWrapperActiveClasses);
  }

  set isOpen(value) {
    this._isOpen = value;

    if (!this.inputConfig.isWithInput) {
      this.changeButtonState(value);
    } else {
      this.changeInputState(value);
    }

    if (this.isOpen) {
      this.dropdownWrapperElement.classList.remove(...this.dropdownWrapperHiddenClasses);
      return;
    }
    this.dropdownWrapperElement.classList.add(...this.dropdownWrapperHiddenClasses);
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
