import * as ymaps from 'ymaps';
import { LoaderPresenter } from '~presenters/LoaderPresenter';
import { NotifyPresenter } from '~presenters/NotifyPresenter';
import { DOMCreatorService } from '~services/DOMCreatorService';
import { ILimitArea, IObject } from '~types/atmsMap';
import { IClasses } from '~types/select';
import { View } from '~types/view';

export class AtmsMapView extends View {
  private containerElement: HTMLElement;
  private siteContainerElement: HTMLElement;
  private titleElement: HTMLElement;
  private mapContainerElement: HTMLElement;
  private errorElement: HTMLElement;

  private loaderPresenter: LoaderPresenter;
  private notifyPresenter: NotifyPresenter;
  private readonly domCreatorService: DOMCreatorService;

  private defaultClasses: IClasses = ['flex', 'grow', 'flex-col'];
  private siteContainerClass: IClasses = [
    'flex',
    'flex-col',
    'max-w-[1440px]',
    'px-[50px]',
    'py-[50px]',
    'mx-auto',
    'relative',
    'w-full',
    'grow',
    'sm:px-[30px]',
    'xs:px-[20px]'
  ];
  private mapContainerClass: IClasses = ['flex-[1_1_100%]', 'w-full', 'h-full'];
  private titleClasses: IClasses = [
    'text-[25px]',
    'font-Work-Sans',
    'font-bold',
    'mb-[30px]',
    'xs:mb-[20px]'
  ];
  private loaderClasses: IClasses = ['z-[2]'];
  private errorHideClasses: IClasses = ['hidden'];

  private map: any;
  private _isLoading: boolean;
  private maps: any;
  private ymaps: any;

  constructor() {
    super();

    this.loaderPresenter = new LoaderPresenter({ classNamesRoot: this.loaderClasses });
    this.notifyPresenter = new NotifyPresenter();
    this.domCreatorService = new DOMCreatorService();
    this.createElements();
    this.addClasses();
    this.combineElements();
    this.addAttributes();
    this.setValue();
  }

  protected createElements(): void {
    this.containerElement = this.domCreatorService.createElement('div');
    this.siteContainerElement = this.domCreatorService.createElement('div');
    this.mapContainerElement = this.domCreatorService.createElement('div');
    this.titleElement = this.domCreatorService.createElement('h1');
    this.errorElement = this.domCreatorService.createElement('p');
  }

  protected addClasses(): void {
    this.containerElement.classList.add(...this.defaultClasses);
    this.siteContainerElement.classList.add(...this.siteContainerClass);
    this.mapContainerElement.classList.add(...this.mapContainerClass);
    this.titleElement.classList.add(...this.titleClasses);
    this.errorElement.classList.add(...this.errorHideClasses);
  }

  protected combineElements(): void {
    this.siteContainerElement.append(this.titleElement, this.mapContainerElement);
    this.containerElement.append(this.siteContainerElement);
    this.mapContainerElement.append(this.loaderPresenter.render(), this.errorElement);
  }

  private addAttributes(): void {
    this.mapContainerElement.setAttribute('id', 'atms-map');
  }

  public initAtmsMap(data: { lat: number; lon: number }[]): void {
    this.hideError();
    this.loaderPresenter.getView().switchVisibleLoader(true);

    const { minLat, maxLat, minLon, maxLon } = this.limitArea(data);

    if (!this.ymaps) {
      this.ymaps = ymaps;
      this.ymaps
        .load()
        .then((maps: any) => {
          this.maps = maps;
          this.map = new maps.Map(
            'atms-map',
            {
              center: [55.75399399999374, 37.62209300000001],
              zoom: 10
            },
            {
              restrictMapArea: [
                [minLat - 2, minLon - 2],
                [maxLat + 2, maxLon + 2]
              ]
            }
          );
        })
        .catch((error: Error) => {
          this.showError();
          this.notifyPresenter.notify({
            title: 'Ошибка при запросе',
            description:
              'Произошла неизвестная ошибка при запросе. Попробуйте обновить страницу и повторить снова.'
          });
          throw new Error(`Failed to load Yandex Maps: ${error.message}`);
        })
        .then(() => {
          this.setMarks(data);
          this.loaderPresenter.getView().switchVisibleLoader(false);
        });
    }
  }

  protected setValue(): void {
    this.titleElement.textContent = 'Карта банкоматов';
    this.errorElement.textContent = 'Произошла ошибка при загрузке';
  }

  public setMarks(data: any): void {
    const objectManager = new this.maps.ObjectManager();

    data.forEach((item: any, index: number) => {
      objectManager.add(this.getObject({ id: index, lat: item.lat, lon: item.lon }));
    });

    this.map.geoObjects.add(objectManager);
  }

  private getObject({ id, lat, lon }: IObject) {
    return {
      type: 'Feature',
      id,
      geometry: {
        type: 'Point',
        coordinates: [lat, lon]
      },
      properties: {
        hintContent: 'Банкомат "Coin"'
      }
    };
  }

  public limitArea(data: { lat: number; lon: number }[]): ILimitArea {
    let minLat: number = 0;
    let maxLat: number = 0;
    let minLon: number = 0;
    let maxLon: number = 0;

    data.forEach((item: { lat: number; lon: number }) => {
      if (minLat === 0 || item.lat < minLat) {
        minLat = item.lat;
      }
      if (maxLat === 0 || item.lat > maxLat) {
        maxLat = item.lat;
      }
      if (minLon === 0 || item.lon < minLon) {
        minLon = item.lon;
      }
      if (maxLon === 0 || item.lon > maxLon) {
        maxLon = item.lon;
      }
    });

    return { minLat, minLon, maxLat, maxLon };
  }

  public showError(): void {
    this.errorElement.classList.remove(...this.errorHideClasses);
  }

  public hideError(): void {
    this.errorElement.classList.add(...this.errorHideClasses);
  }

  public set isLoading(value: boolean) {
    this._isLoading = value;

    this.loaderPresenter.getView().switchVisibleLoader(value);
  }

  public render(): HTMLElement {
    return this.containerElement;
  }
}
