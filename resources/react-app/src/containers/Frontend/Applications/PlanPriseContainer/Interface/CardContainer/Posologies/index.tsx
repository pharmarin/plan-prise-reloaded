import FormGroup from 'components/FormGroup';
import { TextArea } from 'components/Input';
import Label from 'components/Label';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import joinClassNames from 'tools/class-names';

const Posologies = ({
  medicament,
  planPrise,
  showDetails,
}: {
  medicament: Medicament | ApiMedicament;
  planPrise: PlanPrise;
  showDetails: boolean;
}) => {
  const posologies = planPrise.posologies(medicament);

  return (
    <div
      className={joinClassNames('flex', {
        'md:flex-col w-full md:w-3/6 space-x-2 md:space-x-0 md:space-y-2': showDetails,
        'w-full md:w-1/6': showDetails && medicament.isMedicament(),
        'w-full flew-row space-x-2': !showDetails,
      })}
    >
      {posologies.map((posologie) => (
        <div
          key={posologie.id}
          className={joinClassNames('w-1/2', {
            'w-1/3 md:w-full': medicament.isMedicament(),
          })}
        >
          <Label>{posologie.label}</Label>
          <FormGroup>
            <TextArea
              name={posologie.id}
              onChange={action(
                'setPosologie',
                (event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  (planPrise.posologie = {
                    medicament,
                    posologieId: posologie.id,
                    value: event.currentTarget.value,
                  })
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
