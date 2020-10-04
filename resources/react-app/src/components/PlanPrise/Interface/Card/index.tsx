import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Card, CardHeader, Button, CardBody, Spinner, Input } from 'reactstrap';
import { BsTrash, BsCaretDown, BsCaretUpFill } from 'react-icons/bs';
import { find, get } from 'lodash';
import { loadItem, removeItem, setLoading } from 'store/plan-prise';
import Content from './Content';
import { addNotification } from 'store/app';
import useRepository from 'store/plan-prise/hooks/use-repository';

const mapState = (state: IReduxState) => ({
  storedMedicaments: state.cache.medicaments,
});

const mapDispatch = {
  addNotification,
  loadItem,
  removeItem,
  setLoading,
};

const connector = connect(mapState, mapDispatch);

type CardProps = IProps.Card & ConnectedProps<typeof connector>;

const ItemCard = ({
  addNotification,
  id,
  loadItem,
  removeItem,
  setLoading,
  storedMedicaments,
}: CardProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const repository = useRepository();
  const medicament = find<IMedicament>(storedMedicaments, {
    id: id.id,
    type: id.type,
  });

  useEffect(() => {
    if (!medicament && !id.loading) {
      setLoading({ id, status: true });
      loadItem(id);
    }
    if (medicament && id.loading) {
      setLoading({ id, status: false });
    }
  }, [id, loadItem, medicament, setLoading, storedMedicaments]);

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
                  {get(medicament, 'attributes.denomination', '')}
                </div>
              </div>
              <div className="text-muted text-truncate">
                <small>
                  {get(medicament, 'attributes.composition', [])
                    .map((composant: IComposition) => composant.denomination)
                    .join(' + ')}
                </small>
              </div>
              <div className="text-muted text-truncate">
                {(() => {
                  const voies_administration = get(
                    medicament,
                    'attributes.voies_administration',
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
                  removeItem(id);
                  addNotification({
                    header: `Suppression de ${medicament.attributes.denomination}`,
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
          <Content isOpened={isOpened} id={id} />
        </CardBody>
      )}
    </Card>
  );
};

export default connector(ItemCard);
