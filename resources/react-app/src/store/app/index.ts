import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { filter, find, findIndex, uniqueId } from 'lodash';

const initialState: ReduxState.App = {
  auth: { isLoading: false, isError: false, tokens: null },
  notifications: [],
  options: undefined,
  returnTo: {
    path: '/',
    label: '',
  },
  title: '',
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateAppNav: (
      state,
      action: PayloadAction<{
        title: string;
        returnTo?: { path: string; label: string };
        options?: { path: string; label: string }[];
      }>
    ) => {
      const {
        payload: { options, returnTo, title },
      } = action;
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
  updateAppNav,
} = appSlice.actions;
export default appSlice.reducer;
