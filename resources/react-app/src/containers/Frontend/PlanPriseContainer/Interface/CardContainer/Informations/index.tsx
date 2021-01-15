import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import { RawInput } from 'components/Input';
import Label from 'components/Label';
import { observer } from 'mobx-react-lite';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';

const Informations = ({
  medicament,
  planPrise,
}: {
  medicament: Medicament;
  planPrise: PlanPrise;
}) => {
  const indications = planPrise.getIndications(medicament);
  const conservation_duree = planPrise.getConservationDuree(medicament);

  return (
    <div className="space-y-2">
      <div>
        <Label>Indication</Label>
        <FormGroup>
          {indications.length > 1 ? (
            <div>
              {indications.map((indication: string) => (
                <Button
                  color="light"
                  key={indication}
                  onClick={(e) => console.log(e.currentTarget.value)}
                >
                  {indication}
                </Button>
              ))}
            </div>
          ) : (
            <RawInput
              name="indications"
              onChange={(e) => console.log(e.currentTarget.value)}
              value={indications?.[0] || ''}
            />
          )}
        </FormGroup>
      </div>
      {(conservation_duree?.data || []).length > 0 && (
        <div>
          <Label>Conservation après ouverture</Label>
          {conservation_duree.custom && (
            <Button
              className="float-right"
              color="link"
              onClick={(e) =>
                console.log('Set conservation_duree', e.currentTarget.value)
              }
              size="sm"
            >
              X
            </Button>
          )}
          <FormGroup>
            {Array.isArray(conservation_duree.data) &&
              (conservation_duree.data.length === 1 ? (
                <RawInput
                  name="conservation_duree"
                  onChange={() => null}
                  value={conservation_duree.data[0] || ''}
                  readOnly={true}
                />
              ) : (
                <div>
                  {(conservation_duree.data || []).map((laboratoire) => (
                    <Button
                      key={laboratoire}
                      color="light"
                      onClick={(e) => console.log(e.currentTarget.value)}
                    >
                      {laboratoire}
                    </Button>
                  ))}
                </div>
              ))}
          </FormGroup>
        </div>
      )}
    </div>
  );
};

export default observer(Informations);
