import AsyncTable from 'components/AsyncTable';
import Avatar from 'components/Avatar';
import Pill from 'components/Pill';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateAppNav } from 'store/app';

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
        ]}
        extractData={(columnId, user: Models.App.User) => {
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
            default:
              return '';
          }
        }}
        filters={{
          all: { label: 'Tous les utilisateurs', filter: undefined },
          pending: {
            label: 'Utilisateurs à approuver',
            filter: {
              field: 'approved_at',
              value: '',
            },
          },
        }}
        type="users"
      />
    </div>
  );
};

export default UsersBackend;
