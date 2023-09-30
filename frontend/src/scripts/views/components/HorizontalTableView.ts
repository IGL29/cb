import { DOMCreatorService } from '~services/DOMCreatorService';
import {
  IAppendCells,
  ICreateRowArgs,
  IFillDataArgs,
  IHorizontalTableArgs,
  ISetSelValueArgs,
  TValue
} from '~types/horizontalTable';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class HorizontalTableView extends View {
  private readonly rootElement: HTMLElement;

  private readonly domCreatorService: DOMCreatorService;

  private readonly rootClasses: IClasses = [];
  private readonly rowClasses: IClasses = [
    'relative',
    'flex',
    '[&:not(:last-of-type)]:mb-[25px]',
    'items-center',
    'leading-none',
    'xs:[&:not(:last-of-type)]:mb-[21px]'
  ];
  private readonly cellHeaderClasses: IClasses = [
    'mr-[10px]',
    'font-Work-Sans',
    'font-semibold',
    'text-[#000000]',
    'text-[20px]',
    'md:text-[18px]',
    'xs:text-[16px]'
  ];
  private readonly cellBodyClasses: IClasses = [
    'font-Ubuntu',
    'font-regular',
    'text-[#374151]',
    'pr-[35px]'
  ];
  private readonly cellEmptyClasses: IClasses = [
    'flex-[1_1_100%]',
    'relative',
    'self-stretch',
    'mr-[10px]',
    'after:content("")',
    'after:w-full',
    'after:h-full',
    'after:absolute',
    'after:top-0',
    'after:left-0',
    'after:border-b',
    'after:border-dotted',
    'after:border-[#000000]'
  ];

  private readonly optionsEmptyClasses = {
    up: ['after:border-[#76CA66]'],
    down: ['after:border-[#FD4E5D]']
  };
  private readonly optionsBodyClasses = {
    up: [
      'relative',
      'after:content("")',
      'after:absolute',
      'after:right-[0]',
      'after:top-[50%]',
      'after:translate-y-[-50%]',
      'after:border-b-[9px]',
      'after:border-r-[8px]',
      'after:border-l-[8px]',
      'after:border-b-[#76CA66]',
      'after:border-r-transparent',
      'after:border-t-transparent',
      'after:border-l-transparent'
    ],
    down: [
      'relative',
      'after:content("")',
      'after:absolute',
      'after:right-[0]',
      'after:top-[50%]',
      'after:translate-y-[-50%]',
      'after:border-t-[9px]',
      'after:border-r-[8px]',
      'after:border-l-[8px]',
      'after:border-t-[#FD4E5D]',
      'after:border-r-transparent',
      'after:border-b-transparent',
      'after:border-l-transparent'
    ]
  };

  private externalRootClasses: IClasses;

  private cellsElements: {
    [key: string]: { bodyElement: HTMLElement; emptyElement: HTMLElement; value: string };
  } = {};

  constructor({ classNamesRoot = [] }: IHorizontalTableArgs = {}) {
    super();
    this.externalRootClasses = classNamesRoot;
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.combineElements();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses, ...this.externalRootClasses);
  }

  private setCellValue({ cellElement, value }: ISetSelValueArgs): void {
    if (typeof value === 'string' || typeof value === 'number') {
      cellElement.textContent = String(value);
    }
  }

  public fillData({ values, options, renderingMethod = 'replace' }: IFillDataArgs): void {
    if (renderingMethod === 'update') {
      const fragment = document.createDocumentFragment();

      for (let i = 0; values.length > i; i++) {
        const rowValues = values[i];
        const optionClass = options?.[i];

        if (
          rowValues[0] in this.cellsElements &&
          String(rowValues[1]) !== this.cellsElements[rowValues[0]].value
        ) {
          this.cellsElements[rowValues[0]].value = String(rowValues[1]);
          this.cellsElements[rowValues[0]].bodyElement.textContent = String(rowValues[1]);
          this.cellsElements[rowValues[0]].bodyElement.classList.remove(
            ...this.optionsBodyClasses.down,
            ...this.optionsBodyClasses.up
          );
          this.cellsElements[rowValues[0]].bodyElement.classList.remove(
            ...this.optionsEmptyClasses.down,
            ...this.optionsEmptyClasses.up
          );

          if (optionClass) {
            this.cellsElements[rowValues[0]].bodyElement.classList.add(
              ...this.optionsBodyClasses[optionClass]
            );
            this.cellsElements[rowValues[0]].emptyElement.classList.add(
              ...this.optionsEmptyClasses[optionClass]
            );
          }
        } else {
          fragment.append(this.createRow({ cellValues: values[i], option: optionClass }));
          this.rootElement.append(fragment);
        }
      }
      return;
    }

    this.cellsElements = {};

    const fragment = document.createDocumentFragment();

    for (let i = 0; values.length > i; i++) {
      fragment.append(this.createRow({ cellValues: values[i], option: options?.[i] }));
    }

    if (renderingMethod === 'replace') {
      this.rootElement.innerHTML = '';
      this.rootElement.append(fragment);
    }

    if (renderingMethod === 'append') {
      this.rootElement.append(fragment);
    }

    if (renderingMethod === 'prepend') {
      this.rootElement.prepend(fragment);
    }
  }

  protected combineElements() {}

  private createCell(
    value?: TValue,
    isHeader?: boolean,
    option?: 'up' | 'down' | null
  ): HTMLDivElement {
    const cellElement = this.domCreatorService.createElement('div');

    if (value) {
      cellElement.classList.add(
        ...(isHeader
          ? this.cellHeaderClasses
          : option
          ? [...this.cellBodyClasses, ...this.optionsBodyClasses[option]]
          : this.cellBodyClasses)
      );
      this.setCellValue({ cellElement, value });
      return cellElement;
    }

    cellElement.classList.add(
      ...this.cellEmptyClasses,
      ...(option ? this.optionsEmptyClasses[option] : [])
    );
    return cellElement;
  }

  private appendCells({ rowElement, cellValues, option }: IAppendCells): HTMLElement {
    const headerCellElement = this.createCell(cellValues[0], true, option);
    const emptyCellElement = this.createCell('', false, option);
    const dataCellElement = this.createCell(cellValues[1], false, option);

    rowElement.append(headerCellElement, emptyCellElement, dataCellElement);

    this.cellsElements[cellValues[0]] = {
      bodyElement: dataCellElement,
      emptyElement: emptyCellElement,
      value: String(cellValues[1])
    };

    return rowElement;
  }

  private createRow({ cellValues, option }: ICreateRowArgs): HTMLElement {
    const rowElement = this.domCreatorService.createElement('div');
    rowElement.classList.add(...this.rowClasses);
    return this.appendCells({ rowElement, cellValues, option });
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
