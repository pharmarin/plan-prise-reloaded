import { observer } from 'mobx-react-lite';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import joinClassNames from 'tools/class-names';
import ConservationDuree from './ConservationDuree';
import Indications from './Indications';

const Informations = ({
  medicament,
  planPrise,
  showDetails,
}: {
  medicament: Medicament;
  planPrise: PlanPrise;
  showDetails: boolean;
}) => {
  return (
    <div className={joinClassNames('w-full md:w-2/6 space-y-2')}>
      <Indications
        medicament={medicament}
        planPrise={planPrise}
        showDetails={showDetails}
      />
      <ConservationDuree
        medicament={medicament}
        planPrise={planPrise}
        showDetails={showDetails}
      />
    </div>
  );
};

export default observer(Informations);
