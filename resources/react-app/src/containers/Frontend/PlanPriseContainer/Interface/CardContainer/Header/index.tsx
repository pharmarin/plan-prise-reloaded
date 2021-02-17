import Button from 'components/Button';
import Chevron from 'components/Icons/Chevron';
import Times from 'components/Icons/Times';
import Input from 'components/Input';
import switchVoieAdministration from 'helpers/switch-voie-administration';
import { useNotifications } from 'hooks/use-store';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';

const Header = ({
  medicament,
  planPrise,
  useDetails: [showDetails, setShowDetails],
}: {
  medicament: Medicament | ApiMedicament;
  planPrise: PlanPrise;
  useDetails: [boolean, (value: boolean) => void];
}) => {
  const notifications = useNotifications();

  return (
    <div className="flex flex-row">
      <div className="d-flex flex-column flex-grow">
        <div className="font-semibold text-truncate">
          {medicament.denomination}
        </div>
        <div className="flex flex-row space-x-1">
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
                    (Voie {switchVoieAdministration(voies_administration[0])})
                  </small>
                );
              } else if (voies_administration.length > 1) {
                return (
                  <Input name="voie_administration" type="select">
                    {voies_administration.map((voieAdministration) => (
                      <option>
                        ({switchVoieAdministration(voieAdministration)})
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
      </div>
      <div className="d-flex flex-grow-0 flex-shrink-0 flex-column space-y-1">
        <Button
          block={true}
          className="rounded-full text-red-600 py-0 space-x-1"
          tabIndex={-1}
          color="white"
          onClick={action('removeMedicament', () => {
            const notification = notifications.addNotification({
              title: 'Suppression du médicament',
              message: medicament.denomination,
              type: 'loading',
            });

            planPrise.removeMedicament(medicament).finally(() => {
              notifications.removeOne(notification);
            });
          })}
        >
          <small className="mr-auto">
            Supprimer<span className="hidden sm:inline"> la ligne</span>
          </small>
          <Times.Regular.Small />
        </Button>
        <Button
          block={true}
          className="rounded-full text-gray-600 py-0 space-x-1"
          tabIndex={-1}
          color="white"
          onClick={() => setShowDetails(!showDetails)}
        >
          <small className="mr-auto">
            {showDetails ? 'Masquer' : 'Afficher'}
            <span className="hidden sm:inline"> les détails</span>
          </small>
          {showDetails ? (
            <Chevron.Single.Up.Small />
          ) : (
            <Chevron.Single.Down.Small />
          )}
        </Button>
      </div>
    </div>
  );
};

export default observer(Header);
