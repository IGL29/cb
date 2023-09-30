import { AuthorizationFormModel } from '~models/AuthorizationFormModel';
import { TServerError } from '~types/authorizationForm';
import { TValidationError } from '~types/authorizationService';
import { Predicate } from '~types/Predicate';
import { IPresenter } from '~types/presenter';
import { ILoginRequestArgs } from '~types/requests';
import { AuthorizationFormView } from '~views/components/AuthorizationFormView';
import { NotifyPresenter } from './NotifyPresenter';

export class AuthorizationFormPresenter implements IPresenter<AuthorizationFormView> {
  private model: AuthorizationFormModel;
  private view: AuthorizationFormView;
  private inputLoginValue: string = '';
  private inputPasswordValue: string = '';

  private notifyPresenter: NotifyPresenter;

  constructor() {
    this.model = new AuthorizationFormModel();
    this.view = new AuthorizationFormView();
    this.notifyPresenter = new NotifyPresenter();
    this.addHandlers();
  }

  private addHandlers() {
    this.view.addHandlers({
      target: 'inputLogin',
      type: 'input',
      handler: (ev) => {
        const inputTargetElement = ev.target as HTMLInputElement;
        this.inputLoginValue = inputTargetElement.value;
      }
    });
    this.view.addHandlers({
      target: 'inputPassword',
      type: 'input',
      handler: (ev) => {
        const inputTargetElement = ev.target as HTMLInputElement;
        this.inputPasswordValue = inputTargetElement.value;
      }
    });
    this.view.addHandlers({
      target: 'form',
      type: 'submit',
      handler: (ev) => {
        if (!Predicate.isSubmitEvent(ev)) {
          return;
        }
        this.handlerSubmit(ev, {
          login: this.inputLoginValue,
          password: this.inputPasswordValue
        });
      }
    });
  }

  private async handlerSubmit(ev: SubmitEvent, data: ILoginRequestArgs) {
    ev.preventDefault();

    this.view.isLoading = true;
    this.view.hideError();

    await this.model
      .handlerSubmit(data)
      .then(() => {})
      .catch((err: Error | TServerError | TValidationError) => {
        if ('errors' in err && err.errors.login.length) {
          this.view.showLoginError(err.errors.login[0]);
        }
        if ('errors' in err && err.errors.password.length) {
          this.view.showPasswordError(err.errors.password[0]);
          return;
        }
        if (
          'message' in err &&
          (err.message === 'No such user' || err.message === 'Invalid password')
        ) {
          this.view.showLoginError('Неверный логин или пароль');
          this.view.showPasswordError('Неверный логин или пароль');
          return;
        }
        this.notifyPresenter.notify({
          title: 'Ошибка при запросе',
          description:
            'Произошла неизвестная ошибка при запросе. Попробуйте обновить страницу и повторить снова.'
        });
        throw err;
      })
      .finally(() => {
        this.view.isLoading = false;
      });
  }

  public getView(): AuthorizationFormView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
