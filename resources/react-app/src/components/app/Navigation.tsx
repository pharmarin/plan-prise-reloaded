import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar } from "react-bootstrap";
import authenticate, { AuthProps } from "components/auth/AuthGate";

interface RootState {
  auth: {
    tokens: {
      token_type: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
    };
  };
}

const mapState = (state: RootState) => ({
  tokens: state.auth.tokens,
});

const connector = connect(mapState);

type StoreProps = ConnectedProps<typeof connector>;

type NavigationProps = StoreProps & AuthProps;

class Navigation extends React.Component<NavigationProps> {
  auth = (component: React.ReactElement) => {
    const { auth } = this.props;
    if (auth.isValid) {
      return component;
    }
    return null;
  };

  public = (component: React.ReactElement) => {
    const { auth } = this.props;
    if (!auth.isValid) {
      return component;
    }
    return null;
  };

  admin = (component: React.ReactElement) => {
    const {
      auth: {
        user: { admin: isAdmin = false },
      },
    } = this.props;
    if (isAdmin) {
      return this.auth(component);
    }
    return null;
  };

  render() {
    const {
      auth: {
        user: { name = "" },
      },
    } = this.props;
    return (
      <Navbar bg="light" className="mb-1" expand="lg">
        <Navbar.Brand>
          <Link to="/">Plan de prise</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar id="basic-navbar-nav">
          <Nav className="mr-auto">
            {this.auth(
              <LinkContainer to="/plan-prise">
                <Nav.Link>Plan de prise</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
          {this.auth(
            <Nav>
              <LinkContainer to="/profile">
                <Nav.Link>{name}</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/deconnexion">
                <Nav.Link>Se déconnecter</Nav.Link>
              </LinkContainer>
            </Nav>
          )}
          {this.public(
            <Nav>
              <LinkContainer to="/connexion">
                <Nav.Link>Se connecter</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/inscription">
                <Nav.Link>S'inscrire</Nav.Link>
              </LinkContainer>
            </Nav>
          )}
        </Navbar>
      </Navbar>
    );
  }
}

export default connector(authenticate(Navigation));
