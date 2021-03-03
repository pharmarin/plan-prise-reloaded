import Interface from 'containers/Frontend/PlanPriseContainer/Interface';
import Selection from 'containers/Frontend/PlanPriseContainer/Selection';
import ErrorBoundary from 'containers/Utility/ErrorBoundary';
import { useApi } from 'hooks/use-store';
import useUser from 'hooks/use-user';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

const PlanPriseContainer = () => {
  const { user } = useUser();
  const api = useApi();
  const { id } = useParams<{ action?: string; id?: string }>();

  const {
    data: planPrise,
    error: planPriseError,
    isValidating: isValidatingPlanPrise,
  } = useSWR(
    id ? ['plan-prise/plan-prise', id] : null,
    action((_: string, id: string) => {
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
    }),
    {
      revalidateOnFocus: false,
    }
  );

  const { data: list, isValidating: isValidatingList } = useSWR(
    'plan-prise/list',
    action(() =>
      api
        .getMany(PlanPrise, {
          queryParams: {
            filter: { user: String(user?.meta.id) },
          },
          cacheOptions: {
            cachingStrategy: 1,
          },
        })
        .then((response) => response.data as PlanPrise[])
    ),
    {
      revalidateOnFocus: false,
    }
  );

  if (!id) {
    return <Selection list={list} isLoading={isValidatingList} />;
  }

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
