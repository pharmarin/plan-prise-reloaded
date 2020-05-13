import React, { useEffect, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Button, Col, Form, Row } from "react-bootstrap";
import keys from "lodash/keys";
import Skeleton from "components/generic/Skeleton";
import { doLoadUser } from "store/user/actions";

interface reduxState {
  user: {
    details: {
      name: string;
      display_name: string;
      admin: boolean;
      email: string;
    };
    isError: boolean | string;
    isLoading: boolean;
  };
}

const mapState = (state: reduxState) => ({
  details: state.user.details,
  isError: state.user.isError,
  isLoading: state.user.isLoading,
});

const mapDispatch = {
  loadUser: () => doLoadUser(),
};

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

const Profile: React.FunctionComponent<PropsFromRedux> = (props) => {
  const { details, isError, isLoading } = props;
  const [isEditing, setIsEditing] = useState<string | false>(false);

  useEffect(() => {
    const { loadUser } = props;
    if (keys(details).length === 0 && !isLoading && !isError) {
      loadUser();
    }
  });

  const getButtons = (property: string) =>
    isEditing !== property ? (
      <Button block variant="link" onClick={() => setIsEditing(property)}>
        <span className="fa fa-edit" />
      </Button>
    ) : (
      <Row>
        <Col className="p-0" sm={6}>
          <Button variant="success" onClick={() => setIsEditing(false)}>
            <span className="fa fa-check" />
          </Button>
        </Col>
        <Col className="p-0" sm={6}>
          <Button variant="danger" onClick={() => setIsEditing(false)}>
            <span className="fa fa-times" />
          </Button>
        </Col>
      </Row>
    );

  return (
    <Skeleton header="Profil">
      {(() => {
        if (isLoading) return "Chargement en cours... ";
        if (isError) return "Erreur lors du chargement";
        return (
          <React.Fragment>
            <Form.Group as={Row} controlId="name">
              <Form.Label column sm="3">
                Nom et Prénom
              </Form.Label>
              <Col sm="7">
                <Form.Control
                  defaultValue={details.name || ""}
                  name="name"
                  plaintext={isEditing !== "name"}
                  readOnly={isEditing !== "name"}
                />
              </Col>
              <Col sm="2">{getButtons("name")}</Col>
            </Form.Group>
            <Form.Group as={Row} controlId="rpps">
              <Form.Label column sm="3">
                RPPS
              </Form.Label>
              <Col sm="7">
                <Form.Control
                  defaultValue="Reste à ajouter"
                  name="rpps"
                  plaintext={isEditing !== "rpps"}
                  readOnly={isEditing !== "rpps"}
                />
              </Col>
              <Col sm="2">{getButtons("rpps")}</Col>
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
                  defaultValue={details.display_name || details.name || ""}
                  name="display-name"
                  plaintext={isEditing !== "display-name"}
                  readOnly={isEditing !== "display-name"}
                />
              </Col>
              <Col sm="2">{getButtons("display-name")}</Col>
            </Form.Group>
            <Form.Group as={Row} controlId="email">
              <Form.Label column sm="3">
                Email
              </Form.Label>
              <Col sm="7">
                <Form.Control
                  defaultValue={details.email || ""}
                  name="email"
                  plaintext={isEditing !== "email"}
                  readOnly={isEditing !== "email"}
                />
              </Col>
              <Col sm="2">{getButtons("email")}</Col>
            </Form.Group>
            <Form.Group as={Row} controlId="old-password">
              <Form.Label column sm="3">
                {isEditing === "password"
                  ? "Ancien mot de passe"
                  : "Mot de passe"}
              </Form.Label>
              <Col sm="7">
                <Form.Control
                  autoComplete="current-password"
                  defaultValue={
                    isEditing !== "password" ? "***************" : ""
                  }
                  name="old-password"
                  plaintext={isEditing !== "password"}
                  readOnly={isEditing !== "password"}
                  type="password"
                />
              </Col>
              <Col sm="2">{getButtons("password")}</Col>
            </Form.Group>
            {isEditing === "password" && (
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

export default connector(Profile);
