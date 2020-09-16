import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Card, CardHeader, Button, CardBody, Spinner } from 'reactstrap';
import { BsTrash, BsCaretDown, BsCaretUpFill } from 'react-icons/bs';
import { find, get } from 'lodash';
import { loadItem, setLoading } from 'store/plan-prise';
import Content from './Content';

const mapState = (state: ReduxState) => ({
  storedMedicaments: state.cache.medicaments,
});

const mapDispatch = {
  loadItem,
  setLoading,
};

const connector = connect(mapState, mapDispatch);

type CardProps = Props.Card & ConnectedProps<typeof connector>;

const ItemCard = ({
  id,
  loadItem,
  setLoading,
  storedMedicaments,
}: CardProps) => {
  const [isOpened, setIsOpened] = useState(false);
  const medicament = find(storedMedicaments, {
    id: id.id,
    type: id.type,
  }) as Medicament;

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
                  {get(medicament, 'attributes.compositions', [])
                    .map((composant: any) => composant.denomination)
                    .join(' + ')}
                </small>
              </div>
            </div>
            <div className="d-flex flex-shrink-0 flex-column">
              <Button
                block={true}
                className="rounded-pill text-danger py-0 prevent-toggle"
                size="sm"
                tabIndex={-1}
                color="neutral"
                //onClick={() => removeLine(id)}
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
          <Content isOpened={isOpened} medicament={medicament} />
        </CardBody>
      )}
    </Card>
  );
};

export default connector(ItemCard);
