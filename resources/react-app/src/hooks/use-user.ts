import { runInAction } from 'mobx';
import User from 'models/User';
import { useContext } from 'react';
import { SanctumContext } from 'react-sanctum';
import { ContextProps } from 'react-sanctum/build/SanctumContext';
import { useApi } from './use-store';

interface SanctumProps extends Partial<ContextProps> {
  user?: IServerResponse<Models.App.User>;
}

const useUser = () => {
  const api = useApi();

  const userContext = useContext<SanctumProps>(SanctumContext);

  const user = runInAction(() => api.sync(userContext.user) as User | null);

  return {
    ...userContext,
    user,
  };
};

export default useUser;
