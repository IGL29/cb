import { View } from '~types/view';
import { IClasses } from '~types/select';
import { ILoaderArgs } from '~types/loader';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class LoaderView extends View {
  private readonly rootElement: HTMLElement;
  private readonly loaderElement: HTMLElement;

  private readonly domCreatorService: DOMCreatorService;

  private rootClasses = [
    'pointer-events-none',
    'absolute',
    'top-[50%]',
    'left-[50%]',
    'translate-x-[-50%]',
    'translate-y-[-50%]',
    'w-[64px]',
    'h-[64px]',
    'z-[1]',
    'overflow-hidden'
  ];
  private rootHiddenClasses = ['hidden'];
  private loaderClasses = [
    'before:border-2',
    'before:z-1',
    'w-full',
    'h-full',
    'before:border-[#116ACC]',
    'before:rounded-[50%]',
    'before:absolute',
    'before:border-r-[#B3CEE2]',
    'before:top-0',
    'before:left-0',
    'before:w-full',
    'before:h-full',
    'absolute',
    'animate-spin'
  ];
  private externalRootClasses: IClasses;
  private externalLoaderClasses: IClasses;

  constructor({ classNamesRoot = [], classNamesLoader = [] }: ILoaderArgs = {}) {
    super();
    this.externalRootClasses = classNamesRoot;
    this.externalLoaderClasses = classNamesLoader;
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.combineElements();
    this.addClasses();
  }

  protected createElements(): void {
    (this.rootElement as HTMLElement) = this.domCreatorService.createElement('div');
    (this.loaderElement as HTMLElement) = this.domCreatorService.createElement('div');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(
      ...this.rootClasses,
      ...this.rootHiddenClasses,
      ...this.externalRootClasses
    );
    this.loaderElement.classList.add(...this.loaderClasses, ...this.externalLoaderClasses);
  }

  protected combineElements(): void {
    this.rootElement.append(this.loaderElement);
  }

  public switchVisibleLoader(isShow: boolean): void {
    if (isShow) {
      this.rootElement.classList.remove(...this.rootHiddenClasses);
      return;
    }
    this.rootElement.classList.add(...this.rootHiddenClasses);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
