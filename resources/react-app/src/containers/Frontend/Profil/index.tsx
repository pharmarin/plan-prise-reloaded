import Card from 'components/Card';
import DeleteUser from 'containers/Frontend/Profil/DeleteUser';
import EditInformations from 'containers/Frontend/Profil/EditInformations';
import EditPassword from 'containers/Frontend/Profil/EditPassword';
import { useNavigation } from 'hooks/use-store';
import useUser from 'hooks/use-user';
import React, { useEffect } from 'react';

const Profil = () => {
  const navigation = useNavigation();
  const { setUser, user } = useUser();

  if (!user || !setUser)
    throw new Error("L'utilisateur n'a pas pu être chargé");

  useEffect(() => {
    navigation.setNavigation('Profil');
  }, [navigation]);

  return (
    <div>
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Informations
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Vous trouverez ici les informations fournies lors de
              l'inscription.
              <br />
              Vous pouvez les modifier à tout moment.
            </p>
          </div>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <Card>
            <EditInformations user={user} setUser={setUser} />
          </Card>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      <div className="my-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Mot de passe
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Vous pouvez ici modifier votre mot de passe.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <Card>
              <EditPassword user={user} />
            </Card>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      <div className="my-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Supprimer mon compte
              </h3>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <Card>
              <DeleteUser user={user} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
