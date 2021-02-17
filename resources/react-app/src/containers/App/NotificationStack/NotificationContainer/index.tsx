import { Transition } from '@headlessui/react';
import Button from 'components/Button';
import Danger from 'components/Icons/Danger';
import Times from 'components/Icons/Times';
import Spinner from 'components/Spinner';
import { observer } from 'mobx-react-lite';
import Notification from 'models/Notification';
import React, { useCallback, useEffect, useState } from 'react';

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

  const getIcon = (icon?: typeof notification.type) => {
    switch (icon) {
      case 'loading':
        return <Spinner className="text-gray-600" />;
      case 'warning':
        return <Danger.Triangle.Filled className="text-yellow-600" />;
      case 'danger':
        return <Danger.Circle.Filled className="text-red-600" />;
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
      <div className="w-72 bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
        <div className="flex flex-row">
          <div className="flex pt-0.5 text-2xl">
            {getIcon(notification.type)}
          </div>
          <div className="ml-2 mr-4 w-full">
            <span className="font-semibold text-sm">{notification.title}</span>
            <span className="block text-gray-500">{notification.message}</span>
          </div>
          {notification.type !== 'loading' && (
            <div>
              <Button
                color="white"
                className="p-1 text-gray-500"
                onClick={() => transitionBeforeDelete()}
              >
                <Times.Regular.Medium />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Transition>
  );
};

export default observer(NotificationContainer);
