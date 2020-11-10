import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { filter, findIndex, uniqueId } from 'lodash-es';

const initialState: IRedux.App = {
  navigation: {
    options: undefined,
    returnTo: {
      path: '/',
      label: '',
    },
    title: '',
  },
  notifications: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateAppNav: (
      state,
      {
        payload: { options, returnTo, title },
      }: PayloadAction<
        Pick<IRedux.App['navigation'], 'title' | 'returnTo' | 'options'>
      >
    ) => {
      state.navigation.title = title;
      state.navigation.returnTo = returnTo;
      state.navigation.options = options;
    },
    addNotification: (
      state,
      action: PayloadAction<Partial<Models.App.Notification>>
    ) => {
      const index = findIndex(state.notifications, { id: action.payload.id });
      if (action.payload.id && index > -1) {
        state.notifications[index] = {
          id: action.payload.id,
          header: action.payload.header,
          content: action.payload.content,
          icon: action.payload.icon,
          timer: action.payload.timer,
        };
      } else {
        state.notifications.push({
          id: action.payload.id || uniqueId(),
          header: action.payload.header,
          content: action.payload.content,
          icon: action.payload.icon,
          timer: action.payload.timer,
        });
      }
    },
    removeNotification: (
      state,
      { payload }: PayloadAction<Models.App.Notification['id']>
    ) => {
      state.notifications = filter(
        state.notifications,
        (n) => n.id !== payload
      );
    },
  },
});

export const {
  addNotification,
  removeNotification,
  updateAppNav,
} = appSlice.actions;
export default appSlice.reducer;
