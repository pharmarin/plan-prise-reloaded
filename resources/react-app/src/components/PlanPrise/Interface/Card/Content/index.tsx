import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, ButtonGroup, FormGroup, Input, Label } from 'reactstrap';
import { find, get, has, keys, map, uniqueId } from 'lodash';
import { removeValue, setValue } from 'store/plan-prise';
import CustomInput from '../CustomInput';
import useConfig from 'helpers/hooks/use-config';
import { typeToInt } from 'helpers/type-switcher';
import { BsPlusCircle, BsXCircle } from 'react-icons/bs';

const mapState = (state: ReduxState) => ({
  customData: get(state.planPrise, 'content.custom_data', {}),
  settings: get(state.planPrise, 'content.custom_settings', {}),
});

const mapDispatch = {
  removeValue,
  setValue,
};

const connector = connect(mapState, mapDispatch);

type ContentProps = Props.Content & ConnectedProps<typeof connector>;

const Content = ({
  customData,
  isOpened,
  medicament,
  removeValue,
  setValue,
  settings,
}: ContentProps) => {
  const posologies = useConfig('default.posologies');
  const uid = `${typeToInt(medicament.type)}-${medicament.id}`;

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

  return (
    <React.Fragment>
      {isOpened && (
        <div className="col-md-3">
          <div>
            <Label>Indication</Label>
            <FormGroup>
              <CustomInput
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
              <CustomInput
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
                  <CustomInput
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
                    <CustomInput
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
                  <CustomInput
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
            <div className="mb-1">
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
                style={{ position: 'relative' }}
              >
                <BsPlusCircle />
              </Button>
            </div>
          </FormGroup>
        </div>
      )}
    </React.Fragment>
  );
};

export default connector(Content);
