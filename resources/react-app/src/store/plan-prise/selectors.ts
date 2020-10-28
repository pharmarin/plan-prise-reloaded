import { createSelector } from '@reduxjs/toolkit';
import useConfig from 'helpers/hooks/use-config';
import { typeToInt } from 'helpers/type-switcher';
import {
  filter,
  find,
  get,
  isNil,
  isPlainObject,
  keyBy,
  keys,
  map,
} from 'lodash';

export const selectPlanPriseContent = (state: IRedux.State) =>
  state.planPrise.content;
export const selectMedicament = (state: IRedux.State, props: any) =>
  find(state.cache.medicaments, props.id);
const selectSettings = createSelector(
  [selectPlanPriseContent],
  (planPriseContent) => get(planPriseContent, 'custom_settings', {})
);
const selectCustomData = createSelector(
  [selectPlanPriseContent],
  (planPriseContent) => get(planPriseContent, 'custom_data', {})
);

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

const isDeleted = (
  content: IRedux.PlanPrise['content']
): content is 'deleted' => {
  if (content === 'deleted') return true;
  return false;
};

const isDeleting = (
  content: IRedux.PlanPrise['content']
): content is 'deleting' => {
  if (content === 'deleting') return true;
  return false;
};

const isError = (content: IRedux.PlanPrise['content']): content is 'error' => {
  if (content === 'error') return true;
  return false;
};

export const isLoaded = (
  content: IRedux.PlanPrise['content']
): content is IPlanPriseContent => {
  if (isPlainObject(content)) {
    return true;
  }
  return false;
};

const isLoading = (
  content: IRedux.PlanPrise['content']
): content is 'loading' => {
  if (content === 'loading') return true;
  return false;
};

const isNotLoaded = (content: IRedux.PlanPrise['content']): content is null => {
  if (content === null) return true;
  return false;
};

export const selectStatus = createSelector(
  [selectPlanPriseContent],
  (planPriseContent) => {
    return {
      isLoaded: isLoaded(planPriseContent),
      isLoading: isLoading(planPriseContent),
      isEmpty: get(planPriseContent, 'medic_data', []).length === 0,
      isError: isError(planPriseContent),
      isDeleting: isDeleting(planPriseContent),
      isDeleted: isDeleted(planPriseContent),
      isNotLoaded: isNotLoaded(planPriseContent),
    };
  }
);

export const makeUniqueSelectorInstance = () => selectContent;
