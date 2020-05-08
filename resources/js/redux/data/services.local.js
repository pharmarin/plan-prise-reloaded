import isArray from 'lodash/isArray';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import set from 'lodash/set';

export default (state, medicaments) => {
  const medicamentsArray = isArray(medicaments)
    ? medicaments
    : [medicaments];

  forEach(medicamentsArray, (medicament) => {
    // const medicament = { ...medicament, ...medicament.value };
    const key = findIndex(state.data, {
      id: medicament.value.id,
      type: medicament.type,
    });

    if (key === -1) {
      state.data.push({
        ...state.empty,
        ...medicament.value, // id + denomination
        type: medicament.type,
        data: medicament.data,
      });
    } else {
      set(state, `data.${key}.data`, medicament.data);
    }
  });

  return state;
};
