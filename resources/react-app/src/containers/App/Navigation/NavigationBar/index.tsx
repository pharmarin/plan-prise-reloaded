import Avatar from 'components/Avatar';
import Dropdown from 'components/Dropdown';
import Navbar from 'components/Navbar';
import Spinner from 'components/Spinner';
import Logo from 'containers/App/Logo';
import { useNavigation } from 'hooks/use-store';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { SanctumContext } from 'react-sanctum';
import { ContextProps } from 'react-sanctum/build/SanctumContext';
import NavbarLink from '../NavbarLink';

const NAVBAR_TITLE = 'plandeprise.fr';

interface SanctumProps extends Partial<ContextProps> {
  user?: IServerResponse<Models.App.User>;
}

const NavigationBar = () => {
  const { authenticated, user } = useContext<SanctumProps>(SanctumContext);

  const navigation = useNavigation();

  return (
    <Navbar>
      <Navbar.Left>
        <Navbar.Brand>
          <Logo /> <Navbar.BrandName>{NAVBAR_TITLE}</Navbar.BrandName>
        </Navbar.Brand>
        <Navbar.Content>
          {navigation.returnTo && <NavbarLink {...navigation.returnTo} />}
          <div className="flex flex-grow min-w-0 justify-center">
            <Navbar.Title>{navigation.title}</Navbar.Title>
            {navigation.options &&
              navigation.options.map((option) => (
                <NavbarLink key={option.path} {...option} />
              ))}
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
                    firstName={user?.data.attributes.first_name || ''}
                    lastName={user?.data.attributes.last_name || ''}
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
