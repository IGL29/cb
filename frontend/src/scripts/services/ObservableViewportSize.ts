import { IObserver } from '~types/observable';
import { Observable } from './Observable';

export class ObservableViewportSize extends Observable {
  private static _instance: ObservableViewportSize;
  private viewportWidth: number;
  private isAddedResizeHandler: boolean;

  constructor() {
    super(() => {
      if (!this.isAddedResizeHandler) {
        window.addEventListener('resize', () => {
          this.saveSize();
          for (const observer of Object.values(this.observers)) {
            observer.next({ width: this.viewportWidth });
          }
        });
        this.isAddedResizeHandler = true;
      }
    });

    if (ObservableViewportSize._instance) {
      return ObservableViewportSize._instance;
    }
    ObservableViewportSize._instance = this;
    this.saveSize();
  }

  public subscribe(observer: IObserver) {
    return super.subscribe(observer);
  }

  private saveSize(): void {
    this.viewportWidth = document.documentElement.clientWidth;
  }
}
