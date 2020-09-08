import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { keys, map, toNumber } from 'lodash';
import Card from './Card';

const mapState = (state: ReduxState) => ({
  content: state.planPrise.content,
});

const connector = connect(mapState);

type InterfaceProps = ConnectedProps<typeof connector> & Props.Interface;

const Interface = (props: InterfaceProps) => {
  const { content } = props;

  if (!content) {
    return <React.Fragment>Need Loading</React.Fragment>;
  }

  if (content === 'loading')
    return <React.Fragment>Chargement en cours...</React.Fragment>;

  if (content === 'error')
    return <React.Fragment>Erreur lors du chargement</React.Fragment>;

  const { medic_data: medicaments } = content;

  return (
    <React.Fragment>
      {map(keys(content.medic_data), toNumber)
        .sort()
        .map((key: number) => (
          <Card key={medicaments[key].id} id={medicaments[key]} />
        ))}
    </React.Fragment>
  );
};

export default connector(Interface);
