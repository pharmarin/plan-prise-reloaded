import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import Button from 'components/Button';
import React from 'react';
import { Link } from 'react-router-dom';

const Dropdown: React.FC<{
  buttonContent: React.ReactElement | string;
  buttonProps?: any;
  items: ({ label: string } & ({ path: string } | { action: () => void }))[];
}> = ({ buttonContent, buttonProps, items }) => {
  return (
    <Menu>
      {({ open }) => (
        <div className="relative">
          <Menu.Button {...buttonProps}>{buttonContent}</Menu.Button>
          <Transition
            show={open || false}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right right-0 absolute mt-2 w-full rounded-md shadow-lg bg-white z-10">
              {(items || []).map((item, index) => (
                <Menu.Item key={index}>
                  {({ active }) =>
                    'path' in item ? (
                      <Link
                        className={classNames(
                          'block px-4 py-2 text-sm normal-case! font-medium! tracking-normal! text-gray-700 hover:bg-gray-100 w-full',
                          { 'bg-green-200': active }
                        )}
                        to={item.path}
                      >
                        {item.label}
                      </Link>
                    ) : 'action' in item ? (
                      <Button
                        className={classNames(
                          'block text-sm normal-case! font-medium! tracking-normal! text-gray-700 hover:bg-gray-100 w-full',
                          { 'bg-green-200': active }
                        )}
                        color="link"
                        onClick={item.action}
                        size="sm"
                      >
                        {item.label}
                      </Button>
                    ) : null
                  }
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </div>
      )}
    </Menu>
  );
};

export default Dropdown;
