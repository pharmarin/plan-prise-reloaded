import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { get, keys, map, toNumber } from 'lodash';
import Card from './Card';
import Select from './Select';
import SplashScreen from 'components/App/SplashScreen';
import { selectStatus } from 'store/plan-prise/selectors';

const mapState = (state: IRedux.State) => ({
  status: selectStatus(state),
  medicaments: get(state.planPrise.content, 'medic_data'),
});

const connector = connect(mapState);

type InterfaceProps = ConnectedProps<typeof connector> & IProps.Interface;

const Interface = ({ medicaments, status }: InterfaceProps) => {
  if (status.isLoading)
    return (
      <SplashScreen
        type="load"
        message="Chargement du plan de prise en cours"
      />
    );

  if (status.isDeleting)
    return <SplashScreen type="warning" message="Suppression en cours" />;

  if (!status.isLoaded)
    throw new Error(
      "Une erreur est survenue lors de l'affichage de ce plan de prise. "
    );

  return (
    <React.Fragment>
      {map(keys(medicaments), toNumber)
        .sort()
        .map((key: number) => (
          <Card key={medicaments[key].id} id={medicaments[key]} />
        ))}
      <Select />
    </React.Fragment>
  );
};

export default connector(Interface);
