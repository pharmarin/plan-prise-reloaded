import useAxios from 'axios-hooks';
import AsyncTable from 'components/AsyncTable';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Check from 'components/Icons/Check';
import Trash from 'components/Icons/Trash';
import Pill from 'components/Pill';
import Spinner from 'components/Spinner';
import { requestUrl } from 'helpers/hooks/use-json-api';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateAppNav } from 'store/app';

const ApproveButton: React.FC<{
  id: Models.App.User['id'];
  onSuccess: () => void;
}> = ({ id, onSuccess }) => {
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
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateAppNav({
        title: 'Utilisateurs',
        returnTo: {
          component: { name: 'arrow', props: { left: true, strokeWidth: 3 } },
          path: '/admin',
        },
      })
    );
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
        extractData={(filter, columnId, user: Models.App.User, forceReload) => {
          switch (columnId) {
            case 'avatar':
              return (
                <Avatar
                  lastName={user.attributes.last_name}
                  firstName={user.attributes.first_name}
                />
              );
            case 'last_name':
              return user.attributes.last_name;
            case 'first_name':
              return user.attributes.first_name;
            case 'email':
              return user.attributes.email;
            case 'status':
              return user.attributes.admin ? (
                <Pill color="red">Administrateur</Pill>
              ) : (
                <Pill color="green">
                  {user.attributes.status === 'pharmacist'
                    ? 'Pharmacien'
                    : 'Étudiant'}
                </Pill>
              );
            case 'signup_date':
              return new Date(user.attributes.created_at).toLocaleDateString(
                'fr-FR'
              );
            case 'actions':
              return (
                <div className="flex flex-row justify-end space-x-2">
                  {filter === 'pending' && (
                    <ApproveButton id={user.id} onSuccess={forceReload} />
                  )}
                  <DeleteButton id={user.id} onSuccess={forceReload} />
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
        type="users"
      />
    </div>
  );
};

export default UsersBackend;
