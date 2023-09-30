import { View } from '~types/view';
import { IClasses } from '~types/select';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class RouterView extends View {
  private readonly rootElement: HTMLElement;
  private readonly rootElementClasses = ['h-full'];
  private readonly domCreatorService: DOMCreatorService;

  constructor() {
    super();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
  }

  protected createElements(): void {
    (<HTMLElement>this.rootElement) = this.domCreatorService.createElement('div');
  }

  public addRootElementClasses(classes: IClasses): void {
    this.rootElement.classList.add(...classes);
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootElementClasses);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
