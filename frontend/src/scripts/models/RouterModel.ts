import { ReserveNotFoundPagePresenter } from '~router/reserveNotFoundPage/ReserveNotFoundPagePresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { Observable } from '~services/Observable';
import { IObserver } from '~types/observable';
import { TUrl } from '~types/requests';
import { IDataForRoute, IPresenter, IResultCheckDefenders, TRoute } from '~types/router';

export class RouterModel extends Observable {
  private routerContainerElement: HTMLElement;

  private domCreatorService: DOMCreatorService;
  private routes: TRoute[];
  private lastRoute: IPresenter;
  private newURL: TUrl;
  private redirectUrl: string | null;
  private paramsURL: string | undefined | null;
  private dataForRoute: IDataForRoute | null = null;
  private isScrollTop: boolean;

  constructor({
    routes,
    isScrollTop = false
  }: {
    routes: TRoute[];
    isScrollTop: boolean | undefined;
  }) {
    super((observer: IObserver) => {
      this.notifyAboutChangeRoute(observer);
    });

    this.domCreatorService = new DOMCreatorService();

    window.addEventListener('popstate', () => {
      this.changeRouteComponent.call(this);
      for (const observer of Object.values(this.observers)) {
        this.notifyAboutChangeRoute(observer);
      }
    });

    this.routes = routes;
    this.isScrollTop = isScrollTop;

    this.newURL = window.location.pathname;
  }

  public redirect(pathname: string) {
    this.redirectUrl = pathname;
  }

  public subscribe(observer: IObserver) {
    return super.subscribe(observer);
  }

  private async changeRouteComponent() {
    this.dataForRoute = null;
    this.paramsURL = null;

    const newRoute = this.getNewRoute();
    if (!newRoute) {
      return null;
    }

    const pageComponent: IPresenter = await this.getRoutePresenter(newRoute);

    if (!pageComponent) {
      throw new Error('');
    }

    this.callOnDestroyLastRouter();
    this.saveCurrentRoute(pageComponent);
    this.mount(pageComponent);

    if (this.isScrollTop) {
      window.scrollTo(0, 0);
    }

    return null;
  }

  private async getRoutePresenter(newRoute: TRoute): Promise<IPresenter> {
    if ('Presenter' in newRoute) {
      return new newRoute.Presenter();
    }
    const Presenter = await newRoute.loadChildren();
    return new Presenter();
  }

  private saveCurrentRoute(newRoute: IPresenter) {
    this.lastRoute = newRoute;
  }

  private callOnDestroyLastRouter() {
    if (this.lastRoute && 'onDestroy' in this.lastRoute && this.lastRoute.onDestroy) {
      this.lastRoute.onDestroy();
    }
  }

  public initRoute(): void {
    const currentUrl = window.location.pathname;
    this.newURL = currentUrl;
    this.changeRouteComponent();
  }

  private getNewRoute(): TRoute | null | undefined {
    this.newURL = window.location.pathname;

    let foundRoute = this.findRoute(this.newURL);

    if (!foundRoute) {
      foundRoute = this.getNotFoundPageRoute();
    }

    const resultDefenders = this.checkDefenders(foundRoute);

    if (!resultDefenders.canActivate || this.redirectUrl) {
      return this.handleNotAllowedRoute();
    }
    return foundRoute;
  }

  private handleNotAllowedRoute() {
    let allowedRoute = null;
    const newUrl = this.redirectUrl;

    if (newUrl) {
      allowedRoute = this.findRoute(newUrl);
      window.history.pushState({ redirect: true }, '', newUrl);
      this.redirectUrl = null;
    }
    return allowedRoute;
  }

  private findRoute(url: TUrl) {
    return this.routes.find((route) => {
      const routeWithDynamicURL = route.url.match(/(\S+):/);

      if (routeWithDynamicURL) {
        return this.getRouteWithDynamicURL(routeWithDynamicURL[1], url);
      }
      return route.url === url;
    });
  }

  private getRouteWithDynamicURL(dynamicURL: string, url: TUrl): boolean {
    this.paramsURL = url.match(/:([\S]+)/)?.[1];

    const routeStaticPartialURL: string = dynamicURL;
    const regexp = new RegExp(`^${routeStaticPartialURL}(.+)`);
    const newURLReplaced = url.match(regexp);
    this.paramsURL = newURLReplaced?.[1];
    return !!url.match(regexp);
  }

  private getNotFoundPageRoute(): TRoute {
    const notFoundPageComponent = this.routes.find((route) => route.isNotFound);

    const foundRoute = notFoundPageComponent || {
      url: '/404',
      Presenter: ReserveNotFoundPagePresenter
    };
    return foundRoute;
  }

  private checkDefenders(route: TRoute): IResultCheckDefenders {
    const isCanActivate = this.runCanActivateDefenders(route);
    this.runResolverDefenders(route);

    return { canActivate: isCanActivate };
  }

  private runCanActivateDefenders(route: TRoute): boolean {
    let isCanActivate = true;

    if (route.canActivate && route.canActivate.length) {
      for (const CanActivateDefender of route.canActivate) {
        isCanActivate = new CanActivateDefender().canActivate() ? isCanActivate : false;
      }
    }
    return isCanActivate;
  }

  private runResolverDefenders(route: TRoute): void {
    if (!route.resolver) {
      return;
    }
    for (const ResolverDefender of route.resolver) {
      new ResolverDefender().resolve();
    }
  }

  public mount(routerPresenter: IPresenter) {
    this.routerContainerElement.innerHTML = '';
    this.routerContainerElement.append(routerPresenter.render());
  }

  private notifyAboutChangeRoute(observer: IObserver) {
    observer.next(this.newURL);
  }

  public setContainer(routerContainerElement: HTMLElement) {
    this.routerContainerElement = routerContainerElement;
  }

  public createLink(href: string) {
    const linkElement: HTMLAnchorElement = this.domCreatorService.createElement('a');
    linkElement.classList.add('card__link');
    linkElement.classList.add('router-link');
    linkElement.setAttribute('href', `${href}`);
    linkElement.addEventListener('click', this.handlerClickRedirect.bind(this));
    return linkElement;
  }

  private handlerClickRedirect(ev: MouseEvent) {
    ev.preventDefault();
    const targetElement = ev.currentTarget as HTMLAnchorElement;
    const hrefValue = targetElement.getAttribute('href');

    if (!targetElement || !hrefValue) return;

    this.pushStateHistory(hrefValue);
  }

  public getParamsURL() {
    return this.paramsURL;
  }

  private pushStateHistory(url: TUrl) {
    window.history.pushState(null, '', url);
    const popStateEvent = new PopStateEvent('popstate', {});
    dispatchEvent(popStateEvent);
  }

  public getCurrentRoute(): TUrl {
    return window.location.pathname;
  }

  public goTo(url: TUrl, data?: { [key: string]: any }) {
    if (data) {
      this.dataForRoute = data;
    }
    this.pushStateHistory(url);
  }
}
