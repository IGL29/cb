import { INotifyItemArgs } from '~types/notify';
import { IPresenter } from '~types/presenter';
import { NotifyItemView } from '~views/elements/NotifyItemView';

export class NotifyItemPresenter implements IPresenter<NotifyItemView> {
  private view: NotifyItemView;

  constructor(args: INotifyItemArgs) {
    this.view = new NotifyItemView(args);
  }

  public getView(): NotifyItemView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
