export interface IRecentValue {
  value: number;
  title: string;
  date: Date;
}

export interface IRecentValuesInMonths {
  [key: number]: IRecentValue;
}

export interface IRecentValuesInMonthsRate {
  [key: number]: IRecentValueRate;
}

export interface IRecentValueRate {
  title: string;
  value: IValue;
}

export interface IValue {
  down?: number;
  up?: number;
}

export interface ITransactionsWithBalance {
  balance: number;
  amount: number;
  date: string;
  from: string;
  to: string;
}

export interface IDataWithOneValue {
  title: string;
  value: number;
}

export interface IDataWithMultiplyValue {
  title: string;
  value: IValue;
}
