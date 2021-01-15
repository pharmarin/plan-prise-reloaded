import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import { RawInput } from 'components/Input';
import Label from 'components/Label';
import { observer } from 'mobx-react-lite';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import PrecautionContainer from './PrecautionContainer';

const Commentaires = ({
  medicament,
  planPrise,
}: {
  medicament: Medicament | ApiMedicament;
  planPrise: PlanPrise;
}) => {
  const precautions = planPrise.getPrecautions(medicament);
  const customPrecautions = planPrise.getCustomPrecautions(medicament);

  return (
    <div className="col-md-6">
      <Label>Commentaires</Label>
      <FormGroup>
        {precautions.map((precaution) => (
          <PrecautionContainer
            key={precaution.id}
            medicament={medicament}
            planPrise={planPrise}
            precaution={precaution}
          />
        ))}
        {(customPrecautions || []).map((custom: any) => (
          <div key={custom.id} className="mb-1">
            <Button
              className="form-check-input p-0"
              color="link"
              onClick={(e) => console.log(e.currentTarget.value)}
              size="sm"
              style={{ position: 'absolute' }}
            >
              X
            </Button>
            <RawInput
              name="custom_precaution"
              onChange={(e) => console.log(e.currentTarget.value)}
              value={custom.commentaire}
            />
          </div>
        ))}
        <div className="mb-1">
          <Button
            className="form-check-input p-0"
            color="link"
            onClick={(e) => {
              console.log('Add custom_precaution');
            }}
            size="sm"
            style={{ position: 'relative' }}
          >
            +
          </Button>
        </div>
      </FormGroup>
    </div>
  );
};

export default observer(Commentaires);
