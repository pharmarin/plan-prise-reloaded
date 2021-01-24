import Button from 'components/Button';
import Card from 'components/Card';
import Form from 'components/Form';
import FormGroup from 'components/FormGroup';
import Times from 'components/Icons/Times';
import Input from 'components/Input';
import Label from 'components/Label';
import Submit from 'components/Submit';
import debounce from 'debounce-promise';
import { Field, FieldArray, Formik } from 'formik';
import axios from 'helpers/axios-clients';
import useConfig from 'helpers/hooks/use-config';
import { useApi } from 'hooks/use-store';
import { observer } from 'mobx-react-lite';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PrincipeActif from 'models/PrincipeActif';
import React, { useState } from 'react';
import Select, { InputActionTypes } from 'react-select';
import { AsyncPaginate } from 'react-select-async-paginate';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { Option } from 'react-select/src/filters';
import reactSelectOptions from 'utility/react-select-options';
import * as yup from 'yup';

yup.setLocale({
  mixed: {
    // eslint-disable-next-line no-template-curly-in-string
    required: 'Le champ ${path} est obligatoire',
  },
});

const EditAttributes = ({ medicament }: { medicament: Medicament }) => {
  const api = useApi();

  const [CISInputValue, setCISInputValue] = useState(medicament.denomination);
  const [isCreatingOption, setCreatingOption] = useState(false);

  const voiesAdministration = useConfig('default.voies_administration');

  const loadPrincipeActifs = debounce(async (query) => {
    return await api
      .getMany(PrincipeActif, {
        queryParams: {
          filter: { denomination: query },
          sort: 'denomination',
        },
      })
      .then((response) => {
        return (response.data as PrincipeActif[]).map((principeActif) => ({
          value: principeActif.meta.id,
          label: principeActif.denomination,
        }));
      });
  }, 500);

  return (
    <Card className="mb-2">
      <Formik
        initialValues={{
          bdpm: (medicament.bdpm || []).map((bdpm) => ({
            value: bdpm.meta.id,
            label: bdpm.denomination,
          })),
          denomination: medicament.denomination,
          composition: medicament.composition.map((principeActif) => ({
            label: principeActif.denomination,
            value: principeActif.meta.id,
          })),
          voies_administration: (medicament.voies_administration || []).map(
            (voieAdministration) => ({
              value: String(voieAdministration),
              label: voiesAdministration[voieAdministration],
            })
          ),
          indications: medicament.indications || [],
          conservation_frigo: medicament.conservation_frigo,
          conservation_duree: (medicament.conservation_duree || []).filter(
            (conservation) =>
              (conservation.laboratoire || '').length > 0 ||
              (conservation.duree || '').length > 0
          ),
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          console.log('values: ', values);
          return axios
            .patch(`/medicaments/${medicament.meta.id}`, {
              data: {
                id: String(medicament.meta.id),
                type: 'medicaments',
                attributes: {
                  conservation_duree: values.conservation_duree || [],
                  conservation_frigo: values.conservation_frigo || false,
                  denomination: values.denomination,
                  indications: values.indications || [],
                  voies_administration: (
                    values.voies_administration || []
                  ).map((voieAdministration) =>
                    Number(voieAdministration.value)
                  ),
                },
                relationships: {
                  bdpm: {
                    data: (values.bdpm || []).map((bdpm) => ({
                      type: 'api-medicaments',
                      id: bdpm.value,
                    })),
                  },
                  composition: {
                    data: (values.composition || []).map((composition) => ({
                      type: 'principe-actifs',
                      id: composition.value,
                    })),
                  },
                },
              },
            })
            .catch((error) => {
              alert(error);
            })
            .finally(() => setSubmitting(false));
        }}
        validateOnBlur
        validationSchema={yup.object().shape({
          denomination: yup
            .string()
            .required('La dénomination doit être remplie'),
          composition: yup.array().of(
            yup.object().shape({
              value: yup.string(),
              label: yup.string(),
            })
          ),
          bdpm: yup.array().of(
            yup.object().shape({
              value: yup.string(),
              label: yup.string(),
            })
          ),
          voies_administration: yup.array().of(
            yup.object().shape({
              value: yup.string(),
              label: yup.string(),
            })
          ),
          indications: yup
            .array()
            .of(yup.string().required("L'indication doit être remplie")),
          conservation_frigo: yup.boolean(),
          conservation_duree: yup.array().of(
            yup.object().shape({
              laboratoire: yup.string().notRequired(),
              duree: yup
                .string()
                .required('La durée de conservation doit être remplie'),
            })
          ),
        })}
      >
        {({
          errors,
          handleSubmit,
          isSubmitting,
          isValid,
          setFieldValue,
          values,
        }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Dénomination</Label>
              <Input
                name="denomination"
                placeholder="Dénomination"
                withLoading
                withFeedback
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
                  const principeActif = new PrincipeActif({
                    denomination: value,
                  });
                  principeActif
                    .save()
                    .then((response) => {
                      setFieldValue('composition', [
                        ...values.composition,
                        {
                          value: (response as PrincipeActif).meta.id,
                          label: (response as PrincipeActif).denomination,
                        },
                      ]);
                      setCreatingOption(false);
                    })
                    .catch((e) => {
                      console.error(e);
                      setCreatingOption(false);
                    });
                }}
                {...reactSelectOptions}
              />
            </FormGroup>
            <FormGroup>
              <Label>Associer à la base de données du médicament</Label>
              <Field
                as={AsyncPaginate}
                name="bdpm"
                closeMenuOnSelect={false}
                debounceTimeout={500}
                get={async (url: string, params: any) => {
                  const response = await axios.get(url, {
                    params,
                  });
                  return response.data;
                }}
                hideSelectedOptions={false}
                inputValue={CISInputValue}
                isDisabled={isSubmitting}
                isMulti
                loadOptions={async (query: string) => {
                  const apiMedicaments = await api
                    .getMany(ApiMedicament, {
                      queryParams: {
                        filter: { denomination: [query] },
                      },
                    })
                    .then((response) => response.data as ApiMedicament[]);

                  return {
                    options: apiMedicaments.map((apiMedicament) => ({
                      value: apiMedicament.meta.id,
                      label: apiMedicament.denomination,
                    })),
                    hasMore: false,
                  };
                }}
                onChange={(options: Option[]) => setFieldValue('bdpm', options)}
                onInputChange={(
                  query: string,
                  { action }: { action: InputActionTypes }
                ) => {
                  if (action === 'input-change') {
                    setCISInputValue(query);
                    return query;
                  }
                  return query;
                }}
                {...reactSelectOptions}
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
                options={Object.keys(voiesAdministration).map((i) => ({
                  value: String(i),
                  label: voiesAdministration[i],
                }))}
                {...reactSelectOptions}
              />
            </FormGroup>
            <FormGroup>
              <Label>Indications</Label>
              <FieldArray
                name="indications"
                render={(helpers) => (
                  <div>
                    {(values.indications || []).map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-row items-center space-x-4"
                      >
                        <div className="flex flex-col w-full">
                          <Input
                            className="pl-2"
                            name={`indications.${index}`}
                            placeholder="Indication"
                            withFeedback
                            withLoading
                          />
                        </div>
                        <Button
                          className="p-1"
                          color="white"
                          disabled={isSubmitting}
                          onClick={() => helpers.remove(index)}
                          size="sm"
                          type="button"
                        >
                          <Times.Regular.Small className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    ))}
                    <Form.Text className="text-red-600">
                      {errors.indications}
                    </Form.Text>
                    <div>
                      <Button
                        className="text-left pl-0"
                        color="link"
                        disabled={isSubmitting}
                        onClick={() => helpers.push('')}
                        size="sm"
                        type="button"
                      >
                        + Ajouter une indication
                      </Button>
                    </div>
                  </div>
                )}
              />
            </FormGroup>
            <FormGroup>
              <Label>Conservation</Label>
              <FormGroup className="mb-2">
                <Label
                  check
                  className="text-muted flex flex-row space-x-2 ml-0"
                >
                  <Input
                    className="m-0"
                    name="conservation_frigo"
                    type="checkbox"
                    withFeedback
                    withLoading
                  />
                  <div>Se conserve au frigo avant ouverture</div>
                </Label>
              </FormGroup>
              <FieldArray name="conservation_duree">
                {(helpers) => (
                  <div>
                    {(values.conservation_duree || []).map((_, index) => (
                      <div
                        key={index}
                        className="flex flex-row items-center space-x-4"
                      >
                        <div className="flex flex-col w-full">
                          <div className="flex flex-row space-x-4 w-full">
                            <Input
                              className="pl-2"
                              name={`conservation_duree.${index}.laboratoire`}
                              placeholder="Laboratoire"
                              withLoading
                            />
                            <Input
                              className="border-left pl-2"
                              name={`conservation_duree.${index}.duree`}
                              placeholder="Durée de conservation après ouverture"
                              withLoading
                            />
                          </div>
                        </div>
                        <Button
                          className="p-1"
                          color="white"
                          disabled={isSubmitting}
                          onClick={() => helpers.remove(index)}
                          size="sm"
                          type="button"
                        >
                          <Times.Regular.Small className="h-3 w-3 text-red-600" />
                        </Button>
                      </div>
                    ))}
                    <Form.Text className="text-red-600">
                      {Array.isArray(errors.conservation_duree)
                        ? typeof errors.conservation_duree[0] === 'string'
                          ? errors.conservation_duree[0]
                          : errors.conservation_duree[0].duree
                        : errors.conservation_duree}
                    </Form.Text>
                    <div>
                      <Button
                        className="text-left pl-0"
                        color="link"
                        disabled={isSubmitting}
                        onClick={() => helpers.push('')}
                        size="sm"
                        type="button"
                      >
                        + Ajouter une durée de conservation après ouverture
                      </Button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </FormGroup>
            <div className="max-w-sm mx-auto mt-4">
              <Submit
                block
                color="green"
                type="submit"
                disabled={isCreatingOption || isSubmitting || !isValid}
                size="sm"
                withLoading
                withSpinner
              >
                Enregistrer
              </Submit>
            </div>
          </Form>
        )}
      </Formik>
    </Card>
  );
};

export default observer(EditAttributes);
