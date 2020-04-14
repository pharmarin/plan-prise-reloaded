import React from 'react';
import {
  Form,
  Button
} from 'react-bootstrap';

import Skeleton from './Skeleton';

class Authentification extends React.Component {
  render() {
    return (
      <Skeleton header={
        this.props.role === 'signin' ? "Connexion" :
          this.props.role === 'register' ? "Inscription" :
            null
      } size={{ md: 6 }}>
        {
          this.props.role === 'signin' &&
            <Form>
              <Form.Group controlId="signinEmail">
                <Form.Label>Adresse mail</Form.Label>
                <Form.Control type="email" placeholder="Adresse mail" />
                <Form.Text className="text-muted">
                  Ne sera jamais utilisée ou diffusée.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="signinPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" placeholder="Mot de passe" />
              </Form.Group>
              <Form.Group controlId="signinCheckbox">
                <Form.Check type="checkbox" label="Rester connecté" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Se connecter
              </Button>
            </Form>
        }
        {
          this.props.role === 'register' && 
            <Form>
              <Form.Group controlId="registerName">
                <Form.Label>Nom</Form.Label>
                <Form.Control type="text" placeholder="Nom"/>
              </Form.Group>
              <Form.Group controlId="registerEmail">
                <Form.Label>Adresse mail</Form.Label>
                <Form.Control type="email" placeholder="Adresse mail" />
                <Form.Text className="text-muted">
                  Ne sera jamais utilisée ou diffusée.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="registerPassword">
                <Form.Label>Mot de passe</Form.Label>
                <Form.Control type="password" placeholder="Mot de passe" />
              </Form.Group>
              <Button variant="primary" type="submit">
                S'inscrire
              </Button>
            </Form>
        }
      </Skeleton>
    )
  }
}

export default Authentification