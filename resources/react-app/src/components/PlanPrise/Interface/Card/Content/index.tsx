import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, ButtonGroup, FormGroup, Input, Label } from 'reactstrap';
import { has, isArray, isString, map, uniqueId } from 'lodash';
import { removeValue, setValue } from 'store/plan-prise';
import CustomInput from '../CustomInput';
import { BsPlusCircle, BsXCircle } from 'react-icons/bs';
import { makeUniqueSelectorInstance } from 'store/plan-prise/selectors/plan-prise';

const mapState = (state: IRedux.State, props: Props.Content) => {
  const selectMedicamentForContent = makeUniqueSelectorInstance();
  return (state: IRedux.State, { identifier }: Props.Content) => {
    const data = selectMedicamentForContent(state, {
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

const Content = ({ isOpened, removeValue, setValue, data }: ContentProps) => {
  const uid = data?.uid;
  return (
    <React.Fragment>
      {isOpened && (
        <div className="col-md-3">
          <div>
            <Label>Indication</Label>
            <FormGroup>
              {isArray(data?.indications) ? (
                <ButtonGroup vertical style={{ width: '100%' }}>
                  {data?.indications.map((indication: string) => (
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
                  value={data?.indications}
                />
              )}
            </FormGroup>
          </div>
          {(data?.conservation_duree.data).length > 0 && (
            <div>
              <Label>Conservation après ouverture</Label>
              {data?.conservation_duree.custom && (
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
                {isString(data?.conservation_duree.data) && (
                  <CustomInput
                    onChange={() => null}
                    value={data?.conservation_duree.data || ''}
                    readOnly={true}
                  />
                )}
                {isArray(data?.conservation_duree.data) && (
                  <ButtonGroup vertical style={{ width: '100%' }}>
                    {data?.conservation_duree.data.map(
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
                )}
              </FormGroup>
            </div>
          )}
        </div>
      )}
      <div
        className={
          !isOpened ? 'col-md-12 d-flex justify-content-around' : 'col-md-3'
        }
      >
        {map(
          data?.posologies,
          (p: { id: string; label: string; value: string }) => (
            <div key={p.id} className={!isOpened ? 'mx-1' : ''}>
              <Label>{p.label}</Label>
              <FormGroup>
                <CustomInput
                  onChange={(value) =>
                    setValue({ id: `${uid}.${p.id}`, value })
                  }
                  value={p.value}
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
            {data?.precautions.map(
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
            {data?.custom_precautions.map((custom: any) => (
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
                  const customPrecautionsID = map(
                    data?.custom_precautions,
                    'id'
                  );
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
      )}
    </React.Fragment>
  );
};

export default connector(Content);
