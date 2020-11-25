import React from 'react';
import classNames from 'classnames';
import { Menu, Transition } from '@headlessui/react';
import { Link } from 'react-router-dom';

const Dropdown: React.FC<{
  buttonClass?: string;
  buttonContent: React.ReactElement;
  items: { label: string; path: string }[];
}> = ({ buttonClass, buttonContent, items }) => {
  return (
    <Menu>
      {({ open }) => (
        <React.Fragment>
          <Menu.Button className={buttonClass}>{buttonContent}</Menu.Button>
          <Transition
            show={open}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white">
              {items.map((item) => (
                <Menu.Item key={item.path}>
                  {({ active }) => (
                    <Link
                      className={classNames(
                        'block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100',
                        { 'bg-blue-500': active }
                      )}
                      to={item.path}
                    >
                      {item.label}
                    </Link>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </React.Fragment>
      )}
    </Menu>
  );
};

export default Dropdown;
