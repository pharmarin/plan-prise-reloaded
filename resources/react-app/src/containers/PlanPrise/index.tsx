import SplashScreen from 'components/SplashScreen';
import ErrorBoundary from 'containers/App/ErrorBoundary';
import Interface from 'containers/PlanPrise/Interface';
import Selection from 'containers/PlanPrise/Selection';
import Settings from 'containers/PlanPrise/Settings';
import { fromPlanPrise, generate } from 'helpers/make-pdf';
import { useNavigation } from 'hooks/use-store';
import { get, isNumber } from 'lodash-es';
import React, { useContext, useEffect } from 'react';
import { connect, ConnectedProps, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { SanctumContext } from 'react-sanctum';
import { loadContent, loadList, setShowSettings } from 'store/plan-prise';
import {
  selectPlanPriseID,
  selectPlanPriseState,
} from 'store/plan-prise/selectors/plan-prise';

const mapState = (state: Redux.State) => ({
  id: selectPlanPriseID(state),
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

const PlanPrise = ({
  list,
  loadContent,
  loadList,
  id,
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

  const state = useSelector((state: Redux.State) => state);

  const routerParams = useParams();

  const history = useHistory();

  const routeIdParam = get(routerParams, 'id') as string | undefined;

  const isPdfRoute = get(routerParams, 'action') === 'export';

  const getTitle = (id: string | undefined) => {
    if (id === 'new') {
      return 'Nouveau Plan de Prise';
    }
    if (isNumber(Number(id)) && Number(id) > 0) {
      return `Plan de prise n°${id}`;
    }
    return 'Que voulez-vous faire ? ';
  };

  useEffect(() => {
    navigation.setNavigation(
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
    );
  }, [id, isEmpty, isLoaded, navigation]);

  useEffect(() => {
    if (!routeIdParam) {
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
    }
  }, [
    isPdfRoute,
    list,
    id,
    routeIdParam,
    loadContent,
    loadList,
    isNotLoaded,
    isLoaded,
    history,
    isDeleted,
    state,
    user,
  ]);

  if (!routeIdParam) {
    return <Selection />;
  }

  if (isDeleting)
    return <SplashScreen type="warning" message="Suppression en cours" />;

  if (isLoaded || isLoading || isNew)
    return (
      <ErrorBoundary returnTo="/plan-prise">
        <Interface />
        <Settings
          show={isLoaded && showSettings}
          toggle={() => setShowSettings(!showSettings)}
        />
      </ErrorBoundary>
    );

  return null;
};

export default connector(PlanPrise);
