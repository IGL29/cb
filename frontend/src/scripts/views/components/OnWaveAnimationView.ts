import { DOMCreatorService } from '~services/DOMCreatorService';
import { IOnWaveAnimationArgs, TFloatElement } from '~types/onWaveAnimation';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class OnWaveAnimationView extends View {
  private readonly rootElement: HTMLElement;
  private readonly coinElement: HTMLElement;
  private readonly animationContainerElement: HTMLElement;
  private readonly waveSvgOne: SVGElement;
  private readonly waveSvgTwo: SVGElement;
  private readonly pathForWaveOne: SVGPathElement;
  private readonly pathForWaveTwo: SVGPathElement;
  private readonly animate: SVGAnimateElement;
  private readonly animate2: SVGAnimateElement;

  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = ['w-full'];
  private animationContainerClasses: IClasses = [
    'relative',
    'w-full',
    'h-full',
    'min-h-[100px]',
    'after:bg-[#0e5db3]',
    'after:w-full',
    'after:h-[55px]',
    'after:absolute',
    'after:bottom-0',
    'after:left-0',
    'overflow-hidden'
  ];
  private floatClasses: IClasses = [
    'absolute',
    'bottom-[20px]',
    'left-[50%]',
    'z-[2]',
    'rotate-0',
    'translate-X-0',
    'translate-Y-0',
    'animate-coin'
  ];
  private coinClasses: IClasses = [
    'bg-[url("src/assets/coin.svg")]',
    'w-[50px]',
    'h-[50px]',
    'bg-no-repeat'
  ];
  private svgBgClasses: IClasses = [
    'left-0',
    'bottom-[50px]',
    'w-full',
    'h-[70px]',
    'absolute',
    'z-[1]'
  ];
  private svgBg2Classes: IClasses = [
    'left-[50%]',
    'bottom-0',
    'w-[120%]',
    'h-[95px]',
    'absolute',
    'z-[3]',
    'mirror-center',
    'animate-wave'
  ];

  private externalRootClasses: IClasses;
  private externalFloatClasses: IClasses;
  private floatElement: TFloatElement;

  constructor({
    floatElement,
    classNamesRoot = [],
    classNamesFloat = []
  }: IOnWaveAnimationArgs = {}) {
    super();
    this.floatElement = floatElement;
    this.externalRootClasses = classNamesRoot;
    this.externalFloatClasses = classNamesFloat;
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.combineElements();
    this.setAttributes();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');
    (<HTMLElement>this.animationContainerElement) = this.domCreatorService.createElement('div');

    if (!this.floatElement) {
      (<HTMLElement>this.coinElement) = this.domCreatorService.createElement('div');
    }

    (<SVGElement>this.waveSvgOne) = this.domCreatorService.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    (<SVGElement>this.waveSvgTwo) = this.domCreatorService.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );
    (<SVGPathElement>this.pathForWaveOne) = this.domCreatorService.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    (<SVGPathElement>this.pathForWaveTwo) = this.domCreatorService.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    (<SVGAnimateElement>this.animate) = this.domCreatorService.createElementNS(
      'http://www.w3.org/2000/svg',
      'animate'
    );
    (<SVGAnimateElement>this.animate2) = this.domCreatorService.createElementNS(
      'http://www.w3.org/2000/svg',
      'animate'
    );
  }

  protected setAttributes(): void {
    this.setAttributesWaveOne();
    this.setAttributesPathWaveOne();

    this.setAttributesWaveTwo();
    this.setAttributesPathWaveTwo();

    this.setAttributesAnimateOne();
    this.setAttributesAnimateTwo();
  }

  private setAttributesPathWaveTwo(): void {
    this.pathForWaveTwo.setAttribute('fill', '#116ACC');
    this.pathForWaveTwo.setAttribute('fill-opacity', '1');
    this.pathForWaveTwo.setAttribute(
      'd',
      'M0,224L48,213.3C96,203,192,181,288,176C384,171,480,181,576,202.7C672,224,768,221,864,200C960,192,1056,170,1152,160.3C1248,150,1344,149,1392,186.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
    );
  }

  private setAttributesAnimateTwo(): void {
    this.animate2.setAttribute('id', 'animate2');
    this.animate2.setAttribute('begin', 'animate1.end');
    this.animate2.setAttribute('attributeName', 'd');
    this.animate2.setAttribute(
      'from',
      'M 0 224 L 10 204 C 52 151 64 225 125 205 C 160 193 214 96 309 189 C 376 245 472 121 556 221 C 629 270 762 130 808 196 C 861 250 1007 268 994 221 C 1009 188 1092 197 1128 226 C 1157 244 1212 241 1253 216 C 1280 184 1363 253 1403 242 L 1440 224 L 1440 320 L 1392 320 C 1344 320 1248 320 1152 320 C 1056 320 960 320 864 320 C 768 320 672 320 576 320 C 480 320 384 320 288 320 C 192 320 96 320 48 320 L 0 320 Z'
    );
    this.animate2.setAttribute(
      'to',
      'M 0 224 L 12 210 C 21 205 56 123 129 201 C 191 249 212 263 309 189 C 404 124 495 245 556 221 C 724 117 769 280 833 251 C 897 215.6667 915 173 1015 226 C 1057 240 1048 117 1148 160 C 1200 182 1230 236 1294 203 C 1339 161 1341 150 1404 197 L 1440 224 L 1440 320 L 1392 320 C 1344 320 1248 320 1152 320 C 1056 320 960 320 864 320 C 768 320 672 320 576 320 C 480 320 384 320 288 320 C 192 320 96 320 48 320 L 0 320 Z'
    );
    this.animate2.setAttribute('attributeType', 'XML');
    this.animate2.setAttribute('by', '5');
    this.animate2.setAttribute('dur', '4000ms');
    this.animate2.setAttribute('fill', 'freeze');
  }

  private setAttributesAnimateOne(): void {
    this.animate.setAttribute('id', 'animate1');
    this.animate.setAttribute('begin', '0s;animate2.end');
    this.animate.setAttribute('attributeName', 'd');
    this.animate.setAttribute(
      'from',
      'M 0 224 L 12 210 C 21 205 56 123 129 201 C 191 249 212 263 309 189 C 404 124 495 245 556 221 C 724 117 769 280 833 251 C 897 215.6667 915 173 1015 226 C 1057 240 1048 117 1148 160 C 1200 182 1230 236 1294 203 C 1339 161 1341 150 1404 197 L 1440 224 L 1440 320 L 1392 320 C 1344 320 1248 320 1152 320 C 1056 320 960 320 864 320 C 768 320 672 320 576 320 C 480 320 384 320 288 320 C 192 320 96 320 48 320 L 0 320 Z'
    );

    this.animate.setAttribute(
      'to',
      'M 0 224 L 10 204 C 52 151 64 225 125 205 C 160 193 214 96 309 189 C 376 245 472 121 556 221 C 629 270 762 130 808 196 C 861 250 1007 268 994 221 C 1009 188 1092 197 1128 226 C 1157 244 1212 241 1253 216 C 1280 184 1363 253 1403 242 L 1440 224 L 1440 320 L 1392 320 C 1344 320 1248 320 1152 320 C 1056 320 960 320 864 320 C 768 320 672 320 576 320 C 480 320 384 320 288 320 C 192 320 96 320 48 320 L 0 320 Z'
    );
    this.animate.setAttribute('attributeType', 'XML');
    this.animate.setAttribute('by', '5');
    this.animate.setAttribute('dur', '4000ms');
    this.animate.setAttribute('fill', 'freeze');
  }

  private setAttributesPathWaveOne(): void {
    this.pathForWaveOne.setAttribute('fill', '#0e5db3');
    this.pathForWaveOne.setAttribute('fill-opacity', '1');
  }

  private setAttributesWaveTwo(): void {
    this.waveSvgTwo.setAttributeNS(
      'http://www.w3.org/2000/xmlns/',
      'xmlns:xlink',
      'http://www.w3.org/1999/xlink'
    );
    this.waveSvgTwo.setAttribute('viewBox', '0 0 1440 320');
    this.waveSvgTwo.setAttribute('preserveAspectRatio', 'none');
  }

  private setAttributesWaveOne(): void {
    this.waveSvgOne.setAttributeNS(
      'http://www.w3.org/2000/xmlns/',
      'xmlns:xlink',
      'http://www.w3.org/1999/xlink'
    );
    this.waveSvgOne.setAttribute('viewBox', '0 0 1440 320');
    this.waveSvgOne.setAttribute('preserveAspectRatio', 'none');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses, ...this.externalRootClasses);
    this.animationContainerElement.classList.add(...this.animationContainerClasses);
    if (!this.floatElement) {
      this.coinElement.classList.add(...this.floatClasses, ...this.coinClasses);
    } else {
      this.floatElement.classList.add(...this.floatClasses, ...this.externalFloatClasses);
    }
    this.waveSvgOne.classList.add(...this.svgBgClasses);
    this.waveSvgTwo.classList.add(...this.svgBg2Classes);
  }

  protected combineElements(): void {
    this.rootElement.append(this.animationContainerElement);
    this.waveSvgOne.appendChild(this.pathForWaveOne);
    this.waveSvgTwo.appendChild(this.pathForWaveTwo);
    this.pathForWaveOne.append(this.animate, this.animate2);
    this.animationContainerElement.append(
      this.waveSvgOne,
      this.floatElement || this.coinElement,
      this.waveSvgTwo
    );
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
