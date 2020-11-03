import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { keys, map, toNumber } from 'lodash';
import Card from './Card';
import Select from './Select';
import SplashScreen from 'components/App/SplashScreen';
import { selectPlanPriseStatus } from 'store/plan-prise/selectors/plan-prise';

const mapState = (state: IRedux.State) => ({
  ...selectPlanPriseStatus(state),
  medicaments: (state.planPrise.content.data?.medicaments || []).map((m) => ({
    id: m.id,
    type: m.type,
    loading: m.loading,
  })),
});

const connector = connect(mapState);

type InterfaceProps = ConnectedProps<typeof connector> & IProps.Interface;

const Interface = ({ isLoaded, isLoading, medicaments }: InterfaceProps) => {
  if (isLoading)
    return (
      <SplashScreen
        type="load"
        message="Chargement du plan de prise en cours"
      />
    );

  if (!isLoaded)
    throw new Error(
      "Une erreur est survenue lors de l'affichage de ce plan de prise. "
    );

  return (
    <React.Fragment>
      {map(keys(medicaments), toNumber)
        .sort()
        .map((key: number) => (
          <Card key={medicaments[key].id} identifier={medicaments[key]} />
        ))}
      <Select />
    </React.Fragment>
  );
};

export default connector(Interface);
