import { transformCurrencyFilter } from 'src/scripts/filters/transformCurrencyFilter';
import { transformDateFilter } from 'src/scripts/filters/transformDateFilter';
import { ButtonPresenter } from '~presenters/ButtonPresenter';
import { RouterPresenter } from '~presenters/RouterPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { ICardArgs } from '~types/card';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class CardView extends View {
  private readonly rootElement: HTMLElement;
  private readonly numberElement: HTMLElement;
  private readonly priceElement: HTMLElement;
  private readonly wrapperElement: HTMLElement;
  private readonly dateWrapperElement: HTMLElement;
  private readonly dateDescrElement: HTMLElement;
  private readonly dateElement: HTMLElement;
  private readonly linkAccoundDetailsElement: HTMLElement;

  private readonly routerPresenter: RouterPresenter;
  private readonly buttonOpenAccount: ButtonPresenter;
  private domCreatorService: DOMCreatorService;

  private containerElementClasses = [
    'bg-[#FFFFFF]',
    'shadow-[0px_5px_20px_rgba(0,0,0,0.25)]',
    'rounded-[9px]',
    'p-[22px]'
  ];
  private numberElementClasses: IClasses = [
    'font-Roboto',
    'text-[18px]',
    'font-medium',
    'mb-[9px]',
    'xs:text-[16px]'
  ];
  private priceElementClasses: IClasses = [
    'font-Ubuntu',
    'text-[15px]',
    'font-regular',
    'mb-[9px]'
  ];
  private dateWrapperElementClasses: IClasses = ['mr-[15px]', 'self-end'];
  private dateDescrElementClasses: IClasses = ['font-Work-Sans', 'text-[13px]', 'font-bold'];
  private dateElementClasses: IClasses = ['leading-none', 'text-[13px]'];
  private wrapperElementClasses: IClasses = ['flex', 'justify-between'];
  private classNames: IClasses = [];

  private numberValue: string;
  private readonly priceValue: number;
  private readonly descrValue: string;
  private readonly descrTransactionsValue = 'Последняя транзакция:';
  private readonly dateEmptyValue = '---';

  constructor({ numberValue, priceValue, descrValue, classNames }: ICardArgs) {
    super();
    this.buttonOpenAccount = new ButtonPresenter({
      buttonValue: 'Открыть',
      rootClasses: ['btn--icon', 'card__btn']
    });
    this.numberValue = numberValue;
    this.priceValue = priceValue;
    this.descrValue = descrValue;
    this.classNames = classNames;
    this.routerPresenter = new RouterPresenter();
    this.domCreatorService = new DOMCreatorService();

    this.createElements();
    this.addClasses();
    this.setValues();
    this.combineElements();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('li');
    (<HTMLElement>this.numberElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.priceElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.dateWrapperElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.dateDescrElement) = this.domCreatorService.createElement('p');
    (<HTMLElement>this.dateElement) = this.domCreatorService.createElement('p');
    (<HTMLElement>this.wrapperElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.linkAccoundDetailsElement) = this.routerPresenter.createLink(
      `/account-details/${this.numberValue}`
    );
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.containerElementClasses, ...this.classNames);
    this.numberElement.classList.add(...this.numberElementClasses);
    this.priceElement.classList.add(...this.priceElementClasses);
    this.dateWrapperElement.classList.add(...this.dateWrapperElementClasses);
    this.dateDescrElement.classList.add(...this.dateDescrElementClasses);
    this.dateElement.classList.add(...this.dateElementClasses);
    this.wrapperElement.classList.add(...this.wrapperElementClasses);
  }

  protected setValues(): void {
    this.numberElement.textContent = String(this.numberValue);
    this.priceElement.textContent = transformCurrencyFilter(String(this.priceValue));
    this.dateElement.textContent = transformDateFilter(this.descrValue) || this.dateEmptyValue;
    this.dateDescrElement.textContent = this.descrTransactionsValue;
  }

  protected combineElements(): void {
    this.wrapperElement.append(this.dateWrapperElement);
    this.dateWrapperElement.append(this.dateDescrElement);
    this.dateWrapperElement.append(this.dateElement);
    this.linkAccoundDetailsElement.append(this.buttonOpenAccount.render());
    this.wrapperElement.append(this.linkAccoundDetailsElement);
    this.rootElement.append(this.numberElement);
    this.rootElement.append(this.priceElement);
    this.rootElement.append(this.wrapperElement);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
