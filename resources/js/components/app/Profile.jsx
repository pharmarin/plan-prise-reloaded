import React from 'react';
import { connect } from "react-redux";
import { Button, Col, Form, Row } from "react-bootstrap";

import Skeleton from '../generic/Skeleton';

class Profile extends React.Component {
  render() {
    return (
      <Skeleton header="Profile">
        <Form.Group as={Row} controlId="name">
          <Form.Label column sm="3">
            Nom et Prénom
          </Form.Label>
          <Col sm="7">
            <Form.Control plaintext readOnly value={this.props.name} />
          </Col>
          <Col sm="2">
            <Button variant="primary" block>Changer</Button>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="rpps">
          <Form.Label column sm="3">
            RPPS
          </Form.Label>
          <Col sm="7">
            <Form.Control plaintext readOnly value="Reste à ajouter" />
          </Col>
          <Col sm="2">
            <Button variant="primary" block>Changer</Button>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="display-name">
          <Form.Label column sm="3">
            Nom affiché
            <Form.Text className="text-muted">
              Sera imprimé sur les documents
            </Form.Text>
          </Form.Label>
          <Col sm="7">
            <Form.Control plaintext readOnly value="Reste à ajouter" />
          </Col>
          <Col sm="2">
            <Button variant="primary" block>Changer</Button>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="email">
          <Form.Label column sm="3">
            Email
          </Form.Label>
          <Col sm="7">
            <Form.Control plaintext readOnly value={this.props.mail} />
          </Col>
          <Col sm="2">
            <Button variant="primary" block>Changer</Button>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="password">
          <Form.Label column sm="3">
            Mot de passe
          </Form.Label>
          <Col sm="7">
            <Form.Control plaintext readOnly value="***************" />
          </Col>
          <Col sm="2">
            <Button variant="primary" block>Changer</Button>
          </Col>
        </Form.Group>
      </Skeleton>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.userReducer
  }
}

export default connect(mapStateToProps)(Profile)