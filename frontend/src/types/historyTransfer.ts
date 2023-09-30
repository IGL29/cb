import { TRenderingMethod } from '~types/table';
import { TTransactions } from './apiPayloads';

export interface IFillHistoryDataArgs {
  currentAccount: string;
  values: TTransactions;
  renderingMethod?: TRenderingMethod;
}

export interface ILoadMoreCallback {
  (args?: any): any;
}

export interface IHistoryTransferArgs {
  loadMoreCallback?: ILoadMoreCallback;
}
