import { View, IAddHandlerArgs } from '~types/view';
import { IClasses } from '~types/select';
import { transformCurrencyFilter } from 'src/scripts/filters/transformCurrencyFilter';
import { BalanceDynamicsPresenter } from '~presenters/BalanceDynamicsPresenter';
import { ButtonPresenter } from '~presenters/ButtonPresenter';
import { IDescriptionBalanceArgs } from '~types/descriptionBalance';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class DescriptionBalanceView extends View {
  private readonly rootElement: HTMLElement;
  private readonly siteContainerElement: HTMLElement;
  private readonly wrapperAccountElement: HTMLElement;
  private readonly wrapperBalanceElement: HTMLElement;
  private readonly wrapperTitleElement: HTMLElement;
  private readonly titleElement: HTMLElement;
  private readonly accountTitleElement: HTMLElement;
  private readonly textBalanceElement: HTMLElement;
  private readonly descrBalanceElement: HTMLElement;

  private readonly buttonBackPresenter: ButtonPresenter;
  private readonly blanceDynamicsBlockPresenter: BalanceDynamicsPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private readonly rootClasses: IClasses = [];
  private readonly externalRootClasses: IClasses = [];
  private readonly siteContainerClasses: IClasses = [];
  private readonly titleElementClasses: IClasses = [
    'text-[34px]',
    'font-Work-Sans',
    'font-bold',
    'leading-none',
    'lg:text-[25px]'
  ];
  private readonly accountTitleElementClasses: IClasses = [
    'font-WOrk-Snas',
    'text-[34px]',
    'font-regular',
    'leading-none',
    'lg:text-[25px]',
    'sm:text-[18px]',
    'sm:mb-[20px]',
    'xs:text-center'
  ];
  private readonly wrapperTitleElementClasses: IClasses = [
    'flex',
    'justify-between',
    'items-center',
    'mb-[30px]',
    'xs:flex-col-reverse',
    'sm:mb-[20px]',
    'xs:mb-[20px]'
  ];
  private readonly wrapperAccountElementClasses: IClasses = [
    'flex',
    'justify-between',
    'sm:flex-col'
  ];
  private readonly wrapperBalanceElementClasses: IClasses = ['flex', 'justify-between'];
  private readonly descrBalanceElementClasses: IClasses = ['mr-[15px]'];

  constructor({ rootClasses = [] }: IDescriptionBalanceArgs) {
    super();

    this.externalRootClasses = rootClasses;
    this.buttonBackPresenter = new ButtonPresenter({
      buttonValue: 'Вернуться назад',
      rootClasses: ['xs:w-full', 'xs:mb-[25px]']
    });
    this.blanceDynamicsBlockPresenter = new BalanceDynamicsPresenter();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.combineElements();
    this.addClasses();
    this.addHandlers();
    this.setValues();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.siteContainerElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.wrapperTitleElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.titleElement) = this.domCreatorService.createElement('h1');
    (<HTMLElement>this.accountTitleElement) = this.domCreatorService.createElement('h2');
    (<HTMLElement>this.textBalanceElement) = this.domCreatorService.createElement('p');
    (<HTMLElement>this.wrapperAccountElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.wrapperBalanceElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.descrBalanceElement) = this.domCreatorService.createElement('p');
  }

  protected combineElements(): void {
    this.rootElement.append(this.siteContainerElement);
    this.siteContainerElement.append(this.wrapperTitleElement);
    this.siteContainerElement.append(this.wrapperAccountElement);

    this.wrapperTitleElement.append(this.titleElement);
    this.wrapperTitleElement.append(this.buttonBackPresenter.render());

    this.wrapperAccountElement.append(this.accountTitleElement);
    this.wrapperAccountElement.append(this.wrapperBalanceElement);

    this.wrapperBalanceElement.append(this.descrBalanceElement);
    this.wrapperBalanceElement.append(this.blanceDynamicsBlockPresenter.render());
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses, ...this.externalRootClasses);
    this.wrapperTitleElement.classList.add(...this.wrapperTitleElementClasses);
    this.siteContainerElement.classList.add(...this.siteContainerClasses);
    this.titleElement.classList.add(...this.titleElementClasses);
    this.accountTitleElement.classList.add(...this.accountTitleElementClasses);
    this.wrapperBalanceElement.classList.add(...this.wrapperBalanceElementClasses);
    this.wrapperAccountElement.classList.add(...this.wrapperAccountElementClasses);
    this.descrBalanceElement.classList.add(...this.descrBalanceElementClasses);
  }

  protected setValues(): void {
    this.descrBalanceElement.textContent = 'Баланс:';
    this.textBalanceElement.textContent = transformCurrencyFilter('0');
    this.accountTitleElement.textContent = 'Загружаем...';
  }

  public setAccountValue(account: string): void {
    this.accountTitleElement.textContent = account;
  }

  public setTitleValue(value: string): void {
    this.titleElement.textContent = value;
  }

  public setBalanceValue(value: string): void {
    const transformValue = transformCurrencyFilter(value);
    this.blanceDynamicsBlockPresenter.getView().setBalanceValue(transformValue);
  }

  private addHandlers(): void {
    this.addHandler({
      target: 'btn-back-to-main',
      type: 'click',
      handler: () => window.history.back()
    });
  }

  public addHandler(args: IAddHandlerArgs<'btn-back-to-main'>): void {
    if (args.target === 'btn-back-to-main') {
      this.buttonBackPresenter.render().addEventListener(args.type, args.handler);
    }
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
