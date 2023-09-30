import { ProgressLoaderPresenter } from '~presenters/ProgressLoaderPresenter';
import { IClasses } from '~types/select';
import { throttle } from '~utils/throttle';
import { DOMCreatorService } from './DOMCreatorService';

export class DragAndDropService {
  static _instance: DragAndDropService;

  private bodyElement: HTMLElement | null;
  private targetElement: HTMLElement | null;
  private targetCloneElement: HTMLElement | null;
  private pseudoTargetElement: HTMLElement | null;

  private currentContainableElement: HTMLElement | null;
  private newContainableElement: HTMLElement | null;

  private progressLoaderPresenter: ProgressLoaderPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private spaceToCursorX: number;
  private spaceToCursorY: number;

  private scrollHeight: number;
  private scrollWidth: number;

  private selectorContainableContainer: string = '[data-containable-container]';
  private selectorTargetElement: string = '[data-draggable-target]';

  private throttleMouseMove: typeof this.handlerMouseMove;

  private timerId: null | ReturnType<typeof setTimeout>;
  private pointerEvent: PointerEvent;

  private progressLoaderClasses: IClasses = ['absolute'];

  constructor() {
    if (DragAndDropService._instance) {
      return DragAndDropService._instance;
    }
    DragAndDropService._instance = this;
    this.domCreatorService = new DOMCreatorService();
    this.init();
  }

  private init(): void {
    document.addEventListener('pointerdown', this.handlerPointerDown.bind(this));
    document.addEventListener('pointerup', () => {
      this.clearTimeoutPseudoTarget();
      this.removeProgressLoader();
    });
    this.throttleMouseMove = throttle(this.handlerMouseMove.bind(this), 15);
    this.progressLoaderPresenter = new ProgressLoaderPresenter({
      classNamesRoot: this.progressLoaderClasses
    });
  }

  public makeDraggable(element: HTMLElement, containerId?: string): HTMLElement {
    const containableContainerElement = this.domCreatorService.createElement('div');
    containableContainerElement.ondragstart = () => false;
    const pseudoTarget = this.domCreatorService.createElement('div');
    containableContainerElement.append(pseudoTarget, element);
    containableContainerElement.classList.add('relative', 'draggable-container');
    containableContainerElement.dataset.containableContainer = 'true';
    pseudoTarget.dataset.draggable = 'true';
    element.dataset.draggableTarget = 'true';
    element.classList.add('relative');

    if (containerId) {
      element.dataset.dragId = containerId;
      containableContainerElement.dataset.dragId = containerId;
    }
    pseudoTarget.classList.add(
      'touch-none',
      'pseudo-target',
      'absolute',
      'left-[50%]',
      'opacity-20',
      'hover:opacity-40',
      'hover:before:bg-[#116ACC]',
      'transition-[opacity]',
      'translate-x-[-50%]',
      'border-[2px]',
      'border-t-[gray]',
      'border-b-[gray]',
      'hover:border-[#116ACC]',
      'border-l-0',
      'border-r-0',
      'top-[5px]',
      'w-[100px]',
      'h-2',
      'z-[1]',
      'cursor-grab'
    );
    return containableContainerElement;
  }

  private handlerPointerDown(ev: PointerEvent): void {
    const pseudoTargetElement = ev.target as HTMLElement;

    if (!this.isExpectedPseudoTarget(pseudoTargetElement)) {
      return;
    }

    const targetElement = pseudoTargetElement?.parentElement?.querySelector(
      this.selectorTargetElement
    ) as HTMLElement;

    if (!this.isExpectedPointer(ev) || !this.isExpectedTarget(targetElement)) {
      return;
    }

    this.clearTimeoutPseudoTarget();
    this.removeProgressLoader();

    this.showProgressLoader(ev.pageX, ev.pageY);

    this.timerId = setTimeout(() => {
      this.preparingToMove(ev, pseudoTargetElement, targetElement);
      this.removeProgressLoader();
    }, 2000);

    setTimeout(() => {
      this.progressLoaderPresenter.getView().setProgress(100);
    });
  }

