import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import Times from 'components/Icons/Times';
import { TextArea } from 'components/Input';
import Label from 'components/Label';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';

const ConservationDuree = ({
  medicament,
  planPrise,
  showDetails,
}: {
  medicament: Medicament;
  planPrise: PlanPrise;
  showDetails: boolean;
}) => {
  const conservationDuree = planPrise.getConservationDuree(medicament);

  if (conservationDuree.data.length === 0) {
    return null;
  }

  console.log('conservationDuree.custom: ', conservationDuree.custom);

  if (
    !showDetails &&
    conservationDuree.custom &&
    conservationDuree.data.length < 2
  ) {
    return null;
  }

  return (
    <div>
      <div className="flex flex-row">
        <Label className="flex-grow">Conservation après ouverture</Label>
        {conservationDuree.custom && (
          <Button
            className="flex-initial px-1 py-0"
            color="link"
            onClick={action(() =>
              planPrise.setConservationDuree(medicament, undefined)
            )}
          >
            <Times.Regular.Small />
          </Button>
        )}
      </div>
      <FormGroup>
        {Array.isArray(conservationDuree.data) &&
          (conservationDuree.data.length === 1 ? (
            <TextArea
              name="conservation_duree"
              onChange={() => null}
              value={conservationDuree.data[0] || ''}
              readOnly={true}
            />
          ) : (
            <div>
              {(conservationDuree.data || []).map((laboratoire) => (
                <Button
                  key={laboratoire}
                  block
                  className="rounded-none first:rounded-t-md last:rounded-b-md border-b-0 last:border-b"
                  color="white"
                  onClick={action('setConservationDuree', () =>
                    planPrise.setConservationDuree(medicament, laboratoire)
                  )}
                >
                  {laboratoire}
                </Button>
              ))}
            </div>
          ))}
      </FormGroup>
    </div>
  );
};

export default observer(ConservationDuree);
