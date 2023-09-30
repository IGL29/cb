import { OfflineModeService } from '~services/OfflineMode';
import { IPresenter } from '~types/presenter';
import { AppView } from '~views/components/AppView';
import { NotifyPresenter } from './NotifyPresenter';

export class AppPresenter implements IPresenter<AppView> {
  private view: AppView;
  notifyPresenter: NotifyPresenter;

  constructor() {
    this.view = new AppView();
    this.notifyPresenter = new NotifyPresenter();

    const offlineMode = new OfflineModeService();
    offlineMode.subscribe({
      next: (val) => {
        if (val) {
          this.notifyPresenter.notify({
            title: 'Отсуствует интернет',
            description: 'Проверьте соединение с интернетом или обновите страницу'
          });
          return;
        }
        this.notifyPresenter.notify({
          title: 'Соединение с интернетом восстановлено',
          description: 'Уже обновляем страницу...',
          type: 'success'
        });
        setInterval(() => {
          window.location.reload();
        }, 1500);
      }
    });
  }

  public getView(): AppView {
    return this.view;
  }

  public render(): HTMLElement {
    return this.view.render();
  }
}
