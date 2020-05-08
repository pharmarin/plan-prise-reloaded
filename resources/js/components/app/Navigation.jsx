import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Navbar } from 'react-bootstrap';

import userSelector from '../../redux/user/selector';

class Navigation extends React.Component {
  auth = (component) => {
    const { user } = this.props;
    if (user.isValid) {
      return component;
    }
    return null;
  };

  public = (component) => {
    const { user } = this.props;
    if (!user.isValid) {
      return component;
    }
    return null;
  };

  admin = (component) => {
    const { user } = this.props;
    if (user.isAdmin) {
      return this.auth(component);
    }
    return null;
  };

  render() {
    const { user } = this.props;
    return (
      <Navbar bg="light" expand="lg" className="mb-1">
        <Navbar.Brand>
          <Link to="/">Plan de prise</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
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
                <Nav.Link>{user.details.name}</Nav.Link>
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
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

Navigation.propTypes = {
  user: PropTypes.shape({
    details: PropTypes.shape({
      name: PropTypes.string,
    }),
    isAdmin: PropTypes.bool,
    isValid: PropTypes.bool,
  }),
};

const mapStateToProps = (state) => {
  return {
    user: userSelector(state),
  };
};

export default connect(mapStateToProps)(Navigation);
