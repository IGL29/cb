import { ICurrenciesTableArgs } from '~types/currenciesTable';
import { IPresenter } from '~types/presenter';
import { CurrenciesTableView } from '~views/components/CurrenciesTableView';

export class CurrenciesTablePresenter implements IPresenter<CurrenciesTableView> {
  private view: CurrenciesTableView;

  constructor(args: ICurrenciesTableArgs) {
    this.view = new CurrenciesTableView(args);
  }

  public getView(): CurrenciesTableView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
