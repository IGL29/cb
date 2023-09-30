import { RouterPresenter } from '~presenters/RouterPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { IMainNavViewArgs } from '~types/mainNav';
import { TUrl } from '~types/requests';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class MainNavView extends View {
  private readonly rootElement: HTMLElement;
  private readonly wrapperButtonsElement: HTMLElement;
  private readonly linkAtmsMapElement: HTMLElement;
  private readonly linkAccountsElement: HTMLElement;
  private readonly linkCurrencyElement: HTMLElement;
  private readonly linkLogoutElement: HTMLElement;

  private readonly routerPresenter: RouterPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private rootElementClasses: IClasses = [];
  private rootElementHiddenClasses: IClasses = ['hidden'];
  private wrapperButtonsClasses: IClasses = [];
  private linkElementClasses: IClasses = [
    'inline-block',
    'bg-white',
    'rounded-[7px]',
    'px-[24px]',
    'py-[16px]',
    'after:border-2',
    'relative',
    'after:content("")',
    'after:absolute',
    'after:top-0',
    'after:left-0',
    'after:rounded-[6px]',
    'after:w-full',
    'after:h-full',
    'after:border-[#116ACC]',
    'hover:after:border-[#5897DB]',
    'active:after:border-[#116ACC]',
    'text-[#116ACC]',
    'text-[16px]',
    'font-medium',
    'hover:bg-[#A0C3EB]',
    'active:bg-[#CFE1F5]',
    'transition-background',
    'after:transition-background',
    'duration-300',
    'after:duration-300',
    'md:text-[14px]',
    'md:px-[20px]',
    'md:py-[12px]'
  ];
  private linkActiveClasses: IClasses = ['bg-[#A0C3FF]'];
  private externalRootClasses: IClasses;
  private externalWrapperButtonsClasses: IClasses;
  private externalLinkClasses: IClasses;

  private linkAtmsMapValue: string = 'Банкоматы';
  private linkAccountValue: string = 'Счета';
  private linkCurrencyValue: string = 'Валюта';
  private linkLogoutValue: string = 'Выйти';

  constructor({
    classNamesRoot = [],
    classNamesWrapperButtons = [],
    classNamesLink = []
  }: IMainNavViewArgs = {}) {
    super();
    this.externalRootClasses = classNamesRoot;
    this.externalWrapperButtonsClasses = classNamesWrapperButtons;
    this.externalLinkClasses = classNamesLink;
    this.routerPresenter = new RouterPresenter();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.combineElements();
    this.addClasses();
    this.setValues();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.wrapperButtonsElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.linkAtmsMapElement) = this.routerPresenter.createLink('/atms-map');
    (<HTMLElement>this.linkAccountsElement) = this.routerPresenter.createLink('/');
    (<HTMLElement>this.linkCurrencyElement) =
      this.routerPresenter.createLink('/currency-conversion');
    (<HTMLElement>this.linkLogoutElement) = this.routerPresenter.createLink('/logout');
  }

  protected combineElements(): void {
    this.rootElement.append(this.wrapperButtonsElement);
    this.wrapperButtonsElement.append(this.linkAtmsMapElement);
    this.wrapperButtonsElement.append(this.linkAccountsElement);
    this.wrapperButtonsElement.append(this.linkCurrencyElement);
    this.wrapperButtonsElement.append(this.linkLogoutElement);
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootElementClasses, ...this.externalRootClasses);
    this.wrapperButtonsElement.classList.add(
      ...this.wrapperButtonsClasses,
      ...this.externalWrapperButtonsClasses
    );
    this.linkAtmsMapElement.classList.add(...this.linkElementClasses, ...this.externalLinkClasses);
    this.linkAccountsElement.classList.add(...this.linkElementClasses, ...this.externalLinkClasses);
    this.linkCurrencyElement.classList.add(...this.linkElementClasses, ...this.externalLinkClasses);
    this.linkLogoutElement.classList.add(...this.linkElementClasses, ...this.externalLinkClasses);
  }

  protected setValues(): void {
    this.linkAtmsMapElement.textContent = this.linkAtmsMapValue;
    this.linkAccountsElement.textContent = this.linkAccountValue;
    this.linkCurrencyElement.textContent = this.linkCurrencyValue;
    this.linkLogoutElement.textContent = this.linkLogoutValue;
  }

  public hidden(): void {
    this.rootElement.classList.add(...this.rootElementHiddenClasses);
  }
  public visible(): void {
    this.rootElement.classList.remove(...this.rootElementHiddenClasses);
  }

  public getLinkHref(linkElement: HTMLElement) {
    return linkElement.getAttribute('href');
  }

  public setActiveRoute(url: TUrl): void {
    this.getLinks().forEach((linkElement) => {
      if (this.getLinkHref(linkElement) === url) {
        this.setActiveLink(linkElement);
        return;
      }
      this.resetActiveLink(linkElement);
    });
  }

  public getLinks(): Array<HTMLElement> {
    return [
      this.linkAtmsMapElement,
      this.linkAccountsElement,
      this.linkCurrencyElement,
      this.linkLogoutElement
    ];
  }

  public setActiveLink(linkElement: HTMLElement): void {
    linkElement.classList.add(...this.linkActiveClasses);
  }

  public resetActiveLink(linkElement: HTMLElement): void {
    linkElement.classList.remove(...this.linkActiveClasses);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
