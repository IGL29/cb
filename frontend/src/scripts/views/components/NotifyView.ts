import { NotifyItemPresenter } from '~presenters/NotifyItemPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { INotifyItemArgs } from '~types/notify';
import { IClasses } from '~types/select';
import { View } from '~types/view';
import { generateRandomString } from '~utils/generateRandomString';

export class NotifyView extends View {
  private rootElement: HTMLElement;

  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = [
    'fixed',
    'right-0',
    'bottom-0',
    'w-[300px]',
    'py-[5px]',
    'px-[5px]',
    'max-h-[100vh]',
    'overflow-auto',
    'z-[5]'
  ];
  private notifyItemClasses: IClasses = ['[&:not(:last-child)]:mb-[5px]'];

  constructor() {
    super();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
  }

  protected createElements(): void {
    this.rootElement = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses);
  }

  public notify({ title, description, type }: INotifyItemArgs) {
    const notifyItemPresenter = new NotifyItemPresenter({
      title,
      description,
      classNamesRoot: this.notifyItemClasses,
      type
    });
    const notifyId = generateRandomString();
    notifyItemPresenter.render().dataset.notifyId = notifyId;

    notifyItemPresenter.render().addEventListener('pointerdown', () => {
      notifyItemPresenter.getView().hide();

      setTimeout(() => {
        notifyItemPresenter.render().remove();
      }, 400);
    });

    notifyItemPresenter.getView().hide();
    this.rootElement.append(notifyItemPresenter.render());

    setTimeout(() => {
      notifyItemPresenter.getView().show();
    }, 10);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
