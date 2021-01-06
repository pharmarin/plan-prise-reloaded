import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { uniqueId } from 'lodash-es';

const initialState: Redux.App = {
  notifications: [],
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Partial<Models.App.Notification>>
    ) => {
      const index = state.notifications.findIndex(
        (i) => i.id === action.payload.id
      );
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
      state.notifications = state.notifications.filter((n) => n.id !== payload);
    },
  },
});

export const { addNotification, removeNotification } = appSlice.actions;
export default appSlice.reducer;
