import Button from 'components/Button';
import Card from 'components/Card';
import { useNavigation, useNotifications } from 'hooks/use-store';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import Notification from 'models/Notification';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Accueil = observer(() => {
  const navigation = useNavigation();

  const notifications = useNotifications();

  useEffect(() => {
    navigation.setNavigation('Bienvenue');
  }, [navigation]);

  return (
    <Card>
      <p>Welcome !!</p>
      <Link to="/plan-prise">Plan de prise</Link>
      <Link to="/admin">Administration</Link>
      <Button
        color="green"
        onClick={action(() =>
          notifications.add(
            {
              title: 'Hello',
              message: 'world !',
              type: 'info',
              timer: 2000,
            },
            Notification
          )
        )}
      >
        Notification
      </Button>
    </Card>
  );
});

export default Accueil;
