import React, { createContext } from 'react';
import RootStore from 'store/root';

const store = new RootStore();

export const StoreContext = createContext(store);

const ContextProvider: React.FC = ({ children }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default ContextProvider;
