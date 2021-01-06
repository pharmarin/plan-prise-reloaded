import { AsyncStatus } from '@react-hook/async';
import Information from 'components/Information';
import Select from 'containers/Frontend/PlanPrises/Interface/Select';
import { useNavigation } from 'hooks/use-store';
import { observer } from 'mobx-react-lite';
import PlanPrise from 'models/PlanPrise';
import React, { useEffect } from 'react';

const Interface = observer(
  ({ planPrise, status }: { planPrise?: PlanPrise; status: AsyncStatus }) => {
    const navigation = useNavigation();

    useEffect(() => {
      navigation.setNavigation(
        planPrise === undefined
          ? 'Chargement en cours'
          : planPrise.meta.id > 0
          ? `Plan de prise n°${planPrise.meta.id}`
          : 'Nouveau plan de prise',
        {
          component: {
            name: 'arrowLeft',
          },
          path: '/plan-prise',
        }
      );
    }, [navigation, planPrise, planPrise?.meta.id]);

    if (status === 'loading' || status === 'idle') {
      return (
        <Information
          type="loading"
          title="Chargement du plan de prise en cours"
        />
      );
    }

    if (status !== 'success') {
      console.log('status: ', status);
      throw new Error(
        "Une erreur est survenue lors de l'affichage de ce plan de prise. "
      );
    }

    return (
      <React.Fragment>
        {/* planPrise.map((medicament) => (
        <Card key={medicament.id} identifier={medicament} />
      )) */}
        <Select />
      </React.Fragment>
    );
  }
);

export default Interface;
