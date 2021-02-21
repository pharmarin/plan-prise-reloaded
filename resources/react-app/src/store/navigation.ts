import { makeAutoObservable } from 'mobx';
import RootStore from './root';

export interface INavigationItem {
  label?: string;
  component?: {
    name: 'arrowLeft' | 'options' | 'trash';
    props?: any;
  };
  path?: string;
  event?: string;
}

interface INavigation {
  options?: INavigationItem[];
  returnTo?: INavigationItem;
  title: string;
}

class Navigation {
  rootStore;

  title: INavigation['title'] = '';
  returnTo: INavigation['returnTo'] = {
    path: '/',
    label: '',
  };
  options: INavigation['options'] = undefined;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }

  setNavigation(
    title: INavigation['title'],
    returnTo?: INavigation['returnTo'],
    options?: INavigation['options']
  ) {
    this.title = title;
    this.returnTo = returnTo;
    this.options = options;
  }
}

export default Navigation;
