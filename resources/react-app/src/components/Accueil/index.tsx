import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { update } from 'store/app';

const mapDispatch = {
  update,
};
const connector = connect(null, mapDispatch);
type AccueilProps = ConnectedProps<typeof connector>;

const Accueil = (props: AccueilProps) => {
  useEffect(() => {
    props.update({
      title: 'Bienvenue',
    });
  });
  return <span>Welcome !!</span>;
};

export default connector(Accueil);
