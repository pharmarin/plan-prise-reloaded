import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Col, Form, Row } from 'react-bootstrap';
import keys from 'lodash/keys';
import Skeleton from '../generic/Skeleton';
import { doLoadUser } from '../../redux/user/actions';

const Profile = (props) => {
  const { user = {} } = props;
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const { loadUser } = props;
    if (keys(user.details).length === 0) {
      loadUser();
    }
  }, []);

  const getButtons = (property) =>
    isEditing !== property ? (
      <Button
        block
        variant="link"
        onClick={() => setIsEditing(property)}
      >
        <span className="fa fa-edit" />
      </Button>
    ) : (
      <Row>
        <Col className="p-0" sm={6}>
          <Button
            variant="success"
            onClick={() => setIsEditing(false)}
          >
            <span className="fa fa-check" />
          </Button>
        </Col>
        <Col className="p-0" sm={6}>
          <Button
            variant="danger"
            onClick={() => setIsEditing(false)}
          >
            <span className="fa fa-times" />
          </Button>
        </Col>
      </Row>
    );

  return (
    <Skeleton header="Profil">
      {(() => {
        if (user.isLoading) return 'Chargement en cours... ';
        if (!user.isLoading && keys(user.details).length === 0)
          return 'Erreur lors du chargement';
        return (
          <React.Fragment>
            <Form.Group as={Row} controlId="name">
              <Form.Label column sm="3">
                Nom et Prénom
              </Form.Label>
              <Col sm="7">
                <Form.Control
                  defaultValue={user.details.name || ''}
                  name="name"
                  plaintext={isEditing !== 'name'}
                  readOnly={isEditing !== 'name'}
                />
              </Col>
              <Col sm="2">{getButtons('name')}</Col>
            </Form.Group>
            <Form.Group as={Row} controlId="rpps">
              <Form.Label column sm="3">
                RPPS
              </Form.Label>
              <Col sm="7">
                <Form.Control
                  defaultValue="Reste à ajouter"
                  name="rpps"
                  plaintext={isEditing !== 'rpps'}
                  readOnly={isEditing !== 'rpps'}
                />
              </Col>
              <Col sm="2">{getButtons('rpps')}</Col>
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
                  defaultValue={
                    user.details.display_name ||
                    user.details.name ||
                    ''
                  }
                  name="display-name"
                  plaintext={isEditing !== 'display-name'}
                  readOnly={isEditing !== 'display-name'}
                />
              </Col>
              <Col sm="2">{getButtons('display-name')}</Col>
            </Form.Group>
            <Form.Group as={Row} controlId="email">
              <Form.Label column sm="3">
                Email
              </Form.Label>
              <Col sm="7">
                <Form.Control
                  defaultValue={user.details.email || ''}
                  name="email"
                  plaintext={isEditing !== 'email'}
                  readOnly={isEditing !== 'email'}
                />
              </Col>
              <Col sm="2">{getButtons('email')}</Col>
            </Form.Group>
            <Form.Group as={Row} controlId="old-password">
              <Form.Label column sm="3">
                {isEditing === 'password'
                  ? 'Ancien mot de passe'
                  : 'Mot de passe'}
              </Form.Label>
              <Col sm="7">
                <Form.Control
                  autoComplete="current-password"
                  defaultValue={
                    isEditing !== 'password' ? '***************' : ''
                  }
                  name="old-password"
                  plaintext={isEditing !== 'password'}
                  readOnly={isEditing !== 'password'}
                  type="password"
                />
              </Col>
              <Col sm="2">{getButtons('password')}</Col>
            </Form.Group>
            {isEditing === 'password' && (
              <React.Fragment>
                <Form.Group as={Row} controlId="new-password-1">
                  <Form.Label column sm="3">
                    Nouveau mot de passe
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      autoComplete="new-password"
                      name="new-password-1"
                      type="password"
                    />
                  </Col>
                  <Col sm="2" />
                </Form.Group>
                <Form.Group as={Row} controlId="new-password-2">
                  <Form.Label column sm="3">
                    Confirmation
                  </Form.Label>
                  <Col sm="7">
                    <Form.Control
                      autoComplete="new-password"
                      name="new-password-2"
                      type="password"
                    />
                  </Col>
                  <Col sm="2" />
                </Form.Group>
              </React.Fragment>
            )}
          </React.Fragment>
        );
      })()}
    </Skeleton>
  );
};

Profile.propTypes = {
  loadUser: PropTypes.func,
  user: PropTypes.shape({
    isLoading: PropTypes.bool,
    details: PropTypes.shape({
      display_name: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
  }),
};

const mapStateToProps = (state) => ({
  user: state.user,
});

const mapDispatchToProps = {
  loadUser: doLoadUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
