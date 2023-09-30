import { IOnWaveAnimationArgs } from '~types/onWaveAnimation';
import { IPresenter } from '~types/presenter';
import { OnWaveAnimationView } from '~views/components/OnWaveAnimationView';

export class OnWaveAnimationPresenter implements IPresenter<OnWaveAnimationView> {
  private view: OnWaveAnimationView;

  constructor(args?: IOnWaveAnimationArgs) {
    this.view = new OnWaveAnimationView(args);
  }

  public getView(): OnWaveAnimationView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
