import { IPresenter } from '~types/presenter';
import { ReserveNotFoundPageView } from './ReserveNotFoundPageView';

export class ReserveNotFoundPagePresenter implements IPresenter<ReserveNotFoundPageView> {
  view: ReserveNotFoundPageView;

  constructor() {
    this.view = new ReserveNotFoundPageView();
  }

  public getView(): ReserveNotFoundPageView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
