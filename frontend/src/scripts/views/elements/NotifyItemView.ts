import { DOMCreatorService } from '~services/DOMCreatorService';
import { INotifyItemArgs, INotifyType } from '~types/notify';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class NotifyItemView extends View {
  private rootElement: HTMLElement;
  private headerElement: HTMLElement;
  private bodyElement: HTMLElement;

  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = [
    'bg-[#646464]',
    'px-[10px]',
    'py-[5px]',
    'text-[#FFFFFF]',
    'font-Roboto',
    'rounded-[7px]',
    'opacity-[0.9]',
    'transition-[opacity]',
    'duration-300',
    'hover:opacity-[1]',
    'cursor-pointer'
  ];
  private rootHiddenClasses: IClasses = ['opacity-[0]', 'hover:opacity-[0]'];
  private headerClasses: IClasses = ['text-[15px]', 'p-[2px]'];
  private bodyClasses: IClasses = ['text-[14px]', 'p-[4px]', 'rounded-[3px]'];
  private externalRootClasses: IClasses;
  private errorRootClasses: IClasses = ['bg-[#e13131]'];
  private errorBodyClasses: IClasses = ['bg-[#a52020]'];
  private successRootClasses: IClasses = ['bg-[#217a21]'];
  private successBodyClasses: IClasses = ['bg-[#315431]'];

  private title: string;
  private description: string;
  private type: INotifyType;

  constructor({ title, description = '', classNamesRoot = [], type = 'error' }: INotifyItemArgs) {
    super();
    this.title = title;
    this.description = description;
    this.externalRootClasses = classNamesRoot;
    this.type = type;
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.combineElements();
    this.setValues();
  }

  protected createElements(): void {
    this.rootElement = this.domCreatorService.createElement('div');
    this.headerElement = this.domCreatorService.createElement('div');
    this.bodyElement = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses, ...this.externalRootClasses);
    this.headerElement.classList.add(...this.headerClasses);
    this.bodyElement.classList.add(...this.bodyClasses);
    if (this.type === 'error') {
      this.rootElement.classList.add(...this.errorRootClasses);
      this.bodyElement.classList.add(...this.errorBodyClasses);
    }
    if (this.type === 'success') {
      this.rootElement.classList.add(...this.successRootClasses);
      this.bodyElement.classList.add(...this.successBodyClasses);
    }
  }

  protected combineElements(): void {
    this.rootElement.append(this.headerElement);
    if (this.description) {
      this.rootElement.append(this.bodyElement);
    }
  }

  protected setValues(): void {
    this.headerElement.textContent = this.title;
    this.bodyElement.textContent = this.description;
  }

  public hide(): void {
    this.rootElement.classList.add(...this.rootHiddenClasses);
  }

  public show(): void {
    this.rootElement.classList.remove(...this.rootHiddenClasses);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
