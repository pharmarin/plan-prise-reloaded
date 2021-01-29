import { makeAutoObservable } from 'mobx';

export interface INavigationItem {
  label?: string;
  component?: {
    name: 'arrowLeft' | 'options';
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
  title: INavigation['title'] = '';
  returnTo: INavigation['returnTo'] = {
    path: '/',
    label: '',
  };
  options: INavigation['options'] = undefined;

  constructor() {
    makeAutoObservable(this);
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
