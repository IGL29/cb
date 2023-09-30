import { IPresenter } from '~types/presenter';
import { BurgerMenuView } from '~views/components/BurgerMenuView';

export class BurgerMenuPresenter implements IPresenter<BurgerMenuView> {
  private view: BurgerMenuView;

  constructor() {
    this.view = new BurgerMenuView();
  }

  public getView(): BurgerMenuView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
