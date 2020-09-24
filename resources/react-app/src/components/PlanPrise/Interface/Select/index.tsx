import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ActionMeta, ValueType } from 'react-select';
import AsyncSelect from 'react-select/async';
import { find, isArray } from 'lodash';
import useLoadAsync from 'helpers/hooks/use-load-async';
import { addNotification } from 'store/app';
import { cache, inCache } from 'store/cache';
import { addItem, checkLoaded } from 'store/plan-prise';

const mapState = (state: ReduxState) => ({
  cacheContent: state.cache,
  planPriseContent: state.planPrise.content,
});

const mapDispatch = {
  addNotification,
  cache,
  addItem,
};

const connector = connect(mapState, mapDispatch);

type SelectProps = ConnectedProps<typeof connector>;

const Select = ({
  addItem,
  addNotification,
  cache,
  cacheContent,
  planPriseContent,
}: SelectProps) => {
  const { loadGeneric } = useLoadAsync();

  const handleChange = (
    value: ValueType<{ label: string; value: string; type: string }>,
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
        checkLoaded(planPriseContent) &&
        find(planPriseContent.medic_data, { id: value.value, type: value.type })
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
      if (
        value.type === 'api-medicament' &&
        !inCache({ id: value.value, type: value.type }, cacheContent)
      ) {
        cache({
          id: value.value,
          type: value.type,
          attributes: { denomination: value.label },
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
