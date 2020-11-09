import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { filter, findIndex, uniqueId } from 'lodash';

const initialState: IRedux.App = {
  notifications: [],
  options: undefined,
  returnTo: {
    path: '/',
    label: '',
  },
  showSettings: false,
  title: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setShowSettings: (
      state,
      { payload }: PayloadAction<IRedux.App['showSettings']>
    ) => {
      state.showSettings = payload;
    },
    updateAppNav: (
      state,
      {
        payload: { options, returnTo, title },
      }: PayloadAction<Pick<IRedux.App, 'title' | 'returnTo' | 'options'>>
    ) => {
      state.title = title;
      state.returnTo = returnTo;
      state.options = options;
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
  setShowSettings,
  updateAppNav,
} = appSlice.actions;
export default appSlice.reducer;
