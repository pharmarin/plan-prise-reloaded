import AsyncTable from 'components/AsyncTable';
import Chevron from 'components/Icons/Chevron';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { updateAppNav } from 'store/app';
import MedicamentEdit from './MedicamentEdit';

const MedicamentsBackend = () => {
  const dispatch = useDispatch();

  const { id } = useParams<{ id?: string }>();

  useEffect(() => {
    dispatch(
      updateAppNav({
        title: `Médicaments`,
        returnTo: {
          path: '/admin',
          component: { name: 'arrowLeft' },
        },
      })
    );
  });

  if (id) {
    return <MedicamentEdit id={id} />;
  }

  return (
    <AsyncTable
      columns={[
        { id: 'denomination', label: 'Médicament' },
        { id: 'composition', label: 'Composition' },
        { id: 'chevron', label: '' },
      ]}
      extractData={(_, columnId, data) => {
        switch (columnId) {
          case 'denomination':
            return data.attributes.denomination;
          case 'composition':
            return (data.attributes.composition || [])
              .map(
                (principeActif: Models.PrincipeActif.Entity) =>
                  principeActif.attributes.denomination
              )
              .join(' + ');
          case 'chevron':
            return (
              <div className="ml-auto">
                <Chevron.Single.Right.Small className="text-gray-600" />
              </div>
            );
          default:
            return '';
        }
      }}
      include={['composition']}
      linkTo="/admin/medicaments/ID"
      searchKey="denomination"
      sortBy="denomination"
      type="medicaments"
    />
  );
};

export default MedicamentsBackend;
