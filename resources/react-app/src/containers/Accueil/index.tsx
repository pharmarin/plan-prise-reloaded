import Card from 'components/Card';
import { useNavigation } from 'hooks/use-store';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Accueil = observer(() => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setNavigation('Bienvenue');
  }, [navigation]);

  return (
    <Card>
      <p>Welcome !!</p>
      <Link to="/plan-prise">Plan de prise</Link>
      <Link to="/admin">Administration</Link>
    </Card>
  );
});

export default Accueil;
