import { DescriptionBalancePresenter } from '~presenters/DescriptionBalancePresenter';
import { HistoryTransferPresenter } from '~presenters/HistoryTransferPresenter';
import { GraphPresenter } from '~presenters/GraphPresenter';
import { DragAndDropService } from '~services/DragAndDropService';
import { IDataWithMultiplyValue, IDataWithOneValue } from '~types/graph';
import { IFillHistoryDataArgs } from '~types/historyTransfer';
import { View } from '~types/view';
import { IClasses } from '~types/select';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class BalanceHistoryView extends View {
  private rootElement: HTMLElement;
  private siteContainerElement: HTMLElement;
  private sectionDynamicOfBalance: HTMLElement;
  private sectionTransactionRatio: HTMLElement;
  private sectionHistoryTransactions: HTMLElement;
  private draggableSectionDynamicOfBalance: HTMLElement;
  private draggableSectionTransactionRatio: HTMLElement;

  private dynamicOfBalanceGraph: GraphPresenter;
  private transactionRationGraph: GraphPresenter;
  private historyTransactionsTable: HistoryTransferPresenter;
  private descriptionBalancePresenter: DescriptionBalancePresenter;
  private dragAndDropService: DragAndDropService;
  private readonly domCreatorService: DOMCreatorService;

  private rootClasses: IClasses = ['grow'];
  private siteContainerClass: IClasses = [
    'max-w-[1440px]',
    'px-[50px]',
    'mx-auto',
    'w-full',
    'pt-[50px]',
    'pb-[50px]',
    'sm:px-[30px]',
    'xs:px-[20px]'
  ];
  private sectionDynamicOfBalanceClasses: IClasses = ['mb-[50px]'];
  private sectionTransactionRatioClasses: IClasses = ['mb-[50px]'];
  private sectionHistoryTransactionsClasses: IClasses = [];
  private descriptionBalanceClasses: IClasses = ['mb-[50px]'];
  private dynamicOfBalanceWrapperClasses: IClasses = ['h-[195px]'];
  private transactionRationWrapperClasses: IClasses = ['h-[195px]'];

  private descBalanceTitleValue: string = 'История баланса';
  private dynamicBalanceTitleValue: string = 'Динамика баланса';
  private transactionRatioTitleValue: string = 'Соотношение входящих исходящих транзакций';
  private dynamicBalanceEmptyValue: string = 'Изменения баланса отсуствуют';
  private transactionsRatioEmptyValue: string = 'Изменения баланса отсуствуют';

  constructor({ loadMoreCallback }: { loadMoreCallback?: (args?: any) => any } = {}) {
    super();

    this.descriptionBalancePresenter = new DescriptionBalancePresenter({
      rootClasses: this.descriptionBalanceClasses
    });
    this.dynamicOfBalanceGraph = new GraphPresenter();
    this.transactionRationGraph = new GraphPresenter();
    this.historyTransactionsTable = new HistoryTransferPresenter({ loadMoreCallback });
    this.dragAndDropService = new DragAndDropService();
    this.domCreatorService = new DOMCreatorService();

    this.createElements();
    this.addClasses();
    this.makeDraggable();
    this.combineElements();
    this.setValue();
  }

  private makeDraggable(): void {
    this.draggableSectionDynamicOfBalance = this.dragAndDropService.makeDraggable(
      this.sectionDynamicOfBalance
    );
    this.draggableSectionTransactionRatio = this.dragAndDropService.makeDraggable(
      this.sectionTransactionRatio
    );
  }

  protected createElements(): void {
    this.rootElement = this.domCreatorService.createElement('div');
    this.siteContainerElement = this.domCreatorService.createElement('div');
    this.sectionDynamicOfBalance = this.domCreatorService.createElement('section');
    this.sectionTransactionRatio = this.domCreatorService.createElement('section');
    this.sectionHistoryTransactions = this.domCreatorService.createElement('section');
  }

  protected addClasses(): void {
    this.rootElement.classList.add(...this.rootClasses);
    this.siteContainerElement.classList.add(...this.siteContainerClass);
    this.sectionDynamicOfBalance.classList.add(...this.sectionDynamicOfBalanceClasses);
    this.sectionTransactionRatio.classList.add(...this.sectionTransactionRatioClasses);
    this.sectionHistoryTransactions.classList.add(...this.sectionHistoryTransactionsClasses);
    this.dynamicOfBalanceGraph.getView().setWrapperClasses(this.dynamicOfBalanceWrapperClasses);
    this.transactionRationGraph.getView().setWrapperClasses(this.transactionRationWrapperClasses);
  }

  protected combineElements(): void {
    this.rootElement.append(this.siteContainerElement);
    this.siteContainerElement.append(this.descriptionBalancePresenter.render());
    this.siteContainerElement.append(this.draggableSectionDynamicOfBalance);
    this.siteContainerElement.append(this.draggableSectionTransactionRatio);
    this.siteContainerElement.append(this.sectionHistoryTransactions);
    this.sectionDynamicOfBalance.append(this.dynamicOfBalanceGraph.render());
    this.sectionTransactionRatio.append(this.transactionRationGraph.render());
    this.sectionHistoryTransactions.append(this.historyTransactionsTable.render());
  }

  protected setValue(): void {
    this.descriptionBalancePresenter.getView().setTitleValue(this.descBalanceTitleValue);
    this.dynamicOfBalanceGraph.getView().setTitleValue(this.dynamicBalanceTitleValue);
    this.transactionRationGraph.getView().setTitleValue(this.transactionRatioTitleValue);
  }

  public setAccountNumberTitle(value: string): void {
    this.descriptionBalancePresenter.getView().setAccountValue(value);
  }

  public fillDataToTable(args: IFillHistoryDataArgs): void {
    this.historyTransactionsTable.getView().fillData(args);
  }

  public set transferBlockLoading(value: boolean) {
    this.historyTransactionsTable.getView().isLoading = value;
  }

  public set graphDynamicOfBalanceLoading(value: boolean) {
    this.dynamicOfBalanceGraph.getView().isLoading = value;
  }

  public set graphTransactionRationLoading(value: boolean) {
    this.transactionRationGraph.getView().isLoading = value;
  }

  public setBalanceValue(value: string): void {
    this.descriptionBalancePresenter.getView().setBalanceValue(value);
  }

  public fillBalanceDynamic(data: IDataWithOneValue[]): void {
    if (!data.length) {
      this.dynamicOfBalanceGraph
        .getView()
        .setMessageHistogramTransfer(this.dynamicBalanceEmptyValue);
      return;
    }
    this.dynamicOfBalanceGraph.getView().fillGraph(data);
  }

  public fillTransactionsRate(data: IDataWithMultiplyValue[]): void {
    if (!data.length) {
      this.transactionRationGraph
        .getView()
        .setMessageHistogramTransfer(this.transactionsRatioEmptyValue);
      return;
    }
    this.transactionRationGraph.getView().fillGraph(data);
  }

  public render(): HTMLElement {
    return this.rootElement;
  }
}
