import { useApi } from 'hooks/use-store';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ActionMeta, ValueType } from 'react-select';
import {
  AsyncPaginate,
  reduceGroupedOptions,
} from 'react-select-async-paginate';
import { addNotification } from 'store/app';
import { cache } from 'store/cache';
import { addItem, createContent } from 'store/plan-prise';
import {
  selectPlanPriseData,
  selectPlanPriseState,
} from 'store/plan-prise/selectors/plan-prise';

const mapState = (state: Redux.State) => ({
  cacheContent: state.cache,
  medicData: selectPlanPriseData(state)?.medicaments || [],
  status: selectPlanPriseState(state),
});

const mapDispatch = {
  addItem,
  addNotification,
  cache,
  createContent,
};

const connector = connect(mapState, mapDispatch);

type SelectProps = ConnectedProps<typeof connector>;

const Select = ({
  addItem,
  addNotification,
  cache,
  cacheContent,
  createContent,
  planPrise,
  medicData,
  status,
}: SelectProps & { planPrise?: PlanPrise }) => {
  //const { loadGeneric } = useLoadAsync();

  const api = useApi();

  if (!planPrise) return <p>Chargement en cours</p>;

  const handleChange = (
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
      /* if (Array.isArray(value)) {
          throw new Error('Un seul médicament peut être ajouté à la fois');
        }
        if (
          status.isLoaded &&
          medicData.find((i) => i.type === value.type && i.id === value.value)
        ) {
          addNotification({
            header: 'Action impossible',
            content:
              "Ce médicament est déjà dans le plan de prise, il est donc impossible de l'ajouter à nouveau. ",
            icon: 'warning',
            timer: 2000,
          });
          console.warn('Ce médicament est déjà dans le plan de prise');
        } */

      api.getOne(Medicament, value.value).then((response) => {
        planPrise.medicaments.push(response.data as Medicament);
        planPrise.save();
      });
    }
  };

  return (
    <AsyncPaginate
      cacheOptions={true}
      className="mb-4"
      debounceTimeout={500}
      loadOptions={(inputValue) => ({
        options: [],
        hasMore: false,
      })}
      loadingMessage={() => 'Chargement des résultats en cours'}
      menuPlacement="auto"
      noOptionsMessage={(p) =>
        p.inputValue.length > 0
          ? 'Aucun résultat'
          : "Taper le nom d'un médicament pour commencer la recherche"
      }
      onChange={handleChange}
      placeholder="Ajouter un médicament au plan de prise"
      reduceOptions={reduceGroupedOptions}
      value={null}
    />
  );
};

export default connector(Select);
