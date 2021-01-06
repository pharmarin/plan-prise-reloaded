import SplashScreen from 'components/SplashScreen';
import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { SanctumContext } from 'react-sanctum';
import { ContextProps } from 'react-sanctum/build/SanctumContext';
import { addNotification } from 'store/app';

type ProtectedRouteProps = Props.Frontend.App.ProtectedRoute;

interface SanctumProps extends Partial<ContextProps> {
  user?: IServerResponse<Models.App.User>;
}

const ProtectedRoute = ({ admin, children }: ProtectedRouteProps) => {
  const { authenticated, user } = useContext<SanctumProps>(SanctumContext);

  const { pathname } = useLocation();

  const dispatch = useDispatch();

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
      dispatch(
        addNotification({
          header: 'Action non autorisée',
          content: "Vous n'êtes pas autorisé à accéder à ce contenu",
          timer: 3000,
          icon: 'danger',
        })
      );

      return <Redirect to="/" />;
    }

    return children || null;
  }

  return <SplashScreen message="Authentification en cours" type="load" />;
};

export default ProtectedRoute;
