import React, { createContext } from 'react';
import JsonApiStore from 'store/json-api';
import Navigation from 'store/navigation';
import NotificationBag from 'store/notification-bag';

const store = {
  api: new JsonApiStore(),
  navigation: new Navigation(),
  notifications: new NotificationBag(),
};

export const StoreContext = createContext(store);

const ContextProvider: React.FC = ({ children }) => {
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
};

export default ContextProvider;
