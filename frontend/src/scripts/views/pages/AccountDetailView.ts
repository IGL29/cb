import { DescriptionBalancePresenter } from '~presenters/DescriptionBalancePresenter';
import { HistoryTransferPresenter } from '~presenters/HistoryTransferPresenter';
import { GraphPresenter } from '~presenters/GraphPresenter';
import { RouterPresenter } from '~presenters/RouterPresenter';
import { TransferPresenter } from '~presenters/TransferPresenter';
import { DragAndDropService } from '~services/DragAndDropService';
import { IDataWithMultiplyValue, IDataWithOneValue } from '~types/graph';
import { IFillHistoryDataArgs } from '~types/historyTransfer';
import { IClasses } from '~types/select';
import { ICallBackPassTransferData } from '~types/transfer';
import { View, IAddHandlerArgs, IAddHandlers } from '~types/view';
import { DOMCreatorService } from '~services/DOMCreatorService';

export class AccountDetailView extends View implements IAddHandlers<'btn-back-to-main'> {
  private containerElement: HTMLElement;
  private siteContainerElement1: HTMLElement;
  private siteContainerElement2: HTMLElement;
  private siteContainerElement3: HTMLElement;
  private sectionElement1: HTMLElement;
  private sectionElement2: HTMLElement;
  private sectionElement3: HTMLElement;
  private sectionInnerWrapperElement2: HTMLElement;
  private sectionInnerWrapperElement3: HTMLElement;
  private linkGraphElement: HTMLAnchorElement;
  private linkHistoryElement: HTMLAnchorElement;
  private draggableSection2: HTMLElement;
  private draggableSection3: HTMLElement;
  private draggableTransferBlock: HTMLElement;
  private draggableLinkGraph: HTMLElement;

  private descriptionBalancePresenter: DescriptionBalancePresenter;
  private historyTransferBlockPresenter: HistoryTransferPresenter;
  private transferBlockPresenter: TransferPresenter;
  private graphTransferPresenter: GraphPresenter;
  private routerPresenter: RouterPresenter;
  private dragAndDropService: DragAndDropService;
  private readonly domCreatorService: DOMCreatorService;

  private containerClasses: IClasses = ['pt-[50px]', 'pb-[50px]', 'xs:pt-[30px]'];
  private transferBlockClasses: IClasses = [];
  private graphTransferClasses: IClasses = [];
  private wrapperGraphTransferClasses: IClasses = ['h-[195px]', 'w-full'];
  private historyTransferBlockClasses: IClasses = [
    'hover:scale-[1.01]',
    'transition-scale',
    'duration-300'
  ];
  private section1Classes: IClasses = [];
  private section2Classes: IClasses = ['mb-[50px]'];
  private section3Classes: IClasses = [];
  private siteContainer1Classes: IClasses = [
    'max-w-[1440px]',
    'px-[50px]',
    'mx-auto',
    'w-full',
    'mb-[50px]',
    'sm:px-[30px]',
    'xs:px-[20px]'
  ];
  private siteContainer2Classes: IClasses = [
    'max-w-[1440px]',
    'px-[50px]',
    'mx-auto',
    'w-full',
    'sm:px-[30px]',
    'xs:px-[20px]'
  ];
  private siteContainer3Classes: IClasses = [
    'max-w-[1440px]',
    'px-[50px]',
    'mx-auto',
    'w-full',
    'sm:px-[30px]',
    'xs:px-[20px]'
  ];

  private dynamicBalanceEmptyMessage = 'Изменения баланса отсуствуют';

  constructor(callbackPassTransferData?: ICallBackPassTransferData) {
    super();

    this.descriptionBalancePresenter = new DescriptionBalancePresenter();
    this.transferBlockPresenter = new TransferPresenter(callbackPassTransferData);
    this.historyTransferBlockPresenter = new HistoryTransferPresenter();
    this.graphTransferPresenter = new GraphPresenter();
    this.routerPresenter = new RouterPresenter();
    this.dragAndDropService = new DragAndDropService();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.setValues();
    this.makeDraggable();
    this.combineElements();
  }

  protected createElements() {
    this.containerElement = this.domCreatorService.createElement('div');
    this.siteContainerElement1 = this.domCreatorService.createElement('div');

    this.siteContainerElement2 = this.domCreatorService.createElement('div');
    this.siteContainerElement3 = this.domCreatorService.createElement('div');

    this.sectionElement1 = this.domCreatorService.createElement('section');
    this.sectionElement2 = this.domCreatorService.createElement('section');
    this.sectionElement3 = this.domCreatorService.createElement('section');

    this.sectionInnerWrapperElement2 = this.domCreatorService.createElement('div');
    this.sectionInnerWrapperElement3 = this.domCreatorService.createElement('div');

    this.linkGraphElement = this.routerPresenter.createLink('/balance-history');
    this.linkHistoryElement = this.routerPresenter.createLink('/balance-history');
  }

