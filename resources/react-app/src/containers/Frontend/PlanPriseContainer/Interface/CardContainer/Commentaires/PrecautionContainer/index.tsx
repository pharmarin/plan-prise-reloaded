import { RawInput } from 'components/Input';
import Label from 'components/Label';
import { IRawModel } from 'datx';
import { action } from 'mobx';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';

const PrecautionContainer = ({
  custom,
  medicament,
  planPrise,
  precaution,
}: {
  custom?: boolean;
  medicament: Medicament | ApiMedicament;
  planPrise: PlanPrise;
  precaution: IRawModel;
}) => {
  return (
    <div className="flex flex-col">
      {precaution.population && (
        <Label className="mb-0 font-italic">{precaution.population}</Label>
      )}
      <div className="flex flex-row items-center space-x-4">
        <RawInput
          name="precaution_check"
          type="checkbox"
          checked={precaution.checked}
          onChange={action('setPrecautionsChecked', () => {
            if (!medicament.isMedicament()) return undefined;

            planPrise.setPrecautionsChecked(
              medicament,
              precaution,
              !precaution.checked
            );
          })}
        />
        <RawInput
          name="precaution"
          onChange={action(
            'setPrecautionsCommentaire',
            (event: React.ChangeEvent<HTMLInputElement>) => {
              if (!medicament.isMedicament()) return undefined;

              planPrise.setPrecautionsCommentaire(
                medicament,
                precaution,
                event.currentTarget.value
              );
            }
          )}
          value={precaution.commentaire}
        />
      </div>
    </div>
  );
};

export default PrecautionContainer;
