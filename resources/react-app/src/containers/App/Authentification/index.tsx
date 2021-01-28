import Spinner from 'components/Spinner';
import { useNavigation } from 'hooks/use-store';
import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { SanctumContext } from 'react-sanctum';
import joinClassNames from 'tools/class-names';
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

  const navigation = useNavigation();

  const { state } = useLocation<{
    message: string;
    redirectTo: string;
  }>();

  if (!signOut) throw new Error('Sanctum props are missing');

  useEffect(() => {
    navigation.setNavigation(getTitle(role));
  }, [navigation, role]);

  useEffect(() => {
    if (role === Role.signout) signOut();
  }, [role, signOut]);

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
    <div
      className={joinClassNames(
        'w-full max-w-sm min-h-screen',
        'mx-auto -my-24 py-24',
        'flex sm:justify-center'
      )}
    >
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

export default observer(Authentification);
