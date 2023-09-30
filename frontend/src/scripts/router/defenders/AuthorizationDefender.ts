import { RouterPresenter } from '~presenters/RouterPresenter';
import { IResolverDefender } from '~types/router';

export class AuthorizationDefender implements IResolverDefender {
  private routerPresenter: RouterPresenter;

  constructor() {
    this.routerPresenter = new RouterPresenter();
  }

  public resolve() {
    if (localStorage.getItem('token')) {
      this.routerPresenter.redirect('/');
    }
  }
}
