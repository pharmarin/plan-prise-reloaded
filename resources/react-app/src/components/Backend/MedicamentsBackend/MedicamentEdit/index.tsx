import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import AsyncCreatableSelect from 'react-select/async-creatable';
import {
  Button,
  Card,
  CardBody,
  CardImgOverlay,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from 'reactstrap';
import { updateAppNav } from 'store/app';
import axios from 'helpers/axios-clients';
import useJsonApi from 'helpers/hooks/use-json-api';
import debounce from 'debounce-promise';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import useConfig from 'helpers/hooks/use-config';
import { isArray, keyBy, keys, set, uniqueId, unset, values } from 'lodash';
import Select from 'react-select';

const mapDispatch = {
  updateAppNav,
};

const connector = connect(null, mapDispatch);

type MedicamentEditProps = ConnectedProps<typeof connector> &
  IProps.Backend.MedicamentEdit;

const MultipleInputs = ({
  addValue,
  removeValue,
  lines,
  render,
}: {
  addValue: () => void;
  lines: { id: any; value: any }[];
  removeValue: (index: number) => void;
  render: (line: any, index: number) => any;
}) => {
  return (
    <React.Fragment>
      {lines.map((line, index) => (
        <Row key={index}>
          <Col sm={1}>
            <Button
              className="px-1"
              color="link"
              onClick={() => removeValue(line.id)}
            >
              <FaMinusCircle />
            </Button>
          </Col>
          <Col sm={11}>{render(line.value, line.id)}</Col>
        </Row>
      ))}
      <Row>
        <Col sm={12}>
          <Button className="px-1" color="link" onClick={addValue}>
            <FaPlusCircle />
          </Button>
        </Col>
      </Row>
    </React.Fragment>
  );
};

const MedicamentEdit = ({
  medicament: inheritedMed,
  updateAppNav,
}: MedicamentEditProps) => {
  const { requestUrl } = useJsonApi();
  const voiesAdministration = useConfig('default.voies_administration');
  const [medicament, setMedicament] = useState({
    ...inheritedMed,
    indications: keyBy(inheritedMed.indications, () => uniqueId('indication_')),
    conservation_duree: keyBy(inheritedMed.conservation_duree, () =>
      uniqueId('composition_')
    ),
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [isCreatingOption, setCreatingOption] = useState(false);

  const setValue = (path: string, value: any) => {
    setMedicament({ ...set(medicament, path, value) });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(medicament);
    setSubmitting(true);
    axios
      .patch(`/medicament/${medicament.id}`, {
        data: {
          id: String(medicament.id),
          type: 'medicament',
          attributes: {
            conservation_duree: values(medicament.conservation_duree),
            conservation_frigo: medicament.conservation_frigo,
            denomination: medicament.denomination,
            indications: values(medicament.indications),
            voies_administration: medicament.voies_administration,
          },
          relationships: {
            composition: {
              data: medicament.composition.map((compo) => ({
                type: 'principe-actif',
                id: compo.id,
              })),
            },
          },
        },
      })
      .then(() => setSubmitting(false))
      .catch((error) => {
        alert(error);
        setSubmitting(false);
      });
  };

  const onCreate = (value: string) => {
    setCreatingOption(true);
    console.log(value);
    const url = requestUrl('principe-actif');
    axios
      .post(url.url, {
        data: {
          type: 'principe-actif',
          attributes: {
            denomination: value,
          },
        },
      })
      .then((res) => {
        console.log(res);
        setCreatingOption(false);
      })
      .catch((e) => {
        console.error(e);
        setCreatingOption(false);
      });
  };

  useEffect(() => {
    updateAppNav({
      title: `Modification de ${medicament.denomination}`,
      returnTo: {
        path: '/admin',
        label: 'arrow-left',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicament.denomination]);

  return (
    <Card>
      <CardBody>
        <Form onSubmit={onSubmit}>
          <FormGroup>
            <Label>Dénomination</Label>
            <Input
              name="denomination"
              value={medicament.denomination || ''}
              onChange={(e) => setValue('denomination', e.currentTarget.value)}
              required={true}
            />
          </FormGroup>
          <FormGroup>
            <Label>Composition</Label>
            <AsyncCreatableSelect
              name="composition"
              cacheOptions
              isDisabled={isCreatingOption}
              isMulti
              isLoading={isCreatingOption}
              loadOptions={debounce(async (query) => {
                const url = requestUrl('principe-actif', {
                  page: 1,
                  filter: { field: 'denomination', value: query },
                  sort: 'denomination',
                });
                const res = await axios.get<
                  IServerResponse<IModels.PrincipeActif[]>
                >(url.url);
                const data = res.data;
                return data.data.map((composition) => ({
                  value: composition.id,
                  label: composition.attributes.denomination,
                }));
              }, 500)}
              onChange={(value) => {
                setValue(
                  'composition',
                  (isArray(value) ? value : [value]).map((v) => ({
                    id: v.value,
                    denomination: v.label,
                  }))
                );
              }}
              onCreateOption={onCreate}
              value={medicament.composition.map((c) => ({
                value: c.id,
                label: c.denomination,
              }))}
            />
          </FormGroup>
          <FormGroup>
            <Label>Voies d'administration</Label>
            <Select
              name="voies_administration"
              isMulti
              options={keys(voiesAdministration).map((i) => ({
                value: String(i),
                label: voiesAdministration[i],
              }))}
              value={medicament.voies_administration.map((i) => ({
                value: String(i),
                label: voiesAdministration[i],
              }))}
              onChange={(value) => {
                setValue(
                  'voies_administration',
                  (isArray(value) ? value : [value]).map((v) => v.value)
                );
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Indications</Label>
            <MultipleInputs
              addValue={() => {
                medicament.indications[uniqueId('indication_')] = '';
                setMedicament({
                  ...medicament,
                });
              }}
              removeValue={(id) => {
                unset(medicament, `indications.${id}`);
                setMedicament({
                  ...medicament,
                });
              }}
              lines={keys(medicament.indications).map((id) => ({
                id,
                value: medicament.indications[id],
              }))}
              render={(indication, id) => (
                <Input
                  name="indications[]"
                  value={indication || ''}
                  type="text"
                  onChange={(e) =>
                    setValue(`indications.${id}`, e.currentTarget.value)
                  }
                />
              )}
            />
          </FormGroup>
          <FormGroup>
            <Label>Conservation</Label>
            <FormGroup check className="ml-1">
              <Input
                name="conservation_frigo"
                checked={medicament.conservation_frigo || false}
                type="checkbox"
                onChange={(e) =>
                  setValue('conservation_frigo', e.currentTarget.checked)
                }
              />
              <Label check className="text-muted">
                Se conserve au frigo avant ouverture
              </Label>
            </FormGroup>
            <MultipleInputs
              addValue={() => {
                medicament.conservation_duree[uniqueId('conservation_')] = {
                  laboratoire: '',
                  duree: '',
                };
                setMedicament({
                  ...medicament,
                });
              }}
              removeValue={(id) => {
                unset(medicament, `conservation_duree.${id}`);
                setMedicament({
                  ...medicament,
                });
              }}
              lines={keys(medicament.conservation_duree).map((id) => ({
                id,
                value: medicament.conservation_duree[id],
              }))}
              render={(conservation, id) => (
                <Row>
                  <Col sm={4}>
                    <Input
                      name={`conservation_duree[][laboratoire]`}
                      value={conservation.laboratoire || ''}
                      placeholder="Laboratoire"
                      type="text"
                      onChange={(e) =>
                        setValue(
                          `conservation_duree.${id}.laboratoire`,
                          e.currentTarget.value
                        )
                      }
                    />
                  </Col>
                  <Col sm={6}>
                    <Input
                      name={`conservation_duree[][duree]`}
                      value={conservation.duree || ''}
                      placeholder="Durée"
                      type="text"
                      onChange={(e) =>
                        setValue(
                          `conservation_duree.${id}.duree`,
                          e.currentTarget.value
                        )
                      }
                    />
                  </Col>
                </Row>
              )}
            />
          </FormGroup>
          <Button type="submit" disabled={isSubmitting || isCreatingOption}>
            {isSubmitting
              ? [<Spinner size="sm" />, 'Enregistrement en cours...']
              : 'Enregistrer'}
          </Button>
          {isSubmitting && (
            <CardImgOverlay
              className="d-flex justify-content-center align-items-center"
              style={{ backgroundColor: 'rgba(255, 255, 255, .7)' }}
            >
              <Spinner size="sm" className="mr-3" />
              Enregistrement en cours...
            </CardImgOverlay>
          )}
        </Form>
      </CardBody>
    </Card>
  );
};

export default connector(MedicamentEdit);
