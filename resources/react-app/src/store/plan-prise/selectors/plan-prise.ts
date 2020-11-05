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

const selectPlanPrise = (state: IRedux.State) => state.planPrise.content;

export const selectPlanPriseContent = createSelector(
  [selectPlanPrise],
  (planPrise) => planPrise.data
);

export const selectMedicament = (
  state: IRedux.State,
  identifier: IModels.MedicamentIdentity
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
    | IExtractModel<IModels.Medicament>
    | IExtractModel<IModels.ApiMedicament>
): medicament is IExtractModel<IModels.Medicament> => {
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
      precautions: (get(medicament, 'precautions', []) as IExtractModel<
        IModels.Precaution
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

const isCreating = (
  content: IRedux.PlanPrise['content']
): content is {
  status: 'creating';
  data: IExtractModel<IModels.PlanPrise>;
} => {
  if (content.status === 'creating') {
    if (!isPlainObject(content.data))
      throw new Error(
        'Le contenu devrait être un objet lorsque le plan de prise est en cours de création'
      );
    return true;
  }
  return false;
};

const isDeleted = (
  content: IRedux.PlanPrise['content']
): content is { status: 'deleted'; data: undefined } => {
  if (content.status === 'deleted') {
    if (content.data !== undefined)
      throw new Error(
        'Le contenu devrait être vide lorsque le plan de prise est supprimé'
      );
    return true;
  }
  return false;
};

const isDeleting = (
  content: IRedux.PlanPrise['content']
): content is {
  status: 'deleting';
  data: IExtractModel<IModels.PlanPrise>;
} => {
  if (content.status === 'deleting') {
    if (!isPlainObject(content.data))
      throw new Error(
        'Le contenu devrait être un objet lorsque le plan de prise est en cours de suppression'
      );
    return true;
  }
  return false;
};

export const isLoaded = (
  content: IRedux.PlanPrise['content']
): content is { status: 'loaded'; data: IExtractModel<IModels.PlanPrise> } => {
  if (content.status === 'loaded') {
    if (!isPlainObject(content.data))
      throw new Error(
        'Le contenu devrait être un objet lorsque le plan de prise est chargé'
      );
    return true;
  }
  return false;
};

const isLoading = (
  content: IRedux.PlanPrise['content']
): content is { status: 'loading'; data: undefined } => {
  if (content.status === 'loading') {
    if (content.data !== undefined)
      throw new Error(
        'Le contenu devrait être vide lorsque le plan de prise est en cours de chargement'
      );
    return true;
  }
  return false;
};

const isNew = (content: IRedux.PlanPrise['content']) => {
  if (content.data?.id === 'new') return true;
  return false;
};

const isNotLoaded = (
  content: IRedux.PlanPrise['content']
): content is { status: 'not-loaded'; data: undefined } => {
  if (content.status === 'not-loaded') {
    if (content.data !== undefined)
      throw new Error(
        "Le plan de prise devrait être vide lorsqu'il n'est pas encore chargé"
      );
    return true;
  }
  return false;
};

export const selectPlanPriseStatus = createSelector(
  [selectPlanPrise, selectPlanPriseContent],
  (planPrise, planPriseContent) => {
    return {
      isCreating: isCreating(planPrise),
      isLoaded: isLoaded(planPrise),
      isLoading: isLoading(planPrise),
      isEmpty: get(planPriseContent, 'medic_data', []).length === 0,
      isDeleting: isDeleting(planPrise),
      isDeleted: isDeleted(planPrise),
      isNew: isNew(planPrise),
      isNotLoaded: isNotLoaded(planPrise),
    };
  }
);

export const makeUniqueSelectorInstance = () => selectContent;