  private setLoaderPosition(ev: PointerEvent) {
    this.progressLoaderPresenter.getView().setLoaderPosition(ev.pageX, ev.pageY);
  }

  private removeProgressLoader() {
    this.progressLoaderPresenter.render().remove();
    document.removeEventListener('pointermove', this.setLoaderPosition);
  }

  private showProgressLoader(x: number, y: number) {
    this.progressLoaderPresenter.getView().setProgress(0);
    document.addEventListener('pointermove', this.setLoaderPosition.bind(this));

    document.documentElement.append(this.progressLoaderPresenter.render());
    this.progressLoaderPresenter.getView().setLoaderPosition(x, y);
  }

  private clearTimeoutPseudoTarget() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private preparingToMove(
    ev: PointerEvent,
    pseudoTargetElement: HTMLElement,
    targetElement: HTMLElement
  ) {
    pseudoTargetElement.style.opacity = '0';
    this.targetElement = targetElement;
    this.pseudoTargetElement = pseudoTargetElement;
    this.saveBodySizes();
    this.createCloneOfTarget(this.targetElement);
    this.setStylesToTarget(this.targetElement);
    this.saveCursorSpaces(ev, this.targetElement);

    this.currentContainableElement = this.targetElement.closest(this.selectorContainableContainer);

    if (!this.targetCloneElement || !this.bodyElement || !this.currentContainableElement) {
      return;
    }

    this.movingTargetClone(ev);

    this.targetCloneElement.onpointermove = this.throttleMouseMove.bind(this);
    this.targetCloneElement.onpointerup = this.handlerMouseUp.bind(this);
    this.targetCloneElement.style.backgroundColor = '#c7d7e9';
  }

  private movingTargetClone(ev: PointerEvent) {
    if (!this.targetCloneElement || !this.bodyElement) {
      return;
    }
    this.moveTo(ev.pageX, ev.pageY);
    this.targetCloneElement.style.position = 'absolute';
    this.targetCloneElement.style.pointerEvents = 'none';
    this.bodyElement.append(this.targetCloneElement);
    this.targetCloneElement.setPointerCapture(ev.pointerId);
    this.moveTo(ev.pageX, ev.pageY);
  }

  private handlerMouseMove(ev: PointerEvent): void {
    ev.preventDefault();

    if (this.bodyElement) {
      this.bodyElement.style.userSelect = 'none';
    }

    const belowElement = this.getBelowElement(ev);

    if (!belowElement) {
      return;
    }

    this.searchNewPossibleContainer(belowElement, this.targetElement!);
    this.moving(ev);
    this.scrollPage(ev);
  }

  private scrollPage(ev: PointerEvent) {
    // upper
    if (ev.clientY < 100 && window.pageYOffset !== 0) {
      window.scrollTo(0, window.pageYOffset - 10);
      return;
    }

    // bottom
    if (
      ev.clientY >= document.documentElement.clientHeight - 100 &&
      document.documentElement.scrollHeight >
        document.documentElement.clientHeight + window.pageYOffset
    ) {
      window.scrollTo(0, window.pageYOffset + 10);
    }
  }

