import { RouterPresenter } from '~presenters/RouterPresenter';
import { IPresenter } from '~types/presenter';
import { NotFoundPageView } from '~views/pages/NotFoundPageView';

export class NotFoundPagePresenter implements IPresenter<NotFoundPageView> {
  private view: NotFoundPageView;
  private routerPresenter: RouterPresenter;

  constructor() {
    this.view = new NotFoundPageView();
    this.routerPresenter = new RouterPresenter();
    this.addHandlers();
  }

  private addHandlers(): void {
    this.view.addHandlers({
      type: 'click',
      target: 'btn-back-to-main',
      handler: () => {
        this.routerPresenter.goTo('/');
      }
    });
  }

  public getView(): NotFoundPageView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
