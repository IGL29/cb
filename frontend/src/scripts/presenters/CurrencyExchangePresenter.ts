import { CurrencyExchangeModel } from '~models/CurrencyExchangeModel';
import { ICurrencyBuyRequestPayload } from '~types/apiPayloads';
import { ICallbackPassCarrencyData, TServerError, TValidationError } from '~types/currencyExchange';
import { Predicate } from '~types/Predicate';
import { IPresenter } from '~types/presenter';
import { IClasses } from '~types/select';
import { CurrencyExchangeView } from '~views/components/CurrencyExchangeView';

export class CurrencyExchangePresenter implements IPresenter<CurrencyExchangeView> {
  private view: CurrencyExchangeView;
  private model: CurrencyExchangeModel;

  private selectCurrencyFrom: string;
  private selectCurrencyTo: string;
  private inputAmount: string;

  private callBackPassExchangeData: ICallbackPassCarrencyData | undefined;

  constructor(args: {
    classNamesRoot: IClasses;
    callBackPassExchangeData?: ICallbackPassCarrencyData;
  }) {
    this.view = new CurrencyExchangeView({
      ...args,
      callbackCurrencyFromSelect: (value: string) => this.changeCurrencyFrom(value),
      callbackCurrencyToSelect: (value: string) => this.changeCurrencyTo(value)
    });
    this.model = new CurrencyExchangeModel();
    if (args.callBackPassExchangeData) {
      this.callBackPassExchangeData = args.callBackPassExchangeData;
    }
    this.addHandlers();
    this.getAllCurrencies();
  }

  public changeCurrencyFrom(value: string): void {
    this.selectCurrencyFrom = value;
  }

  public changeCurrencyTo(value: string): void {
    this.selectCurrencyTo = value;
  }

  public changeAmount(value: string): void {
    this.inputAmount = value;
  }

  private addHandlers(): void {
    this.view.addHandlers({
      target: 'input-amount',
      type: 'input',
      handler: (ev) => {
        if (!Predicate.isInputEvent(ev)) {
          return;
        }
        this.handlerInputAmount(ev);
      }
    });
    this.view.addHandlers({
      type: 'click',
      target: 'btn-transfer',
      handler: (ev) => {
        if (!Predicate.isMouseEvent(ev)) {
          return;
        }
        this.handlerButtonClick();
      }
    });
  }

  private handlerInputAmount(ev: InputEvent): void {
    ev.preventDefault();
    const inputElement = ev.target as HTMLInputElement;
    this.inputAmount = inputElement.value;
  }

  private handlerButtonClick(): void {
    this.view.showInputAmountDefault();
    this.view.showSelectFromDefault();
    this.view.showSelectToDefault();

    this.handlerSubmitCurrencyBuy({
      amount: this.inputAmount,
      from: this.selectCurrencyFrom,
      to: this.selectCurrencyTo
    });
  }

  private handlerSubmitCurrencyBuy(data: ICurrencyBuyRequestPayload): void {
    this.view.isLoading = true;

    this.model
      .handlerSubmitCurrencyBuy(data)
      .then((currencyBuyData) => {
        if (this.callBackPassExchangeData) {
          this.callBackPassExchangeData(currencyBuyData);
        }
        this.view.clearInputAmountValue();
        this.view.clearSelectFromValue();
        this.view.clearSelectToValue();
      })
      .catch((err: Error | TValidationError | TServerError) => {
        if ('errors' in err && err.errors.from && err.errors.from.length) {
          this.view.showSelectFromError(err.errors.from[0]);
        }
        if ('errors' in err && err.errors.to && err.errors.to.length) {
          this.view.showSelectToError(err.errors.to[0]);
        }
        if ('errors' in err && err.errors.amount && err.errors.amount.length) {
          this.view.showInputAmountError(err.errors.amount[0]);
          return;
        }
        if ('error' in err && err.error === 'Not enough currency') {
          this.view.showInputAmountError('На валютном счёте списания нет средств');
          return;
        }
        if ('error' in err && err.error === 'Overdraft prevented') {
          this.view.showInputAmountError(
            'Вы пытаетесь перевести больше, чем доступно на счёте списания'
          );
          return;
        }
        this.view.isLoading = false;
        throw err;
      })
      .finally(() => {
        this.view.isLoading = false;
      });
  }

  private getAllCurrencies(): void {
    this.view.isLoading = true;

    this.model
      .getAllCurrencies()
      .then((data) => {
        if (!data.payload) {
          return;
        }
        const processedDataForSelect = data.payload.map((currency: string) => ({
          title: currency
        }));
        this.view.addOptionsToCurrencyFrom(processedDataForSelect);
        this.view.addOptionsToCurrencyTo(processedDataForSelect);
      })
      .catch((err: Error) => {
        throw err;
      })
      .finally(() => {
        this.view.isLoading = false;
      });
  }

  public getView(): CurrencyExchangeView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
