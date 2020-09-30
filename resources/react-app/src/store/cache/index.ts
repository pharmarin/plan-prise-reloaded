import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { find } from 'lodash';

const initialState: IReduxState.Cache = {
  medicaments: [],
};

const inCache = ({ id, type }: IMedicamentID, cache: IReduxState.Cache) => {
  return find(cache.medicaments, {
    id,
    type,
  });
};

const cacheSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    cache(state, { payload }: PayloadAction<IMedicament>) {
      if (!inCache({ id: payload.id, type: payload.type }, state))
        state.medicaments.push(payload);
    },
  },
});

export const { cache } = cacheSlice.actions;
export { inCache };
export default cacheSlice.reducer;
