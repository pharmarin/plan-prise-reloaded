import Card from 'components/Card';
import Select from 'components/Select';
import Title from 'components/Title';
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
        <Card key={medicament.meta.id} className="w-80">
          {medicament.denomination}
        </Card>
      ))}
      <Card className="w-80 overflow-visible">
        <Title className="font-bold" level={4}>
          Ajouter un médicament
        </Title>
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
      </Card>
    </div>
  );
};

export default observer(CalendarContainer);
