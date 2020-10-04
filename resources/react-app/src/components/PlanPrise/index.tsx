import React, { useEffect } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { get, isError, isNumber } from 'lodash';
import { setShowSettings, updateAppNav } from 'store/app';
import {
  isDeleted,
  isDeleting,
  isLoaded,
  isNotLoaded,
  loadContent,
  loadList,
  setId,
} from 'store/plan-prise';
import usePdf from 'helpers/hooks/use-pdf';
//import PPRepository from 'helpers/PPRepository.helper';
//import generate from 'helpers/pdf.helper';

import Selection from './Selection';
import Interface from './Interface';
import Settings from './Settings';
import SplashScreen from 'components/App/SplashScreen';
import { withSanctum, WithSanctumProps } from 'react-sanctum';
import useRepository from 'store/plan-prise/hooks/use-repository';

const mapState = (state: IReduxState) => ({
  /* Il faut être plus spécifique, calculer isError, isDeleting */
  content: state.planPrise.content,
  id: state.planPrise.id,
  list: state.planPrise.list,
  showSettings: state.app.showSettings,
});

const mapDispatch = {
  loadContent,
  loadList,
  setId,
  setShowSettings,
  updateAppNav,
};

const connector = connect(mapState, mapDispatch);

type PlanPriseProps = ConnectedProps<typeof connector> &
  WithSanctumProps<Models.User>;

const PlanPrise = ({
  content,
  id,
  list,
  loadContent,
  loadList,
  user,
  setId,
  setShowSettings,
  showSettings,
  updateAppNav,
}: PlanPriseProps) => {
  const repository = useRepository();
  const routerParams = useParams();
  const history = useHistory();
  const { fromPlanPrise, generate } = usePdf({ user });
  const contentLoaded = isLoaded(content);
  const medicData = get(content, 'medic_data');
  const contentNotLoaded = isNotLoaded(content);
  const routeIdParam = get(routerParams, 'id');
  const isNewRoute = routeIdParam === 'nouveau';
  const routeId = isNewRoute ? -1 : Number(routeIdParam);
  const isRootRoute = !routeIdParam;
  const isValidRoute = !isNaN(Number(routeIdParam)) || isNewRoute;
  const isPdfRoute = get(routerParams, 'action') === 'export';

  const getTitle = (id: number | null) => {
    if (id === -1) {
      return 'Nouveau Plan de Prise';
    }
    if (id && id > 0) {
      return `Plan de prise n°${id}`;
    }
    return 'Que voulez-vous faire ? ';
  };

  /**
   * @condition location === /plan-prise
   * @condition list === null
   * @action loadList()
   */
  useEffect(() => {
    if (isRootRoute && list === null) {
      loadList();
    }
  }, [isRootRoute, list, loadList]);

  useEffect(() => {
    if (isNewRoute && id !== -1) {
      setId(-1);
    } else if (
      (isNumber(id) && (!routeId || !isValidRoute)) ||
      (id === -1 && !isNewRoute)
    ) {
      setId(null);
    }
  }, [id, isNewRoute, isValidRoute, routeId, setId]);

  useEffect(() => {
    if (isValidRoute && !isRootRoute && !isNewRoute && routeId) {
      /**
       * @condition id !== routeId
       * @action set ID
       * @action reset content
       */
      if (id !== routeId) setId(routeId);
      /**
       * @condition if no content & not loading & not errored
       * @action load content
       */
      if (contentNotLoaded) loadContent(routeId);
    }
  }, [
    contentNotLoaded,
    id,
    isNewRoute,
    isRootRoute,
    isValidRoute,
    loadContent,
    routeId,
    setId,
  ]);

  useEffect(() => {
    updateAppNav({
      title: getTitle(id),
      returnTo: isNumber(id)
        ? {
            path: '/plan-prise',
            label: 'arrow-left',
          }
        : undefined,
      options:
        isNumber(id) && contentLoaded
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
              ...(medicData && medicData.length > 0
                ? [
                    {
                      path: `/plan-prise/${id}/export`,
                      label: 'pdf',
                    },
                  ]
                : []),
            ]
          : undefined,
    });
  }, [contentLoaded, id, medicData, updateAppNav]);

  if (isRootRoute) return <Selection />;

  if (isDeleting(content)) {
    return <SplashScreen type="load" message="Suppression en cours" />;
  }

  if (isError(content) && isValidRoute && id === routeId) {
    console.error("Ce plan de prise n'existe pas. ");
    return (
      <SplashScreen
        button={{ label: 'Retour', path: '/plan-prise' }}
        type="danger"
        message="Ce plan de prise n'existe plus ou vous n'avez pas l'autorisation d'y accéder."
      />
    );
  }

  if ((!isValidRoute || isDeleted(content)) && !isNewRoute && !isRootRoute) {
    return <Redirect to="/plan-prise" />;
  }

  if (isNewRoute && id && id > 0) {
    return <Redirect to={`/plan-prise/${id}`} />;
  }

  if (isLoaded(content) && content.id !== routeId && !isNewRoute) {
    return (
      <SplashScreen
        button={{ label: 'Retour', path: '/plan-prise' }}
        type="danger"
        message="Une erreur est inconnue est survenue. [Erreur 1]"
      />
    );
  }

  if (isPdfRoute && isLoaded(content)) {
    generate(fromPlanPrise(repository.getContent()));
    history.goBack();
  }

  return (
    <React.Fragment>
      <Interface />
      <Settings
        show={isLoaded(content) && showSettings}
        toggle={() => setShowSettings(!showSettings)}
      />
    </React.Fragment>
  );
};

export default connector(withSanctum(PlanPrise));
