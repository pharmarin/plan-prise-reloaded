import { Attribute, Model, withMeta } from '@datx/core';

class Notification extends withMeta(Model) {
  static type = 'notification';

  @Attribute()
  type!: 'danger' | 'info' | 'warning' | 'loading';

  @Attribute()
  title!: string;

  @Attribute()
  message!: string;

  @Attribute()
  timer?: number;
}

export default Notification;
