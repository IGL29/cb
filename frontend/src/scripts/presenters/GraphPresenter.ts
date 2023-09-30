import { IPresenter } from '~types/presenter';
import { GraphView } from '~views/components/GraphView';

export class GraphPresenter implements IPresenter<GraphView> {
  private view: GraphView;

  constructor() {
    this.view = new GraphView();
  }

  public getView(): GraphView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
