import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import { TextArea } from 'components/Input';
import Label from 'components/Label';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';

const Indications = ({
  medicament,
  planPrise,
  showDetails,
}: {
  medicament: Medicament;
  planPrise: PlanPrise;
  showDetails: boolean;
}) => {
  const indications = planPrise.getIndications(medicament);

  if (!showDetails && indications.length < 2) {
    return null;
  }

  return (
    <div>
      <Label>Indication</Label>
      <FormGroup>
        {indications.length > 1 ? (
          <div>
            {indications.map((indication: string) => (
              <Button
                key={indication}
                block
                className="rounded-none first:rounded-t-md last:rounded-b-md border-b-0 last:border-b"
                color="white"
                onClick={action(
                  (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                    planPrise.setIndication(
                      medicament,
                      event.currentTarget.innerHTML
                    )
                )}
              >
                {indication}
              </Button>
            ))}
          </div>
        ) : (
          <TextArea
            name="indications"
            onChange={action((event: React.ChangeEvent<HTMLTextAreaElement>) =>
              planPrise.setIndication(medicament, event.currentTarget.value)
            )}
            value={indications?.[0] || ''}
          />
        )}
      </FormGroup>
    </div>
  );
};

export default observer(Indications);
