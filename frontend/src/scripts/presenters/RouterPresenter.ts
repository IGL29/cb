import { RouterModel } from '~models/RouterModel';
import { IObserver } from '~types/observable';
import { IPresenter } from '~types/presenter';
import { TUrl } from '~types/requests';
import { IRouterArgs } from '~types/router';
import { RouterView } from '~views/components/RouterView';

export class RouterPresenter implements IPresenter<RouterView> {
  static instance: RouterPresenter;
  private view: RouterView;
  private model: RouterModel;

  constructor({ routes, isScrollTop }: IRouterArgs = {}) {
    if (RouterPresenter.instance) {
      return RouterPresenter.instance;
    }

    if (routes) {
      RouterPresenter.instance = this;
      this.view = new RouterView();
      this.model = new RouterModel({ routes, isScrollTop });
      this.setContainer(this.view.render());
    } else {
      throw new Error('It is necessary to transfer the routers when the router is initialized');
    }
  }

  private setContainer(element: HTMLElement): void {
    this.model.setContainer(element);
  }

  public goTo(url: TUrl): void {
    this.model.goTo(url);
  }

  public getView() {
    return this.view;
  }

  public createLink(href: string): HTMLAnchorElement {
    return this.model.createLink(href);
  }

  public getParamsURL() {
    return this.model.getParamsURL();
  }

  public redirect(pathname: string): void {
    this.model.redirect(pathname);
  }

  public getCurrentRoute(): TUrl {
    return this.model.getCurrentRoute();
  }

  public subscribe(observer: IObserver) {
    return this.model.subscribe(observer);
  }

  public render(): HTMLElement {
    this.model.initRoute();
    return this.view.render();
  }
}
