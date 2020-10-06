import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { get, isNumber } from 'lodash';
import { setShowSettings, updateAppNav } from 'store/app';
import { loadContent, loadList, setId } from 'store/plan-prise';
import { withSanctum, WithSanctumProps } from 'react-sanctum';
import usePdf from 'helpers/hooks/use-pdf';

import Selection from './Selection';
import Interface from './Interface';
import Settings from './Settings';
import ErrorBoundary from 'components/App/ErrorBoundary';
import useRepository from 'store/plan-prise/hooks/use-repository';
import {
  selectPlanPriseContent,
  selectStatus,
} from 'store/plan-prise/selectors';

const mapState = (state: IRedux.State) => ({
  content: selectPlanPriseContent(state),
  id: state.planPrise.id,
  list: state.planPrise.list,
  showSettings: state.app.showSettings,
  status: selectStatus(state),
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
  WithSanctumProps<IModels.User>;

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
  status,
  updateAppNav,
}: PlanPriseProps) => {
  const repository = useRepository();
  const routerParams = useParams();
  const history = useHistory();
  const { fromPlanPrise, generate } = usePdf({ user });
  const routeIdParam = get(routerParams, 'id');
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

  useEffect(() => {
    console.log('status: ', status);
    updateAppNav({
      title: getTitle(id),
      returnTo: isNumber(id)
        ? {
            path: '/plan-prise',
            label: 'arrow-left',
          }
        : undefined,
      options:
        isNumber(id) && status.isLoaded
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
              ...(!status.isEmpty
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
  }, [id, status, updateAppNav]);

  useEffect(() => {
    console.log('routeIdParam: ', routeIdParam);
    if (!routeIdParam) {
      if (id !== null) setId(null);
      if (list === null) loadList();
    } else if (routeIdParam === 'nouveau') {
      if (!id) setId(-1);
      if (id && id > 0) history.push(`/plan-prise/${id}`);
    } else if (routeIdParam > 0) {
      if (id !== Number(routeIdParam)) setId(Number(routeIdParam));
      if (status.isNotLoaded) loadContent(routeIdParam);
      if (status.isDeleted) {
        setId(null);
        history.push('/plan-prise');
      }
      if (status.isError && id === Number(routeIdParam)) {
        setId(null);
        throw new Error(
          "Ce plan de prise n'existe plus ou vous n'avez pas l'autorisation d'y accéder."
        );
      }
      if (status.isLoaded && isPdfRoute) {
        generate(fromPlanPrise(repository.getContent()));
        history.goBack();
      }
      if (status.isLoaded && get(content, 'id') !== Number(routeIdParam)) {
        throw new Error('Une erreur est inconnue est survenue. [Erreur 1]');
      }
    } else {
      setId(null);
      throw new Error("La page à laquelle vous tentez d'accéder n'existe pas.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isPdfRoute, list, routeIdParam, setId, status]);

  if (!routeIdParam) {
    return <Selection />;
  }

  if (status.isDeleting || status.isLoaded || status.isLoading)
    return (
      <ErrorBoundary returnTo="/plan-prise">
        <Interface />
        <Settings
          show={status.isLoaded && showSettings}
          toggle={() => setShowSettings(!showSettings)}
        />
      </ErrorBoundary>
    );

  return null;
};

export default connector(withSanctum(PlanPrise));
