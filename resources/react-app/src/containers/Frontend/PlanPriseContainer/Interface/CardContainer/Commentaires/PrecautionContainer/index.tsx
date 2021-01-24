import { IRawModel } from '@datx/core';
import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import Input, { TextArea } from 'components/Input';
import Label from 'components/Label';
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
    <FormGroup className="flex flex-col">
      {precaution.population && (
        <Label className="mb-0 font-italic">{precaution.population}</Label>
      )}
      <div className="flex flex-row items-center space-x-4">
        {custom ? (
          <Button
            className="px-0 pl-1"
            color="link"
            onClick={action('removeCustomPrecaution', () => {
              planPrise.removeCustomPrecaution(medicament, precaution);
            })}
          >
            X
          </Button>
        ) : (
          <Input
            name="precaution_check"
            type="checkbox"
            checked={precaution.checked}
            onChange={action('setPrecautionChecked', () => {
              if (!medicament.isMedicament()) return;

              planPrise.setPrecautionChecked(
                medicament,
                precaution,
                !precaution.checked
              );
            })}
          />
        )}
        <TextArea
          name="precaution"
          onChange={action(
            'setPrecautionCommentaire',
            (event: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (custom) {
                planPrise.setCustomPrecautionCommentaire(
                  medicament,
                  precaution,
                  event.currentTarget.value
                );
              } else if (medicament.isMedicament()) {
                planPrise.setPrecautionCommentaire(
                  medicament,
                  precaution,
                  event.currentTarget.value
                );
              } else {
                return;
              }
            }
          )}
          value={precaution.commentaire}
        />
      </div>
    </FormGroup>
  );
};

export default PrecautionContainer;
