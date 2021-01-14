import { observer } from 'mobx-react-lite';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import Commentaires from '../Commentaires';
import Informations from '../Informations';

const Content = observer(
  ({
    medicament,
    planPrise,
  }: {
    medicament: Medicament | ApiMedicament;
    planPrise: PlanPrise;
  }) => {
    const uid = ''; //medicament?.uid;

    return (
      <React.Fragment>
        {medicament.isMedicament() && (
          <Informations medicament={medicament} planPrise={planPrise} />
        )}
        {/* <Posologies medicament={medicament} planPrise={planPrise} /> */}
        <Commentaires medicament={medicament} planPrise={planPrise} />
      </React.Fragment>
    );
  }
);

export default Content;
