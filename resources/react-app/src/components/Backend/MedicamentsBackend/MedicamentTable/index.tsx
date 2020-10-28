import React from 'react';
import { FaPen, FaRecycle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button, Table } from 'reactstrap';

export default ({ data }: IProps.Backend.MedicamentTable) => {
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
            <td>{d.denomination}</td>
            <td>
              {(d.composition || []).map((c) => (
                <div key={c.id}>{c.denomination}</div>
              ))}
            </td>
            <td>
              <Link
                to={`/admin/${d.id}/edit`}
                className="btn btn-sm btn-success"
              >
                <FaPen />
              </Link>
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
