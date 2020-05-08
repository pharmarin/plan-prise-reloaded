import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Col, Form, Row } from 'react-bootstrap';

import Skeleton from '../generic/Skeleton';

import userSelector from '../../redux/user/selector';

const Profile = (props) => {
  const { user } = props;
  return (
    <Skeleton header="Profil">
      <Form.Group as={Row} controlId="name">
        <Form.Label column sm="3">
          Nom et Prénom
        </Form.Label>
        <Col sm="7">
          <Form.Control
            plaintext
            readOnly
            value={user.details.name || ''}
          />
        </Col>
        <Col sm="2">
          <Button variant="primary" block>
            Changer
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
          <Button variant="primary" block>
            Changer
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
            value={
              user.details.display_name || user.details.name || ''
            }
          />
        </Col>
        <Col sm="2">
          <Button variant="primary" block>
            Changer
          </Button>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="email">
        <Form.Label column sm="3">
          Email
        </Form.Label>
        <Col sm="7">
          <Form.Control
            plaintext
            readOnly
            value={user.details.email || ''}
          />
        </Col>
        <Col sm="2">
          <Button variant="primary" block>
            Changer
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
          <Button variant="primary" block>
            Changer
          </Button>
        </Col>
      </Form.Group>
    </Skeleton>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    details: PropTypes.shape({
      display_name: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
};

const mapStateToProps = (state) => {
  return {
    user: userSelector(state),
  };
};

export default connect(mapStateToProps)(Profile);
