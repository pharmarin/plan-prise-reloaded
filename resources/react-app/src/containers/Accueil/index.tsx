import Card from 'components/Card';
import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateAppNav } from 'store/app';

const mapDispatch = {
  updateAppNav,
};

const connector = connect(null, mapDispatch);
type AccueilProps = ConnectedProps<typeof connector>;

const Accueil = (props: AccueilProps) => {
  const { updateAppNav } = props;

  useEffect(() => {
    updateAppNav({
      title: 'Bienvenue',
    });
  }, [updateAppNav]);

  return (
    <Card>
      <p>Welcome !!</p>
      <Link to="/plan-prise">Plan de prise</Link>
      <Link to="/admin">Administration</Link>
    </Card>
  );
};

export default connector(Accueil);
