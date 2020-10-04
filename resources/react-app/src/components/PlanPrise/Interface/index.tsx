import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { get, keys, map, toNumber } from 'lodash';
import Card from './Card';
import Select from './Select';
import SplashScreen from 'components/App/SplashScreen';

const mapState = (state: IReduxState) => ({
  isLoading: state.planPrise.content === 'loading',
  isError: state.planPrise.content === 'error',
  isDeleting: state.planPrise.content === 'deleting',
  isDeleted: state.planPrise.content === 'deleted',
  medicaments: get(state.planPrise.content, 'medic_data'),
});

const connector = connect(mapState);

type InterfaceProps = ConnectedProps<typeof connector> & Props.Interface;

const Interface = ({
  isDeleted,
  isDeleting,
  isError,
  isLoading,
  medicaments,
}: InterfaceProps) => {
  if (isLoading)
    return (
      <SplashScreen
        type="load"
        message="Chargement du plan de prise en cours"
      />
    );

  if (isError) throw new Error('Erreur lors du chargement du plan de prise');

  if (isDeleting)
    return <SplashScreen type="warning" message="Suppression en cours" />;

  if (isDeleted) return <React.Fragment>Plan de prise supprimé</React.Fragment>;

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
