import { makeAutoObservable } from 'mobx';

interface NavigationInterface {
  options?: {
    args?: any;
    label: string;
    path: string;
  }[];
  returnTo?: {
    label?: string;
    component?: {
      name: string;
      props?: any;
    };
    path?: string;
    event?: string;
  };
  title: string;
}

class Navigation {
  title: NavigationInterface['title'] = '';
  returnTo: NavigationInterface['returnTo'] = {
    path: '/',
    label: '',
  };
  options: NavigationInterface['options'] = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setNavigation(
    title: NavigationInterface['title'],
    returnTo?: NavigationInterface['returnTo'],
    options?: NavigationInterface['options']
  ) {
    this.title = title;
    this.returnTo = returnTo;
    this.options = options;
  }
}

export default Navigation;
