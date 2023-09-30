import { TUrl } from './requests';

export interface IRouteBase {
  url: TUrl;
  canActivate?: IRouteCanActivateDefender[];
  resolver?: IRouteResolverDefender[];
  isNotFound?: boolean;
}

export interface IRouteLazy extends IRouteBase {
  loadChildren: () => Promise<IRoutePresenter>;
}

export interface IRouteStatic extends IRouteBase {
  Presenter: IRoutePresenter;
}

export type TRoute = IRouteLazy | IRouteStatic;

export interface IPresenter {
  render(): HTMLElement;
  onDestroy?(): void;
}

export interface IRoutePresenter {
  new (): IPresenter;
}

export type TRouteDefender = IRouteCanActivateDefender | IRouteCanActivateDefender;

export interface IRouteCanActivateDefender {
  new (): ICanActivateDefender;
}

export interface IRouteResolverDefender {
  new (): IResolverDefender;
}

export interface ICanActivateDefender {
  canActivate(): boolean | null;
}
export interface IResolverDefender {
  resolve(): void;
}

export interface IRouterArgs {
  routes?: TRoute[];
  isScrollTop?: boolean | undefined;
}

export interface IResultCheckDefenders extends IResultCheckCanActivateDefender {}
export interface IResultCheckCanActivateDefender {
  canActivate: boolean;
}

export interface IDataForRoute {
  [key: string]: any;
}
