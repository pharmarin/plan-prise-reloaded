import { createSelector } from '@reduxjs/toolkit';
import useConfig from 'helpers/hooks/use-config';
import { typeToInt } from 'helpers/type-switcher';
import switchVoiesAdministration from 'helpers/switch-voie-administration';
import { get } from 'lodash-es';

const castArray = (value: any) => (Array.isArray(value) ? value : [value]);

const selectPlanPrise = (state: Redux.State) => state.planPrise.content;

export const selectPlanPriseData = createSelector(
  [selectPlanPrise],
  (planPrise) => planPrise.data
);

const selectPlanPriseStatus = createSelector(
  [selectPlanPrise],
  (planPrise) => planPrise.status
);

export const selectMedicament = (
  state: Redux.State,
  identifier: Models.MedicamentIdentity
) =>
  state.cache.medicaments.find(
    (i) => i.id === identifier.id && i.type === identifier.type
  ) as Redux.State['cache']['medicaments'][0] | undefined;

const selectUID = createSelector([selectMedicament], (medicament) =>
  medicament ? `${typeToInt(medicament.type)}-${medicament.id}` : ''
);

const selectSettings = createSelector(
  [selectPlanPriseData],
  (planPriseData) => planPriseData?.custom_settings || {}
);

const selectCustomData = createSelector(
  [selectPlanPriseData, selectUID],
  (planPriseData, uid) => get(planPriseData, `custom_data.${uid}`, {})
);

const selectInputSettings = createSelector(selectSettings, (settings) =>
  get(settings, 'inputs', {})
);

const selectCheckedPosologies = createSelector(
  [selectInputSettings],
  (inputs) => {
    const posologies = useConfig('default.posologies') as Models.Posologie[];

    return posologies
      .map((p) => (inputs?.[p.id]?.checked || p.default ? p : null))
      .filter((i): i is Models.Posologie => i !== null);
  }
);

const selectMedicamentContent = createSelector(
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
      composition: ('composition' in medicament ? medicament.composition : [])
        .map(
          (composant: ExtractModel<Models.PrincipeActif>) =>
            composant.denomination
        )
        .join(' + '),
      voies_administration: medicament.voies_administration.map((va) =>
        switchVoiesAdministration(va)
      ),
      conservation_frigo: medicament.conservation_frigo || false,
      conservation_duree: {
        custom:
          customData.conservation_duree !== null &&
          customData.conservation_duree !== undefined,
        data:
          medicament.conservation_duree.length === 1
            ? [medicament.conservation_duree[0].duree]
            : customData.conservation_duree
            ? [
                (
                  medicament.conservation_duree.find(
                    (i) => i.laboratoire === customData.conservation_duree
                  ) || medicament.conservation_duree[0]
                ).duree,
              ] || []
            : medicament.conservation_duree.map((i) => i.laboratoire) || [],
      },
      posologies: posologies.map((value) => ({
        id: value?.id,
        label: value?.label,
        value: getValue(value?.id || ''),
      })),
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
      custom_precautions: Object.entries(
        customData.custom_precautions || {}
      ).map(([id, commentaire]) => ({
        id,
        commentaire: commentaire || '',
      })),
    };
  }
);

const selectPlanPriseContentLength = createSelector(
  [selectPlanPriseData],
  (planPriseData) => (planPriseData?.medicaments || []).length
);

export const selectPlanPriseID = createSelector(
  [selectPlanPriseData],
  (planPriseData) => planPriseData?.id
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

export const selectPlanPriseColumns = createSelector(
  [selectCheckedPosologies],
  (posologies) => [
    { id: 'informations', label: 'Médicament' },
    { id: 'conservation', label: 'Conservation' },
    ...posologies.map((p) => ({
      id: p?.id,
      label: p?.label,
    })),
    { id: 'precautions', label: "Conseils d'utilisation" },
  ]
);

export const makeUniqueSelectorInstance = () => selectMedicamentContent;
