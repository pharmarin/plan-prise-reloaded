import React, { useEffect } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { get, isNumber } from 'lodash';
import { addNotification, updateAppNav } from 'store/app';
import { loadContent, loadList, manage, setId } from 'store/plan-prise';
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
});

const mapDispatch = {
  addNotification,
  loadContent,
  loadList,
  manage,
  setId,
  updateAppNav,
};

const connector = connect(mapState, mapDispatch);

type PlanPriseProps = ConnectedProps<typeof connector>;

const PlanPrise = ({
  addNotification,
  content,
  id,
  list,
  loadContent,
  loadList,
  manage,
  setId,
  updateAppNav,
}: PlanPriseProps) => {
  const history = useHistory();
  const settingsRoute = get(useParams(), 'action') === 'settings';
  const deleteRoute = get(useParams(), 'action') === 'delete';
  const routeIdParam = get(useParams(), 'id', null);
  const isValidRoute = !isNaN(Number(routeIdParam));
  const isRootRoute = routeIdParam === null;
  const routeId = Number(routeIdParam);
  const contentLoaded = get(content, 'id') === routeId;
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

  /**
   * @condition isNumber(id)
   * @condition routeId === undefined [location === /plan-prise]
   * @action setId(null) [reset id]
   */
  useEffect(() => {
    if (isNumber(id) && (!routeId || !isValidRoute)) setId(null);
  }, [id, isValidRoute, routeId, setId]);

  useEffect(() => {
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
      if (
        !contentLoaded &&
        content !== 'loading' &&
        content !== 'error' &&
        content !== 'deleting'
      )
        loadContent(routeId);
      /**
       * @condition id === routeId
       * @condition deleteRoute
       * @action delete plan-prise
       */
      if (id === routeId && deleteRoute && content !== 'deleting')
        manage({ id, action: 'delete' })
          .then(() => {
            history.replace('/plan-prise/');
            setId(null);
            loadList();
          })
          .catch((e) => {
            console.error(e);
            throw new Error("Le plan de prise n'a pas pu être supprimé");
          });
    }
  }, [
    addNotification,
    content,
    contentLoaded,
    deleteRoute,
    history,
    id,
    isRootRoute,
    isValidRoute,
    loadList,
    loadContent,
    manage,
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
        isNumber(id) && contentLoaded && !deleteRoute
          ? [
              {
                path: `/plan-prise/${id}/settings`,
                label: 'cog',
              },
              {
                path: `/plan-prise/${id}/delete`,
                label: 'trash',
              },
              {
                path: `/plan-prise/${id}/print`,
                label: 'printer',
              },
            ]
          : undefined,
    });
  }, [contentLoaded, deleteRoute, id, updateAppNav]);

  if (deleteRoute) {
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

  if (!isValidRoute) {
    return <Redirect to="/plan-prise" />;
  }

  if (isRootRoute) return <Selection />;

  if (isValidRoute && routeId)
    return (
      <React.Fragment>
        <Interface />
        <Settings
          show={contentLoaded && settingsRoute}
          toggle={() => history.replace(`/plan-prise/${routeId}`)}
        />
      </React.Fragment>
    );

  return <div>Erreur</div>;
};

export default connector(PlanPrise);
