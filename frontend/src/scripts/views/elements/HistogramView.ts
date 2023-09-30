import { View } from '~types/view';
import { IClasses } from '~types/select';
import {
  IDataForValuesRightArgs,
  IDrawValuesRightArgs,
  IHistogramViewArgs
} from '~types/histogramView';
import { IDataWithMultiplyValue, IDataWithOneValue } from '~types/graph';
import { ObservableViewportSize } from '~services/ObservableViewportSize';
import { Observable } from '~services/Observable';
import { lastCalled } from '~utils/lastCalled';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class HistogramView extends View {
  private readonly rootElement: HTMLCanvasElement;
  private readonly reserveWrapperElement: HTMLElement;

  private rootClasses: IClasses = ['w-full', 'h-full'];
  private rootExternalClasses: IClasses = [];

  private readonly viewportSizeStream: Observable;
  private ctx: CanvasRenderingContext2D | null;
  private readonly domCreatorService: DOMCreatorService;
  private options = {
    lineWidth: 1,
    heightBottomValues: 15,
    widthRightValues: 12,
    firstSpace: 6,
    spaceBetween: 5,
    colWidth: 9,
    spaceToTextRight: 1,
    fontSize: 3,
    fontStyle: '#000000',
    borderStyle: '#000000',
    collFillStyle: '#116ACC',
    collFillStyleUp: '#76CA66',
    collFillStyleDown: '#FD4E5D'
  };

  private currentSizes = {
    canvasWidth: 586,
    canvasHeight: 195,
    heightForHistogram: 0,
    widthForHistogram: 0,
    lineWidth: 1,
    heightBottomValues: 30,
    widthRightValues: 73,
    firstSpace: 35,
    spaceBetween: 28,
    colWidth: 50,
    spaceToTextRight: 5,
    fontSize: 20,
    widthAllCol: 0
  };

  private savedData: IDataWithMultiplyValue[] | IDataWithOneValue[];
  private heightForHistogram: number;
  private widthForHistogram: number;
  private lastCalledRedraw: typeof this.redraw;

  constructor({ rootExternalClasses = [] }: IHistogramViewArgs = {}) {
    super();
    this.rootExternalClasses = rootExternalClasses;
    this.viewportSizeStream = new ObservableViewportSize();
    this.domCreatorService = new DOMCreatorService();
    this.subscribe();
    this.init();

    this.lastCalledRedraw = lastCalled(() => {
      this.redraw();
    }, 800);
  }

  private init() {
    this.createElements();
    this.combineElements();
    this.addClasses();
    this.setValues();
  }

  private redraw(): void {
    if (!this.savedData || !this.ctx) {
      return;
    }
    this.ctx.clearRect(0, 0, this.currentSizes.canvasWidth, this.currentSizes.canvasHeight);
    this.fillGraph(this.savedData);
  }

  private subscribe(): void {
    this.viewportSizeStream.subscribe({
      next: () => this.lastCalledRedraw()
    });
  }

  protected combineElements(): void {
    this.rootElement.append(this.reserveWrapperElement);
  }

  protected createElements(): void {
    (this.rootElement as HTMLElement) = this.domCreatorService.createElement('canvas');
    (this.reserveWrapperElement as HTMLElement) = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses, ...this.rootExternalClasses);
  }

  public fillGraph(data: IDataWithMultiplyValue[] | IDataWithOneValue[]): void {
    this.setContext();

    if (!this.ctx) {
      return;
    }

    this.savedData = data;
    this.setCanvasSizes();
    this.setSizesHistogram();

    const isMultipleValues = typeof data[0]?.value === 'object';

    if (isMultipleValues) {
      this.fillGrapghMultipleValues(<IDataWithMultiplyValue[]>data);
    } else {
      this.fillGraphInOneValue(<IDataWithOneValue[]>data);
    }

    this.drawBorder(this.currentSizes.widthForHistogram, this.currentSizes.heightForHistogram);
  }

  private fillGrapghMultipleValues(data: IDataWithMultiplyValue[]): void {
    const minValue = 0;
    const maxValue = Math.max(
      ...data.map((item: IDataWithMultiplyValue) => {
        let result = 0;

        if ('up' in item.value && item.value.up) {
          result += item.value.up;
        }
        if ('down' in item.value && item.value.down) {
          result += item.value.down;
        }
        return result;
      })
    );

    data.forEach((itemData: IDataWithMultiplyValue, index: number) => {
      if (!this.ctx) {
        return;
      }

      let coordinateX = null;
      let valueOfHistogramHeight1 = null;
      let coordinateY1 = null;
      let valueOfHistogramHeight2 = null;
      let coordinateY2 = null;
      let coordinateBottom = null;
      let valueOfHistogramHeight = null;

      coordinateX =
        this.currentSizes.firstSpace +
        this.currentSizes.colWidth * index +
        this.currentSizes.spaceBetween * index;

      if ('up' in itemData.value && itemData.value.up) {
        const percentOfMaxValue1 = (100 * itemData.value.up) / maxValue;
        valueOfHistogramHeight1 = Math.round(
          (percentOfMaxValue1 * this.currentSizes.heightForHistogram) / 100
        );
        valueOfHistogramHeight1 = valueOfHistogramHeight1 === 0 ? 1 : valueOfHistogramHeight1;
        coordinateY1 = this.currentSizes.heightForHistogram - valueOfHistogramHeight1;
      }

      if ('down' in itemData.value && itemData.value.down) {
        const percentOfMaxValue2 = (100 * itemData.value.down) / maxValue;
        valueOfHistogramHeight2 = Math.round(
          (percentOfMaxValue2 * this.currentSizes.heightForHistogram) / 100
        );
        valueOfHistogramHeight2 = valueOfHistogramHeight2 === 0 ? 1 : valueOfHistogramHeight2;
        coordinateY2 = this.currentSizes.heightForHistogram - valueOfHistogramHeight2;
      }

      if (
        coordinateX !== null &&
        coordinateY1 !== null &&
        coordinateY2 !== null &&
        valueOfHistogramHeight1 !== null &&
        valueOfHistogramHeight2 !== null
      ) {
        this.drawCol(
          coordinateX,
          coordinateY1 - valueOfHistogramHeight2,
          valueOfHistogramHeight1,
          this.options.collFillStyleUp
        );
        this.drawCol(
          coordinateX,
          coordinateY2,
          valueOfHistogramHeight2,
          this.options.collFillStyleDown
        );
        coordinateBottom = coordinateY2;
        valueOfHistogramHeight = valueOfHistogramHeight2;
      } else if (
        coordinateX !== null &&
        coordinateY1 !== null &&
        valueOfHistogramHeight1 !== null
      ) {
        this.drawCol(
          coordinateX,
          coordinateY1,
          valueOfHistogramHeight1,
          this.options.collFillStyleUp
        );
        coordinateBottom = coordinateY1;
        valueOfHistogramHeight = valueOfHistogramHeight1;
      } else if (coordinateX !== null && coordinateY2 !== null && valueOfHistogramHeight2) {
        this.drawCol(
          coordinateX,
          coordinateY2,
          valueOfHistogramHeight2,
          this.options.collFillStyleDown
        );
        coordinateBottom = coordinateY2;
        valueOfHistogramHeight = valueOfHistogramHeight2;
      }

      if (coordinateBottom !== null && valueOfHistogramHeight !== null) {
        this.drawValuesBottom(
          itemData.title,
          coordinateX,
          coordinateBottom,
          valueOfHistogramHeight,
          this.currentSizes.heightBottomValues,
          this.currentSizes.lineWidth
        );
      }
    });

    const dataForValuesRight = this.getDataForValuesRight({
      minValue,
      maxValue,
      widthForHistogram: this.currentSizes.widthForHistogram,
      heightForHistogram: this.currentSizes.heightForHistogram,
      widthRightValues: this.currentSizes.widthRightValues,
      spaceToTextRight: this.currentSizes.spaceToTextRight,
      fontSize: this.currentSizes.fontSize
    });
    this.drawValuesRight(dataForValuesRight);
  }

  private fillGraphInOneValue(data: IDataWithOneValue[]): void {
    const minValue = 0;
    const maxValue = Math.max(...data.map((item: IDataWithOneValue) => item.value));

    data.forEach((itemData: IDataWithOneValue, index: number) => {
      if (!this.ctx) {
        return;
      }

      const percentOfMaxValue = (100 * itemData.value) / maxValue;
      const valueOfHistogramHeight = Math.round(
        (percentOfMaxValue * this.currentSizes.heightForHistogram) / 100
      );

      const coordinateX =
        this.currentSizes.firstSpace +
        this.currentSizes.colWidth * index +
        this.currentSizes.spaceBetween * index;
      const coordinateY = this.currentSizes.heightForHistogram - valueOfHistogramHeight;

      this.drawCol(coordinateX, coordinateY, valueOfHistogramHeight);
      this.drawValuesBottom(
        itemData.title,
        coordinateX,
        coordinateY,
        valueOfHistogramHeight,
        this.currentSizes.heightBottomValues,
        this.currentSizes.lineWidth
      );
    });

    const dataForValuesRight = this.getDataForValuesRight({
      minValue,
      maxValue: Number(maxValue.toFixed(2)),
      widthForHistogram: this.currentSizes.widthForHistogram,
      heightForHistogram: this.currentSizes.heightForHistogram,
      widthRightValues: this.currentSizes.widthRightValues,
      spaceToTextRight: this.currentSizes.spaceToTextRight,
      fontSize: this.currentSizes.fontSize
    });
    this.drawValuesRight(dataForValuesRight);
  }

  private setSizesHistogram(): void {
    this.currentSizes.heightForHistogram =
      this.currentSizes.canvasHeight -
      (this.currentSizes.canvasHeight * this.options.heightBottomValues) / 100 -
      (this.currentSizes.canvasHeight * this.options.lineWidth) / 100;
    this.currentSizes.widthForHistogram =
      this.currentSizes.canvasWidth -
      (this.currentSizes.canvasWidth * this.options.widthRightValues) / 100;
    this.currentSizes.lineWidth = (this.currentSizes.canvasHeight * this.options.lineWidth) / 100;
    this.currentSizes.heightBottomValues =
      (this.currentSizes.canvasHeight * this.options.heightBottomValues) / 100;
    this.currentSizes.widthRightValues =
      (this.currentSizes.canvasWidth * this.options.widthRightValues) / 100;
    this.currentSizes.firstSpace = (this.currentSizes.canvasWidth * this.options.firstSpace) / 100;

    if (this.savedData.length > 6) {
      this.currentSizes.widthAllCol =
        this.currentSizes.widthForHistogram - this.currentSizes.firstSpace;
      const spaceOneColAndSpace = this.currentSizes.widthAllCol / this.savedData.length;
      const columnToSpaceRatio = (this.options.colWidth / this.options.spaceBetween) * 100;
      const spaceToColumnRatio = (this.options.spaceBetween / this.options.colWidth) * 100;
      if (spaceToColumnRatio < columnToSpaceRatio) {
        this.currentSizes.spaceBetween = (spaceOneColAndSpace * spaceToColumnRatio) / 100;
        this.currentSizes.colWidth = spaceOneColAndSpace - this.currentSizes.spaceBetween;
      } else {
        this.currentSizes.colWidth = (spaceOneColAndSpace * columnToSpaceRatio) / 100;
        this.currentSizes.spaceBetween = spaceOneColAndSpace - this.currentSizes.colWidth;
      }
    } else {
      this.currentSizes.spaceBetween =
        (this.currentSizes.canvasWidth * this.options.spaceBetween) / 100;

      this.currentSizes.colWidth = (this.currentSizes.canvasWidth * this.options.colWidth) / 100;
    }
    const colWidth = Math.round(this.currentSizes.colWidth);
    this.currentSizes.fontSize = colWidth > 30 ? 23 : colWidth;
    this.currentSizes.spaceToTextRight =
      (this.currentSizes.canvasWidth * this.options.spaceToTextRight) / 100;
  }

  private setContext(): void {
    this.ctx = this.rootElement.getContext('2d', { alpha: true });
  }

  private setCanvasSizes(): void {
    const ratio = window.devicePixelRatio;
    this.currentSizes.canvasWidth = this.rootElement.getBoundingClientRect().width * ratio;
    this.currentSizes.canvasHeight = this.rootElement.getBoundingClientRect().height * ratio;

    this.rootElement.width = this.currentSizes.canvasWidth;
    this.rootElement.height = this.currentSizes.canvasHeight;
  }

  private drawValuesBottom(
    text: string,
    coordinateX: number,
    coordinateY: number,
    valueOfCanvasHeight: number,
    heightBottomValues: number,
    lineWidth: number
  ): void {
    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = this.options.fontStyle;
    this.ctx.font = `${this.currentSizes.fontSize}px Work Sans`;
    const widthText = this.ctx.measureText(text).width;
    this.ctx.fillText(
      text,
      coordinateX + Math.floor(this.currentSizes.colWidth / 2) - Math.floor(widthText / 2),
      coordinateY + valueOfCanvasHeight + (heightBottomValues + lineWidth) / 2
    );
  }

  private drawCol(
    coordinateX: number,
    coordinateY: number,
    height: number,
    color: string = this.options.collFillStyle
  ): void {
    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = color;
    this.ctx.fillRect(coordinateX + 0.5, coordinateY + 0.5, this.currentSizes.colWidth, height);
  }

  private getDataForValuesRight({
    minValue,
    maxValue,
    widthForHistogram,
    heightForHistogram,
    widthRightValues,
    spaceToTextRight,
    fontSize
  }: IDataForValuesRightArgs) {
    const maxValueX = widthForHistogram + spaceToTextRight;
    const maxValueY = fontSize;
    const minValueWidth = widthRightValues - spaceToTextRight;
    const minValueX = widthForHistogram + spaceToTextRight;
    const minValueY = heightForHistogram;
    const maxValueWidth = widthRightValues - spaceToTextRight;

    return {
      minValue,
      maxValue,
      minValueX,
      minValueY,
      minValueWidth,
      maxValueX,
      maxValueY,
      maxValueWidth
    };
  }

  private drawValuesRight({
    minValue,
    maxValue,
    minValueX,
    minValueY,
    minValueWidth,
    maxValueX,
    maxValueY,
    maxValueWidth
  }: IDrawValuesRightArgs): void {
    if (!this.ctx) {
      return;
    }
    this.ctx.fillText(String(minValue), minValueX, minValueY, minValueWidth);
    this.ctx.fillText(String(maxValue), maxValueX, maxValueY, maxValueWidth);
  }

  private drawBorder(width: number, height: number): void {
    if (!this.ctx) {
      return;
    }
    this.ctx.fillStyle = this.options.borderStyle;
    this.ctx.beginPath();
    this.ctx.moveTo(0.5, 0);
    this.ctx.lineTo(0.5, height + 0.5);
    this.ctx.lineTo(width - 0.5, height + 0.5);
    this.ctx.lineTo(width - 0.5, 0 + 0.5);
    this.ctx.lineTo(0.5, 0.5);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  protected setValues(): void {
    this.reserveWrapperElement.textContent = 'Canvas не поддерживается вашим браузером';
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
