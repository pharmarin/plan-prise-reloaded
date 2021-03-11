import { Route } from 'react-router';
import CalendarContainer from './CalendarContainer';
import PlanPriseContainer from './PlanPriseContainer';

const Applications = () => {
  return (
    <>
      <Route path="/plan-prise/:id?">
        <PlanPriseContainer />
      </Route>
      <Route path="/calendrier/:id?">
        <CalendarContainer />
      </Route>
    </>
  );
};

export default Applications;
