import { ICardArgs } from '~types/card';
import { IPresenter } from '~types/presenter';
import { CardView } from '~views/components/CardView';

export class CardPresenter implements IPresenter<CardView> {
  private view: CardView;

  constructor(args: ICardArgs) {
    this.view = new CardView(args);
  }

  public getView(): CardView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
