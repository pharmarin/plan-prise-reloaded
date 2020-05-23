import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  UncontrolledCollapse,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
} from 'reactstrap';
import authenticator, {
  AuthProps,
} from 'components/Authentification/Authenticator';
import routes from './routes.json';
import map from 'lodash/map';
import { connect, ConnectedProps } from 'react-redux';
import { RootState } from 'store/store';

const NavbarTitle = () => {
  return <React.Fragment>plandeprise.fr</React.Fragment>;
};

type NavbarLinkProps = {
  className?: string;
  label: string;
  path: string;
};

const NavbarLink = (props: NavbarLinkProps) => {
  const location = useLocation().pathname;
  const { className, label, path } = props;
  const isActive = location === path;
  return (
    <NavItem className={className}>
      <NavLink active={isActive} to={path} tag={Link}>
        <span className={'nav-link-inner--text' + isActive ? '' : 'text-light'}>
          {label}
        </span>
      </NavLink>
    </NavItem>
  );
};

const mapState = (state: RootState) => ({
  app: state.app,
});
const connector = connect(mapState);
type NavigationProps = ConnectedProps<typeof connector> & AuthProps;

const Navigation = (props: NavigationProps) => {
  const {
    app: { title, return: returnObject },
    auth: { isValid },
  } = props;
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
            label="plandeprise.fr"
          />
          {returnObject && <NavbarLink {...returnObject} />}
        </Nav>
        <Nav className="mx-auto" navbar>
          <span className="h5 m-0 text-light">{title}</span>
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
                <Link to="/">
                  <NavbarTitle />
                </Link>
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
            {isValid
              ? map(routes.auth, (r) => <NavbarLink key={r.path} {...r} />)
              : map(routes.noauth, (r) => <NavbarLink key={r.path} {...r} />)}
          </Nav>
        </UncontrolledCollapse>
      </Container>
    </Navbar>
  );
};

export default connector(authenticator(Navigation));
