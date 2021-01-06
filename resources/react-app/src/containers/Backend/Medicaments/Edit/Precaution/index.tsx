import classNames from 'classnames';
import Button from 'components/Button';
import Card from 'components/Card';
import Form from 'components/Form';
import FormGroup from 'components/FormGroup';
import Input, { Select, Textarea } from 'components/Input';
import Submit from 'components/Submit';
import { Field, Formik } from 'formik';
import useConfig from 'helpers/hooks/use-config';
import { useApi } from 'hooks/use-store';
import Precaution from 'models/Precaution';
import React from 'react';
import * as yup from 'yup';

const EditPrecaution = ({
  cibles,
  precaution,
  save,
}: {
  cibles: { id: string; label: string }[];
  precaution: Precaution;
  save: any;
}) => {
  const voiesAdministration = useConfig('default.voies_administration');

  const api = useApi();

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
          save().finally(() => setSubmitting(false));
        }}
        validationSchema={yup.object().shape({
          cible: yup.string().required(),
          voie_administration: yup.number().when('cible', {
            is: (cible: Precaution['cible']) =>
              cible.startsWith('principe-actifs'),
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
                onClick={() => api.removeOne(precaution)}
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

export default EditPrecaution;
