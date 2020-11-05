import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Card, CardHeader, Button, CardBody, Spinner, Input } from 'reactstrap';
import { BsTrash, BsCaretDown, BsCaretUpFill } from 'react-icons/bs';
import { find, get } from 'lodash';
import { loadItem, removeItem, setLoading } from 'store/plan-prise';
import Content from './Content';
import { addNotification } from 'store/app';
import useRepository from 'store/plan-prise/hooks/use-repository';

const mapState = (state: IRedux.State) => ({
  storedMedicaments: state.cache.medicaments,
});

const mapDispatch = {
  addNotification,
  loadItem,
  removeItem,
  setLoading,
};

const connector = connect(mapState, mapDispatch);

type CardProps = Props.Card & ConnectedProps<typeof connector>;

const ItemCard = ({
  addNotification,
  identifier,
  loadItem,
  removeItem,
  setLoading,
  storedMedicaments,
}: CardProps) => {
  const [isOpened, setIsOpened] = useState(false);

  const repository = useRepository();

  const medicament = find<
    ExtractModel<Models.Medicament> | ExtractModel<Models.ApiMedicament>
  >(storedMedicaments, {
    id: identifier.id,
    type: identifier.type,
  });

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
        onClick={(event) => setIsOpened(!isOpened)}
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
                  {get(medicament, 'composition', [])
                    .map(
                      (composant: ExtractModel<Models.PrincipeActif>) =>
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
                        {repository.switchVoiesAdministration(
                          voies_administration[0]
                        )}
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
                <BsTrash className="prevent-toggle" />
              </Button>
              <Button
                block={true}
                className="rounded-pill text-muted py-0 mt-1"
                size="sm"
                tabIndex={-1}
                color="neutral"
              >
                {isOpened ? (
                  <React.Fragment>
                    <small className="mr-1">Masquer les détails</small>
                    <BsCaretUpFill />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <small className="mr-1">Afficher les détails</small>
                    <BsCaretDown />
                  </React.Fragment>
                )}
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
          <Content isOpened={isOpened} identifier={identifier} />
        </CardBody>
      )}
    </Card>
  );
};

export default connector(ItemCard);
