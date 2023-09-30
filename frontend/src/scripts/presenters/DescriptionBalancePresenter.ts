import { IPresenter } from '~types/presenter';
import { IClasses } from '~types/select';
import { DescriptionBalanceView } from '~views/components/DescriptionBalanceView';

export class DescriptionBalancePresenter implements IPresenter<DescriptionBalanceView> {
  private view: DescriptionBalanceView;

  constructor(args: { rootClasses?: IClasses } = {}) {
    this.view = new DescriptionBalanceView(args);
  }

  public getView(): DescriptionBalanceView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
