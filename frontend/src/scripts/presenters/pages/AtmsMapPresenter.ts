import { AtmsMapModel } from '~models/AtmsMapModel';
import { NotifyPresenter } from '~presenters/NotifyPresenter';
import { IPresenter } from '~types/presenter';
import { AtmsMapView } from '~views/pages/AtmsMapView';

export class AtmsMapPresenter implements IPresenter<AtmsMapView> {
  private view: AtmsMapView;
  private model: AtmsMapModel;

  private notifyPresenter: NotifyPresenter;

  constructor() {
    this.view = new AtmsMapView();
    this.model = new AtmsMapModel();
    this.notifyPresenter = new NotifyPresenter();
    this.getBanks();
  }

  private getBanks() {
    this.view.isLoading = true;
    this.view.hideError();

    this.model
      .getBanks()
      .then((data) => {
        if (!data.payload) {
          return;
        }
        this.view.initAtmsMap(data.payload);
      })
      .catch((err: Error) => {
        this.view.showError();
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

  public getView(): AtmsMapView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
