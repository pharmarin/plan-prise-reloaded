import { useAsync } from '@react-hook/async';
import AsyncTable from 'components/AsyncTable';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Check from 'components/Icons/Check';
import Trash from 'components/Icons/Trash';
import Pill from 'components/Pill';
import Spinner from 'components/Spinner';
import { useNavigation } from 'hooks/use-store';
import User from 'models/User';
import React, { useEffect } from 'react';

const ApproveButton: React.FC<{
  user: User;
  onSuccess: () => void;
}> = ({ user, onSuccess }) => {
  const [{ status }, approveUser] = useAsync(() => {
    user.assign('approved_at', new Date().toISOString());
    return user.save();
  });

  return (
    <Button
      color="green"
      disabled={status === 'loading'}
      onClick={async () => {
        try {
          await approveUser();
          onSuccess();
        } catch {
          console.error(
            "Une erreur est survenue lors de l'approbation de l'utilisateur"
          );
        }
      }}
    >
      {status === 'loading' ? <Spinner /> : <Check />}
    </Button>
  );
};

const DeleteButton: React.FC<{
  user: User;
  onSuccess: () => void;
}> = ({ user, onSuccess }) => {
  const [{ status }, deleteUser] = useAsync(() => user.destroy());

  return (
    <Button
      color="red"
      disabled={status === 'loading'}
      onClick={async () => {
        try {
          await deleteUser();
          onSuccess();
        } catch {
          console.error(
            "Une erreur est survenue lors de la suppression de l'utilisateur"
          );
        }
      }}
    >
      {status === 'loading' ? <Spinner /> : <Trash />}
    </Button>
  );
};

const Users = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setNavigation('Utilisateurs', {
      component: { name: 'arrowLeft' },
      path: '/admin',
    });
  });

  return (
    <div className="flex flex-col space-y-6">
      <AsyncTable
        columns={[
          { id: 'avatar', label: '' },
          { id: 'last_name', label: 'Nom' },
          { id: 'first_name', label: 'Prénom' },
          { id: 'email', label: 'Adresse mail' },
          { id: 'status', label: 'Statut' },
          { id: 'signup_date', label: "Date d'inscription" },
          { id: 'actions', label: '' },
        ]}
        extractData={(filter, columnId, user: User, forceReload) => {
          switch (columnId) {
            case 'avatar':
              return (
                <Avatar lastName={user.last_name} firstName={user.first_name} />
              );
            case 'last_name':
              return user.last_name;
            case 'first_name':
              return user.first_name;
            case 'email':
              return user.email;
            case 'status':
              return user.admin ? (
                <Pill color="red">Administrateur</Pill>
              ) : (
                <Pill color="green">
                  {user.status === 'pharmacist' ? 'Pharmacien' : 'Étudiant'}
                </Pill>
              );
            case 'signup_date':
              return new Date(user.created_at).toLocaleDateString('fr-FR');
            case 'actions':
              return (
                <div className="flex flex-row justify-end space-x-2">
                  {filter === 'pending' && (
                    <ApproveButton user={user} onSuccess={forceReload} />
                  )}
                  <DeleteButton user={user} onSuccess={forceReload} />
                </div>
              );
            default:
              return '';
          }
        }}
        filters={{
          pending: {
            label: 'Utilisateurs à approuver',
            filter: {
              field: 'approved_at',
              value: '',
            },
          },
          all: { label: 'Tous les utilisateurs', filter: undefined },
        }}
        searchKey="name"
        type={User}
      />
    </div>
  );
};

export default Users;
