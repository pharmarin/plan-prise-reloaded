import React from 'react';
import { Card, CardBody } from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { Input, Submit } from 'formstrap';
import { keys } from 'lodash';
import TextareaAutosize from 'react-textarea-autosize';
import useConfig from 'helpers/hooks/use-config';

export default ({ cibles, precaution }: IProps.Backend.PrecautionEdit) => {
  const voiesAdministration = useConfig('default.voies_administration');

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
          {({ handleSubmit, isSubmitting, isValid }) => (
            <Form onSubmit={handleSubmit}>
              <Input name="cible" type="select" withFeedback withLoading>
                {cibles.map((cible) => (
                  <option value={cible.id}>{cible.label}</option>
                ))}
              </Input>
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
              <Input
                className="mt-1"
                name="population"
                placeholder="Population visée"
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
                  color="light"
                  disabled={!isValid}
                  size="sm"
                  withLoading
                  withSpinner
                >
                  Enregistrer
                </Submit>
              </div>
            </Form>
          )}
        </Formik>
      </CardBody>
    </Card>
  );
};
