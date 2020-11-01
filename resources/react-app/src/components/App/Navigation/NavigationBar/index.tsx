import React, { useContext } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { SanctumContext } from 'react-sanctum';
import {
  UncontrolledCollapse,
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Spinner,
} from 'reactstrap';
import NavbarLink from '../NavbarLink';

const NAVBAR_TITLE = 'plandeprise.fr';

const mapState = (state: IRedux.State) => ({
  options: state.app.options,
  returnTo: state.app.returnTo,
  title: state.app.title,
});

const connector = connect(mapState);

type NavigationBarProps = ConnectedProps<typeof connector>;

const NavigationBar = ({ options, returnTo, title }: NavigationBarProps) => {
  const { authenticated, user } = useContext(SanctumContext);

  return (
    <Navbar
      className="navbar-horizontal navbar-dark bg-default mb-4"
      expand="lg"
    >
      <Container>
        <Nav navbar>
          <NavbarLink
            className="d-none d-lg-block"
            path="/"
            label={NAVBAR_TITLE}
          />
        </Nav>
        <Nav className="mx-auto flex-row" navbar>
          {returnTo && <NavbarLink light {...returnTo} />}
          <span className="h5 mx-4 my-auto pt-1 text-light">{title}</span>
          {options &&
            options.map((option) => (
              <NavbarLink key={option.path} light {...option} />
            ))}
        </Nav>
        <button
          aria-controls="navbar-default"
          aria-expanded={false}
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-target="#navbar-default"
          data-toggle="collapse"
          id="navbar-default"
          type="button"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <UncontrolledCollapse
          className="flex-grow-0"
          navbar
          toggler="#navbar-default"
        >
          <div className="navbar-collapse-header">
            <Row>
              <Col className="collapse-brand" xs="6">
                <RouterLink to="/">{NAVBAR_TITLE}</RouterLink>
              </Col>
              <Col className="collapse-close" xs="6">
                <button
                  aria-controls="navbar-default"
                  aria-expanded={false}
                  aria-label="Toggle navigation"
                  className="navbar-toggler"
                  data-target="#navbar-default"
                  data-toggle="collapse"
                  id="navbar-default"
                  type="button"
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          <Nav className="ml-lg-auto" navbar>
            {authenticated ? (
              <React.Fragment>
                {user?.admin === true && (
                  <NavbarLink label="Administration" path="/admin" />
                )}
                <NavbarLink label="Profil" path="/profil" />
                <NavbarLink label="Déconnexion" path="/deconnexion" />
              </React.Fragment>
            ) : authenticated === false ? (
              <React.Fragment>
                <NavbarLink label="Connexion" path="/connexion" />
                <NavbarLink label="Inscription" path="/inscription" />
              </React.Fragment>
            ) : (
              <Spinner size="sm" />
            )}
          </Nav>
        </UncontrolledCollapse>
      </Container>
    </Navbar>
  );
};

export default connector(NavigationBar);
