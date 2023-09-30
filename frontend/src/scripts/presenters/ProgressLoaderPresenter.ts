import { IPresenter } from '~types/presenter';
import { IProgressLoaderArgs } from '~types/progressLoader';
import { ProgressLoaderView } from '~views/elements/ProgressLoaderView';

export class ProgressLoaderPresenter implements IPresenter<ProgressLoaderView> {
  private view: ProgressLoaderView;

  constructor(args: IProgressLoaderArgs) {
    this.view = new ProgressLoaderView(args);
  }

  public getView(): ProgressLoaderView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
