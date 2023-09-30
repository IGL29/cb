import { IClasses } from '~types/select';
import {
  IAppendCells,
  ICreateRowArgs,
  IFillDataArgs,
  ISetSelValueArgs,
  ITableArgs,
  TSavedData,
  TValue
} from '~types/table';
import { View } from '~types/view';
import { ObservableViewportSize } from '~services/ObservableViewportSize';
import { Observable } from '~services/Observable';
import { lastCalled } from '~utils/lastCalled';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class TableView extends View {
  private readonly rootElement: HTMLElement;
  private readonly headerElement: HTMLElement;
  private readonly bodyElement: HTMLElement;
  private readonly loadMoreTargetElement: HTMLElement;
  private allRowElements: HTMLElement[];

  private readonly domCreatorService: DOMCreatorService;

  private containerClasses: IClasses = [];
  private headerClasses: IClasses = ['bg-[#116ACC]', 'rounded-[15px]', 'md:hidden'];
  private cellHeaderClasses: IClasses = [
    '[&:not(:last-of-type)]:mr-[10px]',
    'font-Ubuntu',
    'text-[#FFFFFF]',
    'text-[20px]',
    'flex-[0_1_255px]',
    'lg:text-[16px]',
    'lg:flex-[0_1_25%]'
  ];
  private bodyClasses: IClasses = ['lg:text-[12px]'];
  private rowBodyClasses: IClasses = [
    'relative',
    'flex',
    'px-[50px]',
    'pt-[21px]',
    'pb-[26px]',
    'after:content("")',
    'after:absolute',
    'after:bottom-0',
    'after:left-0',
    'after:w-full',
    'after:h-[2px]',
    'after:bg-[#DBE4F7]',
    'lg:px-[20px]'
  ];
  private rowHeaderClasses: IClasses = [
    'flex',
    'px-[50px]',
    'pt-[20px]',
    'pb-[20px]',
    'lg:px-[20px]'
  ];
  private cellBodyClasses: IClasses = [
    '[&:not(:last-of-type)]:mr-[10px]',
    'font-Ubuntu',
    'font-regular',
    'flex-[0_1_255px]',
    'text-[#374151]',
    'lg:flex-[0_1_25%]'
  ];
  private rowInCellClasses: IClasses = [
    'flex',
    'justify-between',
    'relative',
    'xs:flex-col',
    'after:absolute',
    'after:bottom-0',
    'after:left-0',
    'after:w-full',
    'after:h-[1px]',
    'after:bg-[#DBE4F7]'
  ];
  private rowInVerticalTableClasses: IClasses = ['flex', 'flex-col', 'xs:px-0'];
  private headerVerticalTableClasses: IClasses = [
    'text-[#000000]',
    'font-bold',
    'text-[15px]',
    'lg:flex-[1_1_100%]',
    'xs:text-left'
  ];
  private cellBodyVerticalClasses: IClasses = [
    'text-right',
    'text-[15px]',
    'xs:text-left',
    'lg:flex-[1_1_100%]'
  ];

  private headerValues;
  private columnsCount;
  private loadMoreCallback;
  private optionsClasses = {
    up: ['text-[#76CA66]'],
    down: ['text-[#FD4E5D]']
  };
  private viewportSizeStream: Observable;
  private savedData: TSavedData = {
    values: [],
    options: [],
    renderingMethod: 'replace'
  };
  private lastCalledFillData: typeof this.fillData;

  constructor({ headerValues, columnsCount = null, loadMoreCallback }: ITableArgs) {
    super();
    this.loadMoreCallback = loadMoreCallback;
    this.headerValues = headerValues;
    this.columnsCount = columnsCount;
    this.domCreatorService = new DOMCreatorService();
    this.viewportSizeStream = new ObservableViewportSize();
    this.subscribe();
    this.createElements();
    this.addClasses();
    this.combineElements();
    this.lastCalledFillData = lastCalled(this.fillData.bind(this), 700);
    if (loadMoreCallback) {
      this.setIntersectionObserver();
    }
  }

  private setIntersectionObserver(): void {
    const root = null;

    const options = {
      root,
      rootMargin: '0px 0px 200px 0px',
      threshold: 1.0
    };
    const observer = new IntersectionObserver(this.observerCallback.bind(this), options);

    (<HTMLElement>this.loadMoreTargetElement) = this.domCreatorService.createElement('div');
    this.loadMoreTargetElement.dataset.observerTarget = 'true';
    this.rootElement.append(this.loadMoreTargetElement);

    if (this.loadMoreTargetElement) {
      observer.observe(this.loadMoreTargetElement);
    }
  }

  private observerCallback(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting) {
        this.loadMore();
      }
    });
  }

  private loadMore(): void {
    if (!this.loadMoreCallback) {
      return;
    }
    this.loadMoreCallback();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.headerElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.bodyElement) = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.containerClasses);
    this.headerElement.classList.add(...this.headerClasses);
    this.bodyElement.classList.add(...this.bodyClasses);
  }

  private setCellValue({ cellElement, value }: ISetSelValueArgs): void {
    if (typeof value === 'string' || typeof value === 'number') {
      cellElement.textContent = String(value);
      return;
    }
    if (typeof value === 'object' && value.tagName) {
      cellElement.append(value);
    }
  }

  public fillData({ values, options, renderingMethod = 'replace' }: IFillDataArgs): void {
    const fragment = document.createDocumentFragment();
    const newRowsElements: HTMLElement[] = [];

    this.saveData({ values, options, renderingMethod });

    for (let i = 0; values.length > i; i++) {
      const isVerticalTable = window.document.documentElement.clientWidth <= 992;
      const rowElement = this.createRow({
        cellValues: values[i],
        options: options?.[i],
        isVerticalTable
      });
      newRowsElements.push(rowElement);
      fragment.append(rowElement);
    }

    if (renderingMethod === 'replace') {
      this.bodyElement.innerHTML = '';
      this.allRowElements = newRowsElements;
      this.bodyElement.append(fragment);
    }

    if (renderingMethod === 'append') {
      this.allRowElements.push(...newRowsElements);
      this.bodyElement.append(fragment);
    }

    if (renderingMethod === 'prepend') {
      this.allRowElements = [...newRowsElements, ...this.allRowElements];
      this.bodyElement.prepend(fragment);
    }
  }

  protected combineElements(): void {
    this.rootElement.append(this.headerElement);
    this.rootElement.append(this.bodyElement);
    this.headerElement.append(this.createRow({ cellValues: this.headerValues, isHeader: true }));
  }

  private saveData({ values, options, renderingMethod }: IFillDataArgs) {
    if (renderingMethod === 'append') {
      this.savedData.values.push(...values);
      if (options) {
        this.savedData.options.push(...options);
      }
      return;
    }

    if (renderingMethod === 'prepend') {
      this.savedData.values = [...values, ...this.savedData.values];
      if (options) {
        this.savedData.options = [...options, ...this.savedData.options];
      }
      return;
    }

    this.savedData.values = values;
    if (options) {
      this.savedData.options = options;
    }
  }

  private subscribe(): void {
    this.viewportSizeStream.subscribe({
      next: () => {
        this.lastCalledFillData(this.savedData);
      }
    });
  }

  private createCell(
    value: TValue,
    isHeader?: boolean,
    option?: 'up' | 'down',
    isHeaderVerticalTable?: boolean,
    isBodyVerticalTable?: boolean
  ): HTMLElement {
    const cellElement = this.domCreatorService.createElement('div');
    const cellClasses = [];

    if (isHeader) {
      cellClasses.push(...this.cellHeaderClasses);
    }
    if (option && !isHeaderVerticalTable) {
      cellClasses.push(...[...this.cellBodyClasses, ...this.optionsClasses[option]]);
    }
    if (isHeaderVerticalTable) {
      cellClasses.push(...this.headerVerticalTableClasses);
    }
    if (isBodyVerticalTable) {
      cellClasses.push(...this.cellBodyVerticalClasses);
    }
    cellClasses.push(...this.cellBodyClasses);

    cellElement.classList.add(...cellClasses);
    this.setCellValue({ cellElement, value });
    return cellElement;
  }

  private getRowInCellElement(): HTMLElement {
    const rowInCellElement = this.domCreatorService.createElement('div');
    rowInCellElement.classList.add(...this.rowInCellClasses);
    return rowInCellElement;
  }

  private appendCells({
    rowElement,
    cellValues,
    isHeader,
    options,
    isVerticalTable
  }: IAppendCells): HTMLElement {
    const columnsCount = this.columnsCount || cellValues.length;
    for (let i = 0; columnsCount > i; i++) {
      if (isVerticalTable) {
        const rowInCell = this.getRowInCellElement();
        rowInCell.append(this.createCell(this.headerValues[i], false, options?.[i], true));
        rowInCell.append(this.createCell(cellValues[i], false, options?.[i], false, true));
        rowElement.append(rowInCell);
      } else {
        rowElement.append(this.createCell(cellValues[i], isHeader, options?.[i]));
      }
    }
    return rowElement;
  }

  private createRow({
    cellValues,
    isHeader,
    options,
    isVerticalTable = false
  }: ICreateRowArgs): HTMLElement {
    const rowElement = this.domCreatorService.createElement('div');

    if (isHeader) {
      rowElement.classList.add(...this.rowHeaderClasses);
    } else {
      const classes: IClasses = isVerticalTable
        ? [...this.rowBodyClasses, ...this.rowInVerticalTableClasses]
        : this.rowBodyClasses;
      rowElement.classList.add(...classes);
    }
    return this.appendCells({ rowElement, cellValues, isHeader, options, isVerticalTable });
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
