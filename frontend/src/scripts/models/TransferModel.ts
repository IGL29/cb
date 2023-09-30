import { Requests } from '~services/Requests';
import { TAccountId } from '~types/apiPayloads';
import { ITransferRequestArgs, TTransferResponse } from '~types/requests';

export class TransferModel {
  private requestsService: Requests;

  constructor() {
    this.requestsService = new Requests();
  }

  public postTransfer(data: ITransferRequestArgs): Promise<TTransferResponse> {
    const validateResult = this.validateTransferData(data);

    if (!validateResult.isValid) {
      return Promise.reject(validateResult.errors);
    }
    return this.postTransferApi(data);
  }

  private validateTransferData(data: ITransferRequestArgs) {
    const errors: { to: string[]; amount: string[] } = { to: [], amount: [] };

    const resultValidateAccountTo = this.validateAccountTo(data.data.to);
    const resultValidateAmount = this.validateAmount(data.data.amount);

    if (resultValidateAccountTo.length || resultValidateAmount.length) {
      return {
        isValid: false,
        errors: { to: resultValidateAccountTo, amount: resultValidateAmount }
      };
    }
    return { isValid: true, errors };
  }

  private validateAmount(amount: string) {
    const errors: string[] = [];

    if (!amount.trim()) {
      errors.push('Не указана сумма перевода');
      return errors;
    }

    if (!/^\d+$/.test(amount.trim())) {
      errors.push('Сумма может содержать только цифры и не может быть отрицательной');
      return errors;
    }
    return errors;
  }

  private validateAccountTo(accountTo: TAccountId) {
    const errors: string[] = [];

    if (!accountTo.trim()) {
      errors.push('Не выбран счет для перевода');
      return errors;
    }

    if (!/^\d+$/.test(accountTo.trim())) {
      errors.push('Счет для перевода может содержать только цифры');
      return errors;
    }
    return errors;
  }

  public getSavedAccounts(): TAccountId[] {
    const accountsFromStorage = localStorage.getItem('transfer_accounts');
    if (accountsFromStorage) {
      return JSON.parse(accountsFromStorage);
    }
    return [];
  }

  private saveAccount(account: string): void {
    const accountsFromStorage = localStorage.getItem('transfer_accounts');
    let savedAccounts = null;

    if (accountsFromStorage) {
      savedAccounts = JSON.parse(accountsFromStorage);
      if (savedAccounts.find((savedAccount: string) => savedAccount === account)) {
        return;
      }
      savedAccounts.push(account);
    } else {
      savedAccounts = [account];
    }
    localStorage.setItem('transfer_accounts', JSON.stringify(savedAccounts));
  }

  public postTransferApi(requestData: ITransferRequestArgs): Promise<TTransferResponse> {
    return this.requestsService
      .postTransfer(requestData)
      .then((data) => {
        if (data.error) {
          return Promise.reject(data);
        }
        this.saveAccount(requestData.data.to);
        return Promise.resolve(data);
      })
      .catch((err: Error) => Promise.reject(err));
  }
}
