import useAxios from 'axios-hooks';
import AsyncTable from 'components/AsyncTable';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Check from 'components/Icons/Check';
import Trash from 'components/Icons/Trash';
import Pill from 'components/Pill';
import Spinner from 'components/Spinner';
import { requestUrl } from 'helpers/hooks/use-json-api';
import { useNavigation } from 'hooks/use-store';
import User from 'models/User';
import React, { useEffect } from 'react';

const ApproveButton: React.FC<{
  id: Models.App.User['id'];
  onSuccess: () => void;
}> = ({ id, onSuccess }) => {
  //TODO: Utiliser datx pour approuver l'utilisateur
  const [{ loading }, approveUser] = useAxios(
    { url: requestUrl('users', { id }).url, method: 'PATCH' },
    { manual: true }
  );

  return (
    <Button
      color="green"
      disabled={loading}
      size="sm"
      onClick={async () => {
        try {
          await approveUser({
            data: {
              data: {
                id,
                type: 'users',
                attributes: {
                  approved_at: new Date(),
                },
              },
            },
          });
          onSuccess();
        } catch {
          console.error(
            "Une erreur est survenue lors de l'approbation de l'utilisateur"
          );
        }
      }}
    >
      {loading ? <Spinner /> : <Check />}
    </Button>
  );
};

const DeleteButton: React.FC<{
  id: Models.App.User['id'];
  onSuccess: () => void;
}> = ({ id, onSuccess }) => {
  const [{ loading }, deleteUser] = useAxios(
    { url: requestUrl('users', { id }).url, method: 'DELETE' },
    { manual: true }
  );

  return (
    <Button
      color="red"
      disabled={loading}
      size="sm"
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
      {loading ? <Spinner /> : <Trash />}
    </Button>
  );
};

const UsersBackend: React.FC = () => {
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
                    <ApproveButton
                      id={String(user.meta.id)}
                      onSuccess={forceReload}
                    />
                  )}
                  <DeleteButton
                    id={String(user.meta.id)}
                    onSuccess={forceReload}
                  />
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

export default UsersBackend;
