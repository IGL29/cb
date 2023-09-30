import { IHorizontalTableArgs } from '~types/horizontalTable';
import { IPresenter } from '~types/presenter';
import { HorizontalTableView } from '~views/components/HorizontalTableView';

export class HorizontalTablePresenter implements IPresenter<HorizontalTableView> {
  private view: HorizontalTableView;

  constructor(args: IHorizontalTableArgs) {
    this.view = new HorizontalTableView(args);
  }

  public getView(): HorizontalTableView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
