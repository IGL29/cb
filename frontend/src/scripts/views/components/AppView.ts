import { View } from '~types/view';
import { HeaderPresenter } from '~presenters/HeaderPresenter';
import { RouterPresenter } from '~presenters/RouterPresenter';
import { IClasses } from '~types/select';
import { NotifyPresenter } from '~presenters/NotifyPresenter';
import { LoaderPresenter } from '~presenters/LoaderPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class AppView extends View {
  private rootElement: HTMLElement;
  private mainElement: HTMLElement;

  private headerPresenter: HeaderPresenter;
  private routerPresenter: RouterPresenter;
  private notifyPresenter: NotifyPresenter;
  private laoderPresenter: LoaderPresenter;
  private domCreatorService: DOMCreatorService;

  private rootElementClasses: IClasses = ['flex', 'flex-col', 'min-h-full'];
  private mainElementClasses: IClasses = ['flex-[1_0_100%]', 'flex', 'flex-col'];
  private routerElementClasses: IClasses = ['grow', 'flex', 'flex-col'];

  constructor() {
    super();
    this.headerPresenter = new HeaderPresenter();
    this.routerPresenter = new RouterPresenter();
    this.notifyPresenter = new NotifyPresenter();
    this.laoderPresenter = new LoaderPresenter();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.combineElements();
  }

  protected createElements(): void {
    this.rootElement = this.domCreatorService.createElement('div');
    this.mainElement = this.domCreatorService.createElement('main');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootElementClasses);
    this.mainElement.classList.add(...this.mainElementClasses);
    this.routerPresenter.getView().addRootElementClasses(this.routerElementClasses);
  }

  protected combineElements(): void {
    this.rootElement.append(this.headerPresenter.render(), this.laoderPresenter.render());
    this.mainElement.append(this.routerPresenter.render(), this.notifyPresenter.render());
    this.rootElement.append(this.mainElement);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
