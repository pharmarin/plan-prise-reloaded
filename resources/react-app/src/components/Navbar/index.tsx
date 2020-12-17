import React from 'react';

const NavbarBrandName: React.FC = ({ children }) => (
  <span className="ml-4 text-2xl font-bold text-green-300">{children}</span>
);

const NavBarLeft: React.FC = ({ children }) => (
  <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
    {children}
  </div>
);

const NavbarRight: React.FC = ({ children }) => (
  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
    {children}
  </div>
);

const NavbarBrand: React.FC = ({ children }) => (
  <div className="flex-shrink-0 flex items-center">{children}</div>
);

const NavbarContent: React.FC = ({ children }) => (
  <div className="hidden flex-grow sm:block sm:ml-6">
    <div className="flex">{children}</div>
  </div>
);

const NavbarTitle: React.FC = ({ children }) => (
  <span className="ml-4 text-2xl font-semibold text-green-100">{children}</span>
);

const Navbar: React.FC & {
  Brand: typeof NavbarBrand;
  BrandName: typeof NavbarBrandName;
  Content: typeof NavbarContent;
  Left: typeof NavBarLeft;
  Right: typeof NavbarRight;
  Title: typeof NavbarTitle;
} = ({ children }) => {
  return (
    <nav className="bg-gradient-to-r from-green-800 to-green-600">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed. */}
              {/*
            Heroicon name: menu

            Menu open: "hidden", Menu closed: "block"
          */}
              <svg
                className="block h-6 w-6"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open. */}
              {/*
            Heroicon name: x

            Menu open: "block", Menu closed: "hidden"
          */}
              <svg
                className="hidden h-6 w-6"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </nav>
  );
};

Navbar.Brand = NavbarBrand;
Navbar.BrandName = NavbarBrandName;
Navbar.Content = NavbarContent;
Navbar.Left = NavBarLeft;
Navbar.Right = NavbarRight;
Navbar.Title = NavbarTitle;

export default Navbar;
