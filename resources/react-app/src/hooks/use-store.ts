import { StoreContext } from 'containers/App/ContextProvider';
import { useContext } from 'react';

export const useApi = () => useContext(StoreContext).api;
export const useNavigation = () => useContext(StoreContext).navigation;
export const useNotifications = () => useContext(StoreContext).notifications;
