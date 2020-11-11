import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, ButtonGroup, FormGroup, Input, Label } from 'reactstrap';
import { has, uniqueId } from 'lodash-es';
import { removeValue, setValue } from 'store/plan-prise';
import CustomInput from '../CustomInput';
import { BsPlusCircle, BsXCircle } from 'react-icons/bs';
import { makeUniqueSelectorInstance } from 'store/plan-prise/selectors/plan-prise';

const mapState = () => {
  return (state: IRedux.State, { identifier }: Props.Content) => {
    const data = makeUniqueSelectorInstance()(state, {
      id: identifier.id,
      type: identifier.type,
    });
    return {
      data,
    };
  };
};

const mapDispatch = {
  removeValue,
  setValue,
};

const connector = connect(mapState, mapDispatch);

type ContentProps = Props.Content & ConnectedProps<typeof connector>;

const Content = ({ removeValue, setValue, data }: ContentProps) => {
  const uid = data?.uid;

  return (
    <React.Fragment>
      <div className="col-md-3">
        <div>
          <Label>Indication</Label>
          <FormGroup>
            {(data?.indications || []).length > 1 ? (
              <ButtonGroup vertical style={{ width: '100%' }}>
                {(data?.indications || []).map((indication: string) => (
                  <Button
                    key={indication}
                    onClick={(e) =>
                      setValue({
                        id: `${uid}.indications`,
                        value: indication,
                      })
                    }
                  >
                    {indication}
                  </Button>
                ))}
              </ButtonGroup>
            ) : (
              <CustomInput
                onChange={(value) =>
                  setValue({ id: `${uid}.indications`, value })
                }
                value={data?.indications?.[0] || ''}
              />
            )}
          </FormGroup>
        </div>
        {(data?.conservation_duree?.data || []).length > 0 && (
          <div>
            <Label>Conservation après ouverture</Label>
            {data?.conservation_duree?.custom && (
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
            <FormGroup>
              {Array.isArray(data?.conservation_duree?.data) &&
                (data?.conservation_duree?.data.length === 1 ? (
                  <CustomInput
                    onChange={() => null}
                    value={data?.conservation_duree?.data[0] || ''}
                    readOnly={true}
                  />
                ) : (
                  <ButtonGroup vertical style={{ width: '100%' }}>
                    {(data?.conservation_duree?.data || []).map(
                      (laboratoire: string) => (
                        <Button
                          key={laboratoire}
                          onClick={(e) =>
                            setValue({
                              id: `${uid}.conservation_duree`,
                              value: e.currentTarget.innerText,
                            })
                          }
                        >
                          {laboratoire}
                        </Button>
                      )
                    )}
                  </ButtonGroup>
                ))}
            </FormGroup>
          </div>
        )}
      </div>
      <div className="col-md-3">
        {(data?.posologies || []).map((p) => (
          <div key={p.id}>
            <Label>{p.label}</Label>
            <FormGroup>
              <CustomInput
                onChange={(value) => setValue({ id: `${uid}.${p.id}`, value })}
                value={p.value}
              />
            </FormGroup>
          </div>
        ))}
      </div>
      <div className="col-md-6">
        <Label>Commentaires</Label>
        <FormGroup check>
          {(data?.precautions || []).map(
            (
              precaution: ExtractModel<Models.Precaution> & {
                checked: boolean;
              }
            ) => (
              <React.Fragment key={precaution.id}>
                {precaution.population && (
                  <Label className="mb-0 font-italic">
                    {precaution.population}
                  </Label>
                )}
                <div className="mb-1">
                  <Input
                    type="checkbox"
                    checked={precaution.checked}
                    onChange={(e) =>
                      setValue({
                        id: `${uid}.precautions[${precaution.id}]checked`,
                        value: e.currentTarget.checked,
                      })
                    }
                  />
                  <CustomInput
                    onChange={(value) =>
                      setValue({
                        id: `${uid}.precautions[${precaution.id}]commentaire`,
                        value,
                      })
                    }
                    value={precaution.commentaire}
                  />
                </div>
              </React.Fragment>
            )
          )}
          {(data?.custom_precautions || []).map((custom: any) => (
            <div key={custom.id} className="mb-1">
              <Button
                className="form-check-input p-0"
                color="link"
                onClick={(e) =>
                  removeValue({
                    id: `${uid}.custom_precautions[${custom.id}]`,
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
                    id: `${uid}.custom_precautions[${custom.id}]`,
                    value,
                  })
                }
                value={custom.commentaire}
              />
            </div>
          ))}
          <div className="mb-1">
            <Button
              className="form-check-input p-0"
              color="link"
              onClick={(e) => {
                let newID;
                const customPrecautionsID = (
                  data?.custom_precautions || []
                ).map((i) => i.id);
                while (true) {
                  newID = uniqueId(`custom_precautions_`);
                  if (!has(customPrecautionsID, newID)) {
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
    </React.Fragment>
  );
};

export default connector(Content);
