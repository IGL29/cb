import { AuthorizationService } from '~services/AuthorizationService';
import { ILoginRequestPayload } from '~types/apiPayloads';
import { TLoginResponse } from '~types/requests';

export class AuthorizationFormModel {
  private authorizationService;

  constructor() {
    this.authorizationService = new AuthorizationService();
  }

  public handlerSubmit(data: ILoginRequestPayload): Promise<TLoginResponse['payload']> {
    const processedData = this.authorizationService.getProcessedData({
      login: data.login,
      password: data.password
    });

    const checkingResult = this.authorizationService.checkData(processedData);

    if (checkingResult.isValid) {
      return this.requestLogin(processedData);
    }
    return Promise.reject(checkingResult);
  }

  private requestLogin(data: ILoginRequestPayload): Promise<TLoginResponse['payload']> {
    return this.authorizationService
      .login({
        login: data.login,
        password: data.password
      })
      .then((result: TLoginResponse) => {
        if (!result.error && result.payload?.token) {
          this.authorizationService.authorize(result.payload.token);
          return Promise.resolve(result.payload);
        }
        if (result.error) {
          return Promise.reject(new Error(result.error));
        }
        throw new Error('Unknown error');
      })
      .catch((err: Error) => Promise.reject(err));
  }
}
