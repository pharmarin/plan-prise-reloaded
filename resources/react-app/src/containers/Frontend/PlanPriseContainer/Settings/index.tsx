import Button from 'components/Button';
import Form from 'components/Form';
import FormGroup from 'components/FormGroup';
import Input from 'components/Input';
import Label from 'components/Label';
import Modal from 'components/Modal';
import Submit from 'components/Submit';
import Title from 'components/Title';
import { Formik } from 'formik';
import { ceil, chunk } from 'lodash-es';
import { runInAction } from 'mobx';
import PlanPrise from 'models/PlanPrise';
import getConfig from 'utility/get-config';

const Settings = ({
  planPrise,
  showSettings,
  toggleSettings,
}: {
  planPrise: PlanPrise;
  showSettings: boolean;
  toggleSettings: () => void;
}) => {
  const defaults = getConfig('default');

  const initialValues = Object.entries(planPrise.getColumns()).reduce(
    (result: { [id: string]: boolean }, [posologieID, posologieValues]) => {
      result[posologieID] = posologieValues.display;
      return result;
    },
    {}
  );

  return (
    <Modal show={showSettings}>
      <Modal.Content className="space-y-4">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={(values, { resetForm }) => {
            const changed = Object.fromEntries(
              Object.entries(values)
                .map(([id, value]) =>
                  ((defaults?.posologies || []).find(
                    (posologie) => posologie.id === id
                  )?.default || false) !== value
                    ? [id, value]
                    : []
                )
                .filter((posologie) => posologie[0] !== undefined)
            );
            runInAction(() =>
              planPrise.setCustomSettings('posologies', changed)
            );
            resetForm({
              values,
            });
            toggleSettings();
          }}
        >
          {({ resetForm }) => (
            <Form withFormik>
              <Title level={4}>Colonnes à afficher</Title>
              <div className="flex flex-row space-x-10">
                {chunk(
                  defaults?.posologies || [],
                  ceil((defaults?.posologies || []).length / 4)
                ).map((chunkArray, chunkKey) => (
                  <div key={chunkKey} className="flex-1">
                    {chunkArray.map((posologie) => {
                      return (
                        <FormGroup key={posologie.id} check>
                          <Input
                            name={posologie.id}
                            toggleSize="sm"
                            type="toggle"
                            withFormik
                          />
                          <Label for={posologie.id} check>
                            {posologie.label}
                          </Label>
                        </FormGroup>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex flex-row justify-end space-x-4">
                <Submit color="green">Enregistrer</Submit>
                <Button
                  color="red"
                  type="button"
                  onClick={() => {
                    resetForm({ values: initialValues });
                    toggleSettings();
                  }}
                >
                  Annuler
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Content>
    </Modal>
  );
};

export default Settings;
