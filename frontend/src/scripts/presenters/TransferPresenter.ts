import { TransferModel } from '~models/TransferModel';
import { Predicate } from '~types/Predicate';
import { IPresenter } from '~types/presenter';
import { ICallBackPassTransferData, IServerError, TValidateErrors } from '~types/transfer';
import { TransferView } from '~views/components/TransferView';

export class TransferPresenter implements IPresenter<TransferView> {
  private view: TransferView;
  private model: TransferModel;
  private account: string = '';
  private accountTo: string = '';
  private amount: string = '';
  private callBackPassTransferData: ICallBackPassTransferData;

  constructor(callBackPassTransferData?: ICallBackPassTransferData) {
    this.view = new TransferView({
      callbackSAccountSelect: (val: string) => {
        this.accountTo = val;
      }
    });
    this.model = new TransferModel();
    this.addHandlers();
    this.addOptionsToAccountSelect();
    this.view.addHandlers({
      target: 'btn-transfer',
      type: 'click',
      handler: () => this.handlerTransfer()
    });
    this.view.addHandlers({
      target: 'input-account',
      type: 'input',
      handler: (ev) => {
        const target = <HTMLInputElement>ev.target;
        this.accountTo = target.value;
      }
    });
    this.view.addHandlers({
      target: 'input-amount',
      type: 'input',
      handler: (ev) => {
        const target = <HTMLInputElement>ev.target;
        this.amount = target.value;
      }
    });

    if (callBackPassTransferData) {
      this.callBackPassTransferData = callBackPassTransferData;
    }
  }

  private addOptionsToAccountSelect(): void {
    const accounts: { title: string }[] = [];
    const savedAccounts = this.model.getSavedAccounts();

    if (savedAccounts.length) {
      savedAccounts.forEach((account) => {
        accounts.push({ title: account });
      });
    }
    this.view.addOptionsToAccountSelect(accounts);
  }

  private handlerTransfer(): void | never {
    this.view.showInputAccountDefault();
    this.view.showInputAmountDefault();
    this.view.isLoading = true;

    this.model
      .postTransfer({ data: { amount: this.amount, from: this.account, to: this.accountTo } })
      .then((data) => {
        this.addOptionsToAccountSelect();
        if (this.callBackPassTransferData) {
          this.callBackPassTransferData(data);
        }
        this.view.clearInputAccountValue();
        this.view.clearInputAmountValue();
      })
      .catch((err: Error | TValidateErrors['errors'] | IServerError): void | never => {
        if ('to' in err && err.to.length) {
          this.showInputAccountError(err.to[0]);
        }
        if ('amount' in err && err.amount.length) {
          this.showInputAmountError(err.amount[0]);
          return;
        }
        if ('error' in err && err.error && err.error === 'Invalid account to') {
          this.showInputAccountError('Неверно указан счет зачисления или счет не существует');
          return;
        }
        if ('error' in err && err.error && err.error === 'Overdraft prevented') {
          this.showInputAmountError('Вы попытались перевести больше средств чем доступно на счете');
          return;
        }
        throw err;
      })
      .finally(() => {
        this.view.isLoading = false;
      });
  }

  private addHandlers(): void {
    this.view.addHandlers({
      target: 'input-amount',
      type: 'input',
      handler: (ev) => {
        if (!Predicate.isInputEvent(ev)) {
          return;
        }
        this.handlerAmountInput(ev);
      }
    });
  }

  private handlerAmountInput(ev: InputEvent): void {
    const inputElement = ev.target as HTMLInputElement;
    this.amount = inputElement.value;
  }

  private showInputAccountError(errorMessage?: string): void {
    this.view.showInputAccountError(errorMessage);
  }

  private showInputAmountError(errorMessage?: string): void {
    this.view.showInputAmountError(errorMessage);
  }

  public setAccountValue(account: string): void {
    this.account = account;
  }

  public getView(): TransferView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
