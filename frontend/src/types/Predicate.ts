export class Predicate {
  public static isSubmitEvent(
    ev: GlobalEventHandlersEventMap[keyof GlobalEventHandlersEventMap]
  ): ev is SubmitEvent {
    return ev instanceof SubmitEvent;
  }

  public static isInputEvent(
    ev: GlobalEventHandlersEventMap[keyof GlobalEventHandlersEventMap]
  ): ev is InputEvent {
    return ev instanceof InputEvent;
  }

  public static isMouseEvent(
    ev: GlobalEventHandlersEventMap[keyof GlobalEventHandlersEventMap]
  ): ev is MouseEvent {
    return ev instanceof MouseEvent;
  }

  public static isFocusEvent(
    ev: GlobalEventHandlersEventMap[keyof GlobalEventHandlersEventMap]
  ): ev is FocusEvent {
    return ev instanceof FocusEvent;
  }

  public static isError(err: any): err is Error {
    return err instanceof Error;
  }
}
