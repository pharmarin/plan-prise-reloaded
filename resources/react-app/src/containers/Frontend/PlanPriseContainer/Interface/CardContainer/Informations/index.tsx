import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import { TextArea } from 'components/Input';
import Label from 'components/Label';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import forceArray from 'utility/force-array';

const Informations = ({
  medicament,
  planPrise,
}: {
  medicament: Medicament;
  planPrise: PlanPrise;
}) => {
  const indications = forceArray(
    planPrise.custom_data?.[medicament.uid]?.indications ||
      medicament.indications
  );

  const conservationDureeSource = medicament.conservation_duree;
  const conservationDureeCustom =
    planPrise.custom_data?.[medicament.uid]?.conservation_duree;

  const conservationDuree = {
    custom:
      conservationDureeCustom !== null && conservationDureeCustom !== undefined,
    data:
      conservationDureeSource.length === 1
        ? [conservationDureeSource[0].duree]
        : conservationDureeCustom
        ? [
            (
              conservationDureeSource.find(
                (i) => i.laboratoire === conservationDureeCustom
              ) || conservationDureeSource[0]
            ).duree,
          ] || []
        : conservationDureeSource.map((i) => i.laboratoire) || [],
  } as {
    custom: boolean;
    data: string[];
  };

  return (
    <div className="w-2/6 space-y-2">
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
              onChange={action(
                (event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  planPrise.setIndication(medicament, event.currentTarget.value)
              )}
              value={indications?.[0] || ''}
            />
          )}
        </FormGroup>
      </div>
      {(conservationDuree?.data || []).length > 0 && (
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
                X
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
      )}
    </div>
  );
};

export default observer(Informations);
