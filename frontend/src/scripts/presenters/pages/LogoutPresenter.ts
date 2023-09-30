import { IPresenter } from '~types/presenter';
import { LogoutView } from '~views/pages/LogoutView';

export class LogoutPresenter implements IPresenter<LogoutView> {
  private view: LogoutView;

  constructor() {
    this.view = new LogoutView();
  }

  public getView(): LogoutView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
