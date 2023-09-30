import { IMainNavViewArgs } from '~types/mainNav';
import { IPresenter } from '~types/presenter';
import { MainNavView } from '~views/components/MainNavView';

export class MainNavPresenter implements IPresenter<MainNavView> {
  private view: MainNavView;

  constructor(args?: IMainNavViewArgs) {
    this.view = new MainNavView(args);
  }

  public getView(): MainNavView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
