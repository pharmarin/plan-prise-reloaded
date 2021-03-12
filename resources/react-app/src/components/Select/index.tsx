import reactSelectOptions from 'helpers/react-select-options';
import useLoadList from 'hooks/use-load-list';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import React from 'react';
import { ActionMeta, ValueType } from 'react-select';
import {
  AsyncPaginate,
  reduceGroupedOptions,
} from 'react-select-async-paginate';

const Select = ({
  disabled,
  onAdd,
  placeholder,
}: {
  disabled?: boolean;
  onAdd: (
    value: {
      label: string;
      value: string;
      type: typeof ApiMedicament['type'] | typeof Medicament['type'];
    },
    valueType: typeof ApiMedicament | typeof Medicament
  ) => void;
  placeholder: string;
}) => {
  const { loadGeneric } = useLoadList();

  return (
    <AsyncPaginate
      cacheOptions={true}
      className="mb-4"
      debounceTimeout={500}
      isDisabled={disabled}
      loadingMessage={() => 'Chargement des médicaments en cours'}
      loadOptionsOnMenuOpen={false}
      loadOptions={async (inputValue) => {
        const options = await loadGeneric(inputValue);
        return {
          options,
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
            type: typeof ApiMedicament['type'] | typeof Medicament['type'];
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
              case Medicament.type:
                return Medicament;
              case ApiMedicament.type:
                return ApiMedicament;
              default:
                throw new Error(
                  "Impossible d'ajouter un médicament de type inconnu (Erreur 300)"
                );
            }
          })();

          onAdd(value, valueType);
        }
      }}
      placeholder={placeholder}
      reduceOptions={reduceGroupedOptions}
      value={null}
      {...reactSelectOptions}
    />
  );
};

export default Select;
