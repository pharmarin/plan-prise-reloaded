import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Col, FormGroup, Label, Input, FormText } from 'reactstrap';
import { BsCheck, BsX } from 'react-icons/bs';
import keys from 'lodash/keys';
import { loadUser } from 'store/user';
import { updateAppNav } from 'store/app';
import { RootState } from 'store/store';
import compact from 'lodash/compact';
import values from 'lodash/values';

const mapState = (state: RootState) => ({
  details: state.user.details,
  isError: state.user.isError,
  isLoading: state.user.isLoading,
});

const mapDispatch = {
  loadUser,
  updateAppNav,
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Profil: React.FunctionComponent<PropsFromRedux> = (props) => {
  const { details, isError, isLoading, loadUser, updateAppNav } = props;
  const [isEditing, setIsEditing] = useState<string | false>(false);

  useEffect(() => {
    updateAppNav({
      title: 'Profil',
    });
    if (keys(details).length === 0 && !isLoading && !isError) {
      loadUser();
    }
  }, [details, isError, isLoading, loadUser, updateAppNav]);

  const getButtons = (property: string) =>
    isEditing !== property ? (
      <Button block color="link" onClick={() => setIsEditing(property)}>
        Modifier
      </Button>
    ) : (
      <React.Fragment>
        <Button
          className="ml-auto"
          color="success"
          onClick={() => setIsEditing(false)}
        >
          <BsCheck />
        </Button>
        <Button
          className="mr-auto"
          color="danger"
          onClick={() => setIsEditing(false)}
        >
          <BsX />
        </Button>
      </React.Fragment>
    );

  if (isLoading) return <span>Chargement en cours</span>;
  if (isError) return <span>Erreur lors du chargement</span>;
  if (compact(values(details)).length === 0)
    return <span>Le chargement va commencer</span>;
  return (
    <React.Fragment>
      <FormGroup row>
        <Label for="name" sm="3">
          Nom et Prénom
        </Label>
        <Col sm="7">
          <Input
            defaultValue={details.name || ''}
            name="name"
            plaintext={isEditing !== 'name'}
            readOnly={isEditing !== 'name'}
          />
        </Col>
        <Col sm="2">{getButtons('name')}</Col>
      </FormGroup>
      <FormGroup row>
        <Label for="rpps" sm="3">
          RPPS
        </Label>
        <Col sm="7">
          <Input
            defaultValue="Reste à ajouter"
            name="rpps"
            plaintext={isEditing !== 'rpps'}
            readOnly={isEditing !== 'rpps'}
          />
        </Col>
        <Col sm="2">{getButtons('rpps')}</Col>
      </FormGroup>
      <FormGroup row>
        <Label for="display-name" sm="3">
          Nom affiché
          <FormText className="text-muted">
            Sera imprimé sur les documents
          </FormText>
        </Label>
        <Col sm="7">
          <Input
            defaultValue={details.display_name || details.name || ''}
            name="display-name"
            plaintext={isEditing !== 'display-name'}
            readOnly={isEditing !== 'display-name'}
          />
        </Col>
        <Col sm="2">{getButtons('display-name')}</Col>
      </FormGroup>
      <FormGroup row>
        <Label for="email" sm="3">
          Email
        </Label>
        <Col sm="7">
          <Input
            defaultValue={details.email || ''}
            name="email"
            plaintext={isEditing !== 'email'}
            readOnly={isEditing !== 'email'}
          />
        </Col>
        <Col sm="2">{getButtons('email')}</Col>
      </FormGroup>
      <FormGroup row>
        <Label for="old-password" sm="3">
          {isEditing === 'password' ? 'Ancien mot de passe' : 'Mot de passe'}
        </Label>
        <Col sm="7">
          <Input
            autoComplete="current-password"
            defaultValue={isEditing !== 'password' ? '***************' : ''}
            name="old-password"
            plaintext={isEditing !== 'password'}
            readOnly={isEditing !== 'password'}
            type="password"
          />
        </Col>
        <Col sm="2">{getButtons('password')}</Col>
      </FormGroup>
      {isEditing === 'password' && (
        <React.Fragment>
          <FormGroup row>
            <Label for="new-password-1" sm="3">
              Nouveau mot de passe
            </Label>
            <Col sm="7">
              <Input
                autoComplete="new-password"
                name="new-password-1"
                type="password"
              />
            </Col>
            <Col sm="2" />
          </FormGroup>
          <FormGroup row>
            <Label for="new-password-2" sm="3">
              Confirmation
            </Label>
            <Col sm="7">
              <Input
                autoComplete="new-password"
                name="new-password-2"
                type="password"
              />
            </Col>
            <Col sm="2" />
          </FormGroup>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default connector(Profil);
