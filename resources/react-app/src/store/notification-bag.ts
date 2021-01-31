import { Collection } from '@datx/core';
import Notification from 'models/Notification';

class NotificationBag extends Collection {
  static types = [Notification];

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
