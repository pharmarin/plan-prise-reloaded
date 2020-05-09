import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar } from 'react-bootstrap';
import authenticate from '../auth/AuthGate';

class Navigation extends React.Component {
  auth = (component) => {
    const { auth } = this.props;
    if (auth.isValid) {
      return component;
    }
    return null;
  };

  public = (component) => {
    const { auth } = this.props;
    if (!auth.isValid) {
      return component;
    }
    return null;
  };

  admin = (component) => {
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
        user: { name = '' },
      },
    } = this.props;
    return (
      <Navbar bg="light" expand="lg" className="mb-1">
        <Navbar.Brand>
          <Link to="/">Plan de prise</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar id="basic-navbar-nav">
          <Nav className="mr-auto">
            {this.auth(
              <LinkContainer to="/plan-prise">
                <Nav.Link>Plan de prise</Nav.Link>
              </LinkContainer>,
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
            </Nav>,
          )}
          {this.public(
            <Nav>
              <LinkContainer to="/connexion">
                <Nav.Link>Se connecter</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/inscription">
                <Nav.Link>S'inscrire</Nav.Link>
              </LinkContainer>
            </Nav>,
          )}
        </Navbar>
      </Navbar>
    );
  }
}

Navigation.propTypes = {
  auth: PropTypes.shape({
    isValid: PropTypes.bool,
    user: PropTypes.shape({
      name: PropTypes.string,
      admin: PropTypes.bool,
    }),
  }),
};

const mapStateToProps = (state) => {
  return {
    tokens: state.authReducer.tokens,
  };
};

export default connect(mapStateToProps)(authenticate(Navigation));
