import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'helpers/axios-clients';
import { cache, inCache } from 'store/cache';
import {
  find,
  findIndex,
  forEach,
  get,
  isArray,
  isPlainObject,
  map,
  remove,
  set,
  unset,
} from 'lodash';
import { typeToInt } from 'helpers/type-switcher';

const loadList = createAsyncThunk<number[]>('planPrise/loadList', async () => {
  const response = await axios.get('/plan-prise');
  return map(response.data.data, (pp: any) => pp.attributes['pp-id']);
});

const loadContent = createAsyncThunk<PlanPriseContent, PlanPriseID>(
  'planPrise/loadContent',
  async (id, { dispatch, getState }) => {
    const response = await axios.get(`/plan-prise/${id}?include=medicaments`);
    const state = getState() as ReduxState;
    forEach(get(response, 'data.included', []), (medicament) => {
      if (!inCache({ id: medicament.id, type: medicament.type }, state.cache))
        dispatch(cache(medicament));
    });
    const data = response.data.data;
    return {
      id: Number(data.attributes['pp-id']),
      medic_data: isArray(data.relationships.medicaments.data)
        ? data.relationships.medicaments.data
        : [],
      custom_data: isPlainObject(data.attributes['custom-data'])
        ? data.attributes['custom-data']
        : {},
      custom_settings: isPlainObject(data.attributes['custom-settings'])
        ? data.attributes['custom-settings']
        : {},
    };
  }
);

const loadItem = createAsyncThunk<boolean, MedicamentID>(
  'planPrise/loadItem',
  async ({ id, type }, { dispatch, getState, rejectWithValue }) => {
    return await axios
      .get(`/${type}/${id}`)
      .then((response) => {
        const data = response.data.data;
        const state = getState() as ReduxState;
        if (!inCache({ id, type }, state.cache)) {
          dispatch(
            cache({ id: data.id, type: data.type, attributes: data.attributes })
          );
        }
        return true;
      })
      .catch((error) => {
        console.log(error);
        dispatch(removeItem({ id, type }));
        return rejectWithValue(false);
      });
  }
);

const manage = createAsyncThunk<
  boolean | PlanPriseID,
  { id: PlanPriseID; action: 'delete' }
>('planPrise/manage', async ({ id, action }) => {
  switch (action) {
    case 'delete':
      await axios.delete(`/plan-prise/${id}`);
  }
  return false;
});

const initialState: ReduxState.PlanPrise = {
  id: null,
  list: null,
  content: null,
};

const checkLoaded = (
  content:
    | null
    | 'loading'
    | 'error'
    | 'deleting'
    | 'deleted'
    | PlanPriseContent
): content is PlanPriseContent => {
  if (
    content !== null &&
    content !== 'error' &&
    content !== 'loading' &&
    content !== 'deleting' &&
    content !== 'deleted'
  )
    return true;
  return false;
};

const ppSlice = createSlice({
  name: 'planPrise',
  initialState,
  reducers: {
    addItem: (state, { payload }: PayloadAction<MedicamentID>) => {
      if (checkLoaded(state.content)) {
        if (!find(state.content.medic_data, payload))
          state.content.medic_data.push({
            id: payload.id,
            type: payload.type,
          });
      }
    },
    removeItem: (state, { payload }: PayloadAction<MedicamentID>) => {
      if (checkLoaded(state.content)) {
        remove(state.content.medic_data, {
          id: payload.id,
          type: payload.type,
        });
        unset(
          state.content,
          `custom_data.${typeToInt(payload.type)}-${payload.id}`
        );
      }
    },
    setLoading: (
      state,
      { payload }: PayloadAction<{ id: MedicamentID; status: boolean }>
    ) => {
      if (checkLoaded(state.content)) {
        const index = findIndex(state.content.medic_data, payload.id);
        if (payload.status === true) {
          state.content.medic_data[index].loading = payload.status;
        } else {
          unset(state.content.medic_data, `${index}.loading`);
        }
      }
    },
    setId: (state, { payload }: PayloadAction<number | null>) => {
      if (payload && state.id === -1 && checkLoaded(state.content)) {
        return {
          ...initialState,
          content: { ...state.content, id: payload },
          id: payload || null,
          list: state.list,
        };
      }
      return {
        ...initialState,
        content:
          payload === -1
            ? {
                id: -1,
                custom_data: {},
                custom_settings: {},
                medic_data: [],
              }
            : initialState.content,
        id: payload || null,
        list: state.list,
      };
    },
    setSettings: (
      state,
      { payload }: PayloadAction<{ id: string; value: any }>
    ) => {
      if (checkLoaded(state.content))
        set(state.content, `custom_settings.${payload.id}`, payload.value);
    },
    setValue: (
      state,
      { payload }: PayloadAction<{ id: string; value: any }>
    ) => {
      if (checkLoaded(state.content))
        set(state.content, `custom_data.${payload.id}`, payload.value);
    },
    removeValue: (state, { payload }: PayloadAction<{ id: string }>) => {
      if (checkLoaded(state.content))
        unset(state.content, `custom_data.${payload.id}`);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadList.pending, (state) => {
      state.list = 'loading';
    });
    builder.addCase(loadList.rejected, (state) => {
      state.list = 'error';
    });
    builder.addCase(loadList.fulfilled, (state, { payload }) => {
      if (isArray(payload)) {
        state.list = payload;
      } else {
        state.list = 'error';
      }
    });
    builder.addCase(loadContent.pending, (state) => {
      state.content = 'loading';
    });
    builder.addCase(loadContent.rejected, (state) => {
      state.content = 'error';
    });
    builder.addCase(loadContent.fulfilled, (state, { payload }) => {
      state.content = payload;
    });
    /*builder.addCase(loadItem.pending, (state) => {});*/
    /*builder.addCase(loadItem.rejected, (state) => {});*/
    /*builder.addCase(loadItem.fulfilled, (state) => {});*/
    builder.addCase(manage.pending, (state) => {
      state.content = 'deleting';
    });
    /*builder.addCase(manage.rejected, (state) => {});*/
    builder.addCase(manage.fulfilled, (state) => {
      state.content = 'deleted';
    });
  },
});

export const {
  addItem,
  removeItem,
  removeValue,
  setId,
  setLoading,
  setSettings,
  setValue,
} = ppSlice.actions;
export { checkLoaded, loadContent, loadItem, loadList, manage };
export default ppSlice.reducer;
