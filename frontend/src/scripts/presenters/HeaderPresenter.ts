import { AuthorizationService } from '~services/AuthorizationService';
import { TSubscribeValue } from '~types/observable';
import { IPresenter } from '~types/presenter';
import { TUrl } from '~types/requests';
import { HeaderView } from '~views/components/HeaderView';
import { RouterPresenter } from './RouterPresenter';

export class HeaderPresenter implements IPresenter<HeaderView> {
  private view: HeaderView;
  private routerPresenter: RouterPresenter;
  private subscription: TSubscribeValue;
  private authorizationService: AuthorizationService;

  constructor() {
    this.view = new HeaderView();
    this.authorizationService = new AuthorizationService();
    this.routerPresenter = new RouterPresenter();
    this.subscription = this.subscribe();
  }

  private subscribe(): TSubscribeValue {
    return this.routerPresenter.subscribe({
      next: (url: TUrl) => {
        if (this.authorizationService.isAuth()) {
          this.view.visibleMenu();
          this.view.setActiveRouteToMenu(url);
          return;
        }
        this.view.hiddenMenu();
      }
    });
  }

  public getView(): HeaderView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
