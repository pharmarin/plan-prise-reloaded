import React, { useState } from 'react';
import { Card, CardHeader, Button, CardBody } from 'reactstrap';
import isObject from 'lodash/isObject';
import CatchableError from 'helpers/catchable-error';
import { connect, ConnectedProps } from 'react-redux';
import get from 'lodash/get';
import find from 'lodash/find';
import { BsTrash, BsCaretDown, BsCaretUpFill } from 'react-icons/bs';

const mapState = (state: ReduxState) => ({
  storedMedicaments: state.cache.medicaments,
});

const connector = connect(mapState);

type ItemCardProps = Props.ItemCard & ConnectedProps<typeof connector>;

const ItemCard = (props: ItemCardProps) => {
  const { storedMedicaments, id } = props;
  const medicament = find(storedMedicaments, id) as Medicament;
  console.log(storedMedicaments, id, medicament);
  const [isOpened, setIsOpened] = useState(false);
  return (
    <Card className="mb-3">
      <CardHeader
        className="d-flex"
        onClick={(event) => setIsOpened(!isOpened)}
      >
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
              {medicament.custom_denomination}
            </div>
          </div>
          {medicament.compositions && (
            <div className="text-muted text-truncate">
              <small>
                {medicament.compositions
                  .map((composant) => composant.denomination)
                  .join(' + ')}
              </small>
            </div>
          )}
        </div>
        <div className="d-flex flex-shrink-0 flex-column">
          <Button
            className="rounded-pill text-danger ml-auto py-0 prevent-toggle"
            size="sm"
            tabIndex={-1}
            color="light"
            //onClick={() => removeLine(id)}
          >
            <small className="mr-1 prevent-toggle">Supprimer la ligne</small>
            <BsTrash className="prevent-toggle" />
          </Button>
          <Button
            className="rounded-pill text-muted ml-auto py-0 mt-1"
            size="sm"
            tabIndex={-1}
            color="light"
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
      </CardHeader>
      <CardBody className="row">
        {/*map(keys(inputs), (sectionKey) => {
          const section = inputs[sectionKey];
          if (!section.collapse || isOpened) {
            return (
              <div
                key={sectionKey}
                className={
                  !isOpened && !section.collapse
                    ? 'col-md-12 d-flex justify-content-around'
                    : section.class
                }
              >
                {map(section.inputs, (input) => (
                  <PPInputGroup
                    key={input}
                    input={input}
                    lineId={id}
                    values={details.data}
                  />
                ))}
              </div>
            );
          }
          const needChoiceInputs = find(section.inputs, (i) =>
            includes(needChoice, i.id)
          );
          return (
            needChoiceInputs && (
              <div
                key={sectionKey}
                className="col-md-12 justify-content-around"
              >
                <PPInputGroup
                  input={needChoiceInputs}
                  lineId={id}
                  values={details.data}
                />
              </div>
            )
          );
        })*/}
      </CardBody>
    </Card>
  );
};

export default connector(ItemCard);
