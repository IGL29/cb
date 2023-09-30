import { transformCurrencyFilter } from 'src/scripts/filters/transformCurrencyFilter';
import { CurrencyConversionModel } from '~models/CurrencyConversionModel';
import { NotifyPresenter } from '~presenters/NotifyPresenter';
import { TCurrency } from '~types/apiPayloads';
import { TOptions } from '~types/horizontalTable';
import { IPresenter } from '~types/presenter';
import { TCurrenciesResponse } from '~types/requests';
import { CurrencyConversionView } from '~views/pages/CurrencyConversionView';

export class CurrencyConversionPresenter implements IPresenter<CurrencyConversionView> {
  static _instance: CurrencyConversionPresenter;
  private view: CurrencyConversionView;
  private model: CurrencyConversionModel;
  private notifyPresenter: NotifyPresenter;

  constructor() {
    this.view = new CurrencyConversionView({
      passCallbackToCurrencyExchange: (data) => {
        this.fillTable(data);
      }
    });
    this.model = new CurrencyConversionModel();
    this.notifyPresenter = new NotifyPresenter();
    this.getCurrencies();
    this.getStreamCurrencyRate();
  }

  private getStreamCurrencyRate() {
    this.view.isLoadingCurrencyRate = true;
    const webSocketCurrencyRate = this.model.getStreamCurrencyRate();

    webSocketCurrencyRate.onopen = () => {
      this.view.isLoadingCurrencyRate = false;
    };
    webSocketCurrencyRate.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const processedDataForTable = [[`${data.from}/${data.to}`, data.rate]];
      const classOption: TOptions = [data.change === 1 ? 'up' : data.change === -1 ? 'down' : null];
      this.view.fillCurrenciesRateTable({
        values: processedDataForTable,
        renderingMethod: 'update',
        options: classOption
      });
    };
    webSocketCurrencyRate.onerror = () => {
      this.view.isLoadingCurrencyRate = false;
    };
    webSocketCurrencyRate.onclose = () => {
      this.view.isLoadingCurrencyRate = false;
    };
  }

  private getCurrencies() {
    this.view.isLoadingAccountCurrencies = true;

    this.model
      .getCurrencies()
      .then((data) => {
        this.fillTable(data);
      })
      .catch((err: Error) => {
        this.notifyPresenter.notify({
          title: 'Ошибка при запросе',
          description:
            'Произошла неизвестная ошибка при запросе. Попробуйте обновить страницу и повторить снова.'
        });
        throw err;
      })
      .finally(() => {
        this.view.isLoadingAccountCurrencies = false;
      });
  }
  private fillTable(data: TCurrenciesResponse) {
    if (!data.payload) {
      return;
    }
    const processedData = [];

    for (const [key, value] of Object.entries(data.payload)) {
      processedData.push([key, transformCurrencyFilter(value.amount, <TCurrency>key, false)]);
    }

    this.view.fillAccountCurrenciesTable({ values: processedData });
  }

  public onDestroy() {
    this.model.closeStreamCurrencyRate();
  }

  public getView(): CurrencyConversionView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
