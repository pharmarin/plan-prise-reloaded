import useAxios from 'axios-hooks';
import Card from 'components/Card';
import Chart from 'components/Chart';
import SplashScreen from 'components/SplashScreen';
import Title from 'components/Title';
import { requestUrl } from 'helpers/hooks/use-json-api';
import { useNavigation } from 'hooks/use-store';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setNavigation('Administration', {
      component: { name: 'arrowLeft' },
      path: '/',
    });
  });

  const [{ loading, error, data }] = useAxios(requestUrl('dashboard').url);

  if (loading)
    return <SplashScreen type="load" message="Chargement en cours..." />;
  if (error)
    return (
      <SplashScreen
        type="danger"
        message="Une erreur est survenue lors du chargement"
        button={{ label: 'Rafraichir', path: 'refresh' }}
      />
    );

  return (
    <div>
      <Title color="blue" level={3}>
        Utilisateurs
      </Title>
      <div className="grid grid-cols-3 gap-4">
        <Link to="/admin/utilisateurs">
          <Card className="h-44 flex flex-col justify-center text-center">
            <span className="text-6xl text-blue-700">
              {data.meta.users.total}
            </span>
            <span className="text-3xl text-blue-500">
              Utilisateurs inscrits
            </span>
          </Card>
        </Link>
        <Card className="col-span-2 h-44">
          <Chart
            color="blue"
            data={Object.values(data.meta.users.stats) || []}
            labels={Object.keys(data.meta.users.stats) || []}
          />
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Title color="green" level={3}>
          Médicaments
        </Title>
        <Title color="green" level={3}>
          Derniers ajoutés
        </Title>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Link to="/admin/medicaments">
          <Card className="h-44 flex flex-col justify-center text-center">
            <span className="text-6xl text-green-700">
              {data.meta.medicaments.total}
            </span>
            <span className="text-3xl text-green-500">Médicaments</span>
          </Card>
        </Link>
        <Card className="px-0 col-span-2 h-44 grid grid-cols-2 divide-x divide-gray-300 text-green-600">
          {[
            data.meta.medicaments.latest.slice(
              0,
              Math.floor(data.meta.medicaments.latest.length / 2)
            ),
            data.meta.medicaments.latest.slice(
              Math.floor(data.meta.medicaments.latest.length / 2),
              data.meta.medicaments.latest.length
            ),
          ].map((col: any, index) => (
            <div
              key={index}
              className="px-6 flex flex-col justify-center space-y-1"
            >
              {col.map((med: Models.Medicament.Extracted) => (
                <Link key={med.id} to={`/admin/medicaments/${med.id}`}>
                  {med.denomination}
                </Link>
              ))}
            </div>
          ))}
        </Card>
      </div>

      <div className="mt-6">
        <Title color="pink" level={3}>
          Plans de prise
        </Title>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card className="h-44 flex flex-col justify-center text-center">
          <span className="text-6xl text-pink-700">
            {data.meta['plan-prises'].total}
          </span>
          <span className="text-3xl text-pink-500">Plans de prise créés</span>
        </Card>
        <Card className="col-span-2 h-44">
          <Chart
            color="pink"
            data={Object.values(data.meta['plan-prises'].stats) || []}
            labels={Object.keys(data.meta['plan-prises'].stats) || []}
          />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
