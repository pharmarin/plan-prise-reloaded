import { AsyncStatus } from '@react-hook/async';
import Information from 'components/Information';
import Card from 'containers/Frontend/PlanPrises/Interface/CardContainer';
import Select from 'containers/Frontend/PlanPrises/Interface/Select';
import { useNavigation } from 'hooks/use-store';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import PlanPrise from 'models/PlanPrise';
import React, { useEffect } from 'react';

const Interface = ({
  error,
  planPrise,
  status,
}: {
  error?: Error;
  planPrise?: PlanPrise;
  status: AsyncStatus;
}) => {
  const navigation = useNavigation();

  useEffect(() => {
    runInAction(() =>
      navigation.setNavigation(
        planPrise === undefined
          ? 'Chargement en cours'
          : planPrise.meta.id > 0
          ? `Plan de prise n°${planPrise.meta.id}`
          : 'Nouveau plan de prise',
        {
          component: {
            name: 'arrowLeft',
          },
          path: '/plan-prise',
        }
      )
    );
  }, [navigation, planPrise, planPrise?.meta.id]);

  if (status === 'loading' || status === 'idle') {
    return (
      <Information
        type="loading"
        title="Chargement du plan de prise en cours"
      />
    );
  }

  if (status !== 'success') {
    console.log('status: ', status, error);
    throw new Error(
      "Une erreur est survenue lors de l'affichage de ce plan de prise. <br/>" +
        error?.message
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {planPrise &&
          (planPrise.medicaments || []).map((medicament) => (
            <Card
              key={medicament.uid}
              medicament={medicament}
              planPrise={planPrise}
            />
          ))}
      </div>
      <Select planPrise={planPrise} />
    </div>
  );
};

export default observer(Interface);
