import { useAsyncEffect } from '@react-hook/async';
import SplashScreen from 'components/SplashScreen';
import Interface from 'containers/Frontend/PlanPriseContainer/Interface';
import Selection from 'containers/Frontend/PlanPriseContainer/Selection';
import ErrorBoundary from 'containers/Utility/ErrorBoundary';
import { useApi } from 'hooks/use-store';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import PlanPrise from 'models/PlanPrise';
import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SanctumContext } from 'react-sanctum';

const PlanPriseContainer = () => {
  const { user } = useContext(SanctumContext);

  //const navigation = useNavigation();

  const api = useApi();

  const { id } = useParams<{ action?: string; id?: string }>();

  //const history = useHistory();

  //const isPdfRoute = action === 'export';

  const planPrise = useAsyncEffect(async () => {
    if (id === 'nouveau') {
      return api.add({}, PlanPrise);
    }
    if (id) {
      const planPrise = await runInAction(() =>
        api.getOne(PlanPrise, id || '', {
          queryParams: {
            include: [
              'medicaments',
              'medicaments.bdpm',
              'medicaments.composition',
              'medicaments.precautions',
            ],
          },
        })
      );
      return runInAction(() => planPrise.data as PlanPrise);
    } else {
      return undefined;
    }
  }, [id]);

  const list = useAsyncEffect(async () => {
    const planPrises = await runInAction(() =>
      api.getMany(PlanPrise, {
        queryParams: {
          filter: { user: user.data.id },
        },
      })
    );
    return runInAction(() => planPrises.data as PlanPrise[]);
  }, []);

  useEffect(() => {
    /* navigation.setNavigation(
      getTitle(id),
      isNumber(Number(id))
        ? {
            path: '/plan-prise',
            component: { name: 'arrowLeft' },
          }
        : undefined,
      isNumber(Number(id)) && isLoaded
        ? [
            {
              path: 'settings',
              label: 'cog',
            },
            {
              path: 'pp-delete',
              label: 'trash',
              args: {
                id,
              },
            },
            ...(!isEmpty
              ? [
                  {
                    path: `/plan-prise/${id}/export`,
                    label: 'pdf',
                  },
                ]
              : []),
          ]
        : undefined
    ); */
  }, []);

  useEffect(() => {
    /* if (!routeIdParam) {
      if (id !== undefined) loadContent();
      if (list.status === 'not-loaded') loadList();
    } else if (routeIdParam === 'nouveau') {
      if (isNotLoaded) {
        loadContent('new');
      } else if (isLoaded && id !== 'new') {
        console.log(getTitle(id));
        history.push(`/plan-prise/${id}`);
      }
    } else if (Number(routeIdParam) > 0) {
      if (isNotLoaded) loadContent(routeIdParam);
      if (isDeleted) {
        loadContent();
        history.push('/plan-prise');
      }
      if (isLoaded && isPdfRoute && id) {
        generate(fromPlanPrise(state, user));
        history.goBack();
      }
    } else {
      loadContent();
      throw new Error("La page à laquelle vous tentez d'accéder n'existe pas.");
    } */
  }, []);

  if (!id) {
    return <Selection list={list.value} status={list.status} />;
  }

  if (false)
    //isDeleting
    return <SplashScreen type="warning" message="Suppression en cours" />;

  return (
    <ErrorBoundary returnTo="/plan-prise">
      <Interface
        error={planPrise.error}
        planPrise={planPrise.value}
        status={planPrise.status}
      />
    </ErrorBoundary>
  );
};

export default observer(PlanPriseContainer);
