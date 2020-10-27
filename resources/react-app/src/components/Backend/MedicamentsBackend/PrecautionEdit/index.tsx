import React from 'react';
import { Card, CardBody, Button, CardImgOverlay, Spinner } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { Input, Submit } from 'formstrap';
import { keys, startsWith } from 'lodash';
import TextareaAutosize from 'react-textarea-autosize';
import useConfig from 'helpers/hooks/use-config';
import useAxios from 'axios-hooks';
import useJsonApi from 'helpers/hooks/use-json-api';

export default ({
  cibles,
  precaution: precautionID,
  remove,
}: IProps.Backend.PrecautionEdit) => {
  const voiesAdministration = useConfig('default.voies_administration');

  const { normalizeOne, requestUrl } = useJsonApi();

  const [{ data, loading, error }] = useAxios<
    IServerResponse<IModels.Medicament>
  >({
    url: requestUrl('precaution', {
      id: precautionID.id,
    }).url,
  });

  const [{ loading: saving, error: savingError }, save] = useAxios(
    {
      url: requestUrl('precaution', {
        id: precautionID.id,
      }).url,
      method: 'PATCH',
    },
    {
      manual: true,
    }
  );

  const [{ loading: deleting, error: deleteError }, deletePrec] = useAxios(
    {
      url: requestUrl('precaution', {
        id: precautionID.id,
      }).url,
      method: 'PATCH',
    },
    {
      manual: true,
    }
  );

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  const precaution = normalizeOne(
    { id: precautionID.id, type: precautionID.type },
    data
  );

  const handleDelete = () => {
    deletePrec().then(() => remove(precautionID.id));
  };

  return (
    <Card>
      <CardBody>
        <Formik
          initialValues={precaution}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            console.log(values);
            save({
              data: {
                data: {
                  id: precaution.id,
                  type: precaution.type,
                  attributes: {
                    commentaire: values.commentaire,
                    population: values.population,
                    voie_administration: startsWith(
                      values.cible,
                      'principe-actif'
                    )
                      ? values.voie_administration
                      : 0,
                  },
                  relationships: {
                    precaution_cible: {
                      data: {
                        type: (values.cible as string).split('_')[0],
                        id: (values.cible as string).split('_')[1],
                      },
                    },
                  },
                },
              },
            }).finally(() => setSubmitting(false));
          }}
        >
          {({ handleSubmit, isSubmitting, isValid, values }) => (
            <Form onSubmit={handleSubmit}>
              <Input name="cible" type="select" withFeedback withLoading>
                {cibles.map((cible) => (
                  <option key={cible.id} value={cible.id}>
                    {cible.label}
                  </option>
                ))}
              </Input>
              {startsWith(values.cible, 'principe-actif') && (
                <Input
                  className="mt-1"
                  name="voie_administration"
                  type="select"
                  withFeedback
                  withLoading
                >
                  <option key={0} value={0}>
                    Voie d'administration
                  </option>
                  {keys(voiesAdministration).map((id) => (
                    <option key={id} value={id}>
                      {voiesAdministration[id]}
                    </option>
                  ))}
                </Input>
              )}
              <Input
                className="mt-1"
                name="population"
                placeholder="Population visée (optionnel)"
                withFeedback
                withLoading
              />
              <Field
                as={TextareaAutosize}
                className="form-control mt-1"
                disabled={isSubmitting}
                name="commentaire"
                placeholder="Commentaire"
              />
              <div className="text-center mt-2">
                <Submit
                  color="success"
                  disabled={!isValid || isSubmitting}
                  size="sm"
                  withLoading
                >
                  Enregistrer
                </Submit>
                <Button
                  color="danger"
                  disabled={!isValid || isSubmitting}
                  onClick={handleDelete}
                  size="sm"
                  type="button"
                >
                  Supprimer
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        {(deleting || deleteError || saving || savingError) && (
          <CardImgOverlay className="d-flex justify-content-center align-items-center bg-light">
            {saving && (
              <React.Fragment>
                <Spinner size="sm" className="mr-3" />
                Enregistrement en cours...
              </React.Fragment>
            )}
            {savingError && (
              <React.Fragment>
                <div>Erreur lors de l'enregistrement</div>
                <Button color="success" size="sm">
                  Retour
                </Button>
              </React.Fragment>
            )}
            {deleting && (
              <React.Fragment>
                <Spinner size="sm" className="mr-3" />
                Suppression en cours...
              </React.Fragment>
            )}
            {deleteError && (
              <React.Fragment>
                <div>Erreur lors de la suppression</div>
                <Button color="danger" onClick={handleDelete} size="sm">
                  Réessayer
                </Button>
                <Button color="success" size="sm">
                  Retour
                </Button>
              </React.Fragment>
            )}
          </CardImgOverlay>
        )}
      </CardBody>
    </Card>
  );
};
