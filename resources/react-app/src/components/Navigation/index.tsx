import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { withSanctum, WithSanctumProps } from 'react-sanctum';
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
import { FaArrowLeft, FaCog } from 'react-icons/fa';

const NavbarTitle = () => {
  return <React.Fragment>plandeprise.fr</React.Fragment>;
};

const NavbarLink = ({
  className,
  label,
  light,
  path,
}: Props.NavbarLinkProps) => {
  const location = useLocation().pathname;
  const isActive = location === path;
  console.log(location, path, isActive);

  const switchLabel = (string: string) => {
    if (string === 'arrow-left') return <FaArrowLeft />;
    if (string === 'cog') return <FaCog />;
    return string;
  };

  return (
    <NavItem className={className}>
      <NavLink active={isActive} disabled={isActive} to={path} tag={Link}>
        <span
          className={
            'nav-link-inner--text' + (isActive ? ' text-white-50' : '')
          }
        >
          {switchLabel(label)}
        </span>
      </NavLink>
    </NavItem>
  );
};

const mapState = (state: ReduxState) => ({
  app: state.app,
});

const connector = connect(mapState);

type NavigationProps = WithSanctumProps<Models.User> &
  ConnectedProps<typeof connector>;

const Navigation = (props: NavigationProps) => {
  const {
    app: { options, returnTo, title },
    authenticated,
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
            {authenticated ? (
              <React.Fragment>
                <NavbarLink label="Profil" path="/profil" />
                <NavbarLink label="Déconnexion" path="/deconnexion" />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <NavbarLink label="Connexion" path="/connexion" />
                <NavbarLink label="Inscription" path="/inscription" />
              </React.Fragment>
            )}
          </Nav>
        </UncontrolledCollapse>
      </Container>
    </Navbar>
  );
};

export default connector(withSanctum(Navigation));
