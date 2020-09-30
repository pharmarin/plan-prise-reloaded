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

const loadContent = createAsyncThunk<
  IPlanPriseContent,
  IPlanPriseID,
  { state: IReduxState }
>('planPrise/loadContent', async (id, { dispatch, getState }) => {
  const response = await axios.get(`/plan-prise/${id}?include=medicaments`);
  const state = getState();
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
});

const loadItem = createAsyncThunk<
  boolean,
  IMedicamentID,
  { state: IReduxState }
>(
  'planPrise/loadItem',
  async ({ id, type }, { dispatch, getState, rejectWithValue }) => {
    return await axios
      .get(`/${type}/${id}`)
      .then((response) => {
        const data = response.data.data;
        const state = getState();
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
  boolean | IPlanPriseID,
  { id: IPlanPriseID; action: 'delete' }
>('planPrise/manage', async ({ id, action }) => {
  switch (action) {
    case 'delete':
      await axios.delete(`/plan-prise/${id}`);
  }
  return false;
});

const initialState: IReduxState.PlanPrise = {
  id: null,
  list: null,
  content: null,
};

const isDeleted = (
  content: IReduxState.PlanPrise['content']
): content is 'deleted' => {
  if (content === 'deleted') return true;
  return false;
};

const isDeleting = (
  content: IReduxState.PlanPrise['content']
): content is 'deleting' => {
  if (content === 'deleting') return true;
  return false;
};

const isError = (
  content: IReduxState.PlanPrise['content']
): content is 'error' => {
  if (content === 'error') return true;
  return false;
};

const isLoaded = (
  content: IReduxState.PlanPrise['content']
): content is IPlanPriseContent => {
  if (isPlainObject(content)) return true;
  return false;
};

const isLoading = (
  content: IReduxState.PlanPrise['content']
): content is 'loading' => {
  if (content === 'loading') return true;
  return false;
};

const isNotLoaded = (
  content: IReduxState.PlanPrise['content']
): content is null => {
  if (content === null) return true;
  return false;
};

const ppSlice = createSlice({
  name: 'planPrise',
  initialState,
  reducers: {
    addItem: (state, { payload }: PayloadAction<IMedicamentID>) => {
      if (isLoaded(state.content)) {
        if (!find(state.content.medic_data, payload))
          state.content.medic_data.push({
            id: payload.id,
            type: payload.type,
          });
      }
    },
    removeItem: (state, { payload }: PayloadAction<IMedicamentID>) => {
      if (isLoaded(state.content)) {
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
      { payload }: PayloadAction<{ id: IMedicamentID; status: boolean }>
    ) => {
      if (isLoaded(state.content)) {
        const index = findIndex(state.content.medic_data, payload.id);
        if (payload.status === true) {
          state.content.medic_data[index].loading = payload.status;
        } else {
          unset(state.content.medic_data, `${index}.loading`);
        }
      }
    },
    setId: (state, { payload }: PayloadAction<number | null>) => {
      if (payload && state.id === -1 && isLoaded(state.content)) {
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
      if (isLoaded(state.content))
        set(state.content, `custom_settings.${payload.id}`, payload.value);
    },
    setValue: (
      state,
      { payload }: PayloadAction<{ id: string; value: any }>
    ) => {
      if (isLoaded(state.content))
        set(state.content, `custom_data.${payload.id}`, payload.value);
    },
    removeValue: (state, { payload }: PayloadAction<{ id: string }>) => {
      if (isLoaded(state.content))
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
export {
  isDeleted,
  isDeleting,
  isError,
  isLoaded,
  isLoading,
  isNotLoaded,
  loadContent,
  loadItem,
  loadList,
  manage,
};
export default ppSlice.reducer;
