import { MainNavPresenter } from '~presenters/MainNavPresenter';
import { OnWaveAnimationPresenter } from '~presenters/OnWaveAnimationPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { TUrl } from '~types/requests';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class BurgerMenuView extends View {
  private readonly rootElement: HTMLElement;
  private readonly containerElement: HTMLElement;
  private readonly onWaveAnimationPresenter: OnWaveAnimationPresenter;

  private readonly mainNavPresenter: MainNavPresenter;
  private domCreatorService: DOMCreatorService;

  private rootElementClasses: IClasses = [
    'hidden',
    'fixed',
    'z-[10]',
    'top-0',
    'left-[100%]',
    'w-[50%]',
    'h-full',
    'transition-transform',
    'duration-[500ms]',
    'sm:block',
    'xs:w-full'
  ];
  private containerClasses: IClasses = [
    'h-full',
    'flex',
    'justify-center',
    'flex-col',
    'px-[20px]',
    'py-[65px]',
    'border-[#116ACC]',
    'border-[2px]',
    'bg-[#FFFFFF]'
  ];
  private rootHiddenClasses: IClasses = ['sm:hidden'];
  private rootActiveClasses: IClasses = ['translate-x-[-100%]'];
  private onWaveAnimationRootClasses: IClasses = ['absolute', 'bottom-0', 'left-0'];
  private mainNavWrapperClasses: IClasses = ['flex-col', 'flex', 'text-center'];
  private mainNavLinkClasses: IClasses = ['[&:not(:last-of-type)]:mb-[25px]'];

  private _isActive = false;

  constructor() {
    super();
    this.mainNavPresenter = new MainNavPresenter({
      classNamesWrapperButtons: this.mainNavWrapperClasses,
      classNamesLink: this.mainNavLinkClasses
    });
    this.onWaveAnimationPresenter = new OnWaveAnimationPresenter({
      classNamesRoot: this.onWaveAnimationRootClasses
    });
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.combineElements();
    this.setValues();
    this.addHandler();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.containerElement) = this.domCreatorService.createElement('div');
  }

  public switchVisibility(isActive?: boolean): void {
    this._isActive = isActive !== undefined ? isActive : !this._isActive;

    if (this._isActive) {
      this.rootElement.classList.add(...this.rootActiveClasses);
      document.body.style.overflow = 'hidden';
      return;
    }
    this.rootElement.classList.remove(...this.rootActiveClasses);
    document.body.style.overflow = '';
  }

  protected combineElements(): void {
    this.rootElement.append(this.containerElement, this.onWaveAnimationPresenter.render());
    this.containerElement.append(this.mainNavPresenter.render());
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootElementClasses);
    this.containerElement.classList.add(...this.containerClasses);
  }

  protected setValues(): void {}

  private addHandler() {
    this.rootElement.addEventListener('click', (ev) => this.handlerClick(ev));
  }

  private handlerClick(ev: MouseEvent): void {
    const target = <HTMLElement>ev.target;
    if (this.isClickOnButtons(target)) {
      this.switchVisibility(false);
    }
  }

  private isClickOnButtons(target: HTMLElement): boolean {
    return this.mainNavPresenter
      .getView()
      .getLinks()
      .some((linkElement) => linkElement.contains(target));
  }

  public hidden(): void {
    this.rootElement.classList.add(...this.rootHiddenClasses);
  }

  public visible(): void {
    this.rootElement.classList.remove(...this.rootHiddenClasses);
  }

  public isActive(): boolean {
    return this._isActive;
  }

  public setActiveRoute(url: TUrl) {
    this.mainNavPresenter.getView().setActiveRoute(url);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
