import { createSelector } from '@reduxjs/toolkit';
import useConfig from 'helpers/hooks/use-config';
import { typeToInt } from 'helpers/type-switcher';
import { filter, find, get, isNil, keyBy, keys, map } from 'lodash';

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

const selectSettings = createSelector(
  [selectPlanPriseContent],
  (planPriseContent) => get(planPriseContent, 'custom_settings', {})
);

const selectCustomData = createSelector(
  [selectPlanPriseContent],
  (planPriseContent) => get(planPriseContent, 'custom_data', {})
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

const isMedicament = (
  medicament:
    | ExtractModel<Models.Medicament>
    | ExtractModel<Models.ApiMedicament>
): medicament is ExtractModel<Models.Medicament> => {
  if (medicament.type === 'medicaments') return true;
  return false;
};

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

    const conservationDuree = get(medicament, 'conservation_duree', []);

    const customConservationDuree = get(
      customData,
      `${uid}.conservation_duree`
    );

    return {
      uid,
      indications: isMedicament(medicament)
        ? getValue('indications', 'indications')
        : [],
      conservation_frigo: get(medicament, 'conservation_frigo', false),
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
      precautions: (get(medicament, 'precautions', []) as ExtractModel<
        Models.Precaution
      >[]).map((p) => ({
        ...p,
        commentaire:
          get(customData, `${uid}.precautions[${p.id}]commentaire`) ||
          p.commentaire,
        checked: get(
          customData,
          `${uid}.precautions[${p.id}]checked`,
          p.population !== undefined
        ),
      })),
      custom_precautions: map(
        keys(get(customData, `${uid}.custom_precautions`, {})),
        (c) => ({
          id: c,
          commentaire: get(customData, `${uid}.custom_precautions[${c}]`, ''),
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
