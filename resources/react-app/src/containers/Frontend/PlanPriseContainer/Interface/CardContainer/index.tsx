import Card from 'components/Card';
import Commentaires from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer/Commentaires';
import Header from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer/Header';
import Informations from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer/Informations';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import joinClassNames from 'utility/class-names';

const CardContainer = ({
  medicament,
  planPrise,
}: {
  medicament: Medicament | ApiMedicament;
  planPrise: PlanPrise;
}) => {
  return (
    <Card className="space-y-2 divide-y">
      <Header medicament={medicament} />
      <div
        className={joinClassNames('grid grid-cols-1 gap-4 pt-2', {
          'md:grid-cols-3': medicament.isMedicament(),
          'md:grid-cols-2': !medicament.isMedicament(),
        })}
      >
        {medicament.isMedicament() && (
          <Informations medicament={medicament} planPrise={planPrise} />
        )}
        {/* <Posologies medicament={medicament} planPrise={planPrise} /> */}
        <Commentaires medicament={medicament} planPrise={planPrise} />
      </div>
    </Card>
  );
};

export default CardContainer;
