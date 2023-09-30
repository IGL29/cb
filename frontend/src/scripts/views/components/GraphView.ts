import { View } from '~types/view';
import { HistogramPresenter } from '~presenters/HistogramPresenter';
import { LoaderPresenter } from '~presenters/LoaderPresenter';
import { IClasses } from '~types/select';
import { IDataWithMultiplyValue, IDataWithOneValue } from '~types/graph';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class GraphView extends View {
  private readonly rootElement: HTMLElement;
  private readonly titleElement: HTMLElement;
  private readonly graphWrapperElement: HTMLElement;
  private messageTextElement: HTMLElement | null;

  private readonly histogramTransfer: HistogramPresenter;
  private readonly loaderPresenter: LoaderPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private readonly rootClasses: IClasses = [
    'py-[25px]',
    'px-[50px]',
    'bg-[#FFFFFF]',
    'rounded-[50px]',
    'shadow-[0px_5px_20px_rgba(0,0,0,0.25)]',
    'relative',
    'sm:px-[25px]',
    'xs:px-[10px]'
  ];
  private readonly titleClasses: IClasses = [
    'font-Work-Sans',
    'font-bold',
    'text-[20px]',
    'mb-[25px]',
    'xs:text-center',
    'xs:mb-[20px]'
  ];

  private readonly titleValue: string = 'Заголовок';
  private _isLoader: boolean = false;

  constructor() {
    super();
    this.histogramTransfer = new HistogramPresenter();
    this.loaderPresenter = new LoaderPresenter();
    this.domCreatorService = new DOMCreatorService();

    this.createElements();
    this.setValues();
    this.addClasses();
    this.combineElements();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.titleElement) = this.domCreatorService.createElement('h2');
    (<HTMLElement>this.graphWrapperElement) = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses);
    this.titleElement.classList.add(...this.titleClasses);
  }

  protected combineElements(): void {
    this.rootElement.append(this.titleElement);
    this.rootElement.append(this.graphWrapperElement);
    this.rootElement.append(this.loaderPresenter.render());
    this.graphWrapperElement.append(this.histogramTransfer.render());
  }

  protected setValues(): void {
    this.titleElement.textContent = this.titleValue;
  }

  public setTitleValue(value: string): void {
    this.titleElement.textContent = value;
  }

  public setRootClasses(classes: IClasses): void {
    this.rootElement.classList.add(...classes);
  }

  public setWrapperClasses(classes: IClasses): void {
    this.graphWrapperElement.classList.add(...classes);
  }

  public set isLoading(value: boolean) {
    this._isLoader = value;
    this.loaderPresenter.getView().switchVisibleLoader(value);
  }

  public fillGraph(data: IDataWithMultiplyValue[] | IDataWithOneValue[]): void {
    this.removeMessageHistogramTransfer();

    this.histogramTransfer.getView().fillGraph(data);
  }

  public setMessageHistogramTransfer(message: string): void {
    if (!this.messageTextElement) {
      this.messageTextElement = this.domCreatorService.createElement('p');
      this.graphWrapperElement.prepend(this.messageTextElement);
    }
    this.messageTextElement.textContent = message;
  }

  public removeMessageHistogramTransfer(): void {
    if (!this.messageTextElement) {
      return;
    }
    this.messageTextElement.remove();
    this.messageTextElement = null;
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
