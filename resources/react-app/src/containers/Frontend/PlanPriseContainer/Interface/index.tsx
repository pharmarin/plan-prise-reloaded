import { AsyncStatus } from '@react-hook/async';
import Information from 'components/Information';
import Card from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer';
import Select from 'containers/Frontend/PlanPriseContainer/Interface/Select';
import useEventListener from 'hooks/use-event-listener';
import { useApi, useNavigation } from 'hooks/use-store';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import PlanPrise from 'models/PlanPrise';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { INavigationItem } from 'store/navigation';
import { mutate } from 'swr';
import Settings from '../Settings';

const Interface = ({
  error,
  planPrise,
  status,
}: {
  error?: Error;
  planPrise?: PlanPrise;
  status: AsyncStatus;
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigation = useNavigation();
  const { id } = useParams<{ action?: string; id?: string }>();
  const history = useHistory();

  const api = useApi();

  useEffect(() => {
    if (Number(planPrise?.meta.id) > 0 && planPrise?.meta.id !== id) {
      history.push(`/plan-prise/${planPrise?.meta.id}`);
    }
  });

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
        },
        [
          ...(planPrise === undefined
            ? []
            : [
                {
                  component: {
                    name: 'options',
                  },
                  event: 'toggleSettings',
                } as INavigationItem,
                {
                  component: {
                    name: 'trash',
                  },
                  event: 'deletePP',
                } as INavigationItem,
              ]),
        ]
      )
    );
  }, [navigation, planPrise, planPrise?.meta.id]);

  useEventListener('toggleSettings', () => setShowSettings(!showSettings));

  useEventListener('deletePP', () => {
    if (!planPrise) {
      throw new Error("Ce plan de prise n'existe pas");
    }

    setIsDeleting(true);
    api
      .removeOne(planPrise, true)
      .then(() => {
        mutate('plan-prise/list');
        history.push('/plan-prise');
      })
      .finally(() => setIsDeleting(false));
  });

  if (isDeleting) {
    return (
      <Information
        type="loading"
        title="Suppression du plan de prise en cours"
      />
    );
  }

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
      {planPrise && (
        <Settings
          planPrise={planPrise}
          showSettings={showSettings}
          toggleSettings={() => setShowSettings(!showSettings)}
        />
      )}
    </div>
  );
};

export default observer(Interface);
