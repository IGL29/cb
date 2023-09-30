import { RouterPresenter } from '~presenters/RouterPresenter';
import { ICanActivateDefender } from '~types/router';

export class AuthDefender implements ICanActivateDefender {
  static instance: AuthDefender;
  private routerPresenter: RouterPresenter;

  constructor() {
    if (AuthDefender.instance) {
      return AuthDefender.instance;
    }

    AuthDefender.instance = this;
    this.routerPresenter = new RouterPresenter();
  }

  public canActivate() {
    if (!localStorage.getItem('token')) {
      this.routerPresenter.redirect('/auth');
      return false;
    }
    return true;
  }
}
