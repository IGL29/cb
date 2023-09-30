import { IButtonArgs } from '~types/button';
import { IPresenter } from '~types/presenter';
import { ButtonView } from '~views/elements/ButtonView';

export class ButtonPresenter implements IPresenter<ButtonView> {
  private view: ButtonView;

  constructor(args: IButtonArgs) {
    this.view = new ButtonView(args);
  }

  public getView() {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
