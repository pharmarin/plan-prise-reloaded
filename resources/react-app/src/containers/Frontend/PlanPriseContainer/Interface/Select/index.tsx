import reactSelectOptions from 'helpers/react-select-options';
import useLoadList from 'hooks/use-load-list';
import { useApi } from 'hooks/use-store';
import { runInAction } from 'mobx';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import { ActionMeta, ValueType } from 'react-select';
import {
  AsyncPaginate,
  reduceGroupedOptions,
} from 'react-select-async-paginate';

const Select = ({ planPrise }: { planPrise?: PlanPrise }) => {
  const { loadGeneric } = useLoadList();

  const api = useApi();

  if (!planPrise) return <p>Chargement en cours</p>;

  return (
    <AsyncPaginate
      cacheOptions={true}
      className="mb-4"
      debounceTimeout={500}
      loadingMessage={() => 'Chargement des résultats en cours'}
      loadOptionsOnMenuOpen={false}
      loadOptions={async (inputValue) => {
        return {
          options: await loadGeneric(inputValue),
          hasMore: false,
        };
      }}
      menuPlacement="auto"
      noOptionsMessage={(p) =>
        p.inputValue.length > 0
          ? 'Aucun résultat'
          : "Taper le nom d'un médicament pour commencer la recherche"
      }
      onChange={(
        value: ValueType<
          {
            label: string;
            value: string;
            type: Models.MedicamentIdentity['type'];
          },
          false
        >,
        { action }: ActionMeta<{ label: string; value: string; type: string }>
      ) => {
        if (
          action === 'select-option' &&
          value &&
          'value' in value &&
          'type' in value
        ) {
          if (Array.isArray(value)) {
            throw new Error(
              'Un seul médicament ne peut être ajouté à la fois (Erreur 301)'
            );
          }

          const valueType = (() => {
            switch (value.type) {
              case 'medicaments':
                return Medicament;
              case 'api-medicaments':
                return ApiMedicament;
              default:
                throw new Error(
                  "Impossible d'ajouter un médicament de type inconnu au plan de prise (Erreur 300)"
                );
            }
          })();

          const model = new valueType();

          if (
            planPrise.medicaments.filter(
              (medicament) =>
                medicament.meta.type === value.type &&
                medicament.meta.id === value.value
            ).length > 0
          ) {
            throw new Error(
              'Ce médicament est déjà dans le plan de prise (Erreur 302)'
            );
          }

          runInAction(() =>
            api
              .getOne(valueType, value.value, {
                queryParams: {
                  include: ['bdpm', 'composition', 'precautions'],
                },
              })
              .then((response) => {
                runInAction(() =>
                  planPrise.addMedicament(response.data as typeof model)
                );
              })
          );
        }
      }}
      placeholder="Ajouter un médicament au plan de prise"
      reduceOptions={reduceGroupedOptions}
      value={null}
      {...reactSelectOptions}
    />
  );
};

export default Select;
