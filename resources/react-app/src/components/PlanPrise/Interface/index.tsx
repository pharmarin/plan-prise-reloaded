import React from 'react';
import { useParams } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import get from 'lodash/get';
import map from 'lodash/map';
import toNumber from 'lodash/toNumber';
import { loadContent } from 'store/plan-prise';
import Card from './Card';
import keys from 'lodash/keys';

const mapState = (state: ReduxState) => ({
  content: state.planPrise.content,
});

const mapDisptach = {
  loadContent,
};

const connector = connect(mapState, mapDisptach);

type InterfaceProps = Props.Interface & ConnectedProps<typeof connector>;

const Interface = (props: InterfaceProps) => {
  const { routeId, content, loadContent } = props;

  if (!content) {
    loadContent(routeId);
    return <React.Fragment>Need Loading</React.Fragment>;
  }

  if (content === 'loading')
    return <React.Fragment>Chargement en cours...</React.Fragment>;

  if (content === 'error')
    return <React.Fragment>Erreur lors du chargement</React.Fragment>;

  const { medic_data: medicaments } = content;

  return (
    <React.Fragment>
      {map(keys(medicaments), toNumber)
        .sort()
        .map((key: number) => (
          <Card key={medicaments[key].id} id={medicaments[key]} />
        ))}
    </React.Fragment>
  );
};

export default connector(Interface);
