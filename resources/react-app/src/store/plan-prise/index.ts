import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'helpers/axios-clients';
import { cache, inCache } from 'store/cache';
import {
  find,
  findIndex,
  forEach,
  get,
  isArray,
  map,
  remove,
  set,
  unset,
} from 'lodash';
import { typeToInt } from 'helpers/type-switcher';
import { isLoaded } from './selectors/plan-prise';
import { normalizeOne, requestUrl } from 'helpers/hooks/use-json-api';

const loadList = createAsyncThunk<IModels.PlanPrise['id'][]>(
  'planPrise/loadList',
  async () => {
    const response = await axios.get<IServerResponse<IModels.PlanPrise[]>>(
      requestUrl('plan-prises', {
        fields: {
          'plan-prises': ['id', 'type'],
        },
        sort: '-id',
      }).url
    );
    return map(response.data.data, (p) => p.id);
  }
);

const loadContent = createAsyncThunk<
  IExtractModel<IModels.PlanPrise>,
  IModels.PlanPrise['id'],
  { state: IRedux.State }
>('planPrise/loadContent', async (id, { dispatch, getState }) => {
  const response = await axios.get<IServerResponse<IModels.PlanPrise>>(
    requestUrl('plan-prises', {
      id: id,
      include: [
        'medicaments',
        'medicaments.bdpm',
        'medicaments.composition',
        'medicaments.precautions',
      ],
    }).url
  );

  const state = getState();

  forEach(get(response, 'data.included', []), (included) => {
    if (included.type !== 'medicaments' && included.type !== 'api-medicaments')
      return;

    if (!inCache({ id: included.id, type: included.type }, state.cache))
      dispatch(
        cache(
          normalizeOne({ id: included.id, type: included.type }, response.data)
        )
      );
  });

  const data = normalizeOne({ id, type: 'plan-prises' }, response.data);

  if (!data) throw new Error('Impossible de charger le plan de prise ' + id);

  return data;
});

const loadItem = createAsyncThunk<
  boolean,
  IModels.MedicamentIdentity,
  { state: IRedux.State }
>(
  'planPrise/loadItem',
  async ({ id, type }, { dispatch, getState, rejectWithValue }) => {
    return await axios
      .get(
        requestUrl(type, {
          id,
          include: ['bdpm', 'composition', 'precautions'],
        }).url
      )
      .then((response) => {
        const state = getState();

        if (!inCache({ id, type }, state.cache)) {
          dispatch(cache(normalizeOne({ id, type }, response.data)));
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
>('planPrise/manage', async ({ id, action }, { dispatch }) => {
  switch (action) {
    case 'delete':
      await axios.delete(`/plan-prise/${id}`);
      dispatch(loadList());
      return true;
  }
  return false;
});

const initialState: IRedux.PlanPrise = {
  id: null,
  list: {
    status: 'not-loaded',
  },
  content: {
    status: 'not-loaded',
  },
};

const ppSlice = createSlice({
  name: 'planPrise',
  initialState,
  reducers: {
    addItem: (
      state,
      { payload }: PayloadAction<IModels.MedicamentIdentity>
    ) => {
      if (isLoaded(state.content)) {
        if (!find(state.content.data.medicaments, payload))
          state.content.data.medicaments.push({
            id: payload.id,
            type: payload.type,
            relationshipNames: [],
          });
      }
    },
    removeItem: (
      state,
      { payload }: PayloadAction<IModels.MedicamentIdentity>
    ) => {
      if (isLoaded(state.content)) {
        remove(state.content.data.medicaments, {
          id: payload.id,
          type: payload.type,
        });
        unset(
          state.content.data,
          `custom_data.${typeToInt(payload.type)}-${payload.id}`
        );
      }
    },
    setLoading: (
      state,
      {
        payload,
      }: PayloadAction<{ id: IModels.MedicamentIdentity; status: boolean }>
    ) => {
      if (isLoaded(state.content)) {
        const index = findIndex(state.content.data.medicaments, payload.id);
        if (payload.status === true) {
          (state.content.data.medicaments[
            index
          ] as IModels.MedicamentIdentityWithLoading).loading = payload.status;
        } else {
          unset(state.content.data.medicaments, `${index}.loading`);
        }
      }
    },
    setId: (state, { payload }: PayloadAction<number | null>) => {
      if (payload && state.id === -1 && isLoaded(state.content)) {
        return {
          ...initialState,
          content: {
            data: { ...state.content.data, id: String(payload) },
            status: state.content.status,
          },
          id: payload || null,
          list: state.list,
        };
      }
      return {
        ...initialState,
        /*content:
          payload === -1
            ? {
                id: -1,
                custom_data: {},
                custom_settings: {},
                medic_data: [],
              }
            : initialState.content,*/
        id: payload || null,
        list: state.list,
      };
    },
    setSettings: (
      state,
      { payload }: PayloadAction<{ id: string; value: any }>
    ) => {
      if (isLoaded(state.content))
        set(state.content.data, `custom_settings.${payload.id}`, payload.value);
    },
    setValue: (
      state,
      { payload }: PayloadAction<{ id: string; value: any }>
    ) => {
      if (isLoaded(state.content))
        set(state.content.data, `custom_data.${payload.id}`, payload.value);
    },
    removeValue: (state, { payload }: PayloadAction<{ id: string }>) => {
      if (isLoaded(state.content))
        unset(state.content.data, `custom_data.${payload.id}`);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadList.pending, (state) => {
      state.list.status = 'loading';
    });
    builder.addCase(loadList.rejected, (state) => {
      state.list.status = 'not-loaded';
      throw new Error(
        'Impossible de charger la liste des plans de prise associés à votre compte'
      );
    });
    builder.addCase(
      loadList.fulfilled,
      (state, { payload }: PayloadAction<IModels.PlanPrise['id'][]>) => {
        if (isArray(payload)) {
          state.list.data = payload;
          state.list.status = 'loaded';
        } else {
          throw new Error(
            'Impossible de charger la liste des plans de prise associés à votre compte'
          );
        }
      }
    );
    builder.addCase(loadContent.pending, (state) => {
      state.content.status = 'loading';
    });
    builder.addCase(loadContent.rejected, (state) => {
      state.content.status = 'not-loaded';
      throw new Error('Impossible de charger le plan de prise');
    });
    builder.addCase(loadContent.fulfilled, (state, { payload }) => {
      state.content.data = payload;
      state.content.status = 'loaded';
    });
    /*builder.addCase(loadItem.pending, (state) => {});*/
    /*builder.addCase(loadItem.rejected, (state) => {});*/
    /*builder.addCase(loadItem.fulfilled, (state) => {});*/
    builder.addCase(manage.pending, (state) => {
      state.content.data = undefined;
      state.content.status = 'deleting';
    });
    /*builder.addCase(manage.rejected, (state) => {});*/
    builder.addCase(manage.fulfilled, (state) => {
      state.content.data = undefined;
      state.content.status = 'deleted';
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
export { loadContent, loadItem, loadList, manage };
export default ppSlice.reducer;
