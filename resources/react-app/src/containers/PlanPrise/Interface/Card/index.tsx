import Content from 'containers/PlanPrise/Interface/Card/Content';
import switchVoiesAdministration from 'helpers/switch-voie-administration';
import { get } from 'lodash-es';
import React, { useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Card, CardBody, CardHeader, Input, Spinner } from 'reactstrap';
import { addNotification } from 'store/app';
import { loadItem, removeItem, setLoading } from 'store/plan-prise';

const mapState = (state: Redux.State) => ({
  storedMedicaments: state.cache.medicaments,
});

const mapDispatch = {
  addNotification,
  loadItem,
  removeItem,
  setLoading,
};

const connector = connect(mapState, mapDispatch);

type CardProps = Props.Frontend.PlanPrise.Card &
  ConnectedProps<typeof connector>;

const ItemCard = ({
  addNotification,
  identifier,
  loadItem,
  removeItem,
  setLoading,
  storedMedicaments,
}: CardProps) => {
  const medicament = storedMedicaments.find(
    (i) => i.type === identifier.type && i.id === identifier.id
  );

  useEffect(() => {
    if (!medicament && !identifier.loading) {
      setLoading({
        id: { id: identifier.id, type: identifier.type },
        status: true,
      });
      loadItem(identifier);
    }
    if (medicament && identifier.loading) {
      setLoading({
        id: { id: identifier.id, type: identifier.type },
        status: false,
      });
    }
  }, [identifier, loadItem, medicament, setLoading, storedMedicaments]);

  return (
    <Card className="mb-3">
      <CardHeader
        className="d-flex"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 5,
        }}
      >
        {medicament ? (
          <React.Fragment>
            <div
              className="d-flex flex-column flex-grow-1"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <div className="d-flex">
                <div className="text-truncate">
                  {medicament.denomination || ''}
                </div>
              </div>
              <div className="text-muted text-truncate">
                <small>
                  {('composition' in medicament ? medicament.composition : [])
                    .map(
                      (composant: Models.PrincipeActif.Extracted) =>
                        composant.denomination
                    )
                    .join(' + ')}
                </small>
              </div>
              <div className="text-muted text-truncate">
                {(() => {
                  const voies_administration = get(
                    medicament,
                    'voies_administration',
                    []
                  );
                  if (voies_administration.length === 1) {
                    return (
                      <small>
                        Voie{' '}
                        {switchVoiesAdministration(voies_administration[0])}
                      </small>
                    );
                  } else if (voies_administration.length > 1) {
                    return (
                      <Input type="select">
                        {voies_administration.map((voie: string) => (
                          <option>{voie}</option>
                        ))}
                      </Input>
                    );
                  } else {
                    return null;
                  }
                })()}
              </div>
            </div>
            <div className="d-flex flex-shrink-0 flex-column">
              <Button
                block={true}
                className="rounded-pill text-danger py-0 prevent-toggle"
                size="sm"
                tabIndex={-1}
                color="neutral"
                onClick={() => {
                  removeItem({ id: identifier.id, type: identifier.type });
                  addNotification({
                    header: `Suppression de ${medicament.denomination}`,
                    icon: 'danger',
                    timer: 2000,
                  });
                }}
              >
                <small className="mr-1 prevent-toggle">
                  Supprimer la ligne
                </small>
                <FaTrash className="prevent-toggle" />
              </Button>
            </div>
          </React.Fragment>
        ) : (
          <div>
            <Spinner size="sm" />
            <span className="ml-2">Chargement en cours</span>
          </div>
        )}
      </CardHeader>
      {medicament && (
        <CardBody className="row">
          <Content identifier={identifier} />
        </CardBody>
      )}
    </Card>
  );
};

export default connector(ItemCard);
