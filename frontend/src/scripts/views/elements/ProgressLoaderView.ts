import { DOMCreatorService } from '~services/DOMCreatorService';
import { IProgressLoaderArgs } from '~types/progressLoader';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class ProgressLoaderView extends View {
  private rootElement: HTMLElement;
  private svgElement: SVGElement;
  private circleSVGElement: SVGCircleElement;

  private readonly domCreatorService: DOMCreatorService;

  private svgClasses: IClasses = ['pointer-events-none'];
  private externalRootClasses: IClasses;

  private circleRadius = 10;
  private circleCY = 15;
  private circleCX = this.circleCY;
  private circumference = 2 * Math.PI * this.circleRadius;

  constructor({ classNamesRoot = [] }: IProgressLoaderArgs = {}) {
    super();
    this.externalRootClasses = classNamesRoot;
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.combineElements();
    this.setAttributes();
    this.addClasses();
    this.setStyles();
  }

  protected createElements(): void {
    this.rootElement = this.domCreatorService.createElement('div');
    this.svgElement = this.domCreatorService.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.circleSVGElement = this.domCreatorService.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
  }

  protected setAttributes(): void {
    this.svgElement.setAttribute('width', '30');
    this.svgElement.setAttribute('height', '30');
    this.svgElement.setAttribute('viewbox', '0 0 30 30');

    this.circleSVGElement.setAttribute('stroke', '#116ACC');
    this.circleSVGElement.setAttribute('stroke-width', '5');
    this.circleSVGElement.setAttribute('cx', `${this.circleCX}`);
    this.circleSVGElement.setAttribute('cy', `${this.circleCY}`);
    this.circleSVGElement.setAttribute('r', `${this.circleRadius}`);
    this.circleSVGElement.setAttribute('fill', 'transparent');
  }

  private setStyles() {
    this.circleSVGElement.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    this.circleSVGElement.style.strokeDashoffset = String(this.circumference);
    this.circleSVGElement.classList.add('transition-all', 'duration-[2s]');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.externalRootClasses);
    this.svgElement.classList.add(...this.svgClasses);
  }

  protected combineElements(): void {
    this.rootElement.append(this.svgElement);
    this.svgElement.append(this.circleSVGElement);
  }

  public setLoaderPosition(x: number, y: number) {
    this.rootElement.style.left = `${String(x)}px`;
    this.rootElement.style.top = `${String(y)}px`;
  }

  public setProgress(ratio: number) {
    const offset = this.circumference - (ratio / 100) * this.circumference;
    this.circleSVGElement.style.strokeDashoffset = String(offset);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
