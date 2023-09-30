import { IPresenter } from '~types/presenter';
import { ITableArgs } from '~types/table';
import { TableView } from '~views/components/TableView';

export class TablePresenter implements IPresenter<TableView> {
  private view: TableView;

  constructor(args: ITableArgs) {
    this.view = new TableView(args);
  }

  public getView(): TableView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
