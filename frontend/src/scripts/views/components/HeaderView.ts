import { View } from '~types/view';
import { RouterPresenter } from '~presenters/RouterPresenter';
import { IClasses } from '~types/select';
import { LogoPresenter } from '~presenters/LogoPresenter';
import { MainNavPresenter } from '~presenters/MainNavPresenter';
import { BurgerMenuPresenter } from '~presenters/BurgerMenuPresenter';
import { AuthorizationService } from '~services/AuthorizationService';
import { TUrl } from '~types/requests';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class HeaderView extends View {
  private readonly rootElement: HTMLElement;
  private readonly siteContainerElement: HTMLElement;
  private readonly linkLogoElement: HTMLElement;
  private readonly burgerMenuButtonElement: HTMLButtonElement;
  private readonly burgerMenuInnerElement: HTMLElement;

  private readonly logoPresenter: LogoPresenter;
  private readonly routerPresenter: RouterPresenter;
  private readonly mainNavPresenter: MainNavPresenter;
  private readonly burgerMenuPresenter: BurgerMenuPresenter;
  private readonly authorizationService: AuthorizationService;
  private readonly domCreatorService: DOMCreatorService;

  private rootElementClasses: IClasses = ['bg-[#116ACC]', 'shadow-[0px_5px_20px_rgba(0,0,0,0.25)]'];
  private siteContainerClasses: IClasses = [
    'flex',
    'justify-between',
    'items-center',
    'pt-[25px]',
    'pb-[25px]',
    'max-w-[1440px]',
    'px-[50px]',
    'mx-auto',
    'md:pt-[20px]',
    'md:pb-[20px]',
    'xs:pt-[10px]',
    'xs:pb-[10px]',
    'sm:px-[30px]',
    'xs:px-[20px]'
  ];

  private burgerMenuButtonClasses: IClasses = [
    'hidden',
    'relative',
    'w-[40px]',
    'h-[40px]',
    'bg-[#FFFFFF]',
    'rounded-[7px]',
    'after:absolute',
    'after:top-[9px]',
    'after:left-[50%]',
    'after:translate-x-[-50%]',
    'after:h-[2px]',
    'after:w-[75%]',
    'after:bg-[#116ACC]',
    'before:absolute',
    'before:h-[2px]',
    'before:w-[75%]',
    'before:bg-[#116ACC]',
    'before:bottom-[9px]',
    'before:left-[50%]',
    'before:translate-x-[-50%]',
    'sm:block',
    'z-[11]'
  ];
  private burgerMenuButtonHiddenClasses: IClasses = ['sm:hidden'];
  private burgerMenuInnerClasses: IClasses = [
    'after:absolute',
    'after:top-[50%]',
    'after:left-[50%]',
    'after:translate-x-[-50%]',
    'after:translate-y-[-50%]',
    'after:h-[2px]',
    'after:w-[75%]',
    'after:bg-[#116ACC]'
  ];
  private mainNavRootClasses: IClasses = ['sm:hidden'];
  private mainNavLinkClasses: IClasses = ['[&:not(:last-of-type)]:mr-[25px]'];

  constructor() {
    super();
    this.logoPresenter = new LogoPresenter();
    this.routerPresenter = new RouterPresenter();
    this.mainNavPresenter = new MainNavPresenter({
      classNamesRoot: this.mainNavRootClasses,
      classNamesLink: this.mainNavLinkClasses
    });
    this.burgerMenuPresenter = new BurgerMenuPresenter();
    this.authorizationService = new AuthorizationService();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.checkAccess();
    this.combineElements();
    this.setHandlers();
    this.addHandlerOuterClick();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('header');
    (<HTMLElement>this.siteContainerElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.linkLogoElement) = this.routerPresenter.createLink('/');
    (<HTMLButtonElement>this.burgerMenuButtonElement) =
      this.domCreatorService.createElement('button');
    (<HTMLElement>this.burgerMenuInnerElement) = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootElementClasses);
    this.siteContainerElement.classList.add(...this.siteContainerClasses);
    this.burgerMenuButtonElement.classList.add(...this.burgerMenuButtonClasses);
    this.burgerMenuInnerElement.classList.add(...this.burgerMenuInnerClasses);
  }

  private checkAccess() {
    if (!this.authorizationService.isAuth()) {
      this.mainNavPresenter.getView().hidden();
      this.burgerMenuPresenter.getView().hidden();
      return;
    }
    this.mainNavPresenter.getView().visible();
    this.burgerMenuPresenter.getView().visible();
  }

  protected combineElements(): void {
    this.rootElement.append(this.siteContainerElement, this.burgerMenuPresenter.render());
    this.linkLogoElement.append(this.logoPresenter.render());
    this.burgerMenuButtonElement.append(this.burgerMenuInnerElement);
    this.siteContainerElement.append(
      this.linkLogoElement,
      this.burgerMenuButtonElement,
      this.mainNavPresenter.render()
    );
  }

  private addHandlerOuterClick(): void {
    document.addEventListener('click', (ev) => {
      if (
        this.burgerMenuButtonElement.contains(<HTMLElement>ev.target) ||
        this.burgerMenuPresenter.render().contains(<HTMLElement>ev.target)
      ) {
        return;
      }
      this.burgerMenuPresenter.getView().switchVisibility(false);
    });
  }

  private setHandlers(): void {
    this.burgerMenuButtonElement.addEventListener('click', () => {
      if (document.documentElement.scrollTop) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }

      setTimeout(() => this.burgerMenuPresenter.getView().switchVisibility());
    });
  }

  public visibleMenu(): void {
    this.mainNavPresenter.getView().visible();
    this.burgerMenuButtonElement.classList.remove(...this.burgerMenuButtonHiddenClasses);
    this.burgerMenuPresenter.getView().visible();
  }

  public setActiveRouteToMenu(url: TUrl): void {
    this.mainNavPresenter.getView().setActiveRoute(url);
    this.burgerMenuPresenter.getView().setActiveRoute(url);
  }

  public hiddenMenu(): void {
    this.mainNavPresenter.getView().hidden();
    this.burgerMenuButtonElement.classList.add(...this.burgerMenuButtonHiddenClasses);
    this.burgerMenuPresenter.getView().hidden();
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
