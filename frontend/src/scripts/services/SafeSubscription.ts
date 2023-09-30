import { IObserver } from '~types/observable';

class SafeSubscription {
  private observer: IObserver;
  private observers: { [key: string]: IObserver };

  constructor(observer: IObserver, observers: { [key: string]: IObserver }) {
    this.observer = observer;
    this.observers = observers;
  }

  next(val: any) {
    if (!Object.keys(this.observers).length) {
      return;
    }
    this.observer.next(val);
  }
}

export { SafeSubscription };
