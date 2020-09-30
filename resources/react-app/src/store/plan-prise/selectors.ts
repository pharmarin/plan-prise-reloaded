import { createSelector } from '@reduxjs/toolkit';
import useConfig from 'helpers/hooks/use-config';
import { typeToInt } from 'helpers/type-switcher';
import { filter, find, get, isNil, keyBy, keys, map } from 'lodash';

export const selectMedicament = (state: IReduxState, props: any) =>
  find(state.cache.medicaments, props.id);
const selectSettings = (state: IReduxState) =>
  get(state.planPrise, 'content.custom_settings', {});
const selectCustomData = (state: IReduxState) =>
  get(state.planPrise, 'content.custom_data', {});

const selectInputSettings = createSelector(
  selectSettings,
  (settings) => settings.inputs
);
const selectCheckedPosologies = createSelector(
  [selectInputSettings],
  (inputs) => {
    const posologies = useConfig('default.posologies');

    return filter(
      map(posologies, (p) =>
        get(inputs, `${p.id}.checked`, p.default) ? p : null
      )
    );
  }
);

const selectContent = createSelector(
  [selectMedicament, selectCustomData, selectCheckedPosologies],
  (medicament, customData, posologies) => {
    if (!medicament) return null;
    const uid = `${typeToInt(medicament.type)}-${medicament.id}`;

    const getValue = (customLocation: string, defaultLocation?: string) =>
      get(
        customData,
        `${uid}.${customLocation}`,
        defaultLocation ? get(medicament, defaultLocation, '') : ''
      );
    const conservationDuree = get(
      medicament,
      'attributes.conservation_duree',
      []
    );
    const customConservationDuree = get(
      customData,
      `${uid}.conservation_duree`
    );

    return {
      uid,
      indications: getValue(
        'custom_indications',
        'attributes.custom_indications'
      ),
      conservation_frigo: get(
        medicament.attributes,
        'conservation_frigo',
        false
      ),
      conservation_duree: {
        custom: !isNil(customConservationDuree),
        data:
          customConservationDuree || conservationDuree.length === 1
            ? (
                find(conservationDuree, {
                  laboratoire: customConservationDuree,
                }) || conservationDuree[0]
              ).duree || []
            : map(conservationDuree, 'laboratoire'),
      },
      posologies: keyBy(
        map(posologies, (p) => ({
          id: p.id,
          label: p.label,
          value: getValue(p.id),
        })),
        'id'
      ),
      precautions: map(get(medicament, 'attributes.precautions', []), (p) => ({
        ...p,
        checked: get(
          customData,
          `${uid}.precautions.${p.id}.checked`,
          p.population !== undefined
        ),
      })),
      custom_precautions: map(
        keys(get(customData, `${uid}.custom_precautions`, {})),
        (c) => ({
          id: c,
          commentaire: get(customData, `${uid}.custom_precautions.${c}`, ''),
        })
      ),
    };
  }
);

export const makeUniqueSelectorInstance = () => selectContent;
