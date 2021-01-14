import Card from 'components/Card';
import Content from 'containers/Frontend/PlanPrises/Interface/Card/Content';
import Header from 'containers/Frontend/PlanPrises/Interface/Card/Header';
import { observer } from 'mobx-react-lite';
import ApiMedicament from 'models/ApiMedicament';
import Medicament from 'models/Medicament';
import PlanPrise from 'models/PlanPrise';
import React from 'react';
import { CardBody } from 'reactstrap';

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
        {medicament && (
          <CardBody className="row">
            <Content medicament={medicament} planPrise={planPrise} />
          </CardBody>
        )}
      </Card>
    );
  }
);

export default ItemCard;
