import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'helpers/axios-clients';
import { cache, inCache } from 'store/cache';
import {
  find,
  findIndex,
  forEach,
  get,
  isPlainObject,
  isString,
  map,
  remove,
  setWith,
  unset,
} from 'lodash-es';
import { typeToInt } from 'helpers/type-switcher';
import { normalizeOne, requestUrl } from 'helpers/hooks/use-json-api';

const loadList = createAsyncThunk<Models.PlanPrise['id'][]>(
  'planPrise/loadList',
  async () => {
    const response = await axios.get<IServerResponse<Models.PlanPrise[]>>(
      requestUrl('plan-prises', {
        fields: {
          'plan-prises': ['id', 'type'],
        },
        sort: '-id',
      }).url
    );

    if (!Array.isArray(response.data.data))
      throw new Error("La réponse reçue n'est par un array");
    if (response.data.data.some((p) => !isString(p.id)))
      throw new Error(
        "La réponse reçue ne contient pas d'identifiants de plan de prise valides"
      );

    return map(response.data.data, (p) => p.id);
  }
);

const loadContent = createAsyncThunk<
  ExtractModel<Models.PlanPrise> | undefined,
  Models.PlanPrise['id'] | undefined,
  { state: IRedux.State }
>('planPrise/loadContent', async (id, { dispatch, getState }) => {
  if (id === 'new') {
    return {
      id: 'new',
      type: 'plan-prises',
      medicaments: [],
      relationshipNames: [],
    };
  } else if (id === undefined) {
    return undefined;
  } else {
    const response = await axios.get<IServerResponse<Models.PlanPrise>>(
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
      if (
        included.type !== 'medicaments' &&
        included.type !== 'api-medicaments'
      )
        return;

      if (!inCache({ id: included.id, type: included.type }, state.cache))
        dispatch(
          cache(
            normalizeOne(
              { id: included.id, type: included.type },
              response.data
            )
          )
        );
    });

    const data = normalizeOne({ id, type: 'plan-prises' }, response.data);

    if (!data) throw new Error('Impossible de charger le plan de prise ' + id);

    return data;
  }
});

const loadItem = createAsyncThunk<
  boolean,
  Models.MedicamentIdentity,
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
          const data = normalizeOne({ id, type }, response.data);

          if (!data)
            throw new Error('Impossible de charge le médicament' + id + type);

          dispatch(cache(data));
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

const createContent = createAsyncThunk<
  ExtractModel<Models.PlanPrise>,
  undefined
>('planPrise/create', async (_, { dispatch, getState }) => {
  const state = getState() as IRedux.State;

  const response = await axios.post<IServerResponse<Models.PlanPrise>>(
    requestUrl('plan-prises', { include: ['medicaments'] }).url,
    {
      data: {
        type: 'plan-prises',
        relationships: {
          medicaments: {
            data: state.planPrise.content.data?.medicaments.map(
              (medicament) => ({ id: medicament.id, type: medicament.type })
            ),
          },
        },
      },
    }
  );

  dispatch(loadList());

  return normalizeOne(
    { id: response.data.data.id, type: 'plan-prises' },
    response.data
  );
});

const deleteContent = createAsyncThunk<void, Models.PlanPrise['id']>(
  'planPrise/delete',
  async (id, { dispatch, getState }) => {
    await axios.delete(requestUrl('plan-prises', { id }).url);

    dispatch(loadList());
  }
);

const initialState: IRedux.PlanPrise = {
  list: {
    status: 'not-loaded',
  },
  content: {
    status: 'not-loaded',
  },
  options: {
    showSettings: false,
  },
};

