import JsonApiStore from './json-api';
import Navigation from './navigation';
import NotificationBag from './notification-bag';

class RootStore {
  api;
  navigation;
  notifications;

  constructor() {
    this.api = new JsonApiStore(this);
    this.navigation = new Navigation(this);
    this.notifications = new NotificationBag(this);
  }
}

export default RootStore;
