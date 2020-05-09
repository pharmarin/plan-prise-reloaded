import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Col, Form, Row } from 'react-bootstrap';

import Skeleton from '../generic/Skeleton';

const Profile = (props) => {
  const { user = {} } = props;
  return (
    <Skeleton header="Profil">
      <Form.Group as={Row} controlId="name">
        <Form.Label column sm="3">
          Nom et Prénom
        </Form.Label>
        <Col sm="7">
          <Form.Control plaintext readOnly value={user.name || ''} />
        </Col>
        <Col sm="2">
          <Button variant="primary" size="sm" block>
            <span className="fa fa-edit" />
          </Button>
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
          <Button variant="primary" size="sm" block>
            <span className="fa fa-edit" />
          </Button>
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
          <Form.Control
            plaintext
            readOnly
            value={user.display_name || user.name || ''}
          />
        </Col>
        <Col sm="2">
          <Button variant="primary" size="sm" block>
            <span className="fa fa-edit" />
          </Button>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="email">
        <Form.Label column sm="3">
          Email
        </Form.Label>
        <Col sm="7">
          <Form.Control plaintext readOnly value={user.email || ''} />
        </Col>
        <Col sm="2">
          <Button variant="primary" size="sm" block>
            <span className="fa fa-edit" />
          </Button>
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
          <Button variant="primary" size="sm" block>
            <span className="fa fa-edit" />
          </Button>
        </Col>
      </Form.Group>
    </Skeleton>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    display_name: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
  }),
};

const mapStateToProps = (state) => {
  return {
    user: state.authReducer.user,
  };
};

export default connect(mapStateToProps)(Profile);
