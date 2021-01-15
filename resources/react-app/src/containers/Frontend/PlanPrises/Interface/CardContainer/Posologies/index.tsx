import FormGroup from 'components/FormGroup';
import { RawInput } from 'components/Input';
import Label from 'components/Label';
import { observer } from 'mobx-react-lite';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';

const Posologies = ({
  medicament,
  planPrise,
}: {
  medicament: Medicament | ApiMedicament;
  planPrise: PlanPrise;
}) => {
  return (
    <div className="col-md-3">
      {(false || []).map((p: any) => (
        <div key={p.id}>
          <Label>{p.label}</Label>
          <FormGroup>
            <RawInput
              name={p.id}
              onChange={(e) => console.log(e.currentTarget.value)}
              value={p.value}
            />
          </FormGroup>
        </div>
      ))}
    </div>
  );
};

export default observer(Posologies);
