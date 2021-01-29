import Card from 'components/Card';
import Commentaires from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer/Commentaires';
import Header from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer/Header';
import Informations from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer/Informations';
import Posologies from 'containers/Frontend/PlanPriseContainer/Interface/CardContainer/Posologies';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React, { useState } from 'react';
import joinClassNames from 'tools/class-names';

const CardContainer = ({
  medicament,
  planPrise,
}: {
  medicament: Medicament | ApiMedicament;
  planPrise: PlanPrise;
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="space-y-2 divide-y">
      <Header
        medicament={medicament}
        planPrise={planPrise}
        useDetails={[showDetails, setShowDetails]}
      />
      <div
        className={joinClassNames('flex pt-2', {
          'flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4': showDetails,
          'flex-col': !showDetails,
        })}
      >
        {medicament.isMedicament() && (
          <Informations
            medicament={medicament}
            planPrise={planPrise}
            showDetails={showDetails}
          />
        )}
        <Posologies
          medicament={medicament}
          planPrise={planPrise}
          showDetails={showDetails}
        />
        <Commentaires
          medicament={medicament}
          planPrise={planPrise}
          showDetails={showDetails}
        />
      </div>
    </Card>
  );
};

export default CardContainer;
