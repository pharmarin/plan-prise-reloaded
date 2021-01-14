import Card from 'components/Card';
import Commentaires from 'containers/Frontend/PlanPrises/Interface/Card/Commentaires';
import Header from 'containers/Frontend/PlanPrises/Interface/Card/Header';
import Informations from 'containers/Frontend/PlanPrises/Interface/Card/Informations';
import { observer } from 'mobx-react-lite';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import joinClassNames from 'utility/class-names';

const ItemCard = observer(
  ({
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
  }
);

export default ItemCard;
