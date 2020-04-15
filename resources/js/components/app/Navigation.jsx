import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Nav,
  Navbar
} from 'react-bootstrap';

import * as LOCAL_SERVICES from '../../redux/user/services.local';

class Navigation extends React.Component {
  
  _auth = (component) => {
    if (LOCAL_SERVICES.isValid(this.props.token)) {
      return component
    }
    return null
  }

  _public = (component) => {
    if (!LOCAL_SERVICES.isValid(this.props.token)) {
      return component
    }
    return null
  }

  _admin = (component) => {
    if (LOCAL_SERVICES.get(this.props.token, "admin")) {
      return this._auth(component)
    }
    return null
  }

  render() {
    return (
      <Navbar bg="light" expand="lg" className="mb-1">
        <Navbar.Brand>
          <Link to="/">Plan de prise</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {
              this._auth(
                <LinkContainer to="/plan-prise">
                  <Nav.Link>Plan de prise</Nav.Link>
                </LinkContainer>
              )
            }
          </Nav>
          {
            this._auth(
              <Nav>
                <LinkContainer to="/profile">
                  <Nav.Link>{this.props.name}</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/deconnexion">
                  <Nav.Link>Se déconnecter</Nav.Link>
                </LinkContainer>
              </Nav>
            )
          }
          {
            this._public(
              <Nav>
                <LinkContainer to="/connexion">
                  <Nav.Link>Se connecter</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/inscription">
                  <Nav.Link>S'inscrire</Nav.Link>
                </LinkContainer>
              </Nav>
            )
          }
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.userReducer.token,
    name: LOCAL_SERVICES.get(state.userReducer.token, 'name')
  }
}

export default connect(mapStateToProps)(Navigation)