import React from 'react';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import {
  Button,
  Form,
  Nav,
  Navbar,
  NavDropdown
} from 'react-bootstrap';

class Navigation extends React.Component {
  render() {
    return (
      <Navbar bg="light" expand="lg" className="mb-1">
        <Navbar.Brand>
          <Link to="/">Plan de prise</Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {/*
              TODO: Add support to admin/non admin links
            */}
            <LinkContainer to="/plan-prise">
              <Nav.Link>Plan de prise</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            <LinkContainer to="/connexion">
              <Nav.Link>Se connecter</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/inscription">
              <Nav.Link>S'inscrire</Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default Navigation