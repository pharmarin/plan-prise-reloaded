import FormGroup from 'components/FormGroup';
import { TextArea } from 'components/Input';
import Label from 'components/Label';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import joinClassNames from 'utility/class-names';

const Posologies = ({
  medicament,
  planPrise,
}: {
  medicament: Medicament | ApiMedicament;
  planPrise: PlanPrise;
}) => {
  const columns = planPrise.getColumns();

  const posologies = Object.keys(columns)
    .filter((posologieID) => columns[posologieID].display)
    .map((posologieID) => ({
      ...columns[posologieID],
      value:
        planPrise.custom_data[medicament.uid]?.posologies?.[posologieID] || '',
    }));

  return (
    <div
      className={joinClassNames('space-y-2 w-3/6', {
        'w-1/6': medicament.isMedicament(),
      })}
    >
      {posologies.map((posologie) => (
        <div
          key={posologie.id}
          className={joinClassNames('w-1/2', {
            'w-full': medicament.isMedicament(),
          })}
        >
          <Label>{posologie.label}</Label>
          <FormGroup>
            <TextArea
              name={posologie.id}
              onChange={action(
                (event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  planPrise.setPosologieValue(
                    medicament,
                    posologie.id,
                    event.currentTarget.value
                  )
              )}
              value={posologie.value}
            />
          </FormGroup>
        </div>
      ))}
    </div>
  );
};

export default observer(Posologies);