  protected setValues() {
    this.descriptionBalancePresenter.getView().setTitleValue('Просмотр счета');
    this.graphTransferPresenter.getView().setTitleValue('Динамика баланса');
  }

  public setAccountValue(account: string) {
    this.descriptionBalancePresenter.getView().setAccountValue(account);
    this.transferBlockPresenter.setAccountValue(account);
    this.linkGraphElement.setAttribute('href', `/balance-history/${account}`);
    this.linkHistoryElement.setAttribute('href', `/balance-history/${account}`);
  }

  protected addClasses() {
    this.containerElement.classList.add(...this.containerClasses);

    this.sectionElement1.classList.add(...this.section1Classes);
    this.sectionElement2.classList.add(...this.section2Classes);
    this.sectionElement3.classList.add(...this.section3Classes);

    this.siteContainerElement1.classList.add(...this.siteContainer1Classes);
    this.siteContainerElement2.classList.add(...this.siteContainer2Classes);
    this.siteContainerElement3.classList.add(...this.siteContainer3Classes);

    this.transferBlockPresenter.getView().setRootClasses(this.transferBlockClasses);
    this.graphTransferPresenter.getView().setRootClasses(this.graphTransferClasses);
    this.graphTransferPresenter.getView().setWrapperClasses(this.wrapperGraphTransferClasses);
    this.historyTransferBlockPresenter.getView().setRootClasses(this.historyTransferBlockClasses);
  }

  protected combineElements(): void {
    this.containerElement.append(this.sectionElement1);
    this.containerElement.append(this.sectionElement2);
    this.containerElement.append(this.sectionElement3);

    this.sectionElement1.append(this.siteContainerElement1);
    this.sectionElement2.append(this.siteContainerElement2);
    this.sectionElement3.append(this.siteContainerElement3);

    this.sectionInnerWrapperElement2.append(this.draggableTransferBlock, this.draggableLinkGraph);
    this.sectionInnerWrapperElement3.append(this.linkHistoryElement);

    this.siteContainerElement1.append(this.descriptionBalancePresenter.render());
    this.siteContainerElement2.append(this.draggableSection2);
    this.siteContainerElement3.append(this.draggableSection3);

    this.linkGraphElement.append(this.graphTransferPresenter.render());
    this.linkHistoryElement.append(this.historyTransferBlockPresenter.render());
  }

  private makeDraggable(): void {
    this.draggableSection2 = this.dragAndDropService.makeDraggable(
      this.sectionInnerWrapperElement2
    );
    this.draggableSection2.classList.add('pt-[25px]');
    this.sectionInnerWrapperElement2.classList.add(
      ...['w-full', 'flex', 'justify-between', 'lg:flex-col']
    );
    this.draggableSection3 = this.dragAndDropService.makeDraggable(
      this.sectionInnerWrapperElement3
    );
    this.draggableTransferBlock = this.dragAndDropService.makeDraggable(
      this.transferBlockPresenter.render(),
      'forSection2'
    );
    this.draggableLinkGraph = this.dragAndDropService.makeDraggable(
      this.linkGraphElement,
      'forSection2'
    );

    this.draggableTransferBlock.classList.add(
      'flex-[1_1_100%]',
      'mr-[50px]',
      'lg:mr-0',
      'lg:mb-[50px]'
    );
    this.draggableLinkGraph.classList.add(
      'flex-[1_1_100%]',
      'hover:scale-[1.01]',
      'transition-scale',
      'duration-300'
    );
  }

  public addHandlers(args: IAddHandlerArgs<'btn-back-to-main'>): void {
    if (args.target === 'btn-back-to-main') {
      this.descriptionBalancePresenter.getView().addHandler(args);
    }
  }

  public setBalanceValue(value: string): void {
    this.descriptionBalancePresenter.getView().setBalanceValue(value);
  }

  public fillDataToTable(args: IFillHistoryDataArgs): void {
    this.historyTransferBlockPresenter.getView().fillData(args);
  }

  public setAccountNumberTitle(value: string): void {
    this.descriptionBalancePresenter.getView().setAccountValue(value);
  }

  public set transferBlockLoading(value: boolean) {
    this.transferBlockPresenter.getView().isLoading = value;
  }

  public set graphTransferLoading(value: boolean) {
    this.graphTransferPresenter.getView().isLoading = value;
  }

  public set historyTransferLoading(value: boolean) {
    this.historyTransferBlockPresenter.getView().isLoading = value;
  }

  public fillDynamicBalanceGraph(data: IDataWithMultiplyValue[] | IDataWithOneValue[]): void {
    if (!data.length) {
      this.graphTransferPresenter
        .getView()
        .setMessageHistogramTransfer(this.dynamicBalanceEmptyMessage);
      return;
    }
    this.graphTransferPresenter.getView().fillGraph(data);
  }

  public render(): HTMLElement {
    return this.containerElement;
  }
}
