import { IHistoryTransferArgs } from '~types/historyTransfer';
import { IPresenter } from '~types/presenter';
import { HistoryTransferView } from '~views/components/HistoryTransferView';

export class HistoryTransferPresenter implements IPresenter<HistoryTransferView> {
  private view: HistoryTransferView;

  constructor({ loadMoreCallback }: IHistoryTransferArgs = {}) {
    this.view = new HistoryTransferView({ loadMoreCallback });
  }

  public getView(): HistoryTransferView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
