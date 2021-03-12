import { CachingStrategy } from '@datx/network';
import Card from 'components/Card';
import Form from 'components/Form';
import Input from 'components/Input';
import Select from 'components/Select';
import Title from 'components/Title';
import { Formik } from 'formik';
import { useApi, useNavigation } from 'hooks/use-store';
import useUser from 'hooks/use-user';
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import Calendar from 'models/Calendar';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import Selection from '../Selection';

const CalendarContainer = () => {
  const api = useApi();
  const navigation = useNavigation();
  const { user } = useUser();
  const { id } = useParams<{ id?: string }>();

  const { data: list, isValidating: isValidatingList } = useSWR(
    'calendar/list',
    action(() =>
      api
        .getMany(Calendar, {
          queryParams: {
            filter: { user: String(user?.meta.id) },
          },
          cacheOptions: {
            cachingStrategy: CachingStrategy.NetworkOnly,
          },
        })
        .then((response) => response.data as Calendar[])
    ),
    {
      revalidateOnFocus: false,
    }
  );

  const {
    data: calendar,
    error: calendarError,
    isValidating: isValidatingCalendar,
  } = useSWR(
    ['plan-prise/plan-prise', id],
    action((_: string, id: string) => {
      if (id === 'nouveau') {
        return api.add({}, Calendar);
      }
      if (id) {
        return api
          .getOne(Calendar, id || '', {
            queryParams: {
              include: ['medicaments'],
            },
          })
          .then((response) => response.data as Calendar);
      } else {
        return undefined;
      }
    }),
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    runInAction(() =>
      navigation.setNavigation(
        calendar === undefined
          ? 'Chargement en cours'
          : calendar.meta.id > 0
          ? `Calendrier n°${calendar.meta.id}`
          : 'Nouveau calendrier',
        {
          component: {
            name: 'arrowLeft',
          },
          path: '/calendrier',
        }
      )
    );
  }, [calendar, navigation]);

  if (!id) {
    return (
      <Selection
        baseUrl="calendrier"
        list={list}
        name="calendrier"
        isLoading={isValidatingList}
      />
    );
  }

  if (!calendar) return <p>Chargement en cours</p>;

  return (
    <div className="space-y-4">
      {(calendar.medicaments || []).map((medicament) => (
        <div key={medicament.uid} className="pb-4 border-b border-gray-300">
          <Title level={4} className="mb-0 font-bold">
            {medicament.denomination}
          </Title>
          {medicament.isMedicament() && (
            <Title level={5} className="italic">
              {medicament.composition
                .map((principeActif) => principeActif.denomination)
                .join(' + ')}
            </Title>
          )}
          <div className="flex flex-row space-x-4 overflow-scroll -m-4 p-4">
            <Formik
              initialValues={calendar.recurrences || [{ quantity: 1 }]}
              onSubmit={(values) => console.log('values: ', values)}
            >
              {({ handleSubmit, values }) => (
                <Form onSubmit={handleSubmit}>
                  {values.map((recurrence, index) => (
                    <Card
                      key={`recurrence_${index}_${medicament.uid}`}
                      className="w-48 h-48"
                    >
                      <Title className="font-bold" level={4}>
                        Récurrence n°{index}
                      </Title>
                      <Input name="quantity" value={recurrence.quantity} />{' '}
                      unité(s) tous les{' '}
                      <Input name="recurrence" value={recurrence.recurrence} />
                    </Card>
                  ))}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      ))}
      <Select
        onAdd={(value, valueType) => {
          const model = new valueType();

          runInAction(() =>
            api
              .getOne(valueType, value.value, {
                queryParams: {
                  include: ['bdpm', 'composition', 'precautions'],
                },
              })
              .then((response) => {
                runInAction(() =>
                  calendar.addMedicament(response.data as typeof model)
                );
              })
          );
        }}
        placeholder="Ajoutez un médicament"
      />
    </div>
  );
};

export default observer(CalendarContainer);
