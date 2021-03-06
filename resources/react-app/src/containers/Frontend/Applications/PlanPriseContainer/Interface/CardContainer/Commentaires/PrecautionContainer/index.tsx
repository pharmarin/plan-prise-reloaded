import { IRawModel } from '@datx/core';
import Button from 'components/Button';
import FormGroup from 'components/FormGroup';
import Times from 'components/Icons/Times';
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
            className="px-0 pl-0.5"
            color="link"
            onClick={action('removeCustomPrecaution', () => {
              planPrise.removeCustomPrecaution(medicament, precaution);
            })}
          >
            <Times.Regular.Medium />
          </Button>
        ) : (
          <Input
            name="precaution_check"
            type="checkbox"
            checked={precaution.checked}
            onChange={action('setPrecautionChecked', () => {
              if (!medicament.isMedicament()) return;

              planPrise.precautionChecked = {
                medicament,
                precaution,
                checked: !precaution.checked,
              };
            })}
          />
        )}
        <TextArea
          name="precaution"
          onChange={action(
            'setPrecautionCommentaire',
            (event: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (custom) {
                planPrise.customPrecautionCommentaire = {
                  medicament,
                  customPrecaution: precaution,
                  value: event.currentTarget.value,
                };
              } else if (medicament.isMedicament()) {
                planPrise.precautionCommentaire = {
                  medicament,
                  precaution,
                  value: event.currentTarget.value,
                };
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
