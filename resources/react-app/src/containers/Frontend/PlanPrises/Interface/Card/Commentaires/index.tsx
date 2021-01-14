import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import { RawInput } from 'components/Input';
import Label from 'components/Label';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';

const Commentaires = observer(
  ({
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
            <div key={precaution.meta.id} className="flex flex-col">
              {precaution.population && (
                <Label className="mb-0 font-italic">
                  {precaution.population}
                </Label>
              )}
              <div className="flex flex-row items-center space-x-4">
                <RawInput
                  name="precaution_check"
                  type="checkbox"
                  checked={precaution.checked}
                  onChange={action('setPrecautionsCheck', () => {
                    precaution.checked = !precaution.checked;
                  })}
                />
                <RawInput
                  name="precaution"
                  onChange={(e) => console.log(e.currentTarget.value)}
                  value={precaution.commentaire}
                />
              </div>
            </div>
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
  }
);

export default Commentaires;
