import Card from 'components/Card';
import Form from 'components/Form';
import Input from 'components/Input';
import Select from 'components/Select';
import Title from 'components/Title';
import { Formik } from 'formik';
import { useApi } from 'hooks/use-store';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import Calendar from 'models/Calendar';

const calendar = new Calendar();

const CalendarContainer = () => {
  const api = useApi();

  return (
    <div className="space-y-4">
      {(calendar.medicaments || []).map((medicament) => (
        <div className="pb-4 border-b border-gray-300">
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
