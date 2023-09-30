import { RouterPresenter } from '~presenters/RouterPresenter';
import { ILoginRequestPayload } from '~types/apiPayloads';
import { TErrors, TResultOfChecked } from '~types/authorizationService';
import { TLoginResponse } from '~types/requests';
import { TToken } from '~types/token';
import { Requests } from './Requests';

export class AuthorizationService {
  private readonly requestsService: Requests;
  private readonly routerPresenter: RouterPresenter;

  constructor() {
    this.requestsService = new Requests();
    this.routerPresenter = new RouterPresenter();
  }

  public login(data: ILoginRequestPayload): Promise<TLoginResponse> {
    return this.requestsService.login(data);
  }

  public getProcessedData(data: ILoginRequestPayload): ILoginRequestPayload {
    return {
      login: data.login.trim(),
      password: data.password.trim()
    };
  }

  public checkData(data: ILoginRequestPayload): TResultOfChecked {
    const errors: TErrors = { login: [], password: [] };
    let isValid = true;

    if (!data.login) {
      errors.login?.push('Поле логин не должно быть пустым');
    }

    if (!data.password) {
      errors.password?.push('Поле пароль не должно быть пустым');
    }

    if (errors.login.length || errors.password.length) {
      isValid = false;
    }

    return { isValid, errors };
  }

  public authorize(token: TToken): void {
    localStorage.setItem('token', token);
    this.requestsService.token = token;
    this.routerPresenter.goTo('/');
  }

  public isAuth(): boolean {
    return !!localStorage.getItem('token');
  }

  public logout(): void {
    localStorage.removeItem('token');
  }
}
