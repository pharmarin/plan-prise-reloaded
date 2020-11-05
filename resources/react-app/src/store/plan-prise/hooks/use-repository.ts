import useConfig from 'helpers/hooks/use-config';
import { typeToInt } from 'helpers/type-switcher';
import { filter, find, get, keyBy, keys, map } from 'lodash';
import { useSelector } from 'react-redux';
import { isLoaded } from '../selectors/plan-prise';

const usePosologies = () => {
  const posologies = useConfig('default.posologies');
  const settings = useSelector((state: IRedux.State) =>
    get(state.planPrise.content, 'custom_settings.inputs', {})
  );

  return filter(
    map(posologies, (p) =>
      get(settings, `${p.id}.checked`, p.default) ? p : null
    )
  );
};

const switchVoiesAdministration = (voie: number) => {
  switch (voie) {
    case 1:
      return 'Orale';
    case 2:
      return 'Cutanée';
    case 3:
      return 'Auriculaire';
    case 4:
      return 'Nasale';
    case 5:
      return 'Inhalée';
    case 6:
      return 'Vaginale';
    case 7:
      return 'Oculaire';
    case 8:
      return 'Rectale';
    case 9:
      return 'Sous-cutanée';
    case 10:
      return 'Intra-musculaire';
    case 11:
      return 'Intra-veineux';
    case 12:
      return 'Intra-urétrale';
    default:
      return 'Inconnue';
  }
};

export default () => {
  const cache = useSelector<IRedux.State, any>(
    (state) => state.cache.medicaments
  );

  const content = useSelector<IRedux.State, IRedux.PlanPrise['content']>(
    (state) => state.planPrise.content
  );

  const id = useSelector<IRedux.State, string | undefined>(
    (state) => state.planPrise.content.data?.id
  );

  const customData = useSelector<IRedux.State>((state) =>
    get(state.planPrise, 'content.custom_data', {})
  );

  const posologies = usePosologies();

  const getContent = (): Repositories.PlanPriseRepository => ({
    id,
    status: content.status,
    data: isLoaded(content)
      ? map(content.data.medicaments, (m) => {
          const id = { id: m?.id, type: m?.type };
          const uid = `${typeToInt(id.type)}-${id.id}`;

          const medicament = find<Models.ApiMedicament | Models.Medicament>(
            cache,
            id
          );

          if (!medicament)
            // TODO: Utiliser la valeur loading ?
            throw new Error(
              "Impossible de construire le tableau alors qu'un médicament n'est pas chargé. "
            );

          const getValue = (customLocation: string, defaultLocation?: string) =>
            get(
              customData,
              `${uid}.${customLocation}`,
              defaultLocation ? get(medicament, defaultLocation, '') : ''
            );

          const conservationDuree = get(medicament, 'conservation_duree', []);
          const customConservationDuree = find(conservationDuree, {
            laboratoire: get(customData, `${uid}.conservation_duree`),
          });

          return {
            id: medicament.id,
            type: medicament.type,
            data: {
              denomination: get(medicament, 'denomination', ''),
              composition: map(
                get(medicament, 'composition', []),
                'denomination'
              ),
            },
            attributes: {
              indications: getValue('indications', 'indications'),
              conservation_frigo: get(medicament, 'conservation_frigo', false),
              conservation_duree: {
                custom: customConservationDuree !== undefined,
                data:
                  customConservationDuree || conservationDuree.length === 1
                    ? (customConservationDuree || conservationDuree[0]).duree
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
              precautions: map(get(medicament, 'precautions', []), (p) => ({
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
                  commentaire: get(
                    customData,
                    `${uid}.custom_precautions.${c}`,
                    ''
                  ),
                })
              ),
              voies_administration: map(
                get(medicament, 'voies_administration', []),
                (va) => switchVoiesAdministration(va)
              ),
            },
          };
        })
      : undefined,
  });

  return { getContent, switchVoiesAdministration };
};
