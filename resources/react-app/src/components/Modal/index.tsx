import { Transition } from '@headlessui/react';
import React from 'react';
import joinClassNames from 'tools/class-names';

const ModalContent: React.FC<{ className?: string; icon?: string }> = ({
  children,
  className,
  icon,
}) => {
  return (
    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        {icon && (
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <ModalIcon icon={icon} />
          </div>
        )}
        <div
          className={joinClassNames(
            'mt-3 w-full text-center sm:mt-0 sm:mx-4 sm:text-left',
            className
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const ModalIcon: React.FC<{ icon: string }> = ({ icon }) => {
  switch (icon) {
    case 'danger':
      return (
        <svg
          className="h-6 w-6 text-red-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      );

    default:
      return null;
  }
};

const ModalFooter: React.FC = ({ children }) => {
  return (
    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
      {children}
    </div>
  );
};

const Modal: React.FC<{ show: boolean }> & {
  Content: typeof ModalContent;
  Footer: typeof ModalFooter;
} = ({ children, show }) => {
  return (
    <Transition show={show}>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
          </Transition.Child>

          <span // Permet de centrer les éléments dans le modal
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            {children}
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};

Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

export default Modal;
