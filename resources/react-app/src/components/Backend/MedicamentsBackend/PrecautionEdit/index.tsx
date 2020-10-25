import React from 'react';
import { Card, CardBody, Button } from 'reactstrap';
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

  return (
    <Card>
      <CardBody>
        <Formik
          initialValues={precaution}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            console.log(values);
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
                  withSpinner
                >
                  Enregistrer
                </Submit>
                <Button
                  color="danger"
                  disabled={!isValid || isSubmitting}
                  size="sm"
                  type="button"
                >
                  Supprimer
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
};
