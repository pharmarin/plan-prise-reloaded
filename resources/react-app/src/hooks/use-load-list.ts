import { useApi } from 'hooks/use-store';
import { groupBy, toString } from 'lodash-es';
import JsonApiStore from 'store/json-api';

export const loadGeneric = async (query: string, api: JsonApiStore) => {
  try {
    const response = await api.request(`/generic/?query=${query}`);

    if (Array.isArray(response.data) && response.data.length > 0) {
      const grouped = groupBy(
        response.data.map((m: any) => ({
          value: toString(m.id),
          label: m.denomination,
          type: m.type,
        })),
        'type'
      );

      return [
        {
          label: 'Médicaments de plandeprise.fr',
          options: grouped['medicaments'],
        },
        {
          label: 'Médicaments issus de la base de données publique',
          options: grouped['api-medicaments'],
        },
      ];
    }
    return [];
  } catch (thrown) {
    console.log(thrown);
    return [];
  }
};

const useLoadList = () => {
  const api = useApi();

  return {
    loadGeneric: (query: string) => loadGeneric(query, api),
  };
};

export default useLoadList;
