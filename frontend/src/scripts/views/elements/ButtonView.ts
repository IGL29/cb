import { View } from '~types/view';
import { IButtonArgs } from '~types/button';
import { IClasses } from '~types/select';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class ButtonView extends View {
  private readonly rootElement: HTMLElement;

  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = [
    'py-[14px]',
    'px-[21px]',
    'rounded-[7px]',
    'font-medium',
    'text-[#FFFFFF]',
    'bg-[#116ACC]',
    'text-[14px]',
    'hover:bg-[#5897DB]',
    'active:bg-[#0C4A8F]',
    'transition-background',
    'duration-300'
  ];
  private externalsRootClasses: IClasses;
  private buttonDisabledClasses: IClasses = [
    'bg-[#9CA3AF]',
    'cursor-not-allowed',
    'hover:bg-[#9CA3AF]',
    'active:bg-[#9CA3AF]'
  ];

  private buttonValue: string;
  private _isDisabled = false;

  constructor({ buttonValue = 'button', rootClasses = [] }: IButtonArgs) {
    super();
    this.buttonValue = buttonValue;
    this.externalsRootClasses = rootClasses;
    this.domCreatorService = new DOMCreatorService();
    this.init();
  }

  private init() {
    this.createElements();
    this.addClasses();
    this.changeButtonDisabledState();
    this.setValue();
  }

  protected combineElements(): void {}

  protected createElements(): void {
    (this.rootElement as HTMLElement) = this.domCreatorService.createElement('button');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses, ...this.externalsRootClasses);
  }

  public isDisabled(value: boolean): void {
    this._isDisabled = value;

    this.changeButtonDisabledState();
  }

  private changeButtonDisabledState(): void {
    if (this._isDisabled) {
      this.rootElement.classList.add(...this.buttonDisabledClasses);
      return;
    }
    this.rootElement.classList.remove(...this.buttonDisabledClasses);
  }

  protected setValue(): void {
    this.rootElement.textContent = this.buttonValue;
  }

  public addHandler<K extends keyof GlobalEventHandlersEventMap>({
    type,
    handler
  }: {
    type: K;
    handler: (ev: GlobalEventHandlersEventMap[K]) => any;
  }) {
    this.rootElement.addEventListener(type, (ev) => this.handlerClick(ev, handler));
  }

  private handlerClick<K extends keyof GlobalEventHandlersEventMap>(
    ev: GlobalEventHandlersEventMap[K],
    callback: (ev: GlobalEventHandlersEventMap[K]) => any
  ) {
    ev.preventDefault();

    if (this._isDisabled) {
      return;
    }
    callback(ev);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
