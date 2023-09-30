import { IPresenter } from '~types/presenter';
import { HistogramView } from '~views/elements/HistogramView';

export class HistogramPresenter implements IPresenter<HistogramView> {
  private view: HistogramView;

  constructor() {
    this.view = new HistogramView();
  }

  public getView(): HistogramView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
