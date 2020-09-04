import React, { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  Card,
  CardHeader,
  Button,
  CardBody,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
} from 'reactstrap';
import CatchableError from 'helpers/catchable-error';
import {
  BsTrash,
  BsCaretDown,
  BsCaretUpFill,
  BsXCircle,
  BsPlusCircle,
} from 'react-icons/bs';
import find from 'lodash/find';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';
import { removeValue, setValue } from 'store/plan-prise';
import useConfig from 'helpers/hooks/use-config';
import { typeToInt } from 'helpers/type-switcher';
import InputItem from '../Input/Item';
import { uniqueId, has } from 'lodash';

const mapState = (state: ReduxState) => ({
  customData: get(state.planPrise, 'content.custom_data', {}),
  settings: get(state.planPrise, 'content.custom_settings', {}),
  storedMedicaments: state.cache.medicaments,
});

const mapDispatch = {
  removeValue,
  setValue,
};

const connector = connect(mapState, mapDispatch);

type CardProps = Props.Card & ConnectedProps<typeof connector>;

const ItemCard = (props: CardProps) => {
  const {
    customData,
    id,
    removeValue,
    settings,
    setValue,
    storedMedicaments,
  } = props;
  const medicament = find(storedMedicaments, id) as Medicament;
  const uid = `${typeToInt(medicament.type)}-${medicament.id}`;
  const posologies = useConfig('default.posologies');
  const [isOpened, setIsOpened] = useState(true); //useState(false);

  const getValue = (customLocation: string, defaultLocation?: string) =>
    get(
      customData,
      `${uid}.${customLocation}`,
      defaultLocation ? get(medicament, defaultLocation, '') : ''
    );
  const conservationDuree = get(
    medicament,
    'attributes.conservation_duree',
    []
  );
  const customConservationDuree = get(customData, `${uid}.conservation_duree`);

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
        {isOpened && (
          <div className="col-md-3">
            <div>
              <Label>Indication</Label>
              <FormGroup>
                <InputItem
                  onChange={(value) =>
                    setValue({ id: `${uid}.custom_indications`, value })
                  }
                  value={getValue(
                    'custom_indications',
                    'attributes.custom_indications'
                  )}
                />
              </FormGroup>
            </div>
            {conservationDuree.length > 0 && (
              <div>
                <Label>Conservation après ouverture</Label>
                {customConservationDuree && (
                  <Button
                    className="float-right"
                    color="link"
                    onClick={(e) =>
                      setValue({
                        id: `${uid}.conservation_duree`,
                        value: null,
                      })
                    }
                    size="sm"
                  >
                    <BsXCircle />
                  </Button>
                )}
              </div>
            )}
            <FormGroup>
              {(customConservationDuree || conservationDuree.length === 1) && (
                <InputItem
                  onChange={() => null}
                  value={
                    (
                      find(conservationDuree, {
                        laboratoire: customConservationDuree,
                      }) || conservationDuree[0]
                    ).duree
                  }
                  readOnly={true}
                />
              )}
              {!customConservationDuree && conservationDuree.length > 1 && (
                <ButtonGroup vertical style={{ width: '100%' }}>
                  {conservationDuree.map((conservation: any) => (
                    <Button
                      key={conservation.laboratoire}
                      onClick={(e) =>
                        setValue({
                          id: `${uid}.conservation_duree`,
                          value: e.currentTarget.innerText,
                        })
                      }
                    >
                      {conservation.laboratoire}
                    </Button>
                  ))}
                </ButtonGroup>
              )}
            </FormGroup>
          </div>
        )}
        <div
          className={
            !isOpened ? 'col-md-12 d-flex justify-content-around' : 'col-md-3'
          }
        >
          {map(
            posologies,
            (p: any) =>
              get(settings, `inputs.${p.id}.checked`, p.default) && (
                <div key={p.id}>
                  <Label>{p.label}</Label>
                  <FormGroup>
                    <InputItem
                      onChange={(value) =>
                        setValue({ id: `${uid}.${p.id}`, value })
                      }
                      value={getValue(p.id)}
                    />
                  </FormGroup>
                </div>
              )
          )}
        </div>
        {isOpened && (
          <div className="col-md-6">
            <Label>Commentaires</Label>
            <FormGroup check>
              {get(medicament, 'attributes.precautions', []).map(
                (precaution: any) => (
                  <React.Fragment key={precaution.id}>
                    {precaution.population && (
                      <Label className="mb-0 font-italic">
                        {precaution.population}
                      </Label>
                    )}
                    <div className="mb-1">
                      <Input
                        type="checkbox"
                        checked={get(
                          customData,
                          `${uid}.precautions.${precaution.id}.checked`,
                          precaution.population !== undefined
                        )}
                        onChange={(e) =>
                          setValue({
                            id: `${uid}.precautions.${precaution.id}.checked`,
                            value: e.currentTarget.checked,
                          })
                        }
                      />
                      <InputItem
                        onChange={(value) =>
                          setValue({
                            id: `${uid}.precautions.${precaution.id}.commentaire`,
                            value,
                          })
                        }
                        value={get(
                          customData,
                          `${uid}.precautions.${precaution.id}.commentaire`,
                          precaution.commentaire
                        )}
                      />
                    </div>
                  </React.Fragment>
                )
              )}
              {keys(get(customData, `${uid}.custom_precautions`, {})).map(
                (custom: any) => (
                  <div key={custom} className="mb-1">
                    <Button
                      className="form-check-input p-0"
                      color="link"
                      onClick={(e) =>
                        removeValue({
                          id: `${uid}.custom_precautions.${custom}`,
                        })
                      }
                      size="sm"
                      style={{ position: 'absolute' }}
                    >
                      <BsXCircle />
                    </Button>
                    <InputItem
                      onChange={(value) =>
                        setValue({
                          id: `${uid}.custom_precautions.${custom}`,
                          value,
                        })
                      }
                      value={get(
                        customData,
                        `${uid}.custom_precautions.${custom}`,
                        ''
                      )}
                    />
                  </div>
                )
              )}
              <Button
                className="form-check-input p-0"
                color="link"
                onClick={(e) => {
                  let newID;
                  const customPrecautions = get(
                    customData,
                    `${uid}.custom_precautions`,
                    ''
                  );
                  while (true) {
                    newID = uniqueId(`custom_precautions_`);
                    if (!has(customPrecautions, newID)) {
                      break;
                    }
                  }
                  setValue({
                    id: `${uid}.custom_precautions.${newID}`,
                    value: '',
                  });
                }}
                size="sm"
                style={{ position: 'absolute' }}
              >
                <BsPlusCircle />
              </Button>
            </FormGroup>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default connector(ItemCard);
