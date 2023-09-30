import { AccountsPresenter } from '~presenters/pages/AccountsPresenter';
import { AuthorizationPresenter } from '~presenters/pages/AuthorizationPresenter';
import { LogoutPresenter } from '~presenters/pages/LogoutPresenter';
// import { NotFoundPagePresenter } from '~presenters/pages/NotFoundPagePresenter';
import { TRoute } from '~types/router';
import { lazyLoad } from '~utils/lazyLoad';
import { AuthDefender } from './defenders/AuthDefender';
import { AuthorizationDefender } from './defenders/AuthorizationDefender';
import { ExitDefender } from './defenders/ExitDefender';

export const routes: TRoute[] = [
  {
    url: '/',
    Presenter: AccountsPresenter,
    canActivate: [AuthDefender]
  },
  {
    url: '/auth',
    Presenter: AuthorizationPresenter,
    resolver: [AuthorizationDefender]
  },
  {
    url: '/account-details/:id',
    loadChildren: () => lazyLoad(import('~presenters/pages/AccountDetailPresenter')),
    canActivate: [AuthDefender]
  },
  {
    url: '/balance-history/:id',
    loadChildren: () => lazyLoad(import('~presenters/pages/BalanceHistoryPresenter')),
    canActivate: [AuthDefender]
  },
  {
    url: '/currency-conversion',
    loadChildren: () => lazyLoad(import('~presenters/pages/CurrencyConversionPresenter')),
    canActivate: [AuthDefender]
  },
  {
    url: '/atms-map',
    loadChildren: () => lazyLoad(import('~presenters/pages/AtmsMapPresenter')),
    canActivate: [AuthDefender]
  },
  {
    url: '/logout',
    Presenter: LogoutPresenter,
    canActivate: [ExitDefender]
  },
  {
    url: '/404',
    loadChildren: () => lazyLoad(import('~presenters/pages/NotFoundPagePresenter')),
    isNotFound: true
  }
];
