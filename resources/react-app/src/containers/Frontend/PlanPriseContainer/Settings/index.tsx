import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import Input from 'components/Input';
import Label from 'components/Label';
import Modal from 'components/Modal';
import { ceil, chunk } from 'lodash-es';
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

  return (
    <Modal show={showSettings}>
      <Modal.Content className="space-y-4">
        <h4>Colonnes à afficher</h4>
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
                      checked={false}
                      name={posologie.id}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        alert(event.currentTarget.name);
                      }}
                      toggleSize="sm"
                      type="toggle"
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
          <Button color="green" onClick={() => {}}>
            Enregistrer
          </Button>
          <Button color="red" onClick={toggleSettings}>
            Annuler
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default Settings;
