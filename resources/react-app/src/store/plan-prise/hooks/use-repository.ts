import useConfig from 'helpers/hooks/use-config';
import { typeToInt } from 'helpers/type-switcher';
import { filter, find, get, keyBy, keys, map } from 'lodash';
import { useSelector } from 'react-redux';
import { checkLoaded } from '..';

const usePosologies = () => {
  const posologies = useConfig('default.posologies');
  const settings = useSelector((state: IReduxState) =>
    get(state.planPrise.content, 'custom_settings.inputs', {})
  );

  return filter(
    map(posologies, (p) =>
      get(settings, `${p.id}.checked`, p.default) ? p : null
    )
  );
};

const switchStatus = (content: IReduxState.PlanPrise['content']) => {
  if (content === null) {
    return 'not-loaded';
  }
  if (checkLoaded(content)) {
    return 'loaded';
  }
  return content;
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

export default (): IPlanPriseRepository => {
  const cache = useSelector<IReduxState, any>(
    (state) => state.cache.medicaments
  );
  const content = useSelector<IReduxState, IReduxState.PlanPrise['content']>(
    (state) => state.planPrise.content
  );
  const id = useSelector<IReduxState, number | null>(
    (state) => state.planPrise.id
  );
  const customData = useSelector<IReduxState>((state) =>
    get(state.planPrise, 'content.custom_data', {})
  );
  const posologies = usePosologies();
  const status = switchStatus(content);
  return {
    id: id || 0,
    status,
    data: checkLoaded(content)
      ? map<IMedicamentID, IMedicamentRepository>(content.medic_data, (m) => {
          const id = { id: m?.id, type: m?.type };
          const uid = `${typeToInt(id.type)}-${id.id}`;

          const medicament = find<IMedicament>(cache, id);

          if (!medicament)
            throw new Error(
              "Impossible de construire le tableau alors qu'un médicament n'est pas chargé. "
            );

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
          const customConservationDuree = find(conservationDuree, {
            laboratoire: get(customData, `${uid}.conservation_duree`),
          });

          return {
            id: medicament.id,
            type: medicament.type,
            data: {
              denomination: get(medicament.attributes, 'denomination', ''),
              compositions: map(
                get(medicament.attributes, 'compositions', []),
                'denomination'
              ),
            },
            attributes: {
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
              precautions: map(
                get(medicament, 'attributes.precautions', []),
                (p) => ({
                  ...p,
                  checked: get(
                    customData,
                    `${uid}.precautions.${p.id}.checked`,
                    p.population !== undefined
                  ),
                })
              ),
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
                medicament.attributes.voies_administration || [],
                (va) => switchVoiesAdministration(va)
              ),
            },
          };
        })
      : undefined,
  };
};
