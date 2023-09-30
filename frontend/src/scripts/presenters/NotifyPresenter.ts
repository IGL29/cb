import { INotifyItemArgs } from '~types/notify';
import { IPresenter } from '~types/presenter';
import { NotifyView } from '~views/components/NotifyView';

export class NotifyPresenter implements IPresenter<NotifyView> {
  static _instance: NotifyPresenter;
  private view: NotifyView;

  constructor() {
    if (NotifyPresenter._instance) {
      return NotifyPresenter._instance;
    }
    NotifyPresenter._instance = this;
    this.view = new NotifyView();
  }

  public notify(args: INotifyItemArgs) {
    this.view.notify(args);
  }

  public getView(): NotifyView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
