import React, { useEffect } from 'react';
import { useParams, Redirect, useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { get, isNumber } from 'lodash';
import { addNotification, updateAppNav } from 'store/app';
import { loadContent, loadList, resetId, setId } from 'store/plan-prise';
//import PPRepository from 'helpers/PPRepository.helper';
//import generate from 'helpers/pdf.helper';

import Selection from './Selection';
import Interface from './Interface';
import Settings from './Settings';

const mapState = (state: ReduxState) => ({
  content: state.planPrise.content,
  id: state.planPrise.id,
  list: state.planPrise.list,
});

const mapDispatch = {
  addNotification,
  loadContent,
  loadList,
  resetId,
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
  resetId,
  setId,
  updateAppNav,
}: PlanPriseProps) => {
  const history = useHistory();
  const showSettings = get(useParams(), 'showSettings') === 'settings';
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

  useEffect(() => {
    if (isRootRoute && list === null) {
      loadList();
    }
  }, [isRootRoute, list, loadList]);

  useEffect(() => {
    if (isNumber(id) && !routeId) resetId();
    if (isValidRoute && !isRootRoute && routeId) {
      /**
       * @condition if id !== routeId
       * @action set ID
       * @action reset content
       */
      if (id !== routeId) setId(routeId);
      /**
       * @condition if no content & not loading & not errored
       * @action load content
       */
      if (!contentLoaded && content !== 'loading' && content !== 'error')
        loadContent(routeId);
      /**
       * @condition content is "error"
       * @action error to console
       * @action add notification
       */
      if (isError) {
        console.error("Ce plan de prise n'existe pas. ");
        addNotification({
          header: 'Erreur',
          content: "Ce plan de prise n'existe pas. ",
          icon: 'danger',
          timer: 5000,
        });
      }
    }
  }, [
    addNotification,
    content,
    contentLoaded,
    id,
    isError,
    isRootRoute,
    isValidRoute,
    loadContent,
    resetId,
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
  }, [contentLoaded, id, updateAppNav]);

  if (!isValidRoute || isError) {
    return <Redirect to="/plan-prise" />;
  }

  if (isRootRoute) return <Selection />;

  if (isValidRoute && routeId)
    return (
      <React.Fragment>
        <Interface />
        <Settings
          show={contentLoaded && showSettings}
          toggle={() => history.replace(`/plan-prise/${routeId}`)}
        />
      </React.Fragment>
    );

  return <div>Erreur</div>;
};

export default connector(PlanPrise);
