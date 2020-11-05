import React, { useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { get, isNumber } from 'lodash';
import { setShowSettings, updateAppNav } from 'store/app';
import { loadContent, loadList, setId } from 'store/plan-prise';
import usePdf from 'helpers/hooks/use-pdf';

import Selection from './Selection';
import Interface from './Interface';
import Settings from './Settings';
import ErrorBoundary from 'components/App/ErrorBoundary';
import useRepository from 'store/plan-prise/hooks/use-repository';
import { selectPlanPriseStatus } from 'store/plan-prise/selectors/plan-prise';
import { SanctumContext } from 'react-sanctum';
import SplashScreen from 'components/App/SplashScreen';

const mapState = (state: IRedux.State) => ({
  id: state.planPrise.id,
  pid: state.planPrise.content.data?.id,
  list: state.planPrise.list,
  showSettings: state.app.showSettings,
  status: selectPlanPriseStatus(state),
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
  id,
  list,
  loadContent,
  loadList,
  pid,
  setId,
  setShowSettings,
  showSettings,
  status,
  updateAppNav,
}: PlanPriseProps) => {
  const { user } = useContext(SanctumContext);

  const repository = useRepository();

  const routerParams = useParams();

  const history = useHistory();

  const { fromPlanPrise, generate } = usePdf({ user });

  const routeIdParam = get(routerParams, 'id') as string | undefined;

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
    if (!routeIdParam) {
      if (id !== null) setId(null);
      if (list.status === 'not-loaded') loadList();
    } else if (routeIdParam === 'nouveau') {
      if (!status.isLoaded) {
        loadContent('new');
      } else {
        if (pid !== 'new') {
          history.push(`/plan-prise/${pid}`);
        }
      }
      if (!id) setId(-1);
      if (id && id > 0) history.push(`/plan-prise/${id}`);
    } else if (Number(routeIdParam) > 0) {
      if (id !== Number(routeIdParam)) setId(Number(routeIdParam));
      if (status.isNotLoaded) loadContent(routeIdParam);
      if (status.isDeleted) {
        setId(null);
        history.push('/plan-prise');
      }
      if (status.isLoaded && isPdfRoute) {
        generate(fromPlanPrise(repository.getContent()));
        history.goBack();
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

  if (status.isDeleting)
    return <SplashScreen type="warning" message="Suppression en cours" />;

  if (status.isLoaded || status.isLoading || status.isNew)
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

export default connector(PlanPrise);
