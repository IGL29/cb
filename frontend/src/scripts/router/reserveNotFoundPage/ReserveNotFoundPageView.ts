import { DOMCreatorService } from '~services/DOMCreatorService';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class ReserveNotFoundPageView extends View {
  private containerElement: HTMLElement;
  private siteContainerElement: HTMLElement;

  private readonly domCreatorService: DOMCreatorService;

  private defaultClasses: IClasses = ['atms-maps'];
  private siteContainerClass: IClasses = ['container', 'atms-maps__container'];

  constructor() {
    super();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.combineElements();
    this.setValues();
  }

  protected createElements(): void {
    this.containerElement = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.containerElement.classList.add(...this.defaultClasses);
    this.siteContainerElement.classList.add(...this.siteContainerClass);
  }

  protected combineElements(): void {
    this.containerElement.append(this.siteContainerElement);
  }

  protected setValues(): void {
    this.siteContainerElement.textContent = '404';
  }

  public render(): HTMLElement {
    return this.containerElement;
  }
}
