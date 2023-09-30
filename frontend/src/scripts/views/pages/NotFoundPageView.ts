import { ButtonPresenter } from '~presenters/ButtonPresenter';
import { OnWaveAnimationPresenter } from '~presenters/OnWaveAnimationPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { IClasses } from '~types/select';
import { IAddHandlerArgs, IAddHandlers, View } from '~types/view';

export class NotFoundPageView extends View implements IAddHandlers<'btn-back-to-main'> {
  private rootElement: HTMLElement;
  private siteContainerElement: HTMLElement;
  private messageElement: HTMLParagraphElement;

  private onWaveAnimationPresenter: OnWaveAnimationPresenter;
  private readonly buttonBackPresenter: ButtonPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = ['grow', 'flex', 'flex-col'];
  private siteContainerClasses: IClasses = [
    'max-w-full',
    'pt-[25px]',
    'pb-[25px]',
    'px-[50px]',
    'xs:pt-[10px]',
    'xs:pb-[10px]',
    'sm:px-[30px]',
    'xs:px-[20px]',
    'grow',
    'relative',
    'after:h-[40%]',
    'after:bottom-0',
    'after:left-0',
    'after:w-full',
    'after:bg-[#116ACC]',
    'after:absolute'
  ];
  private messageClasses: IClasses = [
    'm-0',
    'px-[20px]',
    'py-[10px]',
    'text-[50px]',
    'leading-1',
    'rounded-[7px]',
    'border',
    'border-[#999999]',
    'bg-[#FFFFFF]'
  ];
  private onWaveAnimateClasses: IClasses = [
    'absolute',
    'bottom-[40%]',
    'left-0',
    'w-full',
    'h-[150px]'
  ];
  private buttonBackClasses: IClasses = ['xs:w-full', 'xs:mb-[25px]', 'relative', 'z-[3]'];

  private messageValue: string = '404';
  private buttonBackValue: string = 'На главную';

  constructor() {
    super();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.onWaveAnimationPresenter = new OnWaveAnimationPresenter({
      floatElement: this.messageElement,
      classNamesRoot: this.onWaveAnimateClasses
    });
    this.buttonBackPresenter = new ButtonPresenter({
      buttonValue: this.buttonBackValue,
      rootClasses: this.buttonBackClasses
    });
    this.addClasses();
    this.combineElements();
    this.setValues();
  }

  protected createElements() {
    this.rootElement = this.domCreatorService.createElement('div');
    this.siteContainerElement = this.domCreatorService.createElement('div');
    this.messageElement = this.domCreatorService.createElement('p');
  }

  protected addClasses() {
    this.rootElement.classList.add(...this.rootClasses);
    this.siteContainerElement.classList.add(...this.siteContainerClasses);
    this.messageElement.classList.add(...this.messageClasses);
  }

  protected combineElements() {
    this.rootElement.append(this.siteContainerElement);
    this.siteContainerElement.append(
      this.buttonBackPresenter.render(),
      this.onWaveAnimationPresenter.render()
    );
  }

  protected setValues(): void {
    this.messageElement.textContent = this.messageValue;
  }

  public addHandlers(args: IAddHandlerArgs<'btn-back-to-main'>): void {
    if (args.target === 'btn-back-to-main') {
      this.buttonBackPresenter.render().addEventListener(args.type, args.handler);
    }
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
