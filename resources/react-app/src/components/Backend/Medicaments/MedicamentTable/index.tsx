import SplashScreen from 'components/App/SplashScreen';
import React from 'react';
import { FaPen, FaRecycle } from 'react-icons/fa';
import { Button, Table } from 'reactstrap';

export default ({ data }: IProps.Backend.MedicamentTable) => {
  if (!data)
    return <SplashScreen type="load" message="Chargement des médicaments" />;

  return (
    <Table bordered responsive>
      <thead>
        <tr>
          <th>Médicament</th>
          <th>Composition</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <tr key={d.id}>
            <td>{d.attributes.denomination}</td>
            <td>
              {d.attributes.composition.map((c) => (
                <div key={c.id}>{c.denomination}</div>
              ))}
            </td>
            <td>
              <Button color="success" size="sm">
                <FaPen />
              </Button>
              <Button color="danger" size="sm">
                <FaRecycle />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
