import { RouterPresenter } from '~presenters/RouterPresenter';
import { AuthorizationService } from '~services/AuthorizationService';
import { ICanActivateDefender } from '~types/router';

export class ExitDefender implements ICanActivateDefender {
  routerPresenter: RouterPresenter;
  authorizationService: AuthorizationService;

  constructor() {
    this.routerPresenter = new RouterPresenter();
    this.authorizationService = new AuthorizationService();
  }

  public canActivate() {
    this.authorizationService.logout();
    this.routerPresenter.redirect('/auth');
    return null;
  }
}
