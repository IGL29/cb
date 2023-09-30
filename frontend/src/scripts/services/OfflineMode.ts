import { IObserver } from '~types/observable';
import { Observable } from './Observable';

export class OfflineModeService extends Observable {
  static _instance: OfflineModeService;
  private isAddedOfflineHandler: boolean;

  constructor() {
    if (OfflineModeService._instance) {
      return OfflineModeService._instance;
    }
    super(() => {
      if (this.isAddedOfflineHandler) {
        return;
      }
      window.addEventListener('offline', () => {
        Object.values(this.observers).forEach((observer: IObserver) => {
          observer.next(true);
        });
      });
      window.addEventListener('online', () => {
        Object.values(this.observers).forEach((observer: IObserver) => {
          observer.next(false);
        });
      });
    });
  }

  public subscribe(observer: IObserver) {
    return super.subscribe(observer);
  }
}
