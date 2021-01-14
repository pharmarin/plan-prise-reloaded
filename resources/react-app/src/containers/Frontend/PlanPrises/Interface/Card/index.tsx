import Content from 'containers/Frontend/PlanPrises/Interface/Card/Content';
import { observer } from 'mobx-react-lite';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { Button, Card, CardBody, CardHeader, Input, Spinner } from 'reactstrap';
import switchVoiesAdministration from 'utility/switch-voie-administration';

const ItemCard = observer(
  ({
    medicament,
    planPrise,
  }: {
    medicament?: Medicament | ApiMedicament;
    planPrise: PlanPrise;
  }) => {
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
                    {(
                      ('composition' in medicament && medicament.composition) ||
                      []
                    )
                      .map((principeActif) => principeActif.denomination)
                      .join(' + ')}
                  </small>
                </div>
                <div className="text-muted text-truncate">
                  {(() => {
                    const voies_administration =
                      ('voies_administration' in medicament &&
                        medicament.voies_administration) ||
                      [];
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
                          {voies_administration.map((voieAdministration) => (
                            <option>
                              {switchVoiesAdministration(voieAdministration)}
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
              <div className="d-flex flex-shrink-0 flex-column">
                <Button
                  block={true}
                  className="rounded-pill text-danger py-0 prevent-toggle"
                  size="sm"
                  tabIndex={-1}
                  color="neutral"
                  onClick={() => {
                    alert('Delete medicament');
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
            <Content medicament={medicament} planPrise={planPrise} />
          </CardBody>
        )}
      </Card>
    );
  }
);

export default ItemCard;
