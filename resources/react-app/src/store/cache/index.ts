import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { find } from 'lodash-es';

const initialState: IRedux.Cache = {
  medicaments: [],
};

const inCache = (
  { id, type }: Models.MedicamentIdentity,
  cache: IRedux.Cache
) => {
  return find(cache.medicaments, {
    id,
    type,
  });
};

const cacheSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    cache(
      state,
      {
        payload,
      }: PayloadAction<
        ExtractModel<Models.Medicament> | ExtractModel<Models.ApiMedicament>
      >
    ) {
      if (!inCache({ id: payload.id, type: payload.type }, state))
        state.medicaments.push(payload);
    },
  },
});

export const { cache } = cacheSlice.actions;
export { inCache };
export default cacheSlice.reducer;
