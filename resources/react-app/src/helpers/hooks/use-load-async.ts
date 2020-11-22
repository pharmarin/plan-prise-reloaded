import axios from 'helpers/axios-clients';
import { groupBy, toString } from 'lodash-es';
import debounce from 'debounce-promise';

const loadGeneric = async (query: string) => {
  try {
    const response = await axios.get('/generic', {
      //cancelToken: this.axiosSourceOptions.token,
      params: {
        query: query,
      },
    });

    if (response.data.data.length > 0) {
      const grouped = groupBy(
        response.data.data.map((m: any) => ({
          value: toString(m.id),
          label: m.denomination,
          type: m.type,
        })),
        'type'
      );

      return [
        {
          label: 'Médicaments de plandeprise.fr',
          options: [...(grouped['medicaments'] || [])],
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
  }
};

const useLoadAsync = () => ({
  loadGeneric: debounce(loadGeneric, 1000),
});

export default useLoadAsync;
