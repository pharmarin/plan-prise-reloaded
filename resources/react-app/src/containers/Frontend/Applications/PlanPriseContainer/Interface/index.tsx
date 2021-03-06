import Information from 'components/Information';
import Select from 'components/Select';
import Card from 'containers/Frontend/Applications/PlanPriseContainer/Interface/CardContainer';
import useEventListener from 'hooks/use-event-listener';
import usePdf from 'hooks/use-pdf';
import { useApi, useNavigation, useNotifications } from 'hooks/use-store';
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
  const [isLoadingMedicament, setIsLoadingMedicament] = useState(false);

  const notifications = useNotifications();
  const navigation = useNavigation();
  const { id } = useParams<{ action?: string; id?: string }>();
  const history = useHistory();
  const api = useApi();
  const { user } = useUser();
  const { generate, fromPlanPrise } = usePdf();

  useEffect(() => {
    if (!isLoading && Number(planPrise?.meta.id) > 0 && id === 'nouveau') {
      history.push(`/plan-prise/${planPrise?.meta.id}`);
      // Réinitialise le "nouveau" plan de prise
      mutate(['plan-prise/plan-prise', 'nouveau'], undefined);
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
          ? ''
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
          ...((planPrise?.medicaments || []).length > 0
            ? [
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
              ]
            : []),
          ...((planPrise?.meta.id || 0) > 0
            ? [
                {
                  component: {
                    name: 'trash',
                  },
                  event: deleteEvent,
                } as INavigationItem,
              ]
            : []),
        ]
      )
    );
  }, [
    deleteEvent,
    exportEvent,
    navigation,
    planPrise,
    planPrise?.medicaments,
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

  if (
    (planPrise?.meta.id || 0) < 1 &&
    (planPrise?.medicaments || []).length > 0
  ) {
    return (
      <Information type="loading" title="Création du plan de prise en cours" />
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
      {planPrise && (
        <>
          <Select
            disabled={isLoadingMedicament}
            onAdd={async (value, valueType) => {
              setIsLoadingMedicament(true);

              const model = new valueType();

              if (
                planPrise.medicaments.filter(
                  (medicament) =>
                    medicament.meta.type === value.type &&
                    medicament.meta.id === value.value
                ).length > 0
              ) {
                notifications.addNotification({
                  title: 'Ce médicament est déjà dans le plan de prise',
                  type: 'warning',
                  timer: 2000,
                });
                return;
              }

              const notification = notifications.addNotification({
                title: 'Ajout du médicament',
                message: value.label,
                type: 'loading',
              });

              await runInAction(() =>
                api
                  .getOne(valueType, value.value, {
                    queryParams: {
                      include: ['bdpm', 'composition', 'precautions'],
                    },
                  })
                  .then((response) => {
                    runInAction(() =>
                      planPrise.addMedicament(response.data as typeof model)
                    );
                  })
              );

              notifications.removeOne(notification);
              setIsLoadingMedicament(false);
            }}
            placeholder="Ajoutez un médicament au plan de prise"
          />
          <Settings
            planPrise={planPrise}
            showSettings={showSettings}
            toggleSettings={() => setShowSettings(!showSettings)}
          />
        </>
      )}
    </div>
  );
};

export default observer(Interface);
