export interface IObserver {
  next(value: any): void;
}

export interface ISubscriptionFunction {
  (observer: IObserver): void;
}

export type TSubscribeValue = { unsubscribe: () => void };
