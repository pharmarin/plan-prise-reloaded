import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: Redux.Cache = {
  medicaments: [],
};

const inCache = (
  { id, type }: Models.MedicamentIdentity,
  cache: Redux.Cache
) => {
  return cache.medicaments.find((i) => i.type === type && i.id === id);
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
        Models.Medicament.Extracted | Models.ApiMedicament.Extracted
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
