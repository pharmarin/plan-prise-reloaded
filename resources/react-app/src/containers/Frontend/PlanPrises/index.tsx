import { useAsyncEffect } from '@react-hook/async';
import SplashScreen from 'components/SplashScreen';
import Interface from 'containers/Frontend/PlanPrises/Interface';
import Selection from 'containers/Frontend/PlanPrises/Selection';
import Settings from 'containers/Frontend/PlanPrises/Settings';
import ErrorBoundary from 'containers/Utility/ErrorBoundary';
import { useApi, useNavigation } from 'hooks/use-store';
import PlanPrise from 'models/PlanPrise';
import React, { useContext, useEffect } from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { SanctumContext } from 'react-sanctum';
import { loadContent, loadList, setShowSettings } from 'store/plan-prise';
import { selectPlanPriseState } from 'store/plan-prise/selectors/plan-prise';

const mapState = (state: Redux.State) => ({
  list: state.planPrise.list,
  showSettings: state.planPrise.options.showSettings,
  status: selectPlanPriseState(state),
});

const mapDispatch = {
  loadContent,
  loadList,
  setShowSettings,
};

const connector = connect(mapState, mapDispatch);

type PlanPriseProps = ConnectedProps<typeof connector>;

const PlanPrises = ({
  loadContent,
  loadList,
  setShowSettings,
  showSettings,
  status: {
    isDeleted,
    isDeleting,
    isEmpty,
    isLoaded,
    isLoading,
    isNew,
    isNotLoaded,
  },
}: PlanPriseProps) => {
  const { user } = useContext(SanctumContext);

  const navigation = useNavigation();

  const api = useApi();

  const state = useSelector((state: Redux.State) => state);

  const { action, id } = useParams<{ action?: string; id?: string }>();

  const history = useHistory();

  const isPdfRoute = action === 'export';

  const planPrise = useAsyncEffect(async () => {
    if (id) {
      const planPrise = await api.getOne(PlanPrise, id || '');
      return planPrise.data as PlanPrise;
    } else {
      return undefined;
    }
  }, [id]);

  const list = useAsyncEffect(async () => {
    const planPrises = await api.getMany(PlanPrise, {
      queryParams: {
        filter: { user: user.data.id },
      },
    });
    return planPrises.data as PlanPrise[];
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
  }, [id, isEmpty, isLoaded, navigation]);

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
  }, [
    isPdfRoute,
    list,
    id,
    loadContent,
    loadList,
    isNotLoaded,
    isLoaded,
    history,
    isDeleted,
    state,
    user,
  ]);

  if (!id) {
    return <Selection list={list.value} status={list.status} />;
  }

  if (isDeleting)
    return <SplashScreen type="warning" message="Suppression en cours" />;

  return (
    <ErrorBoundary returnTo="/plan-prise">
      <Interface planPrise={planPrise.value} status={planPrise.status} />
      <Settings
        show={isLoaded && showSettings}
        toggle={() => setShowSettings(!showSettings)}
      />
    </ErrorBoundary>
  );
};

export default connector(PlanPrises);
