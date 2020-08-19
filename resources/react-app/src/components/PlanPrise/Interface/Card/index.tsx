import React, { useState } from 'react';
import { Card, CardHeader, Button, CardBody } from 'reactstrap';
import CatchableError from 'helpers/catchable-error';
import { connect, ConnectedProps } from 'react-redux';
import get from 'lodash/get';
import find from 'lodash/find';
import { BsTrash, BsCaretDown, BsCaretUpFill } from 'react-icons/bs';
import useConfig from 'helpers/hooks/use-config';
import map from 'lodash/map';
import keys from 'lodash/keys';
import InputGroup from '../Input/Group';

const mapState = (state: ReduxState) => ({
  settings: get(state.planPrise, 'content.custom_settings', {}),
  storedMedicaments: state.cache.medicaments,
});

const connector = connect(mapState);

type CardProps = Props.Card & ConnectedProps<typeof connector>;

const ItemCard = (props: CardProps) => {
  const { storedMedicaments, id, settings } = props;
  const medicament = find(storedMedicaments, id) as Medicament;
  const inputs = useConfig('default.pp_inputs');
  const [isOpened, setIsOpened] = useState(true); //useState(false);

  if (!medicament) {
    throw new CatchableError(
      "Nous n'avons pas pu obtenir les données pour le médicament #" + id.id
    );
  }

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
            block={true}
            className="rounded-pill text-danger py-0 prevent-toggle"
            size="sm"
            tabIndex={-1}
            color="neutral"
            //onClick={() => removeLine(id)}
          >
            <small className="mr-1 prevent-toggle">Supprimer la ligne</small>
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
      </CardHeader>
      <CardBody className="row">
        {map(keys(inputs), (sectionKey) => {
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
                {map(section.inputs, (input) => {
                  /*<PPInputGroup
                    key={input}
                    input={input}
                    lineId={id}
                    values={details.data}
                  />*/
                  let displayInput = true;
                  if (sectionKey === 'posologies') displayInput = input.default;
                  if (
                    get(settings, `${input.id}.checked`, undefined) !==
                    undefined
                  )
                    displayInput = get(settings, `${input.id}.checked`);
                  return displayInput ? (
                    <InputGroup
                      key={input.id}
                      input={input}
                      medicament={medicament}
                    />
                  ) : (
                    false
                  );
                })}
              </div>
            );
          }
          /*const needChoiceInputs = find(section.inputs, (i) =>
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
          );*/
          return null;
        })}
      </CardBody>
    </Card>
  );
};

export default connector(ItemCard);
