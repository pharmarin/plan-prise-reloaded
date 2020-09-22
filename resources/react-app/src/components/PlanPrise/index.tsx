import React, { useEffect } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { get, isNumber } from 'lodash';
import { setShowSettings, updateAppNav } from 'store/app';
import { checkLoaded, loadContent, loadList, setId } from 'store/plan-prise';
//import PPRepository from 'helpers/PPRepository.helper';
//import generate from 'helpers/pdf.helper';

import Selection from './Selection';
import Interface from './Interface';
import Settings from './Settings';
import SplashScreen from 'components/App/SplashScreen';

const mapState = (state: ReduxState) => ({
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

type PlanPriseProps = ConnectedProps<typeof connector>;

const PlanPrise = ({
  content,
  id,
  list,
  loadContent,
  loadList,
  setId,
  setShowSettings,
  showSettings,
  updateAppNav,
}: PlanPriseProps) => {
  const contentLoaded = checkLoaded(content);
  const routeIdParam = get(useParams(), 'id', null);
  const routeId = Number(routeIdParam);
  const isRootRoute = routeIdParam === null;
  const isValidRoute = !isNaN(Number(routeIdParam));
  const isError = isValidRoute && id === routeId && content === 'error';

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
    /**
     * @condition isNumber(id)
     * @condition routeId === undefined [location === /plan-prise]
     * @action setId(null) [reset id]
     */
    if (isNumber(id) && (!routeId || !isValidRoute)) setId(null);
    if (isValidRoute && !isRootRoute && routeId) {
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
      if (content === null) loadContent(routeId);
    }
  }, [content, id, isRootRoute, isValidRoute, loadContent, routeId, setId]);

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
              {
                path: `/plan-prise/${id}/print`,
                label: 'printer',
              },
            ]
          : undefined,
    });
  }, [contentLoaded, id, updateAppNav]);

  if (content === 'deleting') {
    return <SplashScreen type="load" message="Suppression en cours" />;
  }

  if (isError) {
    console.error("Ce plan de prise n'existe pas. ");
    return (
      <SplashScreen
        button={{ label: 'Retour', path: '/plan-prise' }}
        type="danger"
        message="Ce plan de prise n'existe plus ou vous n'avez pas l'autorisation d'y accéder."
      />
    );
  }

  if (!isValidRoute || content === 'deleted') {
    return <Redirect to="/plan-prise" />;
  }

  if (isRootRoute) return <Selection />;

  if (contentLoaded && get(content, 'id') !== routeId) {
    return (
      <SplashScreen
        button={{ label: 'Retour', path: '/plan-prise' }}
        type="danger"
        message="Une erreur est inconnue est survenue. [Erreur 1]"
      />
    );
  }

  if (isValidRoute && routeId)
    return (
      <React.Fragment>
        <Interface />
        <Settings
          show={contentLoaded && showSettings}
          toggle={() => setShowSettings(!showSettings)}
        />
      </React.Fragment>
    );

  return <div>Erreur</div>;
};

export default connector(PlanPrise);
