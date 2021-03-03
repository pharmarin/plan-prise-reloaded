import Card from 'components/Card';
import Title from 'components/Title';

const CalendarContainer = () => {
  return (
    <div>
      <Card className="w-80">
        <Title className="font-bold" level={4}>
          Ajouter un médicament
        </Title>
      </Card>
    </div>
  );
};

export default CalendarContainer;
