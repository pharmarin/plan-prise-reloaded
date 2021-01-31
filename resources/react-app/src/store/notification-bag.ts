import { Collection, IRawCollection, IRawModel } from '@datx/core';
import Notification from 'models/Notification';
import RootStore from './root';

class NotificationBag extends Collection {
  rootStore;

  static types = [Notification];

  constructor(rootStore: RootStore, data?: IRawModel[] | IRawCollection) {
    super(data);

    this.rootStore = rootStore;
  }

  addNotification(notification: {
    title: string;
    message?: string;
    timer?: number;
    type?: string;
  }) {
    const notificationRef = new Notification(notification);
    this.add(notificationRef);
    return notificationRef;
  }
}

export default NotificationBag;
