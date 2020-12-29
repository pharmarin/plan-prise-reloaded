import React, { createContext } from 'react';
import JsonApiStore from 'store/json-api';

const store = new JsonApiStore();

export const StoreContext = createContext({ store });

const ContextProvider: React.FC = ({ children }) => {
  return (
    <StoreContext.Provider value={{ store }}>{children}</StoreContext.Provider>
  );
};

export default ContextProvider;
