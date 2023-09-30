import { View, IAddHandlerArgs, IAddHandlers } from '~types/view';
import { InputPresenter } from '~presenters/InputPresenter';
import { LoaderPresenter } from '~presenters/LoaderPresenter';
import { ButtonView } from '~views/elements/ButtonView';
import { IClasses } from '~types/select';
import { TAuthElements } from '~types/authorizationForm';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class AuthorizationFormView extends View implements IAddHandlers<TAuthElements> {
  private rootElement: HTMLElement;
  private titleElement: HTMLElement;
  private fieldsWrapperElement: HTMLElement;
  private buttonWrapperElement: HTMLElement;
  private errorElement: HTMLElement;

  private inputLoginPresenter: InputPresenter;
  private inputPasswordPresenter: InputPresenter;
  private buttonEnterView: ButtonView;
  private loaderPresenter: LoaderPresenter;
  private domCreatorService: DOMCreatorService;

  private fieldsWrapperElementClasses: IClasses = [
    'mb-[30px]',
    'pr-[45px]',
    'text-right',
    'relative',
    'sm:pr-[20px]'
  ];
  private buttonWrapperElementClasses: IClasses = ['pl-[75px]', 'sm:pl-0', 'xs:pr-[20px]'];
  private mainclasses: IClasses = [
    'flex',
    'flex-col',
    'max-w-[500px]',
    'w-full',
    'm-auto',
    'bg-[#F3F4F6]',
    'rounded-[50px]',
    'py-[50px]',
    'px-[40px]',
    'xs:py-[30px]',
    'xs:px-[23px]'
  ];
  private titleClasses: IClasses = [
    'font-Work-Sans',
    'font-bold',
    'text-[34px]',
    'text-center',
    'mb-[35px]',
    'lg:text-[30px]',
    'lg:text-[25px]',
    'xs:mb-[30px]',
    'xs:text-[20px]'
  ];
  private inputLoginRootClasses: IClasses = [
    'mb-[25px]',
    'justify-between',
    'sm:flex-col',
    'sm:mb-[20px]'
  ];
  private inputLoginWrapperClasses: IClasses = ['w-full', 'max-w-[300px]', 'sm:max-w-full'];
  private inputLoginLabelClasses: IClasses = ['sm:self-start', 'sm:mr-0', 'sm:mb-[7px]'];
  private inputPasswordRootClasses: IClasses = ['sm:flex-col', 'justify-between'];
  private inputPasswordWrapperClasses: IClasses = ['w-full', 'max-w-[300px]', 'sm:max-w-full'];
  private inputPasswordLabelClasses: IClasses = ['sm:self-start', 'sm:mr-0', 'sm:mb-[7px]'];
  private buttonEnterRootClasses: IClasses = ['xs:w-full'];

  private titleValue: string = 'Вход в аккаунт';
  private loginLabelValue: string = 'Логин';
  private passwordLabelValue: string = 'Пароль';
  private loginPlaceholderValue: string = 'Введите логин';
  private passwordPlaceholderValue: string = 'Введите пароль';
  private buttonValue = 'Войти';

  private _isLoading = false;

  constructor() {
    super();
    this.inputLoginPresenter = new InputPresenter({
      labelValue: this.loginLabelValue,
      inputValue: '',
      placeholderValue: this.loginPlaceholderValue,
      classNamesRoot: this.inputLoginRootClasses,
      classNamesWrapperInput: this.inputLoginWrapperClasses,
      classNamesLabel: this.inputLoginLabelClasses
    });

    this.inputPasswordPresenter = new InputPresenter({
      type: 'password',
      labelValue: this.passwordLabelValue,
      inputValue: '',
      placeholderValue: this.passwordPlaceholderValue,
      classNamesRoot: this.inputPasswordRootClasses,
      classNamesWrapperInput: this.inputPasswordWrapperClasses,
      classNamesLabel: this.inputPasswordLabelClasses,
      autocomplete: 'current-password'
    });

    this.buttonEnterView = new ButtonView({
      buttonValue: this.buttonValue,
      rootClasses: this.buttonEnterRootClasses
    });

    this.loaderPresenter = new LoaderPresenter();
    this.domCreatorService = new DOMCreatorService();
    this.init();
  }

  private init(): void {
    this.createElements();
    this.addClasses();
    this.combineElements();
    this.setValues();
  }

  protected createElements(): void {
    this.rootElement = this.domCreatorService.createElement('form');
    this.titleElement = this.domCreatorService.createElement('h1');
    this.fieldsWrapperElement = this.domCreatorService.createElement('div');
    this.buttonWrapperElement = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.mainclasses);
    this.titleElement.classList.add(...this.titleClasses);
    this.fieldsWrapperElement.classList.add(...this.fieldsWrapperElementClasses);
    this.buttonWrapperElement.classList.add(...this.buttonWrapperElementClasses);
  }

  protected combineElements(): void {
    this.rootElement.append(this.titleElement);
    this.rootElement.append(this.fieldsWrapperElement);
    this.rootElement.append(this.buttonWrapperElement);
    this.fieldsWrapperElement.append(this.loaderPresenter.render());
    this.fieldsWrapperElement.append(this.inputLoginPresenter.render());
    this.fieldsWrapperElement.append(this.inputPasswordPresenter.render());
    this.buttonWrapperElement.append(this.buttonEnterView.render());
  }

  public showLoginError(message?: string): void {
    this.inputLoginPresenter.getView().showInputErrorState(message);
  }

  public showPasswordError(message?: string): void {
    this.inputPasswordPresenter.getView().showInputErrorState(message);
  }

  public resetLoginErrorState(): void {
    this.inputLoginPresenter.getView().showInputDefaultState();
  }

  public resetPasswordErrortState(): void {
    this.inputPasswordPresenter.getView().showInputDefaultState();
  }

  public showError(message: string): void {
    if (!this.errorElement) {
      this.errorElement = this.domCreatorService.createElement('p');
    }
    this.errorElement.textContent = message;
    this.rootElement.append(this.errorElement);
  }

  public hideError(): void {
    this.resetLoginErrorState();
    this.resetPasswordErrortState();

    if (!this.errorElement) {
      return;
    }
    this.errorElement.remove();
  }

  protected setValues(): void {
    this.titleElement.textContent = this.titleValue;
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;
    this.switchVisibleLoader();
    this.buttonEnterView.isDisabled(value);
  }

  public get isLoading(): boolean {
    return this._isLoading;
  }

  private switchVisibleLoader(): void {
    if (this.isLoading) {
      this.loaderPresenter.getView().switchVisibleLoader(true);
      return;
    }
    this.loaderPresenter.getView().switchVisibleLoader(false);
  }

  public addHandlers({ handler, target, type }: IAddHandlerArgs<TAuthElements>): void {
    if (target === 'form') {
      this.rootElement.addEventListener(type, handler);
    }
    if (target === 'inputLogin') {
      this.inputLoginPresenter.getView().addHandlers({ target: 'input-element', type, handler });
    }
    if (target === 'inputPassword') {
      this.inputPasswordPresenter.getView().addHandlers({ target: 'input-element', type, handler });
    }
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
