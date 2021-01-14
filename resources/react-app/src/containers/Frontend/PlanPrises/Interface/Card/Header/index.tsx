import Button from 'components/Button';
import Input from 'components/Input';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import React from 'react';
import switchVoieAdministration from 'utility/switch-voie-administration';

const Header = ({ medicament }: { medicament: Medicament | ApiMedicament }) => {
  return (
    <div className="flex flex-row">
      <div className="d-flex flex-column flex-grow">
        <div className="d-flex">
          <div className="font-semibold text-truncate">
            {medicament.denomination}
          </div>
        </div>
        <div className="text-gray-500 text-truncate">
          <small>
            {(('composition' in medicament && medicament.composition) || [])
              .map((principeActif) => principeActif.denomination)
              .join(' + ')}
          </small>
        </div>
        <div className="text-gray-500 italic text-truncate">
          {(() => {
            const voies_administration =
              ('voies_administration' in medicament &&
                medicament.voies_administration) ||
              [];
            if (voies_administration.length === 1) {
              return (
                <small>
                  Voie {switchVoieAdministration(voies_administration[0])}
                </small>
              );
            } else if (voies_administration.length > 1) {
              return (
                <Input name="voie_administration" type="select">
                  {voies_administration.map((voieAdministration) => (
                    <option>
                      {switchVoieAdministration(voieAdministration)}
                    </option>
                  ))}
                </Input>
              );
            } else {
              return null;
            }
          })()}
        </div>
      </div>
      <div className="d-flex flex-grow-0 flex-column">
        <Button
          block={true}
          className="rounded-full text-red-600 py-0"
          size="sm"
          tabIndex={-1}
          color="white"
          onClick={() => {
            alert('Delete medicament');
          }}
        >
          <small className="mr-1">Supprimer la ligne</small> X
        </Button>
      </div>
    </div>
  );
};

export default Header;
