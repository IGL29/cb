import { View } from './view';

export interface IPresenter<K extends View> {
  getView(): K;
  render(): HTMLElement;
}
