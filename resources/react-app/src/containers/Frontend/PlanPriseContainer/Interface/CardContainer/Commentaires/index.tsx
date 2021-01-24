import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import Label from 'components/Label';
import { action } from 'mobx';
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
    <div className="w-3/6">
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
        {(customPrecautions || []).map((customPrecaution) => (
          <PrecautionContainer
            key={customPrecaution.id}
            custom
            medicament={medicament}
            planPrise={planPrise}
            precaution={customPrecaution}
          />
        ))}
        <div className="mt-2 ml-8">
          <Button
            className="form-check-input p-0"
            color="link"
            onClick={action(() => planPrise.addCustomPrecaution(medicament))}
            style={{ position: 'relative' }}
          >
            + Ajouter un commentaire
          </Button>
        </div>
      </FormGroup>
    </div>
  );
};

export default observer(Commentaires);