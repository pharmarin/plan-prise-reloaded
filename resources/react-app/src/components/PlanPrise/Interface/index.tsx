import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { keys, map, toNumber } from 'lodash';
import Card from './Card';
import Select from './Select';

const mapState = (state: ReduxState) => ({
  content: state.planPrise.content,
});

const connector = connect(mapState);

type InterfaceProps = ConnectedProps<typeof connector> & Props.Interface;

const Interface = ({ content }: InterfaceProps) => {
  if (!content) {
    return <React.Fragment>Need Loading</React.Fragment>;
  }

  if (content === 'loading')
    return <React.Fragment>Chargement en cours</React.Fragment>;

  if (content === 'error')
    return <React.Fragment>Erreur lors du chargement</React.Fragment>;

  if (content === 'deleting')
    return <React.Fragment>Suppression en cours</React.Fragment>;

  const { medic_data: medicaments } = content;

  return (
    <React.Fragment>
      {map(keys(content.medic_data), toNumber)
        .sort()
        .map((key: number) => (
          <Card key={medicaments[key].id} id={medicaments[key]} />
        ))}
      <Select />
    </React.Fragment>
  );
};

export default connector(Interface);
