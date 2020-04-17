import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Nav,
  Navbar
} from 'react-bootstrap';

import userSelector from "../../redux/user/selector";

class Navigation extends React.Component {
  
  _auth = (component) => {
    if (this.props.user.isValid) {
      return component
    }
    return null
  }

  _public = (component) => {
    if (!this.props.user.isValid) {
      return component
    }
    return null
  }

  _admin = (component) => {
    if (this.props.user.isAdmin) {
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
                  <Nav.Link>{this.props.user.details.name}</Nav.Link>
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
    user: userSelector(state)
  }
}

export default connect(mapStateToProps)(Navigation)