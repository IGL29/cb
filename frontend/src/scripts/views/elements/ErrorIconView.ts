import { DOMCreatorService } from '~services/DOMCreatorService';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class ErrorIconView extends View {
  private readonly rootElement: HTMLElement;
  private readonly errorIconElement: HTMLElement;
  private readonly tooltipElement: HTMLElement;

  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = [
    'absolute',
    'w-[17px]',
    'h-[17px]',
    'right-[-20px]',
    'top-[50%]',
    'translate-y-[-50%]'
  ];
  private errorIconClasses: IClasses = [
    'absolute',
    'w-full',
    'h-full',
    'after:text-[10px]',
    'after:absolute',
    'after:font-Roboto',
    'after:font-medium',
    'after:content-["!"]',
    'after:text-[#ffffff]',
    'after:left-0',
    'after:top-[4px]',
    'after:w-full',
    'after:h-full',
    'after:text-center',
    'leading-[1.2]',
    'before:left-[50%]',
    'before:w-full',
    'before:h-full',
    'before:translate-x-[-50%]',
    'before:absolute',
    'before:top-[-1px]',
    'before:border-b-[14px]',
    'before:border-l-[8px]',
    'before:border-r-[8px]',
    'before:border-t-transparent',
    'before:border-r-transparent',
    'before:border-l-transparent',
    'before:border-b-[#BA0000]',
    'transition-opacity',
    'duration-[0.3s]',
    'z-[-1]'
  ];
  private errorIconHiddenClasses: IClasses = ['opacity-0'];
  private tooltipElementClasses: IClasses = [
    'absolute',
    'hidden',
    'w-full',
    'h-full',
    'before:left-[50%]',
    'before:w-full',
    'before:h-[5px]',
    'before:translate-x-[-50%]',
    'before:absolute',
    'before:bottom-[17px]',
    'before:border-b-transparent',
    'before:border-l-[8px]',
    'before:border-r-[8px]',
    'before:border-t-[8px]',
    'before:border-t-transparent',
    'before:border-r-transparent',
    'before:border-l-transparent',
    'before:border-t-[#182233]',
    'transition-opacity',
    'duration-[0.3s]',
    'after:absolute',
    'after:bottom-[23px]',
    'after:p-[5px]',
    'after:bg-[#182233]',
    'after:rounded-[4px]',
    'after:min-w-[200px]',
    'after:text-center',
    'after:right-0',
    'after:text-[#ffffff]',
    'after:text-[12px]',
    'after:content-[attr(after)]',
    'before:pointer-events-none',
    'after:pointer-events-none',
    'opacity-0',
    'hover:opacity-100'
  ];

  constructor() {
    super();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.combineElements();
  }

  protected createElements(): void {
    (this.rootElement as HTMLElement) = this.domCreatorService.createElement('div');
    (this.errorIconElement as HTMLElement) = this.domCreatorService.createElement('div');
    (this.tooltipElement as HTMLElement) = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses);
    this.errorIconElement.classList.add(...this.errorIconClasses, ...this.errorIconHiddenClasses);
    this.tooltipElement.classList.add(...this.tooltipElementClasses);
  }

  protected combineElements(): void {
    this.rootElement.append(this.tooltipElement, this.errorIconElement);
  }

  public showError(message?: string): void {
    if (message) {
      this.tooltipElement.setAttribute('after', message);
      this.tooltipElement.classList.remove('hidden');
    }
    this.errorIconElement.classList.remove(...this.errorIconHiddenClasses);
  }

  public hideError(): void {
    this.errorIconElement.classList.add(...this.errorIconHiddenClasses);

    if (this.tooltipElement.hasAttribute('after')) {
      this.tooltipElement.removeAttribute('after');
      this.tooltipElement.classList.add('hidden');
    }
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
