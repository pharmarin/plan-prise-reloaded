import Spinner from 'components/Spinner';
import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useLocation } from 'react-router-dom';
import { SanctumContext } from 'react-sanctum';
import { updateAppNav } from 'store/app';
import ConnectionForm from './ConnectionForm';
import InscriptionForm from './InscriptionForm';

const cancelRedirect = ['/deconnexion'];

export enum Role {
  signin,
  register,
  signout,
}

type AuthentificationProps = {
  role: Role;
};

const Authentification = ({ role }: AuthentificationProps) => {
  const { authenticated, signOut } = useContext(SanctumContext);

  const dispatch = useDispatch();

  const { state } = useLocation<{
    message: string;
    redirectTo: string;
  }>();

  if (!signOut) throw new Error('Sanctum props are missing');

  useEffect(() => {
    dispatch(
      updateAppNav({
        title: getTitle(role),
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  useEffect(() => {
    if (role === Role.signout) signOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const getTitle = (role: Role) => {
    switch (role) {
      case Role.signin:
        return 'Connexion';
      case Role.register:
        return 'Inscription';
      case Role.signout:
        return 'Déconnexion';
      default:
        return '';
    }
  };

  if (authenticated === true && role !== Role.signout) {
    const redirectTo =
      state?.redirectTo && cancelRedirect.includes(state.redirectTo)
        ? '/'
        : state?.redirectTo || '/';
    return <Redirect to={redirectTo} />;
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {role === Role.signin && <ConnectionForm message={state?.message} />}
      {role === Role.register && <InscriptionForm />}
      {role === Role.signout && (
        <div className="text-center">
          <Spinner className="mr-2" />
          Déconnexion en cours
        </div>
      )}
    </div>
  );
};

export default Authentification;
