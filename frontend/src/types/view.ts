export abstract class View {
  protected abstract createElements(): void;
  protected addClasses?(): void;
  protected setAttributes?(): void;
  protected combineElements?(): void;
  protected setValues?(): void;
  public abstract render(): HTMLElement;
}

export interface IAddHandlers<T extends string> {
  addHandlers(args: IAddHandlerArgs<T>): void;
}

export interface IAddHandlerArgs<T> {
  target: T;
  type: TEvent;
  handler: THandlerEvent;
}

export type THandlerEvent = (ev: GlobalEventHandlersEventMap[TEvent]) => void;

export type TEvent = keyof GlobalEventHandlersEventMap;
