import Information from 'components/Information';
import Card from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer';
import Select from 'containers/Frontend/PlanPriseContainer/Interface/Select';
import useEventListener from 'hooks/use-event-listener';
import usePdf from 'hooks/use-pdf';
import { useApi, useNavigation } from 'hooks/use-store';
import useUser from 'hooks/use-user';
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
  isLoading,
}: {
  error?: Error;
  planPrise?: PlanPrise;
  isLoading: boolean;
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigation = useNavigation();
  const { id } = useParams<{ action?: string; id?: string }>();
  const history = useHistory();

  const api = useApi();
  const { user } = useUser();

  const { generate, fromPlanPrise } = usePdf();

  useEffect(() => {
    if (Number(planPrise?.meta.id) > 0 && id === 'nouveau') {
      history.push(`/plan-prise/${planPrise?.meta.id}`);
    }
  });

  const settingsEvent = useEventListener('plan-prise/settings', () =>
    setShowSettings(!showSettings)
  );

  const deleteEvent = useEventListener('plan-prise/delete', () => {
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

  const exportEvent = useEventListener('plan-prise/export', () => {
    if (!user) {
      throw new Error(
        "Impossible d'exporter un plan de prise si l'utilisateur n'est pas chargé"
      );
    }

    if (!planPrise) {
      throw new Error("Impossible d'exporter un plan de prise non chargé");
    }

    generate(fromPlanPrise(planPrise, user));
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
                  event: settingsEvent,
                } as INavigationItem,
                {
                  component: {
                    name: 'download',
                  },
                  event: exportEvent,
                } as INavigationItem,
                {
                  component: {
                    name: 'trash',
                  },
                  event: deleteEvent,
                } as INavigationItem,
              ]),
        ]
      )
    );
  }, [
    deleteEvent,
    exportEvent,
    navigation,
    planPrise,
    planPrise?.meta.id,
    settingsEvent,
  ]);

  if (isDeleting) {
    return (
      <Information
        type="loading"
        title="Suppression du plan de prise en cours"
      />
    );
  }

  if (isLoading) {
    return (
      <Information
        type="loading"
        title="Chargement du plan de prise en cours"
      />
    );
  }

  if (error) {
    console.log('error: ', error);
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
