import { ILoaderArgs } from '~types/loader';
import { IPresenter } from '~types/presenter';
import { LoaderView } from '~views/elements/LoaderView';

export class LoaderPresenter implements IPresenter<LoaderView> {
  private view: LoaderView;

  constructor(args?: ILoaderArgs) {
    this.view = new LoaderView(args);
  }

  public getView(): LoaderView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
