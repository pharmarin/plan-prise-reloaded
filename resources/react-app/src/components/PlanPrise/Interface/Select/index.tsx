import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { ActionMeta, ValueType } from 'react-select';
import AsyncSelect from 'react-select/async';
import { isArray } from 'lodash';
import useLoadAsync from 'helpers/hooks/use-load-async';
import { cache, inCache } from 'store/cache';
import { addItem } from 'store/plan-prise';

const mapState = (state: ReduxState) => ({
  cacheContent: state.cache,
});

const mapDispatch = {
  cache,
  addItem,
};

const connector = connect(mapState, mapDispatch);

type SelectProps = ConnectedProps<typeof connector>;

const Select = ({ addItem, cache, cacheContent }: SelectProps) => {
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
      if (isArray(value))
        throw new Error('Un seul médicament peut être ajouté à la fois');
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
      className="mb-4"
      loadOptions={loadGeneric}
      loadingMessage={() => 'Chargement des résultats en cours'}
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
