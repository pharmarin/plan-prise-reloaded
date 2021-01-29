import Card from 'components/Card';
import Commentaires from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer/Commentaires';
import Header from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer/Header';
import Informations from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer/Informations';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import Posologies from './Posologies';

const CardContainer = ({
  medicament,
  planPrise,
}: {
  medicament: Medicament | ApiMedicament;
  planPrise: PlanPrise;
}) => {
  return (
    <Card className="space-y-2 divide-y">
      <Header medicament={medicament} planPrise={planPrise} />
      <div className="flex flex-col md:flex-row pt-2 space-y-4 md:space-y-0 md:space-x-4">
        {medicament.isMedicament() && (
          <Informations medicament={medicament} planPrise={planPrise} />
        )}
        <Posologies medicament={medicament} planPrise={planPrise} />
        <Commentaires medicament={medicament} planPrise={planPrise} />
      </div>
    </Card>
  );
};

export default CardContainer;
