import React, { useCallback, useEffect, useState } from 'react';
import {
  BsFillExclamationDiamondFill,
  BsFillExclamationOctagonFill,
} from 'react-icons/bs';
import { connect, ConnectedProps } from 'react-redux';
import { Spinner, Toast, ToastBody, ToastHeader } from 'reactstrap';
import { removeNotification } from 'store/app';

const mapDispatch = { removeNotification };

const connector = connect(null, mapDispatch);

type NotificationProps = ConnectedProps<typeof connector> & {
  notification: Models.App.Notification;
};

const Notification = ({
  notification,
  removeNotification,
}: NotificationProps) => {
  const [show, setShow] = useState(true);
  const toggle = () => setShow(!show);

  const removeSelf = useCallback(() => {
    setShow(false);
    setTimeout(() => {
      removeNotification(notification.id);
    }, 1000);
  }, [notification.id, removeNotification]);

  useEffect(() => {
    if (notification.timer) {
      setTimeout(() => {
        removeSelf();
      }, notification.timer);
    }
  }, [notification.timer, removeSelf]);

  const getIcon = (icon?: string) => {
    switch (icon) {
      case 'spinner':
        return <Spinner size="sm" />;
      case 'warning':
        return <BsFillExclamationDiamondFill className="text-warning" />;
      case 'danger':
        return <BsFillExclamationOctagonFill className="text-danger" />;
      default:
        return null;
    }
  };

  return (
    <Toast className="ml-auto" isOpen={show}>
      {(notification.header || notification.icon) && (
        <ToastHeader
          icon={getIcon(notification.icon)}
          toggle={!notification.timer ? toggle : undefined}
        >
          {notification.header}
        </ToastHeader>
      )}
      {notification.content && <ToastBody>{notification.content}</ToastBody>}
    </Toast>
  );
};

export default connector(Notification);
