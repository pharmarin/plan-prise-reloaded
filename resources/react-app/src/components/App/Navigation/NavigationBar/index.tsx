import Avatar from 'base-components/Avatar';
import Dropdown from 'base-components/Dropdown';
import Navbar from 'base-components/Navbar';
import Spinner from 'base-components/Spinner';
import Logo from 'components/App/Logo';
import React, { useContext } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { SanctumContext } from 'react-sanctum';
import { ContextProps } from 'react-sanctum/build/SanctumContext';
import NavbarLink from '../NavbarLink';

const NAVBAR_TITLE = 'plandeprise.fr';

const mapState = (state: Redux.State) => ({
  options: state.app.navigation.options,
  returnTo: state.app.navigation.returnTo,
  title: state.app.navigation.title,
});

const connector = connect(mapState);

type NavigationBarProps = ConnectedProps<typeof connector>;

interface SanctumProps extends Partial<ContextProps> {
  user?: IServerResponse<Models.App.User>;
}

const NavigationBar = ({ options, returnTo, title }: NavigationBarProps) => {
  const { authenticated, user } = useContext<SanctumProps>(SanctumContext);

  return (
    <Navbar>
      <Navbar.Left>
        <Navbar.Brand>
          <Logo /> <Navbar.BrandName>{NAVBAR_TITLE}</Navbar.BrandName>
        </Navbar.Brand>
        <Navbar.Content>
          {returnTo && <NavbarLink {...returnTo} />}
          <div className="flex flex-grow justify-center">
            <Navbar.Title>{title}</Navbar.Title>
            {options &&
              options.map((option) => (
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

export default connector(NavigationBar);
