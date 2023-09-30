import { DOMCreatorService } from '~services/DOMCreatorService';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class LogoView extends View {
  private readonly rootElement: HTMLElement;

  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = [
    'text-[48px]',
    'font-light',
    'text-white',
    'my-0',
    'leading-none',
    'lg:text-[40px]',
    'xs:text-[35px]'
  ];

  constructor() {
    super();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.setValues();
  }

  protected createElements(): void {
    (this.rootElement as HTMLElement) = this.domCreatorService.createElement('p');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses);
  }

  protected setValues(): void {
    this.rootElement.textContent = 'Coin.';
  }

  protected combineElements(): void {}

  public render(): HTMLElement {
    return this.rootElement;
  }
}
