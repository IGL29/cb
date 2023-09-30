import { IPresenter } from '~types/presenter';
import { LogoView } from '~views/elements/LogoView';

export class LogoPresenter implements IPresenter<LogoView> {
  private view: LogoView;

  constructor() {
    this.view = new LogoView();
  }

  public getView(): LogoView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
