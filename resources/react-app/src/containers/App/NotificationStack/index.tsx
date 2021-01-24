import NotificationContainer from 'containers/App/NotificationStack/NotificationContainer';
import { useNotifications } from 'hooks/use-store';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import Notification from 'models/Notification';
import React from 'react';

const NotificationStack = () => {
  const notifications = useNotifications();

  return (
    <div className="fixed top-0 right-0 z-10 p-2 space-y-2">
      {notifications.findAll(Notification).map((notification) => (
        <NotificationContainer
          key={notification.meta.id}
          notification={notification}
          onDelete={action(() => notifications.removeOne(notification))}
        />
      ))}
    </div>
  );
};

export default observer(NotificationStack);
