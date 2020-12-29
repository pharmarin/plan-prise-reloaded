import AsyncTable from 'components/AsyncTable';
import Chevron from 'components/Icons/Chevron';
import Edit from 'containers/Backend/Medicaments/Edit';
import { useNavigation } from 'hooks/use-store';
import Medicament from 'models/Medicament';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Medicaments = () => {
  const navigation = useNavigation();

  const { id } = useParams<{ id?: string }>();

  useEffect(() => {
    // Si id !=== undefined, le titre est affiché par <Edit/>
    if (!id) {
      navigation.setNavigation('Médicaments', {
        path: '/admin',
        component: { name: 'arrowLeft' },
      });
    }
  }, [id, navigation]);

  if (id) {
    return <Edit id={id} />;
  }

  return (
    <AsyncTable
      columns={[
        { id: 'denomination', label: 'Médicament' },
        { id: 'composition', label: 'Composition' },
        { id: 'chevron', label: '' },
      ]}
      extractData={(_, columnId, data: Medicament) => {
        switch (columnId) {
          case 'denomination':
            return data.denomination;
          case 'composition':
            return (data.composition || [])
              .map((principeActif) => principeActif.denomination)
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
      type={Medicament}
    />
  );
};

export default Medicaments;
