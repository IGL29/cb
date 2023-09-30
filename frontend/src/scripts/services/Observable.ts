import { ISubscriptionFunction, IObserver, TSubscribeValue } from '~types/observable';
import { generateRandomString } from '~utils/generateRandomString';
import { SafeSubscription } from './SafeSubscription';

export class Observable {
  private subscriptionFunction: ISubscriptionFunction;
  protected observers: { [key: string]: IObserver } = {};

  constructor(subscriptionFunction: ISubscriptionFunction) {
    this.subscriptionFunction = subscriptionFunction;
  }

  public subscribe(observer: IObserver): TSubscribeValue {
    const key = generateRandomString();
    this.observers[key] = observer;

    const safeSubscriptionFunction = new SafeSubscription(observer, this.observers);

    this.subscriptionFunction(safeSubscriptionFunction);
    return { unsubscribe: this.unsubscribe.bind(null, key) };
  }

  private unsubscribe(key: string): void {
    if (this.observers[key]) {
      delete this.observers[key];
    }
  }
}
