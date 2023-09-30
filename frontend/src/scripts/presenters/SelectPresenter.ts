import { IPresenter } from '~types/presenter';
import { ISelectArgs } from '~types/select';
import { SelectView } from '~views/elements/SelectView';

export class SelectPresenter implements IPresenter<SelectView> {
  private view: SelectView;

  constructor(args: ISelectArgs) {
    this.view = new SelectView(args);
  }

  public getView(): SelectView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
