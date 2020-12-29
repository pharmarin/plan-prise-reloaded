import { StoreContext } from 'containers/App/ContextProvider';
import { useContext } from 'react';

export const useStore = () => useContext(StoreContext).store;
