import { CachingStrategy } from '@datx/network';
import Button from 'components/Button';
import Card from 'components/Card';
import Information from 'components/Information';
import Input from 'components/Input';
import Select from 'components/Select';
import SplashScreen from 'components/SplashScreen';
import Title from 'components/Title';
import { useApi, useNavigation } from 'hooks/use-store';
import useUser from 'hooks/use-user';
import { action, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import Calendar from 'models/Calendar';
import { useEffect } from 'react';
import { BiPlus } from 'react-icons/bi';
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
          ? ''
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

  if (!calendar || isValidatingCalendar) {
    return (
      <Information type="loading" title="Chargement du calendrier en cours" />
    );
  }

  if (calendarError) {
    return (
      <SplashScreen
        type="danger"
        message="Impossible de charger le calendrier"
        button={{ label: 'Retour', path: '/calendrier' }}
      />
    );
  }

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
          <div className="flex flex-row items-center space-x-4 overflow-scroll -m-4 p-4">
            <Button
              color="light"
              className="rounded-full h-6 w-6 p-0 flex flex-shrink-0 items-center bg-gray-600 text-white hover:bg-white hover:text-gray-600"
              onClick={action(() =>
                calendar.addRecurrenceAtIndex(0, medicament)
              )}
            >
              <BiPlus />
            </Button>
            {calendar?.recurrencesFor(medicament).map((recurrence, index) => (
              <div
                key={`recurrence_${index}_${medicament.uid}`}
                className="flex flex-row items-center space-x-4"
              >
                <Card className="w-48 h-64 flex flex-col text-center">
                  <Title className="font-bold mb-2" level={4}>
                    Récurrence n°{index + 1}
                  </Title>
                  <Input
                    name="quantity"
                    className="p-0 text-center text-blue-600 text-5xl font-bold border-0 border-b-2 border-dashed border-blue-700 rounded-none shadow-none"
                    onChange={action((event) =>
                      calendar.setRecurrenceValueAtIndex(
                        index,
                        medicament,
                        'quantity',
                        event.currentTarget.value
                      )
                    )}
                    value={recurrence.quantity || ''}
                  />
                  unité(s) tous les
                  <Input
                    name="recurrence"
                    className="p-0 text-center text-green-600 text-5xl font-bold border-0 border-b-2 border-dashed border-green-700 rounded-none shadow-none"
                    onChange={action((event) =>
                      calendar.setRecurrenceValueAtIndex(
                        index,
                        medicament,
                        'recurrence',
                        event.currentTarget.value
                      )
                    )}
                    value={recurrence.recurrence || ''}
                  />
                  jour(s)
                  <Button
                    block
                    color="link"
                    className="mt-auto text-red-600"
                    disabled={calendar?.recurrencesFor(medicament).length < 2}
                    onClick={action(() =>
                      calendar.removeRecurrenceAtIndex(index, medicament)
                    )}
                  >
                    Supprimer
                  </Button>
                </Card>
                <Button
                  color="light"
                  className="rounded-full h-6 w-6 p-0 flex items-center justify-center bg-gray-600 text-white hover:bg-white hover:text-gray-600"
                  onClick={action(() =>
                    calendar.addRecurrenceAtIndex(index + 1, medicament)
                  )}
                >
                  <BiPlus />
                </Button>
              </div>
            ))}
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
