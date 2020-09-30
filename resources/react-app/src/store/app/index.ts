import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { filter, findIndex, uniqueId } from 'lodash';

const initialState: IReduxState.App = {
  auth: { isLoading: false, isError: false, tokens: null },
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
    setShowSettings: (state, { payload }: PayloadAction<boolean>) => {
      state.showSettings = payload;
    },
    updateAppNav: (
      state,
      {
        payload,
      }: PayloadAction<{
        title: string;
        returnTo?: { path: string; label: string };
        options?: { path: string; label: string; args?: any }[];
      }>
    ) => {
      const { options, returnTo, title } = payload;
      state.title = title;
      state.returnTo = returnTo;
      state.options = options;
    },
    addNotification: (
      state,
      action: PayloadAction<{
        id?: string;
        header?: string;
        content?: string;
        icon?: string;
        timer?: number;
      }>
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
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = filter(
        state.notifications,
        (n) => n.id !== action.payload
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
