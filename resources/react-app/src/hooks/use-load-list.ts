import { useApi } from 'hooks/use-store';
import { groupBy, toString } from 'lodash-es';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import JsonApiStore from 'store/json-api';

export const loadGeneric = async (query: string, api: JsonApiStore) => {
  try {
    const response = await api.request<Medicament | ApiMedicament>(
      `generic/?query=${query}`
    );

    if (Array.isArray(response.data) && response.data.length > 0) {
      const grouped = groupBy(
        response.data.map((m) => ({
          value: toString(m.meta.id),
          label: m.denomination,
          type: m.meta.type,
        })),
        'type'
      );

      const options = [
        {
          label: 'Médicaments de plandeprise.fr',
          options: grouped[Medicament.type],
        },
        {
          label: 'Médicaments issus de la base de données publique',
          options: grouped[ApiMedicament.type],
        },
      ];

      return options;
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