const ppSlice = createSlice({
  name: 'planPrise',
  initialState,
  reducers: {
    addItem: (state, { payload }: PayloadAction<Models.MedicamentIdentity>) => {
      if (state.content.status !== 'loaded')
        throw new Error(
          "Impossible d'ajouter un médicament à un plan de prise non chargé"
        );
      if (!isPlainObject(state.content.data))
        throw new Error('Un plan de prise chargé doit être un objet');

      if (!find(state.content.data?.medicaments, payload))
        state.content.data?.medicaments.push({
          id: payload.id,
          type: payload.type,
          relationshipNames: [],
        });
    },
    removeItem: (
      state,
      { payload }: PayloadAction<Models.MedicamentIdentity>
    ) => {
      if (state.content.status !== 'loaded')
        throw new Error(
          "Impossible de supprimer un médicament d'un plan de prise non chargé"
        );
      if (
        !isPlainObject(state.content.data) ||
        !state.content.data?.medicaments
      )
        throw new Error('Un plan de prise chargé doit être un objet');

      remove(state.content.data.medicaments, {
        id: payload.id,
        type: payload.type,
      });

      unset(
        state.content.data,
        `custom_data.${typeToInt(payload.type)}-${payload.id}`
      );
    },
    setLoading: (
      state,
      {
        payload,
      }: PayloadAction<{ id: Models.MedicamentIdentity; status: boolean }>
    ) => {
      if (state.content.status !== 'loaded')
        throw new Error(
          "Impossible de modifier un médicament d'un plan de prise non chargé"
        );
      if (!isPlainObject(state.content.data))
        throw new Error('Un plan de prise chargé doit être un objet');

      const index = findIndex(state.content.data?.medicaments, payload.id);
      if (payload.status === true) {
        (state.content.data?.medicaments[
          index
        ] as Models.MedicamentIdentityWithLoading).loading = payload.status;
      } else {
        unset(state.content.data?.medicaments, `${index}.loading`);
      }
    },
    setSettings: (
      state,
      { payload }: PayloadAction<{ id: string; value: any }>
    ) => {
      if (state.content.status !== 'loaded')
        throw new Error(
          "Impossible de modifier les paramètres d'un plan de prise non chargé"
        );
      if (
        !isPlainObject(state.content.data) ||
        !state.content.data?.medicaments
      )
        throw new Error('Un plan de prise chargé doit être un objet');

      setWith(
        state.content.data,
        `custom_settings.${payload.id}`,
        payload.value,
        Object
      );
    },
    setShowSettings: (
      state,
      { payload }: PayloadAction<IRedux.PlanPrise['options']['showSettings']>
    ) => {
      state.options.showSettings = payload;
    },
    setValue: (
      state,
      { payload }: PayloadAction<{ id: string; value: any }>
    ) => {
      if (state.content.status !== 'loaded')
        throw new Error(
          "Impossible de modifier une valeur d'un plan de prise non chargé"
        );
      if (
        !isPlainObject(state.content.data) ||
        !state.content.data?.medicaments
      )
        throw new Error('Un plan de prise chargé doit être un objet');

      setWith(
        state.content.data,
        `custom_data.${payload.id}`,
        payload.value,
        Object
      );
    },
    removeValue: (state, { payload }: PayloadAction<{ id: string }>) => {
      if (state.content.status !== 'loaded')
        throw new Error(
          "Impossible de supprimer une valeur d'un plan de prise non chargé"
        );
      if (
        !isPlainObject(state.content.data) ||
        !state.content.data?.medicaments
      )
        throw new Error('Un plan de prise chargé doit être un objet');

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
      (state, { payload }: PayloadAction<Models.PlanPrise['id'][]>) => {
        if (Array.isArray(payload)) {
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
      state.content.data = undefined;
      state.content.status = 'loading';
    });
    builder.addCase(loadContent.rejected, (state) => {
      state.content.status = 'not-loaded';
      throw new Error('Impossible de charger le plan de prise');
    });
    builder.addCase(loadContent.fulfilled, (state, { payload }) => {
      if (payload === undefined) {
        state.content.data = undefined;
        state.content.status = 'not-loaded';
      } else {
        state.content.data = payload;
        state.content.status = 'loaded';
      }
    });
    /*builder.addCase(loadItem.pending, (state) => {});*/
    /*builder.addCase(loadItem.rejected, (state) => {});*/
    /*builder.addCase(loadItem.fulfilled, (state) => {});*/
    builder.addCase(createContent.pending, (state) => {
      state.content.status = 'creating';
    });
    builder.addCase(createContent.rejected, () => {
      throw new Error("Le plan de prise n'a pas pu être créé");
    });
    builder.addCase(
      createContent.fulfilled,
      (state, { payload }: PayloadAction<ExtractModel<Models.PlanPrise>>) => {
        if (isPlainObject(payload)) {
          state.content.data = payload;
          state.content.status = 'loaded';
        }
      }
    );
    builder.addCase(deleteContent.pending, (state) => {
      state.content.status = 'deleting';
    });
    builder.addCase(deleteContent.rejected, () => {
      throw new Error("Le plan de prise n'a pas pu être supprimé");
    });
    builder.addCase(deleteContent.fulfilled, (state) => {
      state.content.data = undefined;
      state.content.status = 'deleted';
    });
  },
});

export const {
  addItem,
  removeItem,
  removeValue,
  setLoading,
  setSettings,
  setShowSettings,
  setValue,
} = ppSlice.actions;
export { loadContent, loadItem, loadList, createContent, deleteContent };
export default ppSlice.reducer;
