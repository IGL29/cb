import { AuthorizationFormPresenter } from '~presenters/AuthorizationFormPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { View } from '~types/view';

export class AuthorizationView extends View {
  private containerElement: HTMLElement;
  private siteContainerElement: HTMLElement;

  private formPresenter: AuthorizationFormPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private mainClasses = ['flex-[1_0_100%]', 'flex', 'flex-col'];
  private siteContainerClasses = [
    'grow',
    'flex',
    'flex-col',
    'pt-[25px]',
    'pb-[25px]',
    'max-w-[1440px]',
    'w-full',
    'my-0',
    'mx-auto',
    'px-[50px]',
    'sm:px-[30px]',
    'xs:px-[20px]'
  ];

  constructor() {
    super();
    this.formPresenter = new AuthorizationFormPresenter();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.combineElements();
  }

  protected createElements(): void {
    this.containerElement = this.domCreatorService.createElement('div');
    this.siteContainerElement = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.containerElement.classList.add(...this.mainClasses);
    this.siteContainerElement.classList.add(...this.siteContainerClasses);
  }

  protected combineElements(): void {
    this.siteContainerElement.append(this.formPresenter.render());
    this.containerElement.append(this.siteContainerElement);
  }

  public render(): HTMLElement {
    return this.containerElement;
  }
}
