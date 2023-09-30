import { DOMCreatorService } from '~services/DOMCreatorService';
import { View } from '~types/view';

export class BalanceDynamicsView extends View {
  private containerElement: HTMLElement;
  private balanceElement: HTMLElement;

  private domCreatorService: DOMCreatorService;

  private balanceValue: number = 0;

  constructor() {
    super();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.combineElements();
    this.setValue();
  }

  protected setValue(): void {
    this.balanceElement.textContent = String(this.balanceValue);
  }

  protected createElements(): void {
    this.containerElement = this.domCreatorService.createElement('div');
    this.balanceElement = this.domCreatorService.createElement('p');
  }

  protected combineElements(): void {
    this.containerElement.append(this.balanceElement);
  }

  public setBalanceValue(value: string): void {
    this.balanceElement.textContent = value;
  }

  public render(): HTMLElement {
    return this.containerElement;
  }
}
