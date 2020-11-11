import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import Card from './Card';
import Select from './Select';
import SplashScreen from 'components/App/SplashScreen';
import { selectPlanPriseState } from 'store/plan-prise/selectors/plan-prise';

const mapState = (state: IRedux.State) => ({
  ...selectPlanPriseState(state),
  medicaments: (state.planPrise.content.data?.medicaments || []).map((m) => ({
    id: m.id,
    type: m.type,
    loading: m.loading,
  })),
});

const connector = connect(mapState);

type InterfaceProps = ConnectedProps<typeof connector> & Props.Interface;

const Interface = ({
  isLoaded,
  isLoading,
  medicaments,
  isNew,
}: InterfaceProps) => {
  if (isLoading)
    return (
      <SplashScreen
        type="load"
        message="Chargement du plan de prise en cours"
      />
    );

  if (!isLoaded && !isNew)
    throw new Error(
      "Une erreur est survenue lors de l'affichage de ce plan de prise. "
    );

  return (
    <React.Fragment>
      {medicaments.map((medicament) => (
        <Card key={medicament.id} identifier={medicament} />
      ))}
      <Select />
    </React.Fragment>
  );
};

export default connector(Interface);
