import { IPresenter } from '~types/presenter';
import { AuthorizationView } from '~views/pages/AuthorizationView';

export class AuthorizationPresenter implements IPresenter<AuthorizationView> {
  private view: AuthorizationView;

  constructor() {
    this.view = new AuthorizationView();
  }

  public getView(): AuthorizationView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
