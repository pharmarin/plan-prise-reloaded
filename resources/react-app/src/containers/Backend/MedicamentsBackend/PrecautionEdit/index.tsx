import useAxios from 'axios-hooks';
import classNames from 'classnames';
import Button from 'components/Button';
import Card from 'components/Card';
import Form from 'components/Form';
import FormGroup from 'components/FormGroup';
import Input, { Select, Textarea } from 'components/Input';
import Submit from 'components/Submit';
import { Field, Formik } from 'formik';
import useConfig from 'helpers/hooks/use-config';
import useJsonApi from 'helpers/hooks/use-json-api';
import React from 'react';
import * as yup from 'yup';

const PrecautionEdit = ({
  cibles,
  precaution: precautionID,
  remove,
}: Props.Backend.PrecautionEdit) => {
  const voiesAdministration = useConfig('default.voies_administration');

  const { normalizeOne, requestUrl } = useJsonApi();

  const [{ data, loading, error }] = useAxios<
    IServerResponse<Models.Medicament.Entity>
  >({
    url: requestUrl('precautions', {
      id: precautionID.id,
    }).url,
  });

  const [{ loading: saving, error: savingError }, save] = useAxios(
    {
      url: requestUrl('precautions', {
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
      url: requestUrl('precautions', {
        id: precautionID.id,
      }).url,
      method: 'DELETE',
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
    //deletePrec().then(() => remove(precaution.getApiId()));
  };

  return (
    <Card className="mb-4" style={{ breakInside: 'avoid' }}>
      <Formik
        initialValues={{
          commentaire: precaution.commentaire || '',
          population: precaution.population || '',
          cible: precaution.cible || cibles[0].id,
          voie_administration: precaution.voie_administration || 0,
        }}
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
                  voie_administration: values.cible.startsWith(
                    'principe-actifs'
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
        validationSchema={yup.object().shape({
          cible: yup.string().required(),
          voie_administration: yup.number().when('cible', {
            is: (cible) => cible.startsWith('principe-actifs'),
            then: yup.number().min(0).max(12),
            otherwise: yup.number().min(0).max(0),
          }),
          population: yup.string().notRequired(),
          commentaire: yup.string().required('Un commentaire est obligatoire'),
        })}
      >
        {({ errors, handleSubmit, isSubmitting, isValid, values }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Select
                name="cible"
                options={cibles.map((cible) => ({
                  default: cible.id === cibles[0].id,
                  value: cible.id,
                  label: cible.label,
                }))}
                withFeedback
                withLoading
              />
            </FormGroup>
            {values.cible.startsWith('principe-actifs') && (
              <FormGroup>
                <Select
                  className="mt-1"
                  name="voie_administration"
                  options={[
                    { value: '0', label: "Toutes les voies d'administration" },
                    ...Object.keys(voiesAdministration).map((id) => ({
                      value: id,
                      label: voiesAdministration[id],
                    })),
                  ]}
                  withFeedback
                  withLoading
                />
              </FormGroup>
            )}
            <FormGroup>
              <Input
                className="mt-1"
                name="population"
                placeholder="Population visée (optionnel)"
                withFeedback
                withLoading
              />
            </FormGroup>
            <FormGroup>
              <Field
                as={Textarea}
                autoSize
                className={classNames({
                  'form-control mt-1': true,
                  'is-invalid': errors.commentaire !== undefined,
                })}
                disabled={isSubmitting}
                name="commentaire"
                placeholder="Commentaire"
                withFeedback
                withLoading
              />
            </FormGroup>
            <div className="flex flex-row justify-center space-x-4">
              <Submit
                color="green"
                disabled={!isValid || isSubmitting}
                size="sm"
                withLoading
              >
                Enregistrer
              </Submit>
              <Button
                color="red"
                disabled={isSubmitting}
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
      {/* (deleting || deleteError || saving || savingError) && (
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
        ) */}
    </Card>
  );
};

export default PrecautionEdit;
