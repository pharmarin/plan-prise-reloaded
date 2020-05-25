import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link } from 'react-router-dom';
import { update } from 'store/app';

const mapDispatch = {
  update,
};
const connector = connect(null, mapDispatch);
type AccueilProps = ConnectedProps<typeof connector>;

const Accueil = (props: AccueilProps) => {
  const { update } = props;
  useEffect(() => {
    update({
      title: 'Bienvenue',
    });
  }, [update]);
  return (
    <div>
      <p>Welcome !!</p>
      <Link to="/plan-prise">Plan de prise</Link>
    </div>
  );
};

export default connector(Accueil);
