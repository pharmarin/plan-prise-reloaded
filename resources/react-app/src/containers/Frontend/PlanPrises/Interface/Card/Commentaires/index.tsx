import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import { RawInput } from 'components/Input';
import Label from 'components/Label';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';

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
          <React.Fragment key={precaution.meta.id}>
            {precaution.population && (
              <Label className="mb-0 font-italic">
                {precaution.population}
              </Label>
            )}
            <div className="mb-1">
              <RawInput
                name="precaution_check"
                type="checkbox"
                checked={precaution.checked}
                onChange={(e) => console.log(e.currentTarget.value)}
              />
              <RawInput
                name="precaution"
                onChange={(e) => console.log(e.currentTarget.value)}
                value={precaution.commentaire}
              />
            </div>
          </React.Fragment>
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

export default Commentaires;
