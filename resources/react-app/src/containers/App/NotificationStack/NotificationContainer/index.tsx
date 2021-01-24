import { Transition } from '@headlessui/react';
import Button from 'components/Button';
import Spinner from 'components/Spinner';
import { observer } from 'mobx-react-lite';
import Notification from 'models/Notification';
import React, { useCallback, useEffect, useState } from 'react';
import {
  BsFillExclamationDiamondFill,
  BsFillExclamationOctagonFill,
} from 'react-icons/bs';

const NotificationContainer = ({
  notification,
  onDelete,
}: {
  notification: Notification;
  onDelete: Function;
}) => {
  const [show, setShow] = useState(true);

  const transitionBeforeDelete = useCallback(() => {
    setShow(false);
    setTimeout(() => onDelete(), 150);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setShow]);

  useEffect(() => {
    if (notification.timer) {
      const timeout = setTimeout(() => {
        transitionBeforeDelete();
      }, notification.timer - 150);

      return () => clearTimeout(timeout);
    }
  }, [notification.timer, transitionBeforeDelete]);

  const getIcon = (icon?: string) => {
    switch (icon) {
      case 'spinner':
        return <Spinner />;
      case 'warning':
        return <BsFillExclamationDiamondFill className="text-warning" />;
      case 'danger':
        return <BsFillExclamationOctagonFill className="text-danger" />;
      default:
        return null;
    }
  };

  return (
    <Transition
      appear={true}
      show={show}
      enter="transition-all duration-150"
      enterFrom="opacity-0 scale-75"
      enterTo="opacity-100 scale-100"
      leave="transition-all duration-150"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-75"
    >
      <div className="w-80 bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
        <div className="flex flex-row">
          <div className="px-2">Icon</div>
          <div className="ml-2 mr-6 w-full">
            <span className="font-semibold">{notification.title}</span>
            <span className="block text-gray-500">{notification.message}</span>
          </div>
          <div>
            <Button
              color="link"
              className="p-1 text-gray-500"
              onClick={() => transitionBeforeDelete()}
            >
              X
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default observer(NotificationContainer);
