import { ITransaction, TAccountId, TTransactions } from '~types/apiPayloads';
import {
  IRecentValue,
  IRecentValueRate,
  IRecentValuesInMonths,
  IRecentValuesInMonthsRate,
  ITransactionsWithBalance,
  IValue
} from '~types/graph';

export class GraphService {
  static _instance: GraphService;

  constructor() {
    if (GraphService._instance) {
      return GraphService._instance;
    }
    GraphService._instance = this;
  }

  public processDataDynamicBalance(
    account: TAccountId,
    currentBalance: number,
    transactions: TTransactions,
    count?: number
  ): Omit<IRecentValue, 'date'>[] {
    if (!transactions.length) {
      return <[]>transactions;
    }

    const monthNames = [
      'янв',
      'фев',
      'мар',
      'апр',
      'май',
      'июн',
      'июл',
      'авг',
      'сен',
      'окт',
      'ноя',
      'дек'
    ];
    let balanceFfterCurrentTransaction = currentBalance;
    let balanceFfterLastTransaction = currentBalance;

    const transactionsWithBalance: ITransactionsWithBalance[] = transactions.map(
      (transaction: ITransaction, index: number) => {
        if (index === 0) {
          if (transaction.from === account) {
            balanceFfterLastTransaction += transaction.amount;
          } else {
            balanceFfterLastTransaction -= transaction.amount;
          }
          return { ...transaction, balance: balanceFfterCurrentTransaction };
        }

        if (transaction.from === account) {
          balanceFfterCurrentTransaction += transaction.amount;
          return { ...transaction, balance: balanceFfterLastTransaction };
        }

        balanceFfterCurrentTransaction -= transaction.amount;
        return { ...transaction, balance: balanceFfterLastTransaction };
      }
    );
    const recentValuesInMonths: IRecentValuesInMonths = {};

    transactionsWithBalance.forEach((item: ITransactionsWithBalance) => {
      const date = new Date(item.date);
      const month = date.getMonth();

      if (!recentValuesInMonths[month] || date > recentValuesInMonths[month].date) {
        recentValuesInMonths[month] = { value: item.balance, title: monthNames[month], date };
      }
    });

    const result: IRecentValue[] = Object.values(recentValuesInMonths);
    if (count) {
      return result
        .slice(0, count)
        .map((item: IRecentValue) => ({ value: item.value, title: item.title }));
    }
    return result;
  }

  public processDataTransactionsRate(
    account: TAccountId,
    transactions: TTransactions,
    count?: number
  ): IRecentValueRate[] {
    const monthNames = [
      'янв',
      'фев',
      'мар',
      'апр',
      'май',
      'июн',
      'июл',
      'авг',
      'сен',
      'окт',
      'ноя',
      'дек'
    ];

    const recentValuesInMonths: IRecentValuesInMonthsRate = {};

    const copyTransactions = [...transactions];

    copyTransactions.forEach((item: ITransaction) => {
      const date = new Date(item.date);
      const month = date.getMonth();

      const processedValue: IValue = {};

      if (item.from === account) {
        processedValue.down =
          'down' in processedValue && processedValue.down
            ? item.amount + processedValue.down
            : item.amount;
      } else {
        processedValue.up =
          'up' in processedValue && processedValue.up
            ? item.amount + processedValue.up
            : item.amount;
      }

      if (!recentValuesInMonths[month]) {
        recentValuesInMonths[month] = { value: processedValue, title: monthNames[month] };
      } else if (
        'up' in recentValuesInMonths[month].value &&
        recentValuesInMonths[month].value.up &&
        'up' in processedValue &&
        processedValue.up
      ) {
        recentValuesInMonths[month].value.up =
          recentValuesInMonths[month].value.up! + processedValue.up;
      } else if (
        'down' in recentValuesInMonths[month].value &&
        recentValuesInMonths[month].value.down &&
        'down' in processedValue &&
        processedValue.down
      ) {
        recentValuesInMonths[month].value.down =
          recentValuesInMonths[month].value.down! + processedValue.down;
      } else {
        recentValuesInMonths[month].value = {
          ...recentValuesInMonths[month].value,
          ...processedValue
        };
      }
    });

    if (count) {
      return Object.values(recentValuesInMonths).slice(0, count);
    }
    return Object.values(recentValuesInMonths);
  }
}
