import React, { useEffect } from 'react';
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
  IProps.Backend.MedicamentEdit;

const MedicamentEdit = ({
  medicament: medicamentID,
  updateAppNav,
}: MedicamentEditProps) => {
  const { normalizeOne, requestUrl } = useJsonApi();

  const [{ data, loading, error }] = useAxios<
    IServerResponse<IModels.Medicament>
  >({
    url: requestUrl('medicament', {
      id: medicamentID.id,
      include: ['composition', 'precautions'],
      fields: { precaution: ['id'] },
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

  const medicament = normalizeOne(
    {
      id: medicamentID.id,
      type: medicamentID.type,
    },
    data
  ) as IExtractModel<IModels.Medicament>;

  return (
    <React.Fragment>
      <AttributesEdit medicament={medicament} />
      <ConditionalWrapper
        condition={medicament.precautions && medicament.precautions.length > 0}
        wrapper={CardColumns}
      >
        <React.Fragment>
          {medicament.precautions.map((precaution) => (
            <PrecautionEdit
              key={precaution.id}
              cibles={[
                {
                  id: `medicament_${medicament.id}`,
                  label: medicament.denomination,
                },
                ...medicament.composition.map((compo) => ({
                  id: `principe-actif_${compo.id}`,
                  label: compo.denomination,
                })),
              ]}
              precaution={precaution}
              remove={(id: string) => remove(medicament.precautions, { id })}
            />
          ))}
          <Button
            color="light"
            size="sm"
            onClick={() =>
              medicament.precautions.push({
                id: uniqueId('new_'),
                type: 'precaution',
                commentaire: '',
                population: '',
                relationshipNames: [],
                voie_administration: 0,
              })
            }
          >
            Ajouter une précaution
          </Button>
        </React.Fragment>
      </ConditionalWrapper>
    </React.Fragment>
  );
};

export default connector(MedicamentEdit);
