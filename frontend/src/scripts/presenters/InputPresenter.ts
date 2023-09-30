import { IInputArgs } from '~types/input';
import { IPresenter } from '~types/presenter';
import { InputView } from '~views/elements/InputView';

export class InputPresenter implements IPresenter<InputView> {
  private view: InputView;

  constructor(args: IInputArgs) {
    this.view = new InputView(args);
  }

  public getView(): InputView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
