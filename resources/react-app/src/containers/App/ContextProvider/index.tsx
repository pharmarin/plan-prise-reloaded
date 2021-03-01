import axios from 'helpers/axios-clients';
import React, { createContext } from 'react';
import { Sanctum } from 'react-sanctum';
import { ContextProps } from 'react-sanctum/build/SanctumContext';
import RootStore from 'store/root';

const store = new RootStore();

export const StoreContext = createContext(store);

const sanctumConfig = {
  api_url: '',
  axios_instance: axios, // Contains base url + api path
  csrf_cookie_route: 'csrf-cookie',
  signin_route: 'login',
  signout_route: 'logout',
  user_object_route: 'user',
};

export interface SanctumProps extends Partial<ContextProps> {
  user?: IServerResponse<Models.App.User>;
}

const ContextProvider: React.FC = ({ children }) => {
  return (
    <Sanctum config={sanctumConfig}>
      <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
    </Sanctum>
  );
};

export default ContextProvider;
