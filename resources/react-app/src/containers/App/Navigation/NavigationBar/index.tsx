import Avatar from 'components/Avatar';
import Dropdown from 'components/Dropdown';
import Navbar from 'components/Navbar';
import Spinner from 'components/Spinner';
import Logo from 'containers/App/Logo';
import { useNavigation } from 'hooks/use-store';
import useUser from 'hooks/use-user';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useLocation } from 'react-router-dom';
import NavbarLink from '../NavbarLink';

const NAVBAR_TITLE = 'plandeprise.fr';

const NavigationBar = () => {
  const { authenticated, user } = useUser();
  const navigation = useNavigation();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <Navbar>
      <Navbar.Left>
        <Navbar.Brand>
          <Logo />{' '}
          {isHome && <Navbar.BrandName>{NAVBAR_TITLE}</Navbar.BrandName>}
        </Navbar.Brand>
        <Navbar.Content>
          {!isHome && <NavbarLink component={{ name: 'home' }} path="/" />}
          {navigation.returnTo && <NavbarLink {...navigation.returnTo} />}
          <div className="flex flex-grow min-w-0 justify-center items-center">
            <Navbar.Title>{navigation.title}</Navbar.Title>
            <div className="flex flex-row ml-4 space-x-3">
              {navigation.options &&
                navigation.options.map((option) => (
                  <NavbarLink key={option.path || option.event} {...option} />
                ))}
            </div>
          </div>
          <div></div>
        </Navbar.Content>
      </Navbar.Left>
      <Navbar.Right>
        {/* Profile dropdown */}
        <div className="ml-3 relative">
          {authenticated === null ? (
            <Spinner color="text-green-600" />
          ) : authenticated ? (
            <Dropdown
              buttonProps={{
                className:
                  'bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white',
              }}
              buttonContent={
                <React.Fragment>
                  <span className="sr-only">Ouvrir le menu utilisateur</span>
                  <Avatar
                    firstName={user?.first_name || ''}
                    lastName={user?.last_name || ''}
                  />
                </React.Fragment>
              }
              items={[
                {
                  label: 'Profil',
                  path: '/profil',
                },
                { label: 'Déconnexion', path: '/deconnexion' },
              ]}
            />
          ) : (
            <React.Fragment>
              <NavbarLink label="Connexion" path="/connexion" />
              <NavbarLink label="Inscription" path="/inscription" />
            </React.Fragment>
          )}
        </div>
      </Navbar.Right>
    </Navbar>
  );
};

export default observer(NavigationBar);
