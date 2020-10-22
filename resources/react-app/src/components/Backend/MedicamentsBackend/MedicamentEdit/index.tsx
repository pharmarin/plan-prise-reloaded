import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import AsyncCreatableSelect from 'react-select/async-creatable';
import {
  Button,
  Card,
  CardBody,
  CardColumns,
  CardImgOverlay,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import { updateAppNav } from 'store/app';
import axios from 'helpers/axios-clients';
import useJsonApi from 'helpers/hooks/use-json-api';
import debounce from 'debounce-promise';
import useConfig from 'helpers/hooks/use-config';
import { keyBy, keys, set } from 'lodash';
import Select from 'react-select';
import ConditionalWrapper from 'components/Utility/ConditionalWrapper';
import { Formik, Field, FieldArray } from 'formik';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { Option } from 'react-select/src/filters';
import TextareaAutosize from 'react-textarea-autosize';

const mapDispatch = {
  updateAppNav,
};

const connector = connect(null, mapDispatch);

type MedicamentEditProps = ConnectedProps<typeof connector> &
  IProps.Backend.MedicamentEdit;

const MedicamentEdit = ({
  medicament: inheritedMed,
  updateAppNav,
}: MedicamentEditProps) => {
  const { requestUrl } = useJsonApi();
  const voiesAdministration = useConfig('default.voies_administration');
  const [medicament, setMedicament] = useState({
    ...inheritedMed,
    precautions: keyBy(inheritedMed.precautions, 'id'),
  });
  const [isCreatingOption, setCreatingOption] = useState(false);

  const setValue = (path: string, value: any) => {
    setMedicament({ ...set(medicament, path, value) });
  };

  const loadPrincipeActifs = debounce(async (query) => {
    const url = requestUrl('principe-actif', {
      page: 1,
      filter: { field: 'denomination', value: query },
      sort: 'denomination',
    });
    const res = await axios.get<IServerResponse<IModels.PrincipeActif[]>>(
      url.url
    );
    const data = res.data;
    return data.data.map((composition) => ({
      value: composition.id,
      label: composition.attributes.denomination,
    }));
  }, 500);

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
    <React.Fragment>
      <Card className="mb-2">
        <CardBody>
          <Formik
            initialValues={{
              denomination: medicament.denomination,
              composition: medicament.composition.map((c) => ({
                label: c.denomination,
                value: c.id,
              })),
              voies_administration: medicament.voies_administration.map(
                (i) => ({
                  value: String(i),
                  label: voiesAdministration[i],
                })
              ),
              indications: medicament.indications,
              conservation_frigo: medicament.conservation_frigo,
              conservation_duree: medicament.conservation_duree.filter(
                (c) => c.laboratoire.length > 0 || c.duree.length > 0
              ),
            }}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              console.log('values: ', values);
              return axios
                .patch(`/medicament/${medicament.id}`, {
                  data: {
                    id: String(medicament.id),
                    type: 'medicament',
                    attributes: {
                      conservation_duree: values.conservation_duree,
                      conservation_frigo: values.conservation_frigo,
                      denomination: values.denomination,
                      indications: values.indications,
                      voies_administration: values.voies_administration.map(
                        (v) => Number(v.value)
                      ),
                    },
                    relationships: {
                      composition: {
                        data: values.composition.map((compo) => ({
                          type: 'principe-actif',
                          id: compo.value,
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
            }}
          >
            {({ handleSubmit, isSubmitting, setFieldValue, values }) => (
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Dénomination</Label>
                  <Field
                    as={Input}
                    disabled={isSubmitting}
                    name="denomination"
                    placeholder="Dénomination"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Composition</Label>
                  <Field
                    as={AsyncCreatableSelect}
                    name="composition"
                    isDisabled={isCreatingOption || isSubmitting}
                    isMulti
                    isLoading={isCreatingOption}
                    loadOptions={loadPrincipeActifs}
                    onChange={(options: Option[]) =>
                      setFieldValue('composition', options)
                    }
                    onCreateOption={(value: string) => {
                      setCreatingOption(true);
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
                        .then((res) => res.data)
                        .then((res) => {
                          const id = res.data.id;
                          const denomination = res.data.attributes.denomination;
                          setFieldValue('composition', [
                            ...values.composition,
                            {
                              value: id,
                              label: denomination,
                            },
                          ]);
                          setCreatingOption(false);
                        })
                        .catch((e) => {
                          console.error(e);
                          setCreatingOption(false);
                        });
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Voies d'administration</Label>
                  <Field
                    as={Select}
                    name="voies_administration"
                    isDisabled={isSubmitting}
                    isMulti
                    onChange={(options: Option[]) =>
                      setFieldValue('voies_administration', options)
                    }
                    options={keys(voiesAdministration).map((i) => ({
                      value: String(i),
                      label: voiesAdministration[i],
                    }))}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Indications</Label>
                  <FieldArray
                    name="indications"
                    render={(helpers) => (
                      <div>
                        {(values.indications || []).map((indication, index) => (
                          <Row key={index} className="mb-2">
                            <Col>
                              <InputGroup>
                                <Field
                                  as={Input}
                                  disabled={isSubmitting}
                                  name={`indications.${index}`}
                                  placeholder="Indication"
                                />
                                <InputGroupAddon addonType="append">
                                  <Button
                                    color="light"
                                    disabled={isSubmitting}
                                    size="sm"
                                    onClick={() => helpers.remove(index)}
                                    outline
                                    type="button"
                                  >
                                    <FaMinusCircle />
                                  </Button>
                                </InputGroupAddon>
                              </InputGroup>
                            </Col>
                          </Row>
                        ))}
                        <Row>
                          <Col>
                            <Button
                              className="text-left"
                              color="link"
                              disabled={isSubmitting}
                              onClick={() => helpers.push('')}
                              size="sm"
                              type="button"
                            >
                              <FaPlusCircle /> Ajouter une indication
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    )}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Conservation</Label>
                  <FormGroup check className="mb-2">
                    <Label check className="text-muted">
                      <Field
                        as={Input}
                        disabled={isSubmitting}
                        name="conservation_frigo"
                        type="checkbox"
                      />
                      Se conserve au frigo avant ouverture
                    </Label>
                  </FormGroup>
                  <FieldArray name="conservation_duree">
                    {(helpers) => (
                      <div>
                        {(values.conservation_duree || []).map(
                          (conservation, index) => (
                            <Row key={index} className="mb-2">
                              <Col>
                                <InputGroup>
                                  <Field
                                    as={Input}
                                    disabled={isSubmitting}
                                    name={`conservation_duree.${index}.laboratoire`}
                                    placeholder="Laboratoire"
                                  />
                                  <Field
                                    as={Input}
                                    className="border-left pl-2"
                                    disabled={isSubmitting}
                                    name={`conservation_duree.${index}.duree`}
                                    placeholder="Durée de conservation après ouverture"
                                    style={{ width: '45%' }}
                                  />
                                  <InputGroupAddon addonType="append">
                                    <Button
                                      color="light"
                                      disabled={isSubmitting}
                                      size="sm"
                                      onClick={() => helpers.remove(index)}
                                      outline
                                      type="button"
                                    >
                                      <FaMinusCircle />
                                    </Button>
                                  </InputGroupAddon>
                                </InputGroup>
                              </Col>
                            </Row>
                          )
                        )}
                        <Row>
                          <Col>
                            <Button
                              className="text-left"
                              color="link"
                              disabled={isSubmitting}
                              onClick={() => helpers.push('')}
                              size="sm"
                              type="button"
                            >
                              <FaPlusCircle /> Ajouter une durée de conservation
                              après ouverture
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </FieldArray>
                </FormGroup>
                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={isCreatingOption || isSubmitting}
                  >
                    {isSubmitting ? (
                      <React.Fragment>
                        <Spinner size="sm" />
                        Enregistrement en cours...
                      </React.Fragment>
                    ) : (
                      'Enregistrer'
                    )}
                  </Button>
                </div>
                {isSubmitting && (
                  <CardImgOverlay className="d-flex justify-content-center align-items-center bg-light">
                    <Spinner size="sm" className="mr-3" />
                    Enregistrement en cours...
                  </CardImgOverlay>
                )}
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
      <ConditionalWrapper
        condition={
          medicament.precautions && keys(medicament.precautions).length > 0
        }
        wrapper={CardColumns}
      >
        {keys(medicament.precautions).map((id) => (
          <Card key={id}>
            <CardBody>
              <TextareaAutosize
                className="form-control"
                value={medicament.precautions[id].commentaire}
                onChange={(e) =>
                  setValue(`precautions.${id}`, e.currentTarget.value)
                }
              />
            </CardBody>
          </Card>
        ))}
      </ConditionalWrapper>
    </React.Fragment>
  );
};

export default connector(MedicamentEdit);
