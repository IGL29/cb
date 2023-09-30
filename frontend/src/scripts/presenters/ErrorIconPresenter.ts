import { IPresenter } from '~types/presenter';
import { ErrorIconView } from '~views/elements/ErrorIconView';

export class ErrorIconPresenter implements IPresenter<ErrorIconView> {
  private view: ErrorIconView;

  constructor() {
    this.view = new ErrorIconView();
  }

  public getView(): ErrorIconView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
