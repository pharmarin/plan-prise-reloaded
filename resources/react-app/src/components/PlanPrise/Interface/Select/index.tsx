import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ActionMeta, ValueType } from 'react-select';
import AsyncSelect from 'react-select/async';
import { find, get, isArray } from 'lodash';
import useLoadAsync from 'helpers/hooks/use-load-async';
import { addNotification } from 'store/app';
import { cache, inCache } from 'store/cache';
import { addItem, createContent } from 'store/plan-prise';
import {
  selectPlanPriseContent,
  selectPlanPriseStatus,
} from 'store/plan-prise/selectors/plan-prise';

const mapState = (state: IRedux.State) => ({
  cacheContent: state.cache,
  medicData: get(selectPlanPriseContent(state), 'medic_data', []),
  planPriseContent: selectPlanPriseContent(state),
  status: selectPlanPriseStatus(state),
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
  medicData,
  status,
}: SelectProps) => {
  const { loadGeneric } = useLoadAsync();

  const handleChange = (
    value: ValueType<{
      label: string;
      value: string;
      type: Models.MedicamentIdentity['type'];
    }>,
    { action }: ActionMeta<{ label: string; value: string; type: string }>
  ) => {
    if (
      action === 'select-option' &&
      value &&
      'value' in value &&
      'type' in value
    ) {
      if (isArray(value)) {
        throw new Error('Un seul médicament peut être ajouté à la fois');
      }
      if (
        status.isLoaded &&
        find(medicData, { id: value.value, type: value.type })
      ) {
        addNotification({
          header: 'Action impossible',
          content:
            "Ce médicament est déjà dans le plan de prise, il est donc impossible de l'ajouter à nouveau. ",
          icon: 'warning',
          timer: 2000,
        });
        console.warn('Ce médicament est déjà dans le plan de prise');
      }
      addItem({ id: value.value, type: value.type });
      if (status.isNew) {
        createContent();
      }
      if (
        value.type === 'api-medicaments' &&
        !inCache({ id: value.value, type: value.type }, cacheContent)
      ) {
        cache({
          id: value.value,
          type: value.type,
          denomination: value.label,
          relationshipNames: [],
        });
      }
    }
  };

  return (
    <AsyncSelect
      cacheOptions={true}
      className="mb-4"
      loadOptions={loadGeneric}
      loadingMessage={() => 'Chargement des résultats en cours'}
      menuPlacement="auto"
      noOptionsMessage={(p) =>
        p.inputValue.length > 0
          ? 'Aucun résultat'
          : "Taper le nom d'un médicament pour commencer la recherche"
      }
      onChange={handleChange}
      placeholder="Ajouter un médicament au plan de prise"
      value={null}
    />
  );
};

export default connector(Select);
