import React, { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, CardColumns } from 'reactstrap';
import { updateAppNav } from 'store/app';
import useJsonApi from 'helpers/hooks/use-json-api';
import { uniqueId, remove } from 'lodash';
import ConditionalWrapper from 'components/Utility/ConditionalWrapper';
import PrecautionEdit from '../PrecautionEdit';
import useAxios from 'axios-hooks';
import SplashScreen from 'components/App/SplashScreen';
import AttributesEdit from '../AttributesEdit';

const mapDispatch = {
  updateAppNav,
};

const connector = connect(null, mapDispatch);

type MedicamentEditProps = ConnectedProps<typeof connector> &
  Props.Backend.MedicamentEdit;

const MedicamentEdit = ({
  medicament: medicamentID,
  updateAppNav,
}: MedicamentEditProps) => {
  const { normalizeOne, requestUrl } = useJsonApi();

  const [precautions, setPrecautions] = useState<
    undefined | ExtractModel<Models.Precaution>[]
  >();

  let medicament: ExtractModel<Models.Medicament> | undefined = undefined;

  const [{ data, loading, error }] = useAxios<
    IServerResponse<Models.Medicament>
  >({
    url: requestUrl('medicaments', {
      id: medicamentID.id,
      include: ['bdpm', 'composition', 'precautions'],
      fields: { precautions: ['id'] },
    }).url,
  });

  useEffect(() => {
    updateAppNav({
      title: `Modification de ${medicamentID.denomination}`,
      returnTo: {
        path: '/admin',
        label: 'arrow-left',
      },
    });
  });

  useEffect(() => {
    if (medicament) {
      setPrecautions(medicament.precautions);
    }
  }, [medicament]);

  if (loading) {
    return (
      <SplashScreen
        type="load"
        message={`Chargement des données pour ${medicamentID.denomination}`}
      />
    );
  }

  if (error || !data) {
    throw new Error(
      `Impossible de charger les données pour ${medicamentID.denomination}`
    );
  }

  medicament = normalizeOne(
    {
      id: medicamentID.id,
      type: medicamentID.type,
    },
    data
  ) as ExtractModel<Models.Medicament>;

  return (
    <React.Fragment>
      <AttributesEdit medicament={medicament} />
      <ConditionalWrapper
        condition={(precautions || []).length > 0}
        wrapper={CardColumns}
      >
        <React.Fragment>
          {medicament.precautions.map((precaution) => (
            <PrecautionEdit
              key={precaution.id}
              cibles={[
                {
                  id: `medicaments_${medicament?.id}`,
                  label: medicament?.denomination || '',
                },
                ...(medicament?.composition || []).map((compo) => ({
                  id: `principe-actifs_${compo.id}`,
                  label: compo.denomination,
                })),
              ]}
              precaution={precaution}
              remove={(id: string) =>
                remove(medicament?.precautions || [], { id })
              }
            />
          ))}
          <Button
            color="light"
            size="sm"
            onClick={() => {
              setPrecautions([
                ...(precautions || []),
                {
                  id: uniqueId('new_'),
                  type: 'precautions',
                  commentaire: '',
                  population: '',
                  relationshipNames: [],
                  voie_administration: 0,
                },
              ]);
            }}
          >
            Ajouter une précaution
          </Button>
        </React.Fragment>
      </ConditionalWrapper>
    </React.Fragment>
  );
};

export default connector(MedicamentEdit);
