import { DOMCreatorService } from '~services/DOMCreatorService';
import { View } from '~types/view';

export class LogoutView extends View {
  private readonly domCreatorService: DOMCreatorService;

  constructor() {
    super();
    this.domCreatorService = new DOMCreatorService();
  }
  protected createElements(): void {}

  public render(): HTMLElement {
    return this.domCreatorService.createElement('div');
  }
}
