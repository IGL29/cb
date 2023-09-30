import { IPresenter } from '~types/presenter';
import { BalanceDynamicsView } from '~views/components/BalanceDynamicsView';

export class BalanceDynamicsPresenter implements IPresenter<BalanceDynamicsView> {
  private view: BalanceDynamicsView;

  constructor() {
    this.view = new BalanceDynamicsView();
  }

  public getView(): BalanceDynamicsView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
