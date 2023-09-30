import { View } from '~types/view';
import { IClasses } from '~types/select';
import { HorizontalTablePresenter } from '~presenters/HorizontalTablePresenter';
import { LoaderPresenter } from '~presenters/LoaderPresenter';
import { ICurrenciesTableArgs } from '~types/currenciesTable';
import { IFillDataArgs } from '~types/horizontalTable';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class CurrenciesTableView extends View {
  private readonly rootElement: HTMLElement;
  private readonly titleElement: HTMLElement;

  private readonly horizontalTablePresenter: HorizontalTablePresenter;
  private readonly loaderPresenter: LoaderPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = [
    'px-[50px]',
    'py-[50px]',
    'bg-[#FFFFFF]',
    'rounded-[50px]',
    'relative',
    'shadow-[0px_5px_20px_rgba(0,0,0,0.25)]',
    'sm:px-[30px]',
    'xs:px-[20px]',
    'xs:py-[30px]'
  ];
  private externalRootClasses: IClasses;
  private externalTableClasses: IClasses;
  private titleClasses: IClasses = [
    'font-Work-Sans',
    'font-bold',
    'text-[20px]',
    'mb-[25px]',
    'lg:text-[17px]',
    'md:text-[16px]',
    'xs:text-center'
  ];

  private readonly titleValue: string;
  private _isLoading: boolean = false;

  constructor({ title, classNamesRoot = [], classNamesTable = [] }: ICurrenciesTableArgs) {
    super();
    this.externalRootClasses = classNamesRoot;
    this.externalTableClasses = classNamesTable;
    this.loaderPresenter = new LoaderPresenter();
    this.titleValue = title;
    this.horizontalTablePresenter = new HorizontalTablePresenter({
      classNamesRoot: this.externalTableClasses
    });
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.combineElements();
    this.setValues();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.titleElement) = this.domCreatorService.createElement('h2');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses, ...this.externalRootClasses);
    this.titleElement.classList.add(...this.titleClasses);
  }

  protected combineElements() {
    this.rootElement.append(
      this.titleElement,
      this.horizontalTablePresenter.render(),
      this.loaderPresenter.render()
    );
  }

  protected setValues(): void {
    this.titleElement.textContent = this.titleValue;
  }

  set isLoading(value: boolean) {
    this._isLoading = value;
    this.loaderPresenter.getView().switchVisibleLoader(value);
  }

  public fillData(args: IFillDataArgs): void {
    this.horizontalTablePresenter.getView().fillData(args);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