  private handlerMouseUp(): void {
    if (this.pseudoTargetElement) {
      this.pseudoTargetElement.style.opacity = '';
    }
    if (!this.targetCloneElement || !this.targetElement) {
      this.resetTargetElementStyles();
      this.resetData();
      return;
    }

    if (!this.newContainableElement) {
      this.targetCloneElement.remove();
      this.resetTargetElementStyles();
      this.resetData();
      return;
    }

    if (
      this.newContainableElement &&
      this.newContainableElement === this.currentContainableElement
    ) {
      this.targetCloneElement.remove();
      this.resetContainableElementStyles();
      this.resetTargetElementStyles();
      this.resetData();
      return;
    }

    if (this.newContainableElement) {
      this.targetCloneElement.remove();
      this.newContainableElement.append(this.targetElement);
      this.resetContainableElementStyles();
    }

    const childrenOfNewContainable = this.newContainableElement?.querySelector(
      this.selectorTargetElement
    ) as HTMLElement;

    if (childrenOfNewContainable) {
      childrenOfNewContainable.style.opacity = '0';
      this.currentContainableElement?.append(childrenOfNewContainable);
    }

    this.targetElement.style.touchAction = '';

    let timerId: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      this.targetElement!.style.opacity = '';
      childrenOfNewContainable.style.opacity = '';
      this.resetData();
      clearTimeout(timerId!);
      timerId = null;
    }, 0);
  }

  private resetData(): void {
    this.bodyElement = null;
    this.targetElement = null;
    this.targetCloneElement = null;
    this.currentContainableElement = null;
    this.newContainableElement = null;
    this.pseudoTargetElement = null;
  }

  private isExpectedPointer(ev: PointerEvent): boolean {
    return ev.button === 0 && ev.isTrusted;
  }

  private isExpectedTarget(targetElement: HTMLElement): boolean {
    return !!(targetElement && targetElement.dataset.draggableTarget);
  }

  private isExpectedPseudoTarget(pointerDownEventTarget: HTMLElement): boolean {
    return !!(pointerDownEventTarget && pointerDownEventTarget.dataset.draggable);
  }

  private saveBodySizes(): void {
    this.bodyElement = document.body;
    this.scrollHeight = Math.max(
      this.bodyElement.scrollHeight,
      document.documentElement.scrollHeight,
      this.bodyElement.offsetHeight,
      document.documentElement.offsetHeight,
      this.bodyElement.clientHeight,
      document.documentElement.clientHeight
    );
    this.scrollWidth = this.bodyElement.scrollWidth;
  }

  private setStylesToTarget(element: HTMLElement): void {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.5s';
  }

  private saveCursorSpaces(ev: PointerEvent, targetElement: HTMLElement): void {
    this.spaceToCursorX = ev.pageX - (targetElement.getBoundingClientRect().left + window.screenX);
    this.spaceToCursorY = ev.pageY - (targetElement.getBoundingClientRect().top + window.scrollY);
  }

  private createCloneOfTarget(element: HTMLElement): void {
    this.targetCloneElement = element.cloneNode(false) as HTMLElement;
    this.targetCloneElement.style.opacity = '0.5';
    this.targetCloneElement.style.width = `${element.offsetWidth}px`;
    this.targetCloneElement.style.height = `${element.offsetHeight}px`;
  }

  private moveTo(x: number, y: number): void {
    this.targetCloneElement!.style.left = `${x - this.spaceToCursorX}px`;
    this.targetCloneElement!.style.top = `${y - this.spaceToCursorY}px`;
  }

  private searchNewPossibleContainer(belowElement: HTMLElement, targetElement: HTMLElement): void {
    const possibleNewContainerElement = belowElement.closest(
      this.selectorContainableContainer
    ) as HTMLElement;

    if (
      this.isCorrectContainerWithoutId(possibleNewContainerElement, targetElement) ||
      this.isCorrectContainerWithId(possibleNewContainerElement, targetElement)
    ) {
      if (this.newContainableElement && this.newContainableElement.style.outline) {
        this.newContainableElement.style.backgroundColor = '';
        this.newContainableElement.style.outline = '';
      }
      this.newContainableElement = possibleNewContainerElement;
      this.newContainableElement.style.outline = '2px solid #5b94d3';
      this.newContainableElement.style.backgroundColor = '#dcedff';
    }
  }

  private isCorrectContainerWithoutId(
    possibleNewContainerElement: HTMLElement,
    targetElement: HTMLElement
  ): boolean {
    return (
      possibleNewContainerElement &&
      !targetElement.dataset.dragId &&
      !possibleNewContainerElement.dataset.dragId
    );
  }

  private isCorrectContainerWithId(
    possibleNewContainerElement: HTMLElement,
    targetElement: HTMLElement
  ): boolean {
    return !!(
      possibleNewContainerElement &&
      possibleNewContainerElement.dataset.dragId &&
      possibleNewContainerElement.dataset.dragId === targetElement.dataset.dragId
    );
  }

  private getBelowElement(ev: PointerEvent): HTMLElement | null {
    this.targetCloneElement!.hidden = true;
    const belowElement = document.elementFromPoint(ev.clientX, ev.clientY) as HTMLElement;
    this.targetCloneElement!.hidden = false;
    return belowElement;
  }

  private moving(ev: PointerEvent): void {
    // upper left corner
    if (ev.pageX - this.spaceToCursorX < 0 && ev.pageY - this.spaceToCursorY < 0) {
      this.moveTo(0 + this.spaceToCursorX, 0 + this.spaceToCursorY);
      return;
    }

    // upper right corner
    if (
      ev.pageX - this.spaceToCursorX + this.targetCloneElement!.offsetWidth >
        this.scrollWidth - 1 &&
      ev.pageY - this.spaceToCursorY < 0
    ) {
      this.moveTo(
        this.scrollWidth - this.targetCloneElement!.offsetWidth + this.spaceToCursorX - 1,
        0 + this.spaceToCursorY
      );
      return;
    }

    // bottom left corner
    if (
      ev.pageX - this.spaceToCursorX < 0 &&
      ev.pageY - this.spaceToCursorY + this.targetCloneElement!.offsetHeight > this.scrollHeight - 1
    ) {
      this.moveTo(
        0 + this.spaceToCursorX,
        this.scrollHeight - this.targetCloneElement!.offsetHeight + this.spaceToCursorY - 1
      );
      return;
    }

    // bottom right corner
    if (
      ev.pageX - this.spaceToCursorX + this.targetCloneElement!.offsetWidth >
        this.scrollWidth - 1 &&
      ev.pageY - this.spaceToCursorY + this.targetCloneElement!.offsetHeight > this.scrollHeight - 1
    ) {
      this.moveTo(
        this.scrollWidth - this.targetCloneElement!.offsetWidth + this.spaceToCursorX - 1,
        this.scrollHeight - this.targetCloneElement!.offsetHeight + this.spaceToCursorY - 1
      );
      return;
    }

    // right side
    if (
      ev.pageX - this.spaceToCursorX + this.targetCloneElement!.offsetWidth >
      this.scrollWidth - 1
    ) {
      this.moveTo(
        this.scrollWidth - this.targetCloneElement!.offsetWidth + this.spaceToCursorX - 1,
        ev.pageY
      );
      return;
    }

    // left side
    if (ev.pageX - this.spaceToCursorX < 0) {
      this.moveTo(0 + this.spaceToCursorX, ev.pageY);
      return;
    }
    // upper side
    if (ev.pageY - this.spaceToCursorY < 0) {
      this.moveTo(ev.pageX, 0 + this.spaceToCursorY);
      return;
    }

    // bottom side
    if (
      ev.pageY - this.spaceToCursorY + this.targetCloneElement!.offsetHeight >
      this.scrollHeight - 1
    ) {
      this.moveTo(
        ev.pageX,
        this.scrollHeight - this.targetCloneElement!.offsetHeight + this.spaceToCursorY - 1
      );
      return;
    }
    this.moveTo(ev.pageX, ev.pageY);
  }

  private resetTargetElementStyles(): void {
    if (!this.targetElement) {
      return;
    }
    this.targetElement.style.opacity = '';
  }

  private resetContainableElementStyles(): void {
    if (!this.newContainableElement) {
      return;
    }
    this.newContainableElement.style.outline = '';
    this.newContainableElement.style.backgroundColor = '';
  }
}
