import { Collection } from '@datx/core';
import Notification from 'models/Notification';

class NotificationBag extends Collection {
  static types = [Notification];
}

export default NotificationBag;
