import Button from 'components/Button';
import Information from 'components/Information';
import SplashScreen from 'components/SplashScreen';
import { useApi, useNavigation } from 'hooks/use-store';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import Medicament from 'models/Medicament';
import Precaution from 'models/Precaution';
import React, { useEffect } from 'react';
import useSWR from 'swr';
import EditAttributes from './Attributes';
import EditPrecaution from './Precaution';

const Edit = observer(({ id }: { id: string }) => {
  const api = useApi();

  const navigation = useNavigation();

  const { data: medicament, error, isValidating } = useSWR(
    ['backend/medicament', id],
    action(() =>
      api
        .getOne(Medicament, id, {
          queryParams: { include: ['bdpm', 'composition', 'precautions'] },
        })
        .then((medicament) => medicament.data as Medicament)
    )
  );

  useEffect(() => {
    navigation.setNavigation(
      medicament
        ? `Modification de ${medicament?.denomination}`
        : "Modification d'un médicament",
      {
        component: { name: 'arrowLeft' },
        path: '/admin/medicaments',
      }
    );
  }, [medicament, navigation]);

  if (isValidating) {
    return <Information type="loading" title="Chargement en cours" />;
  }

  if (error) {
    return <p>Une erreur est survenue : {JSON.stringify(error?.message)}</p>;
  }

  if (!medicament) {
    return (
      <SplashScreen
        type="warning"
        message="Impossible de trouver le médicament"
        button={{ label: 'Retour', path: '/admin/medicaments' }}
      />
    );
  }

  return (
    <React.Fragment>
      <EditAttributes medicament={medicament} />
      <div className="sm:col-count-2 lg:col-count-3">
        {medicament.precautions.map((precaution) => (
          <EditPrecaution
            key={precaution.meta.id}
            precaution={precaution}
            cibles={[
              {
                id: `medicaments_${medicament.meta.id}`,
                label: medicament.denomination || 'Ce médicament',
              },
              ...(medicament.composition || []).map((principeActif) => ({
                id: `principe-actifs_${principeActif.meta.id}`,
                label: principeActif.denomination,
              })),
            ]}
            save={null}
          />
        ))}
        <Button
          block
          className="h-40 border-0 shadow-md"
          color="white"
          size="sm"
          onClick={() => {
            const precaution = api.add(new Precaution());
            medicament.precautions.push(precaution);
          }}
        >
          Ajouter une précaution
        </Button>
      </div>
    </React.Fragment>
  );
});

export default Edit;
