import SplashScreen from 'components/SplashScreen';
import Interface from 'containers/Frontend/PlanPriseContainer/Interface';
import Selection from 'containers/Frontend/PlanPriseContainer/Selection';
import ErrorBoundary from 'containers/Utility/ErrorBoundary';
import { useApi } from 'hooks/use-store';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import PlanPrise from 'models/PlanPrise';
import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SanctumContext } from 'react-sanctum';
import useSWR from 'swr';

const PlanPriseContainer = () => {
  const { user } = useContext(SanctumContext);

  //const navigation = useNavigation();

  const api = useApi();

  const { id } = useParams<{ action?: string; id?: string }>();

  //const history = useHistory();

  //const isPdfRoute = action === 'export';

  const {
    data: planPrise,
    error: planPriseError,
    isValidating: isValidatingPlanPrise,
  } = useSWR(
    id ? `plan-prise/plan-prise/${id}` : null,
    action(() => {
      if (id === 'nouveau') {
        return api.add({}, PlanPrise);
      }
      if (id) {
        return api
          .getOne(PlanPrise, id || '', {
            queryParams: {
              include: [
                'medicaments',
                'medicaments.bdpm',
                'medicaments.composition',
                'medicaments.precautions',
              ],
            },
          })
          .then((response) => response.data as PlanPrise);
      } else {
        return undefined;
      }
    })
  );

  const { data: list, isValidating: isValidatingList } = useSWR(
    'plan-prise/list',
    action(() =>
      api
        .getMany(PlanPrise, {
          queryParams: {
            filter: { user: user.data.id },
          },
          cacheOptions: {
            cachingStrategy: 1,
          },
        })
        .then((response) => response.data as PlanPrise[])
    )
  );

  if (!id) {
    return <Selection list={list} isLoading={isValidatingList} />;
  }

  if (false)
    //isDeleting
    return <SplashScreen type="warning" message="Suppression en cours" />;

  return (
    <ErrorBoundary returnTo="/plan-prise">
      <Interface
        error={planPriseError}
        planPrise={planPrise}
        isLoading={isValidatingPlanPrise}
      />
    </ErrorBoundary>
  );
};

export default observer(PlanPriseContainer);
