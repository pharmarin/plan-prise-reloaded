import SplashScreen from 'components/SplashScreen';
import { useNotifications } from 'hooks/use-store';
import { runInAction } from 'mobx';
import Notification from 'models/Notification';
import React, { useContext } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { SanctumContext } from 'react-sanctum';
import { ContextProps } from 'react-sanctum/build/SanctumContext';

type ProtectedRouteProps = Props.Frontend.App.ProtectedRoute;

interface SanctumProps extends Partial<ContextProps> {
  user?: IServerResponse<Models.App.User>;
}

const ProtectedRoute = ({ admin, children }: ProtectedRouteProps) => {
  const { authenticated, user } = useContext<SanctumProps>(SanctumContext);

  const { pathname } = useLocation();

  const notifications = useNotifications();

  if (authenticated === false) {
    return (
      <Redirect
        to={{
          pathname: '/connexion',
          state: {
            message: "Vous devez vous connecter avant d'accéder à cette page. ",
            redirectTo: pathname,
          },
        }}
      />
    );
  }

  if (authenticated === true) {
    if (admin && user?.data.attributes.admin !== true) {
      runInAction(() =>
        notifications.add(
          new Notification({
            title: 'Action non autorisée',
            message: "Vous n'êtes pas autorisé à accéder à ce contenu",
            timer: 3000,
            icon: 'danger',
          })
        )
      );

      return <Redirect to="/" />;
    }

    return children || null;
  }

  return <SplashScreen message="Authentification en cours" type="load" />;
};

export default ProtectedRoute;
