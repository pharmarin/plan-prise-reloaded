import { createSelector } from '@reduxjs/toolkit';
import useConfig from 'helpers/hooks/use-config';
import { typeToInt } from 'helpers/type-switcher';
import { filter, find, get, isArray, isNil, keyBy, keys, map } from 'lodash';

const castArray = (value: any) => (isArray(value) ? value : [value]);

const selectPlanPrise = (state: IRedux.State) => state.planPrise.content;

export const selectPlanPriseContent = createSelector(
  [selectPlanPrise],
  (planPrise) => planPrise.data
);

const selectPlanPriseStatus = createSelector(
  [selectPlanPrise],
  (planPrise) => planPrise.status
);

export const selectMedicament = (
  state: IRedux.State,
  identifier: Models.MedicamentIdentity
) =>
  find(state.cache.medicaments, identifier) as
    | IRedux.State['cache']['medicaments'][0]
    | undefined;

const selectUID = createSelector([selectMedicament], (medicament) =>
  medicament ? `${typeToInt(medicament.type)}-${medicament.id}` : ''
);

const selectSettings = createSelector(
  [selectPlanPriseContent],
  (planPriseContent) => planPriseContent?.custom_settings || {}
);

const selectCustomData = createSelector(
  [selectPlanPriseContent, selectUID],
  (planPriseContent, uid) => get(planPriseContent, `custom_data.${uid}`, {})
);

const selectInputSettings = createSelector(selectSettings, (settings) =>
  get(settings, 'inputs', {})
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
  [selectMedicament, selectUID, selectCustomData, selectCheckedPosologies],
  (medicament, uid, customData, posologies) => {
    if (!medicament) return null;

    const getValue = (customLocation: string, defaultLocation?: string) =>
      get(
        customData,
        customLocation,
        defaultLocation ? get(medicament, defaultLocation, '') : ''
      );

    if (medicament.type === 'api-medicaments') {
      return {
        uid,
        denomination: medicament.denomination,
      };
    }

    return {
      uid,
      indications: castArray(getValue('indications', 'indications')),
      conservation_frigo: medicament.conservation_frigo || false,
      conservation_duree: {
        custom: !isNil(customData.conservation_duree),
        data: customData.conservation_duree
          ? (
              find(medicament.conservation_duree, {
                laboratoire: customData.conservation_duree,
              }) || medicament.conservation_duree[0]
            ).duree || []
          : map(medicament.conservation_duree, 'laboratoire') || [],
      },
      posologies: keyBy(
        map(posologies, (p) => ({
          id: p.id,
          label: p.label,
          value: getValue(p.id),
        })),
        'id'
      ),
      precautions: (medicament.precautions || []).map((p) => {
        const customChecked = customData.precautions?.[p.id]?.checked;

        return {
          ...p,
          commentaire:
            customData.precautions?.[p.id]?.commentaire || p.commentaire || '',
          checked:
            customChecked === undefined
              ? p.population !== undefined
              : customChecked, // Si on utilise customChecked || defaultValue, on se retrouve avec defaultValue si customChecked est false
        };
      }),
      custom_precautions: map(
        keys(customData.custom_precautions || {}),
        (c) => ({
          id: c,
          commentaire: customData.custom_precautions?.[c] || '',
        })
      ),
    };
  }
);

const selectPlanPriseContentLength = createSelector(
  [selectPlanPriseContent],
  (planPriseContent) => (planPriseContent?.medicaments || []).length
);

export const selectPlanPriseID = createSelector(
  [selectPlanPriseContent],
  (planPriseContent) => planPriseContent?.id
);

export const selectPlanPriseState = createSelector(
  [selectPlanPriseStatus, selectPlanPriseContentLength, selectPlanPriseID],
  (planPriseStatus, planPriseContentLength, planPriseID) => {
    return {
      isCreating: planPriseStatus === 'creating',
      isLoaded: planPriseStatus === 'loaded',
      isLoading: planPriseStatus === 'loading',
      isEmpty: planPriseContentLength === 0,
      isDeleting: planPriseStatus === 'deleting',
      isDeleted: planPriseStatus === 'deleted',
      isNew: planPriseID === 'new',
      isNotLoaded: planPriseStatus === 'not-loaded',
    };
  }
);

export const makeUniqueSelectorInstance = () => selectContent;
